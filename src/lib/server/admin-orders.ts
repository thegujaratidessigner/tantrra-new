import 'server-only';
import type postgres from 'postgres';

export const PAYMENT_FILTERS = ['paid', 'pending', 'failed', 'cancelled', 'refunded'] as const;
export const TYPE_FILTERS = ['product', 'consultation', 'puja', 'chadava', 'daan-seva'] as const;
export const FULFILMENT_STATUSES = ['unfulfilled', 'processing', 'scheduled', 'shipped', 'delivered', 'completed', 'cancelled'] as const;
export const ITEM_FULFILMENT_STATUSES = ['pending', 'scheduled', 'in_progress', 'completed', 'shipped', 'delivered', 'cancelled'] as const;
export const PAGE_SIZE = 25;

export interface OrderFilters {
  q: string;
  payment: (typeof PAYMENT_FILTERS)[number] | '';
  type: (typeof TYPE_FILTERS)[number] | '';
  fulfilment: 'open' | '';
  flag: 'shipping' | '';
  includeTest: boolean;
  page: number;
}

export function parseOrderFilters(sp: Record<string, string | undefined>): OrderFilters {
  const pick = <T extends readonly string[]>(v: string | undefined, list: T) => (list.includes(v ?? '') ? (v as T[number]) : '');
  return {
    q: (sp.q ?? '').trim().slice(0, 100),
    payment: pick(sp.payment, PAYMENT_FILTERS),
    type: pick(sp.type, TYPE_FILTERS),
    fulfilment: sp.fulfilment === 'open' ? 'open' : '',
    flag: sp.flag === 'shipping' ? 'shipping' : '',
    includeTest: sp.test === '1',
    page: Math.max(1, Math.min(10_000, Number.parseInt(sp.page ?? '1', 10) || 1)),
  };
}

export function orderWhere(sql: postgres.Sql, f: OrderFilters) {
  const like = `%${f.q.replace(/[\\%_]/g, (m) => `\\${m}`)}%`;
  const typeCond =
    f.type === 'product'
      ? sql`AND EXISTS (SELECT 1 FROM order_items i WHERE i.order_id = o.id AND i.item_type = 'product')`
      : f.type === 'chadava'
        ? sql`AND EXISTS (SELECT 1 FROM order_items i WHERE i.order_id = o.id AND i.service_type LIKE 'chadava-%')`
        : f.type
          ? sql`AND EXISTS (SELECT 1 FROM order_items i WHERE i.order_id = o.id AND i.service_type = ${f.type})`
          : sql``;
  const paymentCond =
    f.payment === 'paid'
      ? sql`AND o.payment_status IN ('paid', 'partially_refunded')`
      : f.payment === 'refunded'
        ? sql`AND o.payment_status IN ('refunded', 'partially_refunded')`
        : f.payment
          ? sql`AND o.payment_status = ${f.payment}`
          : sql``;

  return sql`
    WHERE o.payment_mode = ANY(${f.includeTest ? ['live', 'test'] : ['live']})
    ${f.includeTest ? sql`` : sql`AND NOT o.internal_test`}
    ${paymentCond}
    ${typeCond}
    ${f.fulfilment === 'open' ? sql`AND o.fulfilment_status IN ('unfulfilled', 'processing', 'scheduled')` : sql``}
    ${f.flag === 'shipping' ? sql`AND o.shipping_rate_unconfirmed` : sql``}
    ${f.q
      ? sql`AND (o.order_number ILIKE ${like} OR o.customer_name ILIKE ${like} OR o.customer_email ILIKE ${like}
              OR o.customer_phone ILIKE ${like} OR o.razorpay_order_id ILIKE ${like}
              OR EXISTS (SELECT 1 FROM payments p WHERE p.order_id = o.id AND p.razorpay_payment_id ILIKE ${like}))`
      : sql``}`;
}

export function filtersToQuery(f: OrderFilters, overrides: Partial<Record<keyof OrderFilters, string | number | boolean>> = {}) {
  const merged = { ...f, ...overrides };
  const params = new URLSearchParams();
  if (merged.q) params.set('q', String(merged.q));
  if (merged.payment) params.set('payment', String(merged.payment));
  if (merged.type) params.set('type', String(merged.type));
  if (merged.fulfilment) params.set('fulfilment', String(merged.fulfilment));
  if (merged.flag) params.set('flag', String(merged.flag));
  if (merged.includeTest) params.set('test', '1');
  if (Number(merged.page) > 1) params.set('page', String(merged.page));
  const s = params.toString();
  return s ? `?${s}` : '';
}
