import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, Search } from 'lucide-react';
import { can, requireAdminPage } from '@/lib/server/admin-auth';
import { requireDb } from '@/lib/server/data';
import { PAGE_SIZE, PAYMENT_FILTERS, TYPE_FILTERS, filtersToQuery, orderWhere, parseOrderFilters } from '@/lib/server/admin-orders';
import { Badge, EmptyState, PageHeader, dateTime, field, inr, table } from '@/components/admin/ui';
import { btn } from '@/components/admin/ActionForm';

export const metadata: Metadata = { title: 'Orders & Bookings' };

const TYPE_LABEL: Record<string, string> = { product: 'Products', consultation: 'Consultations', puja: 'Puja', chadava: 'Chadava', 'daan-seva': 'Daan Seva' };

export default async function OrdersPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const admin = await requireAdminPage('orders.view');
  const f = parseOrderFilters(await searchParams);
  const sql = requireDb();
  const where = orderWhere(sql, f);

  const [[{ count }], rows] = await Promise.all([
    sql<{ count: number }[]>`SELECT count(*)::int AS count FROM orders o ${where}`,
    sql<{
      id: string; order_number: string; customer_name: string; customer_email: string; order_type: string; total_paise: number;
      payment_status: string; fulfilment_status: string; payment_mode: string; created_at: Date; items: string; shipping_rate_unconfirmed: boolean;
    }[]>`
      SELECT o.id, o.order_number, o.customer_name, o.customer_email, o.order_type, o.total_paise, o.payment_status,
             o.fulfilment_status, o.payment_mode, o.created_at, o.shipping_rate_unconfirmed,
             (SELECT string_agg(i.name || CASE WHEN i.quantity > 1 THEN ' ×' || i.quantity ELSE '' END, ', ' ORDER BY i.line_no)
                FROM order_items i WHERE i.order_id = o.id) AS items
      FROM orders o ${where}
      ORDER BY o.created_at DESC
      LIMIT ${PAGE_SIZE} OFFSET ${(f.page - 1) * PAGE_SIZE}`,
  ]);
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-[12px] font-medium transition ${active ? 'border-[#1B3D2F] bg-[#1B3D2F] text-white' : 'border-[#DDD5C3] bg-white text-foreground-muted hover:border-[#1B3D2F]/40'}`;

  return (
    <>
      <PageHeader
        title="Orders & Bookings"
        description="Every checkout, including service bookings. Payment status comes only from verified Razorpay records."
        actions={can(admin, 'orders.export') ? (
          <a href={`/admin/orders/export${filtersToQuery(f, { page: 1 })}`} className={btn.secondary}>
            <Download className="h-4 w-4" /> Export CSV
          </a>
        ) : undefined}
      />

      <form className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end" action="/admin/orders">
        {f.payment && <input type="hidden" name="payment" value={f.payment} />}
        {f.type && <input type="hidden" name="type" value={f.type} />}
        {f.includeTest && <input type="hidden" name="test" value="1" />}
        <label className="flex-1">
          <span className="sr-only">Search orders</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
            <input name="q" defaultValue={f.q} placeholder="Order number, name, email, phone or Razorpay ID" className={`${field.input} mt-0 pl-9`} />
          </div>
        </label>
        <button className={btn.primary}>Search</button>
      </form>

      <div className="mb-2 flex flex-wrap gap-1.5">
        <Link href={`/admin/orders${filtersToQuery(f, { payment: '', page: 1 })}`} className={chip(!f.payment)}>All payments</Link>
        {PAYMENT_FILTERS.map((p) => (
          <Link key={p} href={`/admin/orders${filtersToQuery(f, { payment: p, page: 1 })}`} className={`${chip(f.payment === p)} capitalize`}>{p}</Link>
        ))}
      </div>
      <div className="mb-5 flex flex-wrap gap-1.5">
        <Link href={`/admin/orders${filtersToQuery(f, { type: '', page: 1 })}`} className={chip(!f.type)}>All types</Link>
        {TYPE_FILTERS.map((t) => (
          <Link key={t} href={`/admin/orders${filtersToQuery(f, { type: t, page: 1 })}`} className={chip(f.type === t)}>{TYPE_LABEL[t]}</Link>
        ))}
        <Link href={`/admin/orders${filtersToQuery(f, { fulfilment: f.fulfilment ? '' : 'open', page: 1 })}`} className={chip(f.fulfilment === 'open')}>Awaiting fulfilment</Link>
        <Link href={`/admin/orders${filtersToQuery(f, { includeTest: !f.includeTest, page: 1 })}`} className={chip(f.includeTest)}>Include test orders</Link>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No orders match" description={f.q || f.payment || f.type ? 'Try clearing a filter.' : 'Orders appear here once customers start checkout.'} />
      ) : (
        <div className={table.wrap}>
          <table className={table.table}>
            <thead>
              <tr>{['Order', 'Customer', 'Items', 'Total', 'Payment', 'Fulfilment', 'Date'].map((h) => <th key={h} className={table.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} className={table.row}>
                  <td className={table.td}>
                    <Link href={`/admin/orders/${o.id}`} className="font-mono text-[12.5px] font-semibold text-[#1B3D2F] hover:underline">{o.order_number}</Link>
                    <div className="mt-1 flex gap-1">
                      {o.payment_mode === 'test' && <Badge value="test" />}
                      {o.shipping_rate_unconfirmed && <Badge value="pending" label="shipping TBC" />}
                    </div>
                  </td>
                  <td className={table.td}>
                    <p className="font-medium">{o.customer_name}</p>
                    <p className="text-[12px] text-foreground-muted">{o.customer_email}</p>
                  </td>
                  <td className={`${table.td} max-w-[260px] text-[12.5px] text-foreground-muted`}>{o.items}</td>
                  <td className={`${table.td} tabular-nums font-medium`}>{inr(o.total_paise)}</td>
                  <td className={table.td}><Badge value={o.payment_status} /></td>
                  <td className={table.td}><Badge value={o.fulfilment_status} /></td>
                  <td className={`${table.td} whitespace-nowrap text-foreground-muted`}>{dateTime(o.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <nav className="mt-4 flex items-center justify-between text-[13px]" aria-label="Pagination">
          <span className="text-foreground-muted">{count} orders · page {f.page} of {pages}</span>
          <div className="flex gap-2">
            {f.page > 1 && <Link className={btn.secondary} href={`/admin/orders${filtersToQuery(f, { page: f.page - 1 })}`}>Previous</Link>}
            {f.page < pages && <Link className={btn.secondary} href={`/admin/orders${filtersToQuery(f, { page: f.page + 1 })}`}>Next</Link>}
          </div>
        </nav>
      )}
    </>
  );
}
