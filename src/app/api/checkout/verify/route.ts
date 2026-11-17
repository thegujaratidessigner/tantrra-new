import { NextResponse } from 'next/server';
import { getPaymentConfig } from '@/lib/server/config';
import { settlePayment } from '@/lib/server/orders';
import { describeGatewayError, isValidPaymentSignature } from '@/lib/server/razorpay';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ID_RE = /^[A-Za-z0-9_]{10,40}$/;

export async function POST(request: Request) {
  const cfg = getPaymentConfig();
  if (!cfg.ok) return NextResponse.json({ error: 'payments_unavailable' }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const orderId = body.razorpay_order_id;
  const paymentId = body.razorpay_payment_id;
  const signature = body.razorpay_signature;
  if (
    typeof orderId !== 'string' || !orderId.startsWith('order_') || !ID_RE.test(orderId) ||
    typeof paymentId !== 'string' || !paymentId.startsWith('pay_') || !ID_RE.test(paymentId) ||
    typeof signature !== 'string' || !/^[a-f0-9]{64}$/.test(signature)
  ) {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  if (!isValidPaymentSignature(orderId, paymentId, signature, cfg.config.keySecret)) {
    console.warn(`[payments] invalid checkout signature for ${orderId}`);
    return NextResponse.json({ error: 'invalid_signature' }, { status: 400 });
  }

  try {
    const outcome = await settlePayment(cfg.config, {
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      via: 'client_callback',
      signatureVerified: true,
    });
    if (outcome.kind === 'unknown_order') return NextResponse.json({ error: 'unknown_order' }, { status: 404 });
    return NextResponse.json(
      {
        orderNumber: outcome.order.order_number,
        paymentStatus: outcome.kind === 'mismatch' ? 'pending' : outcome.order.payment_status,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    console.error(`[payments] verify failed for ${orderId}: ${describeGatewayError(err)}`);
    return NextResponse.json({ error: 'verification_failed' }, { status: 502 });
  }
}
