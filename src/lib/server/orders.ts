import 'server-only';
import crypto from 'node:crypto';
import type postgres from 'postgres';
import type { Payments } from 'razorpay/dist/types/payments';
import type { PaymentConfig } from './config';
import { getSql } from './db';
import { getRazorpay, describeGatewayError } from './razorpay';
import type { PricedOrder } from './pricing';
import type { OrderPaymentStatus, PublicOrderView } from '@/lib/checkout-types';

interface OrderRow {
  id: string;
  order_number: string;
  access_token_hash: string;
  payment_status: OrderPaymentStatus;
  total_paise: number;
  currency: string;
  razorpay_order_id: string | null;
  requires_shipping: boolean;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  created_at: Date;
  paid_at: Date | null;
  last_reconciled_at: Date | null;
}

const ORDER_COLUMNS = `id, order_number, access_token_hash, payment_status, total_paise, currency, razorpay_order_id,
  requires_shipping, customer_name, customer_email, customer_phone, created_at, paid_at, last_reconciled_at`;

const ORDER_NUMBER_RE = /^TNT-\d{6}-[A-Z0-9]{6}$/;
const RECONCILE_INTERVAL_MS = 10_000;
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function newOrderNumber(): string {
  const d = new Date();
  const date = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  const bytes = crypto.randomBytes(6);
  const suffix = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
  return `TNT-${date}-${suffix}`;
}

const newAccessToken = () => crypto.randomBytes(32).toString('base64url');
const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

function tokenMatches(token: string, storedHash: string): boolean {
  const a = Buffer.from(hashToken(token), 'utf8');
  const b = Buffer.from(storedHash, 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function uniqueViolation(err: unknown): string | null {
  const e = err as { code?: string; constraint_name?: string };
  return e?.code === '23505' ? e.constraint_name ?? 'unknown' : null;
}

async function selectOrder(sql: postgres.Sql, where: 'id' | 'razorpay_order_id' | 'order_number', value: string) {
  const rows = await sql.unsafe<OrderRow[]>(`SELECT ${ORDER_COLUMNS} FROM orders WHERE ${where} = $1`, [value]);
  return rows[0] ?? null;
}

async function insertOrder(
  sql: postgres.Sql,
  priced: PricedOrder,
  checkoutKey: string,
  tokenHash: string,
  mode: PaymentConfig['mode']
): Promise<OrderRow | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await sql.begin(async (tx) => {
        const [customer] = await tx<{ id: string }[]>`
          INSERT INTO customers (email, name, phone)
          VALUES (${priced.customer.email}, ${priced.customer.name}, ${priced.customer.phone})
          ON CONFLICT ((lower(email))) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone
          RETURNING id`;

        const [order] = await tx<{ id: string }[]>`
          INSERT INTO orders (
            order_number, access_token_hash, checkout_key, cart_hash, customer_id, payment_mode,
            customer_name, customer_email, customer_phone, customer_notes,
            order_type, requires_shipping, shipping_address, shipping_rate_unconfirmed,
            subtotal_paise, energization_paise, dakshina_paise, shipping_paise, total_paise, currency
          ) VALUES (
            ${newOrderNumber()}, ${tokenHash}, ${checkoutKey}, ${priced.cartHash}, ${customer.id}, ${mode},
            ${priced.customer.name}, ${priced.customer.email}, ${priced.customer.phone}, ${priced.notes},
            ${priced.orderType}, ${priced.requiresShipping}, ${priced.shipping ? tx.json(priced.shipping) : null},
            ${priced.shippingRateUnconfirmed},
            ${priced.subtotalPaise}, ${priced.energizationPaise}, ${priced.dakshinaPaise}, ${priced.shippingPaise}, ${priced.totalPaise}, 'INR'
          ) RETURNING id`;

        for (const l of priced.lines) {
          await tx`
            INSERT INTO order_items (
              order_id, line_no, item_type, service_type, ref_id, variant_id, name, package_name,
              quantity, unit_price_paise, energization, energization_unit_paise, line_total_paise,
              devotee_details, booking_metadata
            ) VALUES (
              ${order.id}, ${l.lineNo}, ${l.itemType}, ${l.serviceType}, ${l.refId}, ${l.variantId}, ${l.name}, ${l.packageName},
              ${l.quantity}, ${l.unitPricePaise}, ${l.energization}, ${l.energizationUnitPaise}, ${l.lineTotalPaise},
              ${l.devoteeDetails ? tx.json(l.devoteeDetails) : null}, ${l.bookingMetadata ? tx.json(l.bookingMetadata) : null}
            )`;
        }
        return order.id;
      }).then((id) => selectOrder(sql, 'id', id));
    } catch (err) {
      const constraint = uniqueViolation(err);
      if (constraint === 'orders_order_number_key') continue;
      if (constraint === 'orders_checkout_attempt') return null;
      throw err;
    }
  }
  throw new Error('Could not allocate a unique order number');
}

export type CreateOrderOutcome =
  | { kind: 'ready'; order: OrderRow & { razorpay_order_id: string }; accessToken: string }
  | { kind: 'already_paid'; order: OrderRow; accessToken: string };

export async function createCheckoutOrder(
  config: PaymentConfig,
  priced: PricedOrder,
  checkoutKey: string
): Promise<CreateOrderOutcome> {
  const sql = getSql(config.databaseUrl);
  const accessToken = newAccessToken();
  const tokenHash = hashToken(accessToken);

  const findAttempt = async () =>
    (await sql.unsafe<OrderRow[]>(
      `SELECT ${ORDER_COLUMNS} FROM orders WHERE checkout_key = $1 AND cart_hash = $2`,
      [checkoutKey, priced.cartHash]
    ))[0] ?? null;

  // Same checkout session + identical cart/customer → reuse the order instead of duplicating it.
  let order = await findAttempt();
  if (!order) {
    order = (await insertOrder(sql, priced, checkoutKey, tokenHash, config.mode)) ?? (await findAttempt());
  }
  if (!order) throw new Error('Order could not be created');

  if (order.access_token_hash !== tokenHash) {
    await sql`UPDATE orders SET access_token_hash = ${tokenHash} WHERE id = ${order.id}`;
  }

  if (order.payment_status === 'paid') return { kind: 'already_paid', order, accessToken };

  if (!order.razorpay_order_id) {
    const rzpOrder = await getRazorpay(config).orders.create({
      amount: order.total_paise,
      currency: 'INR',
      receipt: order.order_number,
      notes: { order_id: order.id, order_number: order.order_number },
    });
    if (Number(rzpOrder.amount) !== order.total_paise || rzpOrder.currency !== 'INR') {
      throw new Error(`Gateway order amount mismatch for ${order.order_number}`);
    }
    await sql`UPDATE orders SET razorpay_order_id = ${rzpOrder.id} WHERE id = ${order.id} AND razorpay_order_id IS NULL`;
    order = (await selectOrder(sql, 'id', order.id))!;
  }

  if (order.payment_status === 'failed' || order.payment_status === 'cancelled') {
    await sql`UPDATE orders SET payment_status = 'pending' WHERE id = ${order.id} AND payment_status IN ('failed', 'cancelled')`;
    order = { ...order, payment_status: 'pending' };
  }

  return { kind: 'ready', order: order as OrderRow & { razorpay_order_id: string }, accessToken };
}

export type SettleOutcome =
  | { kind: 'unknown_order' }
  | { kind: 'mismatch'; order: OrderRow; reason: string }
  | { kind: 'settled'; order: OrderRow };

/**
 * Reconciles one Razorpay payment against our order using data fetched from
 * Razorpay's API — never from the browser. Safe to call repeatedly.
 */
export async function settlePayment(
  config: PaymentConfig,
  args: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    via: 'client_callback' | 'webhook' | 'reconcile';
    signatureVerified: boolean;
  }
): Promise<SettleOutcome> {
  const sql = getSql(config.databaseUrl);
  const rzp = getRazorpay(config);

  const order = await selectOrder(sql, 'razorpay_order_id', args.razorpayOrderId);
  if (!order) return { kind: 'unknown_order' };

  let payment = await rzp.payments.fetch(args.razorpayPaymentId);
  if (payment.order_id !== args.razorpayOrderId) {
    console.error(`[payments] payment ${payment.id} does not belong to ${args.razorpayOrderId}`);
    return { kind: 'mismatch', order, reason: 'order_mismatch' };
  }

  const amountMatches = Number(payment.amount) === order.total_paise && payment.currency === order.currency;

  if (amountMatches && payment.status === 'authorized') {
    try {
      payment = await rzp.payments.capture(payment.id, order.total_paise, order.currency);
    } catch (err) {
      // Usually means auto-capture already ran; trust the fresh state from Razorpay.
      console.warn(`[payments] capture for ${payment.id} returned: ${describeGatewayError(err)}`);
      payment = await rzp.payments.fetch(args.razorpayPaymentId);
    }
  }

  await sql`
    INSERT INTO payments (
      order_id, razorpay_order_id, razorpay_payment_id, status, amount_paise, currency, method,
      error_code, error_description, error_reason, signature_verified, verified_via
    ) VALUES (
      ${order.id}, ${args.razorpayOrderId}, ${payment.id}, ${payment.status}, ${Number(payment.amount)}, ${payment.currency},
      ${payment.method ?? null}, ${payment.error_code ?? null}, ${payment.error_description ?? null}, ${payment.error_reason ?? null},
      ${args.signatureVerified}, ${args.via}
    )
    ON CONFLICT (razorpay_payment_id) DO UPDATE SET
      status = CASE
        WHEN payments.status IN ('captured', 'refunded') AND EXCLUDED.status NOT IN ('captured', 'refunded') THEN payments.status
        ELSE EXCLUDED.status END,
      method = COALESCE(EXCLUDED.method, payments.method),
      error_code = EXCLUDED.error_code,
      error_description = EXCLUDED.error_description,
      error_reason = EXCLUDED.error_reason,
      signature_verified = payments.signature_verified OR EXCLUDED.signature_verified,
      verified_via = COALESCE(payments.verified_via, EXCLUDED.verified_via)`;

  if (!amountMatches) {
    console.error(`[payments] amount/currency mismatch on ${order.order_number} (payment ${payment.id}); needs manual review`);
    return { kind: 'mismatch', order, reason: 'amount_mismatch' };
  }

  let transition: { from: string; to: string } | null = null;
  if (payment.status === 'captured') {
    const [row] = await sql<{ prev: string }[]>`
      WITH before AS (SELECT payment_status FROM orders WHERE id = ${order.id})
      UPDATE orders SET payment_status = 'paid', paid_at = COALESCE(paid_at, now())
      WHERE id = ${order.id} AND payment_status IN ('pending', 'failed', 'cancelled')
      RETURNING (SELECT payment_status FROM before) AS prev`;
    if (row) transition = { from: row.prev, to: 'paid' };
  } else if (payment.status === 'failed') {
    const [row] = await sql<{ id: string }[]>`
      UPDATE orders SET payment_status = 'failed' WHERE id = ${order.id} AND payment_status = 'pending' RETURNING id`;
    if (row) transition = { from: 'pending', to: 'failed' };
  }
  if (transition) {
    await sql`
      INSERT INTO order_events (order_id, kind, from_status, to_status, body)
      VALUES (${order.id}, 'payment', ${transition.from}, ${transition.to},
              ${`Razorpay ${payment.id} ${payment.status} (via ${args.via})`})`;
  }
  if (payment.status === 'refunded' || Number(payment.amount_refunded ?? 0) > 0) {
    await syncRefund(sql, order.id, payment);
  }

  return { kind: 'settled', order: (await selectOrder(sql, 'id', order.id))! };
}

type RazorpayPayment = Payments.RazorpayPayment;

async function syncRefund(sql: postgres.Sql, orderId: string, payment: RazorpayPayment) {
  const refunded = Number(payment.amount_refunded ?? 0);
  const full = refunded >= Number(payment.amount);
  await sql`
    UPDATE payments SET amount_refunded_paise = ${refunded}, refund_status = ${full ? 'full' : 'partial'},
      status = ${full ? 'refunded' : payment.status}
    WHERE razorpay_payment_id = ${payment.id}`;
  const next = full ? 'refunded' : 'partially_refunded';
  const [row] = await sql<{ prev: string }[]>`
    WITH before AS (SELECT payment_status FROM orders WHERE id = ${orderId})
    UPDATE orders SET payment_status = ${next}
    WHERE id = ${orderId} AND payment_status IN ('paid', 'partially_refunded') AND payment_status <> ${next}
    RETURNING (SELECT payment_status FROM before) AS prev`;
  if (row) {
    await sql`
      INSERT INTO order_events (order_id, kind, from_status, to_status, body)
      VALUES (${orderId}, 'payment', ${row.prev}, ${next}, ${`Refund of ₹${(refunded / 100).toFixed(2)} on ${payment.id}`})`;
  }
}

async function reconcileOrder(config: PaymentConfig, order: OrderRow): Promise<OrderRow> {
  if (!order.razorpay_order_id || (order.payment_status !== 'pending' && order.payment_status !== 'failed')) return order;
  if (order.last_reconciled_at && Date.now() - order.last_reconciled_at.getTime() < RECONCILE_INTERVAL_MS) return order;

  const sql = getSql(config.databaseUrl);
  await sql`UPDATE orders SET last_reconciled_at = now() WHERE id = ${order.id}`;

  const { items } = await getRazorpay(config).orders.fetchPayments(order.razorpay_order_id);
  for (const p of items) {
    if (p.status === 'captured' || p.status === 'authorized') {
      await settlePayment(config, {
        razorpayOrderId: order.razorpay_order_id,
        razorpayPaymentId: p.id,
        via: 'reconcile',
        signatureVerified: false,
      });
    }
  }
  return (await selectOrder(sql, 'id', order.id)) ?? order;
}

export async function getPublicOrder(
  config: PaymentConfig,
  orderNumber: string,
  token: string
): Promise<PublicOrderView | null> {
  if (!ORDER_NUMBER_RE.test(orderNumber) || !token || token.length > 128) return null;
  const sql = getSql(config.databaseUrl);

  let order = await selectOrder(sql, 'order_number', orderNumber);
  if (!order || !tokenMatches(token, order.access_token_hash)) return null;

  try {
    order = await reconcileOrder(config, order);
  } catch (err) {
    console.error(`[payments] reconcile failed for ${orderNumber}: ${describeGatewayError(err)}`);
  }

  const items = await sql<{ name: string; package_name: string | null; quantity: number; line_total_paise: number }[]>`
    SELECT name, package_name, quantity, line_total_paise FROM order_items WHERE order_id = ${order.id} ORDER BY line_no`;

  return {
    orderNumber: order.order_number,
    paymentStatus: order.payment_status,
    totalPaise: order.total_paise,
    currency: 'INR',
    requiresShipping: order.requires_shipping,
    createdAt: order.created_at.toISOString(),
    paidAt: order.paid_at ? order.paid_at.toISOString() : null,
    items: items.map((i) => ({
      name: i.name,
      packageName: i.package_name,
      quantity: i.quantity,
      lineTotalPaise: i.line_total_paise,
    })),
  };
}

interface WebhookEvent {
  event?: string;
  payload?: {
    payment?: { entity?: { id?: string; order_id?: string } };
    order?: { entity?: { id?: string } };
    refund?: { entity?: { id?: string; payment_id?: string } };
  };
}

// Every event re-fetches the payment from Razorpay, so the payload is only a pointer.
const SETTLING_EVENTS = new Set([
  'payment.authorized',
  'payment.captured',
  'payment.failed',
  'order.paid',
  'refund.created',
  'refund.processed',
  'refund.failed',
]);

export async function handleWebhookEvent(
  config: PaymentConfig,
  eventId: string,
  event: WebhookEvent
): Promise<'processed' | 'duplicate' | 'ignored'> {
  const sql = getSql(config.databaseUrl);
  const eventType = typeof event.event === 'string' ? event.event : 'unknown';
  const paymentId = event.payload?.payment?.entity?.id ?? event.payload?.refund?.entity?.payment_id ?? null;
  let razorpayOrderId = event.payload?.payment?.entity?.order_id ?? event.payload?.order?.entity?.id ?? null;
  if (!razorpayOrderId && paymentId) {
    const [row] = await sql<{ razorpay_order_id: string }[]>`
      SELECT razorpay_order_id FROM payments WHERE razorpay_payment_id = ${paymentId}`;
    razorpayOrderId = row?.razorpay_order_id ?? null;
  }

  const inserted = await sql`
    INSERT INTO webhook_events (event_id, event_type, razorpay_order_id, razorpay_payment_id)
    VALUES (${eventId}, ${eventType}, ${razorpayOrderId}, ${paymentId})
    ON CONFLICT (event_id) DO NOTHING
    RETURNING event_id`;

  if (inserted.length === 0) {
    const [existing] = await sql<{ processed_at: Date | null }[]>`SELECT processed_at FROM webhook_events WHERE event_id = ${eventId}`;
    if (existing?.processed_at) return 'duplicate';
  }

  try {
    let result: 'processed' | 'ignored' = 'ignored';
    if (SETTLING_EVENTS.has(eventType) && paymentId && razorpayOrderId) {
      const outcome = await settlePayment(config, { razorpayOrderId, razorpayPaymentId: paymentId, via: 'webhook', signatureVerified: false });
      result = outcome.kind === 'unknown_order' ? 'ignored' : 'processed';
    }
    await sql`UPDATE webhook_events SET processed_at = now(), processing_error = NULL WHERE event_id = ${eventId}`;
    return result;
  } catch (err) {
    await sql`UPDATE webhook_events SET processing_error = ${describeGatewayError(err).slice(0, 500)} WHERE event_id = ${eventId}`;
    throw err;
  }
}
