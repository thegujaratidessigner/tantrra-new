import 'server-only';

export interface PaymentConfig {
  keyId: string;
  keySecret: string;
  webhookSecret: string | null;
  databaseUrl: string;
  mode: 'test' | 'live';
}

export type PaymentConfigResult =
  | { ok: true; config: PaymentConfig }
  | { ok: false; reason: string };

export function getPaymentConfig(): PaymentConfigResult {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  const databaseUrl = process.env.DATABASE_URL?.trim();
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim() || null;

  if (!keyId || !keySecret) return { ok: false, reason: 'Razorpay keys are not configured' };
  if (!databaseUrl) return { ok: false, reason: 'DATABASE_URL is not configured' };

  const mode = keyId.startsWith('rzp_live_') ? 'live' : keyId.startsWith('rzp_test_') ? 'test' : null;
  if (!mode) return { ok: false, reason: 'RAZORPAY_KEY_ID has an unrecognised format' };

  // Live keys stay inert until someone deliberately opts in.
  if (mode === 'live' && process.env.RAZORPAY_ALLOW_LIVE !== 'true') {
    return { ok: false, reason: 'Live Razorpay keys are present but RAZORPAY_ALLOW_LIVE is not "true"' };
  }

  return { ok: true, config: { keyId, keySecret, webhookSecret, databaseUrl, mode } };
}
