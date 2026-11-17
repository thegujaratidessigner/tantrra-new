'use server';

import { revalidatePath } from 'next/cache';
import { audit, requireAdminAction } from '@/lib/server/admin-auth';
import { requireDb } from '@/lib/server/data';
import { FULFILMENT_STATUSES, ITEM_FULFILMENT_STATUSES } from '@/lib/server/admin-orders';
import { fail, ok, type ActionResult } from '@/lib/server/admin-action-result';
import { cleanText } from '@/lib/content/schema';

const UUID = /^[0-9a-f-]{36}$/i;
const PAID = ['paid', 'partially_refunded'];

export async function updateOrderFulfilment(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdminAction('orders.manage').catch(() => null);
  if (!admin) return fail('You do not have permission to update orders.');
  const orderId = String(formData.get('orderId') ?? '');
  const status = String(formData.get('status') ?? '');
  const note = cleanText(formData.get('note'), 1000);
  if (!UUID.test(orderId) || !(FULFILMENT_STATUSES as readonly string[]).includes(status)) return fail('Invalid request.');

  const sql = requireDb();
  const [order] = await sql<{ fulfilment_status: string; payment_status: string; internal_test: boolean }[]>`
    SELECT fulfilment_status, payment_status, internal_test FROM orders WHERE id = ${orderId}`;
  if (!order) return fail('Order not found.');
  if (order.internal_test && !['completed', 'cancelled'].includes(status)) {
    return fail('Internal test orders are never fulfilled or shipped — mark them completed or cancelled.');
  }
  if (order.fulfilment_status === status) return fail('The order already has that status.');
  if (!PAID.includes(order.payment_status) && status !== 'cancelled') {
    return fail('Only orders with a verified payment can be fulfilled. Unpaid orders can only be cancelled.');
  }

  await sql.begin(async (tx) => {
    await tx`UPDATE orders SET fulfilment_status = ${status} WHERE id = ${orderId}`;
    await tx`
      INSERT INTO order_events (order_id, kind, from_status, to_status, body, actor_id, actor_email)
      VALUES (${orderId}, 'fulfilment', ${order.fulfilment_status}, ${status}, ${note || null}, ${admin.userId}, ${admin.email})`;
  });
  await audit(admin, 'update_fulfilment', 'order', orderId, { from: order.fulfilment_status, to: status });
  revalidatePath(`/admin/orders/${orderId}`);
  return ok(`Fulfilment updated to “${status.replace(/_/g, ' ')}”.`);
}

export async function updateItemFulfilment(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdminAction('orders.manage').catch(() => null);
  if (!admin) return fail('You do not have permission to update orders.');
  const itemId = String(formData.get('itemId') ?? '');
  const status = String(formData.get('status') ?? '');
  if (!UUID.test(itemId) || !(ITEM_FULFILMENT_STATUSES as readonly string[]).includes(status)) return fail('Invalid request.');

  const sql = requireDb();
  const [item] = await sql<{ order_id: string; fulfilment_status: string; name: string; payment_status: string; internal_test: boolean }[]>`
    SELECT i.order_id, i.fulfilment_status, i.name, o.payment_status, o.internal_test
    FROM order_items i JOIN orders o ON o.id = i.order_id WHERE i.id = ${itemId}`;
  if (!item) return fail('Item not found.');
  if (item.internal_test && !['completed', 'cancelled'].includes(status)) return fail('Internal test orders are never fulfilled or shipped.');
  if (!PAID.includes(item.payment_status) && status !== 'cancelled') return fail('This order has no verified payment.');
  if (item.fulfilment_status === status) return fail('The item already has that status.');

  await sql.begin(async (tx) => {
    await tx`UPDATE order_items SET fulfilment_status = ${status} WHERE id = ${itemId}`;
    await tx`
      INSERT INTO order_events (order_id, order_item_id, kind, from_status, to_status, body, actor_id, actor_email)
      VALUES (${item.order_id}, ${itemId}, 'item_fulfilment', ${item.fulfilment_status}, ${status}, ${item.name}, ${admin.userId}, ${admin.email})`;
  });
  await audit(admin, 'update_item_fulfilment', 'order_item', itemId, { from: item.fulfilment_status, to: status });
  revalidatePath(`/admin/orders/${item.order_id}`);
  return ok(`${item.name}: ${status.replace(/_/g, ' ')}.`);
}

export async function addOrderNote(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdminAction('orders.manage').catch(() => null);
  if (!admin) return fail('You do not have permission to add notes.');
  const orderId = String(formData.get('orderId') ?? '');
  const body = cleanText(formData.get('body'), 2000);
  if (!UUID.test(orderId)) return fail('Invalid request.');
  if (!body) return fail('Write a note first.');

  const sql = requireDb();
  const inserted = await sql`
    INSERT INTO order_events (order_id, kind, body, actor_id, actor_email)
    SELECT id, 'note', ${body}, ${admin.userId}, ${admin.email} FROM orders WHERE id = ${orderId}
    RETURNING id`;
  if (!inserted.length) return fail('Order not found.');
  revalidatePath(`/admin/orders/${orderId}`);
  return ok('Note added.');
}
