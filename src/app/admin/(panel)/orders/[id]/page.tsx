import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, AlertTriangle } from 'lucide-react';
import { can, requireAdminPage } from '@/lib/server/admin-auth';
import { requireDb } from '@/lib/server/data';
import { FULFILMENT_STATUSES, ITEM_FULFILMENT_STATUSES } from '@/lib/server/admin-orders';
import { Badge, Card, PageHeader, dateTime, field, inr } from '@/components/admin/ui';
import { ActionForm, SubmitButton } from '@/components/admin/ActionForm';
import { addOrderNote, updateItemFulfilment, updateOrderFulfilment } from '../actions';

export const metadata: Metadata = { title: 'Order' };

interface OrderRow {
  id: string; order_number: string; customer_id: string | null; customer_name: string; customer_email: string; customer_phone: string;
  customer_notes: string | null; order_type: string; requires_shipping: boolean; shipping_address: Record<string, string> | null;
  subtotal_paise: number; energization_paise: number; dakshina_paise: number; shipping_paise: number; total_paise: number;
  payment_status: string; fulfilment_status: string; payment_mode: string; razorpay_order_id: string | null;
  paid_at: Date | null; created_at: Date; shipping_rate_unconfirmed: boolean; internal_test: boolean;
}

const DEVOTEE_LABEL: Record<string, string> = { fullName: 'Devotee', gotra: 'Gotra', sankalp: 'Sankalp', mobile: 'Mobile' };

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminPage('orders.view');
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const sql = requireDb();

  const [[order], items, payments, events, shipments] = await Promise.all([
    sql<OrderRow[]>`SELECT * FROM orders WHERE id = ${id}`,
    sql<{ id: string; item_type: string; service_type: string | null; name: string; package_name: string | null; quantity: number;
          unit_price_paise: number; energization: boolean; energization_unit_paise: number; line_total_paise: number;
          devotee_details: Record<string, string> | null; booking_metadata: Record<string, string> | null; fulfilment_status: string }[]>`
      SELECT * FROM order_items WHERE order_id = ${id} ORDER BY line_no`,
    sql<{ razorpay_payment_id: string; status: string; amount_paise: number; amount_refunded_paise: number; refund_status: string | null;
          method: string | null; error_description: string | null; signature_verified: boolean; verified_via: string | null; created_at: Date }[]>`
      SELECT * FROM payments WHERE order_id = ${id} ORDER BY created_at`,
    sql<{ id: number; kind: string; from_status: string | null; to_status: string | null; body: string | null; actor_email: string | null; created_at: Date }[]>`
      SELECT id, kind, from_status, to_status, body, actor_email, created_at FROM order_events WHERE order_id = ${id} ORDER BY created_at DESC`,
    sql<{ id: string; provider: string | null; awb_number: string | null; status: string }[]>`
      SELECT id, provider, awb_number, status FROM shipments WHERE order_id = ${id}`,
  ]);
  if (!order) notFound();

  const manage = can(admin, 'orders.manage');
  const isPaid = ['paid', 'partially_refunded'].includes(order.payment_status);
  const addr = order.shipping_address;

  return (
    <>
      <Link href="/admin/orders" className="mb-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-foreground-muted hover:text-[#1B3D2F]">
        <ChevronLeft className="h-3.5 w-3.5" /> All orders
      </Link>
      <PageHeader
        title={order.order_number}
        description={`Placed ${dateTime(order.created_at)}${order.paid_at ? ` · Paid ${dateTime(order.paid_at)}` : ''}`}
        actions={
          <div className="flex flex-wrap gap-1.5">
            <Badge value={order.payment_status} label={`Payment: ${order.payment_status.replace(/_/g, ' ')}`} />
            <Badge value={order.fulfilment_status} label={`Fulfilment: ${order.fulfilment_status}`} />
            <Badge value={order.payment_mode} label={order.payment_mode === 'live' ? 'Live' : 'Test mode'} />
            {order.internal_test && <Badge value="test" label="Internal test — do not ship" />}
          </div>
        }
      />

      {order.shipping_rate_unconfirmed && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-[#B88A3B]/40 bg-[#B88A3B]/[0.08] px-4 py-3 text-[13px] text-[#6E5019]">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          Placed below the free-shipping threshold while the shipping rate was unconfirmed — no shipping was charged.
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Card title="Items & bookings">
            <ul className="divide-y divide-[#F1ECE1]">
              {items.map((it) => (
                <li key={it.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-foreground">
                      {it.name}{it.package_name ? <span className="font-normal text-foreground-muted"> — {it.package_name}</span> : null}
                    </p>
                    <p className="text-[12.5px] text-foreground-muted">
                      {it.quantity} × {inr(it.unit_price_paise)}
                      {it.energization && ` + energization ${inr(it.energization_unit_paise)} each`}
                      {' · '}<span className="capitalize">{it.service_type ?? 'product'}</span>
                    </p>
                    {it.devotee_details && (
                      <dl className="mt-1.5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 rounded-lg bg-[#FAF7EF] px-3 py-2 text-[12.5px]">
                        {Object.entries(it.devotee_details).map(([k, v]) => (
                          <div key={k} className="contents"><dt className="text-foreground-subtle">{DEVOTEE_LABEL[k] ?? k}</dt><dd className="text-foreground">{v}</dd></div>
                        ))}
                      </dl>
                    )}
                    {it.booking_metadata && (
                      <p className="mt-1 text-[12px] text-foreground-subtle">
                        {Object.entries(it.booking_metadata).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
                    <span className="text-[14px] font-semibold tabular-nums">{inr(it.line_total_paise)}</span>
                    {manage ? (
                      <ActionForm action={updateItemFulfilment} className="flex items-center gap-1.5">
                        <input type="hidden" name="itemId" value={it.id} />
                        <select name="status" defaultValue={it.fulfilment_status} className={`${field.input} mt-0 w-auto py-1 text-[12.5px]`} aria-label={`Status for ${it.name}`}>
                          {ITEM_FULFILMENT_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                        </select>
                        <SubmitButton variant="secondary">Save</SubmitButton>
                      </ActionForm>
                    ) : (
                      <Badge value={it.fulfilment_status} />
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1 border-t border-[#EFEADF] pt-3 text-[13px]">
              {[
                ['Subtotal', order.subtotal_paise],
                ['Energization', order.energization_paise],
                ['Brahmin Dakshina', order.dakshina_paise],
                ['Shipping', order.shipping_paise],
              ].filter(([, v]) => Number(v) > 0 || v === order.subtotal_paise).map(([k, v]) => (
                <div key={k as string} className="flex justify-between"><dt className="text-foreground-muted">{k}</dt><dd className="tabular-nums">{inr(v as number)}</dd></div>
              ))}
              <div className="flex justify-between pt-1 text-[15px] font-semibold"><dt>Total</dt><dd className="tabular-nums text-[#1B3D2F]">{inr(order.total_paise)}</dd></div>
            </dl>
            <p className="mt-2 text-[11.5px] text-foreground-subtle">Amounts are snapshots taken at checkout and cannot be edited.</p>
          </Card>

          <Card title="Payments (from Razorpay)">
            <p className="mb-3 text-[12.5px] text-foreground-muted">Razorpay order: <span className="font-mono">{order.razorpay_order_id ?? '— not created'}</span></p>
            {payments.length === 0 ? (
              <p className="text-[13px] text-foreground-muted">No payment attempts recorded yet.</p>
            ) : (
              <ul className="space-y-2">
                {payments.map((p) => (
                  <li key={p.razorpay_payment_id} className="rounded-lg border border-[#EFEADF] px-3 py-2.5 text-[13px]">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-[12.5px]">{p.razorpay_payment_id}</span>
                      <Badge value={p.status === 'captured' ? 'paid' : p.status} label={p.status} />
                    </div>
                    <p className="mt-1 text-foreground-muted">
                      {inr(p.amount_paise)}{p.method ? ` via ${p.method}` : ''} · {dateTime(p.created_at)}
                      {p.amount_refunded_paise > 0 && ` · refunded ${inr(p.amount_refunded_paise)} (${p.refund_status})`}
                    </p>
                    <p className="text-[11.5px] text-foreground-subtle">
                      Verified via {p.verified_via?.replace('_', ' ') ?? '—'}{p.signature_verified ? ' · checkout signature verified' : ''}
                    </p>
                    {p.error_description && <p className="mt-1 text-[12px] text-[#B5342E]">{p.error_description}</p>}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="History & notes">
            {manage && (
              <ActionForm action={addOrderNote} resetOnSuccess className="mb-4 flex flex-col gap-2 sm:flex-row">
                <input type="hidden" name="orderId" value={order.id} />
                <input name="body" maxLength={2000} placeholder="Add an internal note (not visible to the customer)" className={`${field.input} mt-0`} />
                <SubmitButton>Add note</SubmitButton>
              </ActionForm>
            )}
            {events.length === 0 ? (
              <p className="text-[13px] text-foreground-muted">No history yet.</p>
            ) : (
              <ol className="space-y-2.5">
                {events.map((e) => (
                  <li key={e.id} className="border-l-2 border-[#E8E2D4] pl-3 text-[13px]">
                    <p className="text-foreground">
                      {e.kind === 'note' ? e.body : (
                        <>
                          <span className="capitalize">{e.kind.replace('_', ' ')}</span>: {e.from_status ?? '—'} → <strong>{e.to_status}</strong>
                          {e.body ? <span className="text-foreground-muted"> — {e.body}</span> : null}
                        </>
                      )}
                    </p>
                    <p className="text-[11.5px] text-foreground-subtle">{dateTime(e.created_at)} · {e.actor_email ?? 'system'}</p>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Customer">
            <p className="text-[14px] font-semibold">{order.customer_name}</p>
            <p className="text-[13px]"><a href={`mailto:${order.customer_email}`} className="text-[#1B3D2F] hover:underline">{order.customer_email}</a></p>
            <p className="text-[13px]"><a href={`tel:${order.customer_phone}`} className="text-[#1B3D2F] hover:underline">{order.customer_phone}</a></p>
            {order.customer_id && <Link href={`/admin/customers/${order.customer_id}`} className="mt-2 inline-block text-[12.5px] font-semibold text-[#1B3D2F] hover:underline">Customer profile →</Link>}
            {order.customer_notes && (
              <div className="mt-3 rounded-lg bg-[#FAF7EF] px-3 py-2 text-[12.5px]">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-foreground-subtle">Order notes</p>
                <p className="mt-0.5 whitespace-pre-wrap">{order.customer_notes}</p>
              </div>
            )}
          </Card>

          <Card title="Shipping">
            {order.requires_shipping && addr ? (
              <>
                <address className="text-[13px] not-italic leading-relaxed">
                  {addr.line1}<br />{addr.line2 && <>{addr.line2}<br /></>}{addr.city}, {addr.state} {addr.pincode}<br />India
                </address>
                <p className="mt-3 text-[12px] text-foreground-subtle">
                  {shipments.length ? `Shipment: ${shipments[0].provider ?? '—'} ${shipments[0].awb_number ?? ''} (${shipments[0].status})` : 'Ready for courier booking (Delhivery integration comes next).'}
                </p>
              </>
            ) : (
              <p className="text-[13px] text-foreground-muted">Service-only order — no shipping required.</p>
            )}
          </Card>

          <Card title="Fulfilment">
            {manage ? (
              <ActionForm action={updateOrderFulfilment} className="space-y-2">
                <input type="hidden" name="orderId" value={order.id} />
                <select name="status" defaultValue={order.fulfilment_status} className={`${field.input} mt-0`} aria-label="Order fulfilment status">
                  {FULFILMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <input name="note" maxLength={1000} placeholder="Optional note for history" className={`${field.input} mt-0`} />
                <SubmitButton>Update fulfilment</SubmitButton>
                {!isPaid && <p className="text-[11.5px] text-foreground-subtle">Payment not verified — only “cancelled” is allowed.</p>}
              </ActionForm>
            ) : (
              <Badge value={order.fulfilment_status} />
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
