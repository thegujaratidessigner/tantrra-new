import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { getPaymentConfig } from '@/lib/server/config';
import { handleWebhookEvent } from '@/lib/server/orders';
import { describeGatewayError, isValidWebhookSignature } from '@/lib/server/razorpay';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const cfg = getPaymentConfig();
  if (!cfg.ok || !cfg.config.webhookSecret) {
    console.error('[payments] webhook received but payments/webhook secret are not configured');
    return NextResponse.json({ error: 'unavailable' }, { status: 503 });
  }

  // Signature is computed over the exact raw body, so read it before any parsing.
  const rawBody = await request.text();
  const signature = request.headers.get('x-razorpay-signature') ?? '';
  if (!signature || !isValidWebhookSignature(rawBody, signature, cfg.config.webhookSecret)) {
    console.warn('[payments] webhook rejected: invalid signature');
    return NextResponse.json({ error: 'invalid_signature' }, { status: 400 });
  }

  let event: unknown;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const eventId =
    request.headers.get('x-razorpay-event-id')?.slice(0, 100) ||
    `sha256:${crypto.createHash('sha256').update(rawBody).digest('hex')}`;

  try {
    const result = await handleWebhookEvent(cfg.config, eventId, event as Parameters<typeof handleWebhookEvent>[2]);
    return NextResponse.json({ status: result });
  } catch (err) {
    // Non-2xx makes Razorpay retry delivery later.
    console.error(`[payments] webhook ${eventId} processing failed: ${describeGatewayError(err)}`);
    return NextResponse.json({ error: 'processing_failed' }, { status: 500 });
  }
}
