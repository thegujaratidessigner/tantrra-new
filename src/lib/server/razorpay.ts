import 'server-only';
import crypto from 'node:crypto';
import Razorpay from 'razorpay';
import type { PaymentConfig } from './config';

let cached: { keyId: string; client: Razorpay } | null = null;

export function getRazorpay(config: PaymentConfig): Razorpay {
  if (!cached || cached.keyId !== config.keyId) {
    cached = {
      keyId: config.keyId,
      client: new Razorpay({ key_id: config.keyId, key_secret: config.keySecret }),
    };
  }
  return cached.client;
}

function hmacMatches(message: string, signature: string, secret: string): boolean {
  const expected = Buffer.from(crypto.createHmac('sha256', secret).update(message).digest('hex'), 'utf8');
  const received = Buffer.from(signature, 'utf8');
  return expected.length === received.length && crypto.timingSafeEqual(expected, received);
}

// Razorpay Standard Checkout: HMAC_SHA256(order_id + "|" + payment_id, key_secret)
export function isValidPaymentSignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string,
  keySecret: string
): boolean {
  return hmacMatches(`${razorpayOrderId}|${razorpayPaymentId}`, signature, keySecret);
}

// Razorpay webhooks: HMAC_SHA256(raw request body, webhook_secret)
export function isValidWebhookSignature(rawBody: string, signature: string, webhookSecret: string): boolean {
  return hmacMatches(rawBody, signature, webhookSecret);
}

export function describeGatewayError(err: unknown): string {
  if (err && typeof err === 'object') {
    const e = err as { statusCode?: number; error?: { code?: string; description?: string }; message?: string };
    if (e.error?.code || e.error?.description) {
      return `${e.statusCode ?? ''} ${e.error.code ?? ''} ${e.error.description ?? ''}`.trim();
    }
    if (e.message) return e.message;
  }
  return 'unknown error';
}
