import 'server-only';
import crypto from 'node:crypto';
import { products } from '@/data/products';
import { consultations } from '@/data/consultations';
import { specializedPujas, pujas } from '@/data/pujas';
import { deityAnushthan, navagrahaShanti, navagrahaDays, tithiPoojan, daanSevaCategories } from '@/data/chadava';
import { siteConfig } from '@/data/site-config';
import { getShippingQuote } from '@/lib/shipping';
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

function resolveService(serviceId: string): ResolvedService | null {
  if (serviceId.startsWith('consult_')) {
    const pkgId = serviceId.slice('consult_'.length);
    for (const c of consultations) {
      if (!c.isActive) continue;
      const pkg = c.packages.find((p) => p.id === pkgId);
      if (pkg) return { serviceType: 'consultation', name: c.name, packageName: pkg.name, unitPriceRupees: pkg.price, metadata: null };
    }
    return null;
  }

  if (serviceId.startsWith('puja_')) {
    const id = serviceId.slice('puja_'.length);
    const sp = specializedPujas.find((p) => p.id === id && p.isActive);
    if (sp) return { serviceType: 'puja', name: sp.name, packageName: null, unitPriceRupees: sp.price, metadata: null };
    const legacy = pujas.find((p) => p.id === id && p.isActive && !p.isRequestOnly && typeof p.price === 'number' && p.price > 0);
    if (legacy && legacy.price) return { serviceType: 'puja', name: legacy.name, packageName: null, unitPriceRupees: legacy.price, metadata: null };
    return null;
  }

  if (serviceId.startsWith('deity_')) {
    const d = deityAnushthan.find((o) => o.id === serviceId.slice('deity_'.length));
    return d ? { serviceType: 'chadava-deity', name: d.name, packageName: null, unitPriceRupees: d.price, metadata: { Deity: d.deity, Tier: d.tier } } : null;
  }

  if (serviceId === 'navagraha_shanti') {
    return { serviceType: 'chadava-navagraha', name: navagrahaShanti.name, packageName: null, unitPriceRupees: navagrahaShanti.price, metadata: { Type: 'Combined Navagraha Shanti' } };
  }

  if (serviceId.startsWith('navagraha_')) {
    const offeringId = serviceId.slice('navagraha_'.length);
    for (const day of navagrahaDays) {
      for (const graha of day.grahas) {
        const o = graha.offerings.find((x) => x.id === offeringId);
        if (o) return { serviceType: 'chadava-navagraha', name: o.name, packageName: null, unitPriceRupees: o.price, metadata: { Day: day.dayEnglish, Graha: graha.name } };
      }
    }
    return null;
  }

  if (serviceId.startsWith('tithi_')) {
    const t = tithiPoojan.find((x) => x.id === serviceId.slice('tithi_'.length));
    return t
      ? { serviceType: 'chadava-tithi', name: `${t.name} Panchopchar Poojan`, packageName: null, unitPriceRupees: t.price, metadata: t.deity ? { Tithi: t.name, Deity: t.deity } : { Tithi: t.name } }
      : null;
  }

  if (serviceId.startsWith('daan_')) {
    const s = daanSevaCategories.find((x) => x.id === serviceId.slice('daan_'.length) && x.isActive);
    return s ? { serviceType: 'daan-seva', name: `${s.name} — Daan Seva`, packageName: null, unitPriceRupees: 'custom', metadata: { Category: s.name } } : null;
  }

  return null;
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

export function priceCheckout(body: unknown): PricingResult {
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

  const lines: PricedLine[] = [];
  const invalidIndexes: number[] = [];
  const priceUpdates: PriceUpdate[] = [];
  let devoteeMissing: string | null = null;

  req.items.forEach((raw: unknown, index: number) => {
    if (!isObj(raw)) { invalidIndexes.push(index); return; }
    const qty = raw.quantity;
    const snapshot = typeof raw.priceSnapshot === 'number' ? raw.priceSnapshot : NaN;

    if (raw.type === 'product') {
      const product = products.find((p) => p.id === raw.productId && p.isActive && p.inStock);
      if (!product || !Number.isInteger(qty) || (qty as number) < 1 || (qty as number) > MAX_PRODUCT_QTY) {
        invalidIndexes.push(index); return;
      }
      let variantId: string | null = null;
      let unitRupees = product.price;
      if (raw.variantId !== undefined && raw.variantId !== null) {
        const variant = product.variants?.find((v) => v.id === raw.variantId);
        if (!variant || !variant.inStock) { invalidIndexes.push(index); return; }
        variantId = variant.id;
        if (typeof variant.price === 'number') unitRupees = variant.price;
      }
      if (snapshot !== unitRupees) priceUpdates.push({ index, priceSnapshot: unitRupees });

      const energization = raw.energization === true;
      if (energization && !product.energizationAvailable) { invalidIndexes.push(index); return; }
      const energizationUnitPaise = energization ? toPaise(siteConfig.energizationPrice) : 0;
      const unitPricePaise = toPaise(unitRupees);
      const quantity = qty as number;

      lines.push({
        lineNo: lines.length + 1,
        itemType: 'product',
        serviceType: null,
        refId: product.id,
        variantId,
        name: product.name,
        packageName: variantId ? product.variants?.find((v) => v.id === variantId)?.name ?? null : null,
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
      const svc = serviceId ? resolveService(serviceId) : null;
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
      if (DEVOTEE_REQUIRED.includes(svc.serviceType) && !devoteeDetails?.fullName) {
        devoteeMissing = svc.name;
      }

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
  if (dakshina !== 0 && !siteConfig.dakshinaOptions.includes(dakshina as number)) {
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
  const shippingQuote = getShippingQuote(productSubtotalPaise / 100, hasProducts);
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
      totalPaise,
      cartHash,
    },
  };
}
