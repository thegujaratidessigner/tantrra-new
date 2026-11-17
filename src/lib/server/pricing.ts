import 'server-only';
import crypto from 'node:crypto';
import type postgres from 'postgres';
import { getShippingQuote } from '@/lib/shipping';
import type { SiteSettings } from '@/lib/site-settings';
import type { ServiceType } from '@/lib/types';
import type {
  CheckoutCustomer,
  CheckoutShippingAddress,
  CreateOrderRequest,
  PriceUpdate,
} from '@/lib/checkout-types';

const MAX_LINES = 50;
const MAX_PRODUCT_QTY = 20;
const MAX_SERVICE_QTY = 10;
const MAX_DAAN_RUPEES = 500_000;
const MAX_ORDER_PAISE = 1_000_000_00;
const DEVOTEE_REQUIRED: ServiceType[] = ['puja', 'chadava-deity', 'chadava-navagraha', 'chadava-tithi'];

export interface PricedLine {
  lineNo: number;
  itemType: 'product' | 'service';
  serviceType: ServiceType | null;
  refId: string;
  variantId: string | null;
  name: string;
  packageName: string | null;
  quantity: number;
  unitPricePaise: number;
  energization: boolean;
  energizationUnitPaise: number;
  lineTotalPaise: number;
  devoteeDetails: Record<string, string> | null;
  bookingMetadata: Record<string, string> | null;
}

export interface PricedOrder {
  customer: CheckoutCustomer;
  shipping: (CheckoutShippingAddress & { country: 'IN' }) | null;
  notes: string | null;
  lines: PricedLine[];
  orderType: 'product' | 'service' | 'mixed';
  requiresShipping: boolean;
  subtotalPaise: number;
  energizationPaise: number;
  dakshinaPaise: number;
  shippingPaise: number;
  shippingRateUnconfirmed: boolean;
  /** Contains an admin-only test product: excluded from sales figures, never fulfilled. */
  internalTest: boolean;
  totalPaise: number;
  cartHash: string;
}

export type PricingResult =
  | { ok: true; order: PricedOrder }
  | { ok: false; error: 'invalid_request'; message: string }
  | { ok: false; error: 'invalid_items'; message: string; invalidIndexes: number[] }
  | { ok: false; error: 'price_changed'; message: string; priceUpdates: PriceUpdate[] };

interface ResolvedService {
  serviceType: ServiceType;
  name: string;
  packageName: string | null;
  unitPriceRupees: number | 'custom';
  metadata: Record<string, string> | null;
}

interface ProductRecord {
  id: string; name: string; price: number; is_active: boolean; in_stock: boolean; archived_at: Date | null;
  energization_available: boolean; stock_quantity: number | null; test_only: boolean;
}
interface VariantRecord { id: string; product_id: string; name: string; price: number | null; in_stock: boolean }
interface OfferingRecord {
  id: string; kind: ServiceType; name: string; price: number | null; is_active: boolean; allow_custom: boolean;
  metadata: Record<string, unknown>; group_name: string | null; group_alt: string | null; group_active: boolean | null;
}

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

function str(v: unknown, max: number): string | null {
  if (typeof v !== 'string') return null;
  const s = v.replace(/[\u0000-\u001f\u007f]/g, ' ').trim();
  if (!s || s.length > max) return null;
  return s;
}

function optStr(v: unknown, max: number): string | undefined {
  if (v === undefined || v === null || v === '') return undefined;
  return str(v, max) ?? undefined;
}

const toPaise = (rupees: number) => Math.round(rupees * 100);

function stringMeta(entries: [string, unknown][]): Record<string, string> | null {
  const out: Record<string, string> = {};
  for (const [k, v] of entries) if (typeof v === 'string' && v) out[k] = v;
  return Object.keys(out).length ? out : null;
}

function resolveService(o: OfferingRecord | undefined): ResolvedService | null {
  if (!o || !o.is_active || o.group_active === false) return null;
  if (o.kind === 'daan-seva') {
    if (!o.allow_custom && o.price === null) return null;
    return { serviceType: o.kind, name: `${o.name} — Daan Seva`, packageName: null, unitPriceRupees: 'custom', metadata: { Category: o.name } };
  }
  if (o.price === null) return null;
  const m = o.metadata;
  switch (o.kind) {
    case 'consultation':
      return { serviceType: o.kind, name: o.group_name ?? o.name, packageName: o.name, unitPriceRupees: o.price, metadata: null };
    case 'chadava-deity':
      return { serviceType: o.kind, name: o.name, packageName: null, unitPriceRupees: o.price, metadata: stringMeta([['Deity', m.deity], ['Tier', m.tier]]) };
    case 'chadava-navagraha':
      return {
        serviceType: o.kind, name: o.name, packageName: null, unitPriceRupees: o.price,
        metadata: m.combined ? { Type: 'Combined Navagraha Shanti' } : stringMeta([['Day', o.group_name], ['Graha', m.graha]]),
      };
    case 'chadava-tithi':
      return { serviceType: o.kind, name: `${o.name} Panchopchar Poojan`, packageName: null, unitPriceRupees: o.price, metadata: stringMeta([['Tithi', o.name], ['Deity', m.deity]]) };
    default:
      return { serviceType: o.kind, name: o.name, packageName: null, unitPriceRupees: o.price, metadata: null };
  }
}

function parseCustomer(v: unknown): CheckoutCustomer | string {
  if (!isObj(v)) return 'Contact details are required';
  const name = str(v.name, 100);
  if (!name || name.length < 2) return 'Please enter your full name';
  const email = str(v.email, 254)?.toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return 'Please enter a valid email address';
  const phoneRaw = typeof v.phone === 'string' ? v.phone.replace(/[\s\-()]/g, '') : '';
  if (!/^\+?[0-9]{10,15}$/.test(phoneRaw)) return 'Please enter a valid phone number';
  return { name, email, phone: phoneRaw };
}

function parseShipping(v: unknown): (CheckoutShippingAddress & { country: 'IN' }) | string {
  if (!isObj(v)) return 'Shipping address is required for physical products';
  const line1 = str(v.line1, 200);
  const city = str(v.city, 80);
  const state = str(v.state, 80);
  const pincode = typeof v.pincode === 'string' ? v.pincode.trim() : '';
  if (!line1) return 'Please enter your address';
  if (!city) return 'Please enter your city';
  if (!state) return 'Please enter your state';
  if (!/^[1-9][0-9]{5}$/.test(pincode)) return 'Please enter a valid 6-digit PIN code';
  return { line1, line2: optStr(v.line2, 200), city, state, pincode, country: 'IN' };
}

function parseDevotee(v: unknown): Record<string, string> | null {
  if (!isObj(v)) return null;
  const out: Record<string, string> = {};
  const fullName = optStr(v.fullName, 100);
  const gotra = optStr(v.gotra, 60);
  const mobile = optStr(v.mobile, 20);
  const sankalp = optStr(v.sankalp, 300);
  if (fullName) out.fullName = fullName;
  if (gotra) out.gotra = gotra;
  if (mobile) out.mobile = mobile;
  if (sankalp) out.sankalp = sankalp;
  return Object.keys(out).length ? out : null;
}

/**
 * Re-prices a checkout request entirely from the database. Client-sent prices are
 * only compared (to tell the shopper a price changed), never used — except the
 * contribution amount for Daan Seva, which the donor chooses within limits.
 */
export async function priceCheckout(
  body: unknown,
  sql: postgres.Sql,
  settings: SiteSettings,
  opts: { allowTestProducts?: boolean } = {}
): Promise<PricingResult> {
  if (!isObj(body)) return { ok: false, error: 'invalid_request', message: 'Invalid request' };
  const req = body as Partial<CreateOrderRequest> & Record<string, unknown>;

  if (typeof req.checkoutKey !== 'string' || !/^[A-Za-z0-9_-]{16,64}$/.test(req.checkoutKey)) {
    return { ok: false, error: 'invalid_request', message: 'Invalid checkout session. Please refresh and try again.' };
  }

  const customer = parseCustomer(req.customer);
  if (typeof customer === 'string') return { ok: false, error: 'invalid_request', message: customer };

  if (!Array.isArray(req.items) || req.items.length === 0) {
    return { ok: false, error: 'invalid_request', message: 'Your cart is empty' };
  }
  if (req.items.length > MAX_LINES) {
    return { ok: false, error: 'invalid_request', message: 'Too many items in cart' };
  }

  const rawItems: unknown[] = req.items;
  const productIds = [...new Set(rawItems.filter(isObj).map((i) => i.productId).filter((x): x is string => typeof x === 'string' && x.length <= 64))];
  const serviceIds = [...new Set(rawItems.filter(isObj).map((i) => i.serviceId).filter((x): x is string => typeof x === 'string' && x.length <= 64))];

  const [productRows, variantRows, offeringRows] = await Promise.all([
    productIds.length
      ? sql<ProductRecord[]>`SELECT id, name, price, is_active, in_stock, archived_at, energization_available, stock_quantity, test_only FROM products WHERE id = ANY(${productIds})`
      : Promise.resolve([] as ProductRecord[]),
    productIds.length
      ? sql<VariantRecord[]>`SELECT id, product_id, name, price, in_stock FROM product_variants WHERE product_id = ANY(${productIds})`
      : Promise.resolve([] as VariantRecord[]),
    serviceIds.length
      ? sql<OfferingRecord[]>`
          SELECT o.id, o.kind, o.name, o.price, o.is_active, o.allow_custom, o.metadata,
                 g.name AS group_name, g.name_alt AS group_alt, g.is_active AS group_active
          FROM service_offerings o LEFT JOIN service_groups g ON g.id = o.group_id
          WHERE o.id = ANY(${serviceIds})`
      : Promise.resolve([] as OfferingRecord[]),
  ]);

  const lines: PricedLine[] = [];
  const invalidIndexes: number[] = [];
  const priceUpdates: PriceUpdate[] = [];
  let devoteeMissing: string | null = null;
  let internalTest = false;

  rawItems.forEach((raw, index) => {
    if (!isObj(raw)) { invalidIndexes.push(index); return; }
    const qty = raw.quantity;
    const snapshot = typeof raw.priceSnapshot === 'number' ? raw.priceSnapshot : NaN;

    if (raw.type === 'product') {
      // Test-only products are hidden (inactive) and resolve only for verified admin checkouts.
      const product = productRows.find(
        (p) => p.id === raw.productId && p.in_stock && !p.archived_at && (p.test_only ? opts.allowTestProducts === true : p.is_active)
      );
      if (!product || !Number.isInteger(qty) || (qty as number) < 1 || (qty as number) > MAX_PRODUCT_QTY) {
        invalidIndexes.push(index); return;
      }
      if (product.stock_quantity !== null && (qty as number) > product.stock_quantity) { invalidIndexes.push(index); return; }

      let variant: VariantRecord | undefined;
      let unitRupees = product.price;
      if (raw.variantId !== undefined && raw.variantId !== null) {
        variant = variantRows.find((v) => v.id === raw.variantId && v.product_id === product.id);
        if (!variant || !variant.in_stock) { invalidIndexes.push(index); return; }
        if (variant.price !== null) unitRupees = variant.price;
      }
      if (snapshot !== unitRupees) priceUpdates.push({ index, priceSnapshot: unitRupees });
      if (product.test_only) internalTest = true;

      const energization = raw.energization === true;
      if (energization && !product.energization_available) { invalidIndexes.push(index); return; }
      const energizationUnitPaise = energization ? toPaise(settings.checkout.energizationPrice) : 0;
      const unitPricePaise = toPaise(unitRupees);
      const quantity = qty as number;

      lines.push({
        lineNo: lines.length + 1,
        itemType: 'product',
        serviceType: null,
        refId: product.id,
        variantId: variant?.id ?? null,
        name: product.name,
        packageName: variant?.name ?? null,
        quantity,
        unitPricePaise,
        energization,
        energizationUnitPaise,
        lineTotalPaise: (unitPricePaise + energizationUnitPaise) * quantity,
        devoteeDetails: null,
        bookingMetadata: null,
      });
      return;
    }

    if (raw.type === 'service') {
      const serviceId = typeof raw.serviceId === 'string' ? raw.serviceId : '';
      const svc = resolveService(offeringRows.find((o) => o.id === serviceId));
      if (!svc || !Number.isInteger(qty) || (qty as number) < 1 || (qty as number) > MAX_SERVICE_QTY) {
        invalidIndexes.push(index); return;
      }

      let unitRupees: number;
      if (svc.unitPriceRupees === 'custom') {
        if (!Number.isInteger(snapshot) || snapshot < 1 || snapshot > MAX_DAAN_RUPEES) { invalidIndexes.push(index); return; }
        unitRupees = snapshot;
      } else {
        unitRupees = svc.unitPriceRupees;
        if (snapshot !== unitRupees) priceUpdates.push({ index, priceSnapshot: unitRupees });
      }

      const devoteeDetails = parseDevotee(raw.devoteeDetails);
      if (DEVOTEE_REQUIRED.includes(svc.serviceType) && !devoteeDetails?.fullName) devoteeMissing = svc.name;

      const unitPricePaise = toPaise(unitRupees);
      const quantity = qty as number;
      lines.push({
        lineNo: lines.length + 1,
        itemType: 'service',
        serviceType: svc.serviceType,
        refId: serviceId,
        variantId: null,
        name: svc.name,
        packageName: svc.packageName,
        quantity,
        unitPricePaise,
        energization: false,
        energizationUnitPaise: 0,
        lineTotalPaise: unitPricePaise * quantity,
        devoteeDetails,
        bookingMetadata: svc.metadata,
      });
      return;
    }

    invalidIndexes.push(index);
  });

  if (invalidIndexes.length) {
    return {
      ok: false,
      error: 'invalid_items',
      message: 'Some items in your cart are no longer available. Please review your cart.',
      invalidIndexes,
    };
  }
  if (priceUpdates.length) {
    return {
      ok: false,
      error: 'price_changed',
      message: 'Some prices have been updated. Please review your order total before paying.',
      priceUpdates,
    };
  }
  if (devoteeMissing) {
    return { ok: false, error: 'invalid_request', message: `Please enter the devotee name for ${devoteeMissing}` };
  }

  const dakshina = req.dakshinaAmount ?? 0;
  if (dakshina !== 0 && !settings.checkout.dakshinaOptions.includes(dakshina as number)) {
    return { ok: false, error: 'invalid_request', message: 'Invalid Dakshina amount' };
  }

  const hasProducts = lines.some((l) => l.itemType === 'product');
  const hasServices = lines.some((l) => l.itemType === 'service');

  let shipping: (CheckoutShippingAddress & { country: 'IN' }) | null = null;
  if (hasProducts) {
    const parsed = parseShipping(req.shipping);
    if (typeof parsed === 'string') return { ok: false, error: 'invalid_request', message: parsed };
    shipping = parsed;
  }

  const notes = optStr(req.notes, 1000) ?? null;
  const subtotalPaise = lines.reduce((s, l) => s + l.unitPricePaise * l.quantity, 0);
  const energizationPaise = lines.reduce((s, l) => s + l.energizationUnitPaise * l.quantity, 0);
  const dakshinaPaise = toPaise(dakshina as number);
  const productSubtotalPaise = lines.filter((l) => l.itemType === 'product').reduce((s, l) => s + l.lineTotalPaise, 0);
  const shippingQuote = getShippingQuote(productSubtotalPaise / 100, hasProducts, settings.shipping);
  const shippingPaise = toPaise(shippingQuote.amount);
  const totalPaise = subtotalPaise + energizationPaise + dakshinaPaise + shippingPaise;

  if (totalPaise < 100 || totalPaise > MAX_ORDER_PAISE) {
    return { ok: false, error: 'invalid_request', message: 'Order total is outside the allowed range' };
  }

  const cartHash = crypto
    .createHash('sha256')
    .update(JSON.stringify({ customer, shipping, notes, dakshinaPaise, shippingPaise, lines }))
    .digest('hex');

  return {
    ok: true,
    order: {
      customer,
      shipping,
      notes,
      lines,
      orderType: hasProducts && hasServices ? 'mixed' : hasProducts ? 'product' : 'service',
      requiresShipping: hasProducts,
      subtotalPaise,
      energizationPaise,
      dakshinaPaise,
      shippingPaise,
      shippingRateUnconfirmed: shippingQuote.kind === 'rate_not_set',
      internalTest,
      totalPaise,
      cartHash,
    },
  };
}
