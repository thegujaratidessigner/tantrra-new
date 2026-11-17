import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { can, requireAdminPage } from '@/lib/server/admin-auth';
import { requireDb } from '@/lib/server/data';
import { Badge, Card, PageHeader, StatCard, dateOnly, dateTime, field, inr, table } from '@/components/admin/ui';
import { ActionForm, SubmitButton } from '@/components/admin/ActionForm';
import { saveCustomerNotes } from '../actions';

export const metadata: Metadata = { title: 'Customer' };

export default async function CustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminPage('customers.view');
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const sql = requireDb();

  const [[customer], orders, bookings, [spent]] = await Promise.all([
    sql<{ id: string; name: string; email: string; phone: string | null; admin_notes: string | null; created_at: Date }[]>`
      SELECT id, name, email, phone, admin_notes, created_at FROM customers WHERE id = ${id}`,
    sql<{ id: string; order_number: string; total_paise: number; payment_status: string; fulfilment_status: string; payment_mode: string; created_at: Date; items: string }[]>`
      SELECT o.id, o.order_number, o.total_paise, o.payment_status, o.fulfilment_status, o.payment_mode, o.created_at,
             (SELECT string_agg(i.name, ', ' ORDER BY i.line_no) FROM order_items i WHERE i.order_id = o.id) AS items
      FROM orders o WHERE o.customer_id = ${id} ORDER BY o.created_at DESC LIMIT 200`,
    sql<{ order_id: string; name: string; service_type: string; fulfilment_status: string; devotee: string | null; created_at: Date }[]>`
      SELECT i.order_id, i.name, i.service_type, i.fulfilment_status, i.devotee_details->>'fullName' AS devotee, o.created_at
      FROM order_items i JOIN orders o ON o.id = i.order_id
      WHERE o.customer_id = ${id} AND i.item_type = 'service' AND o.payment_status IN ('paid', 'partially_refunded')
      ORDER BY o.created_at DESC LIMIT 100`,
    sql<{ net: string | null }[]>`
      SELECT sum(p.amount_paise - p.amount_refunded_paise) AS net FROM payments p JOIN orders o ON o.id = p.order_id
      WHERE o.customer_id = ${id} AND p.status IN ('captured', 'refunded') AND o.payment_mode = 'live'`,
  ]);
  if (!customer) notFound();

  return (
    <>
      <Link href="/admin/customers" className="mb-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-foreground-muted hover:text-[#1B3D2F]">
        <ChevronLeft className="h-3.5 w-3.5" /> All customers
      </Link>
      <PageHeader title={customer.name} description={`Customer since ${dateOnly(customer.created_at)}`} />

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Verified spend" value={inr(Number(spent.net ?? 0))} accent="green" />
        <StatCard label="Orders" value={String(orders.length)} accent="slate" />
        <StatCard label="Paid orders" value={String(orders.filter((o) => ['paid', 'partially_refunded'].includes(o.payment_status)).length)} accent="gold" />
        <StatCard label="Service bookings" value={String(bookings.length)} accent="maroon" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <Card title="Orders">
            {orders.length === 0 ? <p className="text-[13px] text-foreground-muted">No orders.</p> : (
              <div className={table.wrap}>
                <table className={table.table}>
                  <thead><tr>{['Order', 'Items', 'Total', 'Payment', 'Fulfilment', 'Date'].map((h) => <th key={h} className={table.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {orders.map((o) => (
                      <tr key={o.id} className={table.row}>
                        <td className={table.td}>
                          <Link href={`/admin/orders/${o.id}`} className="font-mono text-[12.5px] font-semibold text-[#1B3D2F] hover:underline">{o.order_number}</Link>
                          {o.payment_mode === 'test' && <div className="mt-1"><Badge value="test" /></div>}
                        </td>
                        <td className={`${table.td} max-w-[240px] text-[12.5px] text-foreground-muted`}>{o.items}</td>
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
          <Card title="Service bookings (paid)">
            {bookings.length === 0 ? <p className="text-[13px] text-foreground-muted">No paid service bookings.</p> : (
              <ul className="divide-y divide-[#F1ECE1]">
                {bookings.map((b, i) => (
                  <li key={i} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-[13px]">
                    <span>
                      <Link href={`/admin/orders/${b.order_id}`} className="font-medium text-[#1B3D2F] hover:underline">{b.name}</Link>
                      <span className="text-foreground-muted">{b.devotee ? ` · for ${b.devotee}` : ''} · {dateOnly(b.created_at)}</span>
                    </span>
                    <Badge value={b.fulfilment_status} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
        <div className="space-y-4">
          <Card title="Contact">
            <p className="text-[13px]"><a className="text-[#1B3D2F] hover:underline" href={`mailto:${customer.email}`}>{customer.email}</a></p>
            {customer.phone && <p className="text-[13px]"><a className="text-[#1B3D2F] hover:underline" href={`tel:${customer.phone}`}>{customer.phone}</a></p>}
          </Card>
          <Card title="Internal notes">
            {can(admin, 'customers.manage') ? (
              <ActionForm action={saveCustomerNotes} className="space-y-2">
                <input type="hidden" name="id" value={customer.id} />
                <textarea name="notes" rows={5} maxLength={4000} defaultValue={customer.admin_notes ?? ''} className={field.input} placeholder="Visible only to the TANTRRA team" />
                <SubmitButton>Save notes</SubmitButton>
              </ActionForm>
            ) : (
              <p className="whitespace-pre-wrap text-[13px]">{customer.admin_notes || '—'}</p>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
