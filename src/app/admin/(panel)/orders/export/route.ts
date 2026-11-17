import { NextResponse } from 'next/server';
import { audit, getCurrentAdmin, can } from '@/lib/server/admin-auth';
import { requireDb } from '@/lib/server/data';
import { orderWhere, parseOrderFilters } from '@/lib/server/admin-orders';

export const dynamic = 'force-dynamic';

// Prevent spreadsheet formula injection from customer-entered text.
function cell(v: unknown): string {
  let s = v === null || v === undefined ? '' : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const admin = await getCurrentAdmin();
  if (!admin || !can(admin, 'orders.export')) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const f = parseOrderFilters(Object.fromEntries(new URL(request.url).searchParams));
  const sql = requireDb();
  const rows = await sql`
    SELECT o.order_number, o.created_at, o.payment_mode, o.payment_status, o.fulfilment_status, o.order_type,
           o.customer_name, o.customer_email, o.customer_phone, o.shipping_address,
           o.subtotal_paise, o.energization_paise, o.dakshina_paise, o.shipping_paise, o.total_paise,
           o.razorpay_order_id,
           (SELECT string_agg(p.razorpay_payment_id || ':' || p.status, ' ') FROM payments p WHERE p.order_id = o.id) AS payments,
           (SELECT string_agg(i.name || coalesce(' (' || i.package_name || ')', '') || ' x' || i.quantity
                              || coalesce(' [devotee: ' || (i.devotee_details->>'fullName') || coalesce(', gotra ' || (i.devotee_details->>'gotra'), '') || ']', ''),
                              ' | ' ORDER BY i.line_no) FROM order_items i WHERE i.order_id = o.id) AS items
    FROM orders o ${orderWhere(sql, f)}
    ORDER BY o.created_at DESC
    LIMIT 10000`;

  const header = ['Order', 'Created (UTC)', 'Mode', 'Payment', 'Fulfilment', 'Type', 'Customer', 'Email', 'Phone', 'Address',
    'Subtotal', 'Energization', 'Dakshina', 'Shipping', 'Total', 'Razorpay order', 'Razorpay payments', 'Items'];
  const rupees = (p: unknown) => (Number(p) / 100).toFixed(2);
  const lines = rows.map((r) => {
    const a = r.shipping_address as Record<string, string> | null;
    const address = a ? [a.line1, a.line2, a.city, a.state, a.pincode].filter(Boolean).join(', ') : '';
    return [r.order_number, (r.created_at as Date).toISOString(), r.payment_mode, r.payment_status, r.fulfilment_status, r.order_type,
      r.customer_name, r.customer_email, r.customer_phone, address, rupees(r.subtotal_paise), rupees(r.energization_paise),
      rupees(r.dakshina_paise), rupees(r.shipping_paise), rupees(r.total_paise), r.razorpay_order_id, r.payments, r.items].map(cell).join(',');
  });

  await audit(admin, 'export', 'orders', null, { count: rows.length, filters: f as unknown as Record<string, unknown> });

  const csv = '﻿' + [header.map(cell).join(','), ...lines].join('\r\n');
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="tantrra-orders-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
