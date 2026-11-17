// Webhook signature + idempotency checks against the real database, without calling Razorpay.
// Uses an event for an order that does not exist, so no payment is fetched. Test rows are removed.
// Usage: npm run test:webhooks
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import postgres from 'postgres';

const { isValidWebhookSignature, isValidPaymentSignature } = await import('../src/lib/server/razorpay.ts');
const { handleWebhookEvent } = await import('../src/lib/server/orders.ts');

const sql = postgres(process.env.DATABASE_URL, { prepare: false, max_pipeline: 1, max: 1, ssl: 'require' });
const secret = crypto.randomBytes(24).toString('hex');
const config = { keyId: 'rzp_test_unused', keySecret: secret, webhookSecret: secret, databaseUrl: process.env.DATABASE_URL, mode: 'test' };
const eventId = `selftest_${Date.now()}`;
const sign = (body, key = secret) => crypto.createHmac('sha256', key).update(body).digest('hex');

let passed = 0;
const check = async (name, fn) => {
  try { await fn(); passed++; console.log(`  pass  ${name}`); }
  catch (e) { console.log(`  FAIL  ${name}\n        ${e.message}`); process.exitCode = 1; }
};

const raw = JSON.stringify({ event: 'payment.captured', payload: { payment: { entity: { id: 'pay_SELFTEST000001', order_id: 'order_SELFTEST00001' } } } });

try {
  await check('valid webhook signature accepted', () => assert.ok(isValidWebhookSignature(raw, sign(raw), secret)));
  await check('tampered body rejected', () => assert.ok(!isValidWebhookSignature(raw.replace('captured', 'failed'), sign(raw), secret)));
  await check('wrong secret rejected', () => assert.ok(!isValidWebhookSignature(raw, sign(raw, 'other-secret'), secret)));
  await check('checkout signature (order|payment) verified', () => {
    const sig = sign('order_A1B2C3|pay_D4E5F6');
    assert.ok(isValidPaymentSignature('order_A1B2C3', 'pay_D4E5F6', sig, secret));
    assert.ok(!isValidPaymentSignature('order_A1B2C3', 'pay_OTHER1', sig, secret));
  });

  await check('first delivery recorded and processed (unknown order ignored safely)', async () => {
    const r = await handleWebhookEvent(config, eventId, JSON.parse(raw));
    assert.equal(r, 'ignored');
    const [row] = await sql`SELECT event_type, razorpay_order_id, processed_at, processing_error FROM webhook_events WHERE event_id = ${eventId}`;
    assert.equal(row.event_type, 'payment.captured');
    assert.equal(row.razorpay_order_id, 'order_SELFTEST00001');
    assert.ok(row.processed_at);
    assert.equal(row.processing_error, null);
  });
  await check('duplicate delivery of same event id is skipped', async () => {
    assert.equal(await handleWebhookEvent(config, eventId, JSON.parse(raw)), 'duplicate');
    const [{ n }] = await sql`SELECT count(*)::int AS n FROM webhook_events WHERE event_id = ${eventId}`;
    assert.equal(n, 1);
  });
  await check('event that failed earlier is reprocessed on retry', async () => {
    await sql`UPDATE webhook_events SET processed_at = NULL, processing_error = 'simulated' WHERE event_id = ${eventId}`;
    assert.equal(await handleWebhookEvent(config, eventId, JSON.parse(raw)), 'ignored');
    const [row] = await sql`SELECT processed_at, processing_error FROM webhook_events WHERE event_id = ${eventId}`;
    assert.ok(row.processed_at);
    assert.equal(row.processing_error, null);
  });
  await check('refund event resolves its order through the payment record', async () => {
    const rid = `${eventId}_refund`;
    const refundRaw = { event: 'refund.processed', payload: { refund: { entity: { id: 'rfnd_X', payment_id: 'pay_UNKNOWN0001' } } } };
    assert.equal(await handleWebhookEvent(config, rid, refundRaw), 'ignored');
    const [row] = await sql`SELECT razorpay_payment_id FROM webhook_events WHERE event_id = ${rid}`;
    assert.equal(row.razorpay_payment_id, 'pay_UNKNOWN0001');
  });
} finally {
  await sql`DELETE FROM webhook_events WHERE event_id LIKE ${eventId + '%'}`;
  const [{ n }] = await sql`SELECT count(*)::int AS n FROM webhook_events WHERE event_id LIKE 'selftest_%'`;
  console.log(`  cleanup: ${n} self-test rows remaining`);
  await sql.end();
}
console.log(`\n${passed} checks passed${process.exitCode ? ', some FAILED' : ''}.`);
