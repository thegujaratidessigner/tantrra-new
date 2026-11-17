// Read-only checks of the checkout pricing engine against the live catalog.
// Usage: npm run test:pricing
import assert from 'node:assert/strict';
import postgres from 'postgres';

const { priceCheckout } = await import('../src/lib/server/pricing.ts');
const { mergeSettings } = await import('../src/lib/site-settings.ts');

const sql = postgres(process.env.DATABASE_URL, { prepare: false, max_pipeline: 1, max: 2, ssl: 'require' });
const settings = mergeSettings(await sql`SELECT key, value FROM site_settings`);

const base = {
  checkoutKey: 'pricingtest_' + 'a'.repeat(16),
  customer: { name: 'Pricing Test', email: 'Test@Example.com', phone: '+91 98765 43210' },
  dakshinaAmount: 0,
};
const ship = { line1: '12 Temple Road', city: 'Ahmedabad', state: 'Gujarat', pincode: '380001' };
const prod = { type: 'product', productId: 'prod_001', variantId: 'prod_001_red', quantity: 1, priceSnapshot: 501, energization: false };
const puja = { type: 'service', serviceId: 'puja_spuja_001', quantity: 1, priceSnapshot: 5100, devoteeDetails: { fullName: 'Devotee One', gotra: 'Kashyap' } };
const daan = { type: 'service', serviceId: 'daan_seva_003', quantity: 1, priceSnapshot: 251 };

let passed = 0;
async function check(name, body, verify) {
  const r = await priceCheckout(body, sql, settings);
  try {
    verify(r);
    passed++;
    console.log(`  pass  ${name}`);
  } catch (e) {
    console.log(`  FAIL  ${name}\n        ${e.message}\n        got: ${JSON.stringify(r).slice(0, 300)}`);
    process.exitCode = 1;
  }
}
const err = (code) => (r) => assert.equal(r.ok ? 'ok' : r.error, code);

await check('tampered product price is rejected with real price', { ...base, shipping: ship, items: [{ ...prod, priceSnapshot: 1 }] },
  (r) => { assert.equal(r.error, 'price_changed'); assert.deepEqual(r.priceUpdates, [{ index: 0, priceSnapshot: 501 }]); });
await check('stale puja price (2500) corrected to 5100', { ...base, items: [{ ...puja, priceSnapshot: 2500 }] },
  (r) => { assert.equal(r.error, 'price_changed'); assert.equal(r.priceUpdates[0].priceSnapshot, 5100); });
await check('unknown product rejected', { ...base, shipping: ship, items: [{ ...prod, productId: 'prod_999' }] }, err('invalid_items'));
await check('inactive product rejected', { ...base, shipping: ship, items: [{ ...prod, productId: 'prod_100', variantId: undefined, priceSnapshot: 699 }] }, err('invalid_items'));
await check('variant from another product rejected', { ...base, shipping: ship, items: [{ ...prod, variantId: 'prod_002_red' }] }, err('invalid_items'));
await check('quantity 0 rejected', { ...base, shipping: ship, items: [{ ...prod, quantity: 0 }] }, err('invalid_items'));
await check('fractional quantity rejected', { ...base, shipping: ship, items: [{ ...prod, quantity: 1.5 }] }, err('invalid_items'));
await check('quantity above limit rejected', { ...base, shipping: ship, items: [{ ...prod, quantity: 21 }] }, err('invalid_items'));
await check('made-up service rejected', { ...base, items: [{ type: 'service', serviceId: 'puja_free', quantity: 1, priceSnapshot: 1 }] }, err('invalid_items'));
await check('inactive legacy puja rejected', { ...base, items: [{ type: 'service', serviceId: 'puja_puja_001', quantity: 1, priceSnapshot: 1 }] }, err('invalid_items'));
await check('negative Daan rejected', { ...base, items: [{ ...daan, priceSnapshot: -500 }] }, err('invalid_items'));
await check('fractional Daan rejected', { ...base, items: [{ ...daan, priceSnapshot: 10.5 }] }, err('invalid_items'));
await check('Daan above ₹5,00,000 rejected', { ...base, items: [{ ...daan, priceSnapshot: 500001 }] }, err('invalid_items'));
await check('Dakshina outside options rejected', { ...base, dakshinaAmount: 7, items: [daan] }, err('invalid_request'));
await check('energization on product that does not allow it rejected', { ...base, shipping: ship, items: [{ type: 'product', productId: 'prod_007', quantity: 1, priceSnapshot: 501, energization: true }] }, err('invalid_items'));
await check('physical product without address rejected', { ...base, items: [prod] }, err('invalid_request'));
await check('invalid PIN rejected', { ...base, shipping: { ...ship, pincode: '012345' }, items: [prod] }, err('invalid_request'));
await check('puja without devotee name rejected', { ...base, items: [{ ...puja, devoteeDetails: undefined }] }, err('invalid_request'));

await check('mixed cart priced exactly (₹6,624, free shipping)', {
  ...base, dakshinaAmount: 21, shipping: ship,
  items: [{ ...prod, quantity: 2, energization: true, priceSnapshot: 501 }, puja, daan],
}, (r) => {
  assert.ok(r.ok, r.message);
  const o = r.order;
  assert.equal(o.subtotalPaise, (1002 + 5100 + 251) * 100);
  assert.equal(o.energizationPaise, 250 * 100);
  assert.equal(o.dakshinaPaise, 2100);
  assert.equal(o.shippingPaise, 0);
  assert.equal(o.shippingRateUnconfirmed, false);
  assert.equal(o.totalPaise, 662400);
  assert.equal(o.orderType, 'mixed');
  assert.equal(o.customer.email, 'test@example.com');
  assert.equal(o.lines[1].name, 'Maa Kamakhya Poojan');
  assert.equal(o.lines[1].devoteeDetails.gotra, 'Kashyap');
  assert.equal(o.lines[2].name, 'Gau Seva — Daan Seva');
});

await check('product below ₹999 flags unconfirmed shipping, charges ₹0', { ...base, shipping: ship, items: [prod] }, (r) => {
  assert.ok(r.ok);
  assert.equal(r.order.shippingPaise, 0);
  assert.equal(r.order.shippingRateUnconfirmed, true);
  assert.equal(r.order.totalPaise, 50100);
});

await check('service-only order has no shipping', { ...base, items: [daan] }, (r) => {
  assert.ok(r.ok);
  assert.equal(r.order.requiresShipping, false);
  assert.equal(r.order.shipping, null);
});

await check('consultation & navagraha resolve names/metadata from DB', {
  ...base,
  items: [
    { type: 'service', serviceId: 'consult_tarot_3q', quantity: 1, priceSnapshot: 501 },
    { type: 'service', serviceId: 'navagraha_sat_r04', quantity: 1, priceSnapshot: 151, devoteeDetails: { fullName: 'D' } },
    { type: 'service', serviceId: 'tithi_tithi_001', quantity: 1, priceSnapshot: 151, devoteeDetails: { fullName: 'D' } },
  ],
}, (r) => {
  assert.ok(r.ok, r.message);
  const [c, n, t] = r.order.lines;
  assert.equal(c.packageName, '3 Major Questions');
  assert.deepEqual(n.bookingMetadata, { Day: 'Saturday', Graha: 'Rahu' });
  assert.equal(t.name, 'Maasik Shivratri Panchopchar Poojan');
});

await check('identical carts hash identically; different address does not', { ...base, shipping: ship, items: [prod] }, async () => {});
{
  const a = await priceCheckout({ ...base, shipping: ship, items: [prod] }, sql, settings);
  const b = await priceCheckout({ ...base, shipping: ship, items: [prod] }, sql, settings);
  const c = await priceCheckout({ ...base, shipping: { ...ship, line1: 'Other' }, items: [prod] }, sql, settings);
  try { assert.equal(a.order.cartHash, b.order.cartHash); assert.notEqual(a.order.cartHash, c.order.cartHash); passed++; console.log('  pass  cart hash idempotency'); }
  catch (e) { console.log('  FAIL  cart hash idempotency', e.message); process.exitCode = 1; }
}

console.log(`\n${passed} checks passed${process.exitCode ? ', some FAILED' : ''}.`);
await sql.end();
