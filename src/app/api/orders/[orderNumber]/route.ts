import { NextResponse } from 'next/server';
import { getPaymentConfig } from '@/lib/server/config';
import { getPublicOrder } from '@/lib/server/orders';
import { describeGatewayError } from '@/lib/server/razorpay';
import { getSql } from '@/lib/server/db';
import { clientKey, withinRateLimit } from '@/lib/server/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ orderNumber: string }> }) {
  const cfg = getPaymentConfig();
  if (!cfg.ok) return NextResponse.json({ error: 'payments_unavailable' }, { status: 503 });

  const { orderNumber } = await params;
  const token = request.headers.get('x-order-token') ?? '';

  try {
    if (!(await withinRateLimit(getSql(cfg.config.databaseUrl), `order-status:${clientKey(request)}`, 120, 600))) {
      return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
    }
    const order = await getPublicOrder(cfg.config, orderNumber, token);
    if (!order) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    return NextResponse.json(order, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error(`[payments] order lookup failed: ${describeGatewayError(err)}`);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}
