import { NextResponse } from 'next/server';
import { getPaymentConfig } from '@/lib/server/config';
import { priceCheckout } from '@/lib/server/pricing';
import { createCheckoutOrder } from '@/lib/server/orders';
import { describeGatewayError } from '@/lib/server/razorpay';
import { getSql } from '@/lib/server/db';
import { getSiteSettingsFresh } from '@/lib/server/data';
import { clientKey, withinRateLimit } from '@/lib/server/rate-limit';
import type { CheckoutErrorResponse, CreateOrderResponse } from '@/lib/checkout-types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const fail = (status: number, body: CheckoutErrorResponse) => NextResponse.json(body, { status });

export async function POST(request: Request) {
  const cfg = getPaymentConfig();
  if (!cfg.ok) {
    console.error(`[payments] create-order unavailable: ${cfg.reason}`);
    return fail(503, { error: 'payments_unavailable', message: 'Online payment is temporarily unavailable.' });
  }

  const sql = getSql(cfg.config.databaseUrl);
  try {
    if (!(await withinRateLimit(sql, `create-order:${clientKey(request)}`, 20, 600))) {
      return fail(429, { error: 'invalid_request', message: 'Too many attempts. Please wait a few minutes and try again.' });
    }
  } catch (err) {
    console.error(`[payments] rate limit check failed: ${describeGatewayError(err)}`);
    return fail(503, { error: 'payments_unavailable', message: 'Online payment is temporarily unavailable.' });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, { error: 'invalid_request', message: 'Invalid request' });
  }

  let priced: Awaited<ReturnType<typeof priceCheckout>>;
  try {
    priced = await priceCheckout(body, sql, await getSiteSettingsFresh());
  } catch (err) {
    console.error(`[payments] pricing failed: ${describeGatewayError(err)}`);
    return fail(503, { error: 'payments_unavailable', message: 'Online payment is temporarily unavailable.' });
  }
  if (!priced.ok) {
    if (priced.error === 'price_changed') {
      return fail(409, { error: 'price_changed', message: priced.message, priceUpdates: priced.priceUpdates });
    }
    if (priced.error === 'invalid_items') {
      return fail(422, { error: 'invalid_items', message: priced.message, invalidIndexes: priced.invalidIndexes });
    }
    return fail(400, { error: 'invalid_request', message: priced.message });
  }

  const checkoutKey = (body as { checkoutKey: string }).checkoutKey;

  try {
    const outcome = await createCheckoutOrder(cfg.config, priced.order, checkoutKey);
    const { order } = outcome;
    const response: CreateOrderResponse = {
      orderNumber: order.order_number,
      accessToken: outcome.accessToken,
      paymentStatus: order.payment_status,
      razorpayOrderId: order.razorpay_order_id ?? '',
      amount: order.total_paise,
      currency: 'INR',
      keyId: cfg.config.keyId,
      description: `Order ${order.order_number}`,
      prefill: { name: order.customer_name, email: order.customer_email, contact: order.customer_phone },
    };
    return NextResponse.json(response, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error(`[payments] create-order failed: ${describeGatewayError(err)}`);
    return fail(502, { error: 'gateway_error', message: 'We could not start the payment. Please try again in a moment.' });
  }
}
