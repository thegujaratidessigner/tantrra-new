import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { can, requireAdminPage } from '@/lib/server/admin-auth';
import { requireDb } from '@/lib/server/data';
import { Badge, Card, EmptyState, PageHeader, StatCard, dateTime, inr, table } from '@/components/admin/ui';

export const metadata: Metadata = { title: 'Dashboard' };

const RANGES = { '7d': 7, '30d': 30, '90d': 90, all: null } as const;
type RangeKey = keyof typeof RANGES;

const BOOKING_TYPES = [
  { key: 'product', label: 'Product orders', href: '/admin/orders?type=product' },
  { key: 'consultation', label: 'Consultations', href: '/admin/orders?type=consultation' },
  { key: 'puja', label: 'Puja bookings', href: '/admin/orders?type=puja' },
  { key: 'chadava', label: 'Chadava bookings', href: '/admin/orders?type=chadava' },
  { key: 'daan-seva', label: 'Daan Seva', href: '/admin/orders?type=daan-seva' },
] as const;

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ range?: string; test?: string; denied?: string }> }) {
  const admin = await requireAdminPage('dashboard.view');
  const sp = await searchParams;
  const range: RangeKey = sp.range && sp.range in RANGES ? (sp.range as RangeKey) : '30d';
  const includeTest = sp.test === '1';

  const denied = sp.denied === '1' && (
    <p className="mb-4 rounded-lg bg-[#B5342E]/[0.07] px-4 py-2.5 text-[13px] text-[#B5342E]">
      Your role does not have access to that section.
    </p>
  );

  if (!can(admin, 'orders.view')) {
    return (
      <>
        {denied}
        <PageHeader title={`Namaste${admin.displayName ? `, ${admin.displayName}` : ''}`} description="Use the menu to manage banners, videos, gallery, testimonials and page content." />
      </>
    );
  }

  const sql = requireDb();
  const days = RANGES[range];
  const since = days ? new Date(Date.now() - days * 86_400_000) : new Date(0);
  const modes = includeTest ? ['live', 'test'] : ['live'];

  const [[summary], [revenue], bookings, recent, customers, [needsShipping]] = await Promise.all([
    sql<{ total: number; paid: number; pending: number; failed: number; awaiting: number }[]>`
      SELECT count(*)::int AS total,
             count(*) FILTER (WHERE payment_status IN ('paid', 'partially_refunded'))::int AS paid,
             count(*) FILTER (WHERE payment_status = 'pending')::int AS pending,
             count(*) FILTER (WHERE payment_status = 'failed')::int AS failed,
             count(*) FILTER (WHERE payment_status IN ('paid', 'partially_refunded')
                              AND fulfilment_status IN ('unfulfilled', 'processing', 'scheduled'))::int AS awaiting
      FROM orders WHERE created_at >= ${since} AND payment_mode = ANY(${modes}) AND (${includeTest} OR NOT internal_test)`,
    sql<{ net: string | null }[]>`
      SELECT sum(p.amount_paise - p.amount_refunded_paise) AS net
      FROM payments p JOIN orders o ON o.id = p.order_id
      WHERE p.status IN ('captured', 'refunded') AND o.created_at >= ${since} AND o.payment_mode = ANY(${modes}) AND (${includeTest} OR NOT o.internal_test)`,
    sql<{ kind: string; orders: number; amount: string }[]>`
      SELECT CASE WHEN i.item_type = 'product' THEN 'product'
                  WHEN i.service_type LIKE 'chadava-%' THEN 'chadava'
                  ELSE i.service_type END AS kind,
             count(DISTINCT o.id)::int AS orders, sum(i.line_total_paise) AS amount
      FROM order_items i JOIN orders o ON o.id = i.order_id
      WHERE o.payment_status IN ('paid', 'partially_refunded') AND o.created_at >= ${since} AND o.payment_mode = ANY(${modes}) AND (${includeTest} OR NOT o.internal_test)
      GROUP BY 1`,
    sql<{ id: string; order_number: string; customer_name: string; total_paise: number; payment_status: string; fulfilment_status: string; order_type: string; created_at: Date }[]>`
      SELECT id, order_number, customer_name, total_paise, payment_status, fulfilment_status, order_type, created_at
      FROM orders WHERE payment_mode = ANY(${modes}) AND (${includeTest} OR NOT internal_test) ORDER BY created_at DESC LIMIT 8`,
    sql<{ id: string; name: string; email: string; orders: number; created_at: Date }[]>`
      SELECT c.id, c.name, c.email, count(o.id)::int AS orders, c.created_at
      FROM customers c JOIN orders o ON o.customer_id = c.id AND o.payment_mode = ANY(${modes}) AND (${includeTest} OR NOT o.internal_test)
      GROUP BY c.id ORDER BY max(o.created_at) DESC LIMIT 6`,
    sql<{ n: number }[]>`
      SELECT count(*)::int AS n FROM orders
      WHERE shipping_rate_unconfirmed AND payment_status IN ('paid', 'partially_refunded')
        AND fulfilment_status = 'unfulfilled' AND payment_mode = ANY(${modes}) AND NOT internal_test`,
  ]);

  const byKind = new Map(bookings.map((b) => [b.kind, b]));
  const link = (r: RangeKey, t = includeTest) => `/admin?range=${r}${t ? '&test=1' : ''}`;

  return (
    <>
      {denied}
      <PageHeader
        title="Dashboard"
        description="Verified figures from Razorpay-confirmed payments. Payment state and fulfilment state are tracked separately."
        actions={
          <div className="flex flex-wrap items-center gap-1 rounded-lg border border-[#E2DCCD] bg-white p-1 text-[12.5px]">
            {(Object.keys(RANGES) as RangeKey[]).map((r) => (
              <Link key={r} href={link(r)} className={`rounded-md px-2.5 py-1 ${r === range ? 'bg-[#1B3D2F] font-semibold text-white' : 'text-foreground-muted hover:bg-[#FAF7EF]'}`}>
                {r === 'all' ? 'All time' : `Last ${RANGES[r]} days`}
              </Link>
            ))}
            <Link href={link(range, !includeTest)} className="ml-1 rounded-md px-2.5 py-1 text-foreground-muted hover:bg-[#FAF7EF]">
              {includeTest ? 'Hide test orders' : 'Include test orders'}
            </Link>
          </div>
        }
      />

      {needsShipping.n > 0 && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-[#B88A3B]/40 bg-[#B88A3B]/[0.08] px-4 py-3 text-[13px] text-[#6E5019]">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {needsShipping.n} paid order{needsShipping.n === 1 ? '' : 's'} below the free-shipping threshold were placed while the shipping rate was unconfirmed (₹0 shipping charged).{' '}
            <Link href="/admin/orders?flag=shipping" className="font-semibold underline">Review</Link>
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        <StatCard label="Verified revenue" value={inr(Number(revenue.net ?? 0))} hint="Captured minus refunds" accent="green" />
        <StatCard label="Total orders" value={String(summary.total)} href="/admin/orders" accent="slate" />
        <StatCard label="Paid" value={String(summary.paid)} href="/admin/orders?payment=paid" accent="green" />
        <StatCard label="Pending payment" value={String(summary.pending)} href="/admin/orders?payment=pending" accent="gold" />
        <StatCard label="Failed payments" value={String(summary.failed)} href="/admin/orders?payment=failed" accent="maroon" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-6">
        {BOOKING_TYPES.map((t) => {
          const b = byKind.get(t.key);
          return <StatCard key={t.key} label={t.label} value={String(b?.orders ?? 0)} hint={b ? inr(Number(b.amount)) : 'No paid bookings'} href={t.href} accent="gold" />;
        })}
        <StatCard label="Awaiting fulfilment" value={String(summary.awaiting)} href="/admin/orders?payment=paid&fulfilment=open" accent="maroon" />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_340px]">
        <Card title="Recent orders" actions={<Link href="/admin/orders" className="text-[12.5px] font-semibold text-[#1B3D2F] hover:underline">View all</Link>}>
          {recent.length === 0 ? (
            <EmptyState title="No orders yet" description="Orders appear here as soon as a customer starts checkout." />
          ) : (
            <div className={table.wrap}>
              <table className={table.table}>
                <thead><tr>{['Order', 'Customer', 'Type', 'Total', 'Payment', 'Fulfilment', 'Date'].map((h) => <th key={h} className={table.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {recent.map((o) => (
                    <tr key={o.id} className={table.row}>
                      <td className={table.td}><Link href={`/admin/orders/${o.id}`} className="font-mono text-[12.5px] font-semibold text-[#1B3D2F] hover:underline">{o.order_number}</Link></td>
                      <td className={table.td}>{o.customer_name}</td>
                      <td className={`${table.td} capitalize`}>{o.order_type}</td>
                      <td className={`${table.td} tabular-nums`}>{inr(o.total_paise)}</td>
                      <td className={table.td}><Badge value={o.payment_status} /></td>
                      <td className={table.td}><Badge value={o.fulfilment_status} /></td>
                      <td className={`${table.td} whitespace-nowrap text-foreground-muted`}>{dateTime(o.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card title="Recent customers" actions={<Link href="/admin/customers" className="text-[12.5px] font-semibold text-[#1B3D2F] hover:underline">View all</Link>}>
          {customers.length === 0 ? (
            <EmptyState title="No customers yet" />
          ) : (
            <ul className="divide-y divide-[#F1ECE1]">
              {customers.map((c) => (
                <li key={c.id} className="py-2.5">
                  <Link href={`/admin/customers/${c.id}`} className="block hover:underline">
                    <p className="text-[13.5px] font-medium text-foreground">{c.name}</p>
                    <p className="truncate text-[12px] text-foreground-muted">{c.email} · {c.orders} order{c.orders === 1 ? '' : 's'}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
