import type { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { requireAdminPage } from '@/lib/server/admin-auth';
import { requireDb } from '@/lib/server/data';
import { EmptyState, PageHeader, dateOnly, field, inr, table } from '@/components/admin/ui';
import { btn } from '@/components/admin/ActionForm';

export const metadata: Metadata = { title: 'Customers' };
const PAGE = 30;

export default async function CustomersPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  await requireAdminPage('customers.view');
  const sp = await searchParams;
  const q = (sp.q ?? '').trim().slice(0, 100);
  const page = Math.max(1, Number.parseInt(sp.page ?? '1', 10) || 1);
  const like = `%${q.replace(/[\\%_]/g, (m) => `\\${m}`)}%`;
  const sql = requireDb();
  const filter = q ? sql`WHERE c.name ILIKE ${like} OR c.email ILIKE ${like} OR c.phone ILIKE ${like}` : sql``;

  const [[{ count }], rows] = await Promise.all([
    sql<{ count: number }[]>`SELECT count(*)::int AS count FROM customers c ${filter}`,
    sql<{ id: string; name: string; email: string; phone: string | null; orders: number; paid_orders: number; spent: string | null; last_order: Date | null }[]>`
      SELECT c.id, c.name, c.email, c.phone,
             count(o.id)::int AS orders,
             count(o.id) FILTER (WHERE o.payment_status IN ('paid', 'partially_refunded'))::int AS paid_orders,
             (SELECT sum(p.amount_paise - p.amount_refunded_paise) FROM payments p JOIN orders o2 ON o2.id = p.order_id
               WHERE o2.customer_id = c.id AND p.status IN ('captured', 'refunded') AND o2.payment_mode = 'live') AS spent,
             max(o.created_at) AS last_order
      FROM customers c LEFT JOIN orders o ON o.customer_id = c.id
      ${filter}
      GROUP BY c.id ORDER BY max(o.created_at) DESC NULLS LAST, c.created_at DESC
      LIMIT ${PAGE} OFFSET ${(page - 1) * PAGE}`,
  ]);
  const pages = Math.max(1, Math.ceil(count / PAGE));
  const href = (p: number) => `/admin/customers?${new URLSearchParams({ ...(q ? { q } : {}), ...(p > 1 ? { page: String(p) } : {}) })}`;

  return (
    <>
      <PageHeader title="Customers" description="Created automatically from checkout. Spend counts only verified live payments, net of refunds." />
      <form className="mb-4 flex gap-2" action="/admin/customers">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
          <input name="q" defaultValue={q} placeholder="Name, email or phone" className={`${field.input} mt-0 pl-9`} />
        </div>
        <button className={btn.primary}>Search</button>
      </form>
      {rows.length === 0 ? (
        <EmptyState title={q ? 'No customers match' : 'No customers yet'} description="Customers are added when they start a checkout." />
      ) : (
        <div className={table.wrap}>
          <table className={table.table}>
            <thead><tr>{['Customer', 'Phone', 'Orders', 'Verified spend', 'Last order'].map((h) => <th key={h} className={table.th}>{h}</th>)}</tr></thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className={table.row}>
                  <td className={table.td}>
                    <Link href={`/admin/customers/${c.id}`} className="font-medium text-[#1B3D2F] hover:underline">{c.name}</Link>
                    <p className="text-[12px] text-foreground-muted">{c.email}</p>
                  </td>
                  <td className={table.td}>{c.phone ?? '—'}</td>
                  <td className={`${table.td} tabular-nums`}>{c.paid_orders} paid / {c.orders}</td>
                  <td className={`${table.td} tabular-nums font-medium`}>{inr(Number(c.spent ?? 0))}</td>
                  <td className={`${table.td} text-foreground-muted`}>{c.last_order ? dateOnly(c.last_order) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-[13px]">
          <span className="text-foreground-muted">{count} customers · page {page} of {pages}</span>
          <div className="flex gap-2">
            {page > 1 && <Link className={btn.secondary} href={href(page - 1)}>Previous</Link>}
            {page < pages && <Link className={btn.secondary} href={href(page + 1)}>Next</Link>}
          </div>
        </div>
      )}
    </>
  );
}
