'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { audit, requireAdminAction } from '@/lib/server/admin-auth';
import { CACHE_TAGS, requireDb } from '@/lib/server/data';
import { fail, ok, type ActionResult } from '@/lib/server/admin-action-result';
import { cleanText, isSafeLink } from '@/lib/content/schema';

const MAX_PRICE = 1_000_000;
const IMAGE_KINDS = ['hero', 'info', 'preparation', 'gallery'] as const;

const lines = (v: FormDataEntryValue | null, max = 30) =>
  String(v ?? '').split(/\r?\n/).map((s) => cleanText(s, 300)).filter(Boolean).slice(0, max);
const intOrNull = (v: FormDataEntryValue | null) => {
  const s = String(v ?? '').trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isInteger(n) ? n : NaN;
};
const bool = (v: FormDataEntryValue | null) => v === 'on' || v === 'true';
const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

async function guard() {
  return requireAdminAction('catalog.manage').catch(() => null);
}

export async function saveProduct(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await guard();
  if (!admin) return fail('You do not have permission to manage products.');
  const sql = requireDb();

  const existingId = cleanText(formData.get('id'), 64);
  const name = cleanText(formData.get('name'), 120);
  const slug = slugify(cleanText(formData.get('slug'), 80) || name);
  const category = cleanText(formData.get('category_slug'), 60);
  const price = intOrNull(formData.get('price'));
  const comparePrice = intOrNull(formData.get('compare_price'));
  const stock = intOrNull(formData.get('stock_quantity'));
  const testOnly = bool(formData.get('test_only'));
  // Test-only products can never be live or featured in the public store.
  const isActive = testOnly ? false : bool(formData.get('is_active'));

  if (!name) return fail('Product name is required.');
  if (!slug) return fail('A URL slug is required.');
  if (price === null || Number.isNaN(price) || price < 1 || price > MAX_PRICE) return fail(`Price must be a whole number of rupees between 1 and ${MAX_PRICE.toLocaleString('en-IN')}.`);
  if (comparePrice !== null && (Number.isNaN(comparePrice) || comparePrice <= price)) return fail('Compare-at price must be empty or higher than the price.');
  if (stock !== null && (Number.isNaN(stock) || stock < 0)) return fail('Stock must be empty (not tracked) or 0 or more.');
  const [cat] = await sql`SELECT slug FROM product_categories WHERE slug = ${category}`;
  if (!cat) return fail('Choose a valid category.');

  const values = {
    slug, name, category_slug: category,
    short_description: cleanText(formData.get('short_description'), 500),
    long_description: cleanText(formData.get('long_description'), 5000),
    purpose: cleanText(formData.get('purpose'), 300),
    price, compare_price: comparePrice,
    sku: cleanText(formData.get('sku'), 60) || null,
    weight: cleanText(formData.get('weight'), 60) || null,
    preparation_info: cleanText(formData.get('preparation_info'), 2000) || null,
    how_to_use: cleanText(formData.get('how_to_use'), 2000) || null,
    care_instructions: cleanText(formData.get('care_instructions'), 2000) || null,
    benefits: lines(formData.get('benefits')),
    recommended_for: lines(formData.get('recommended_for')),
    kit_includes: lines(formData.get('kit_includes')),
    badge: cleanText(formData.get('badge'), 40) || null,
    featured: testOnly ? false : bool(formData.get('featured')),
    is_active: isActive,
    test_only: testOnly,
    in_stock: bool(formData.get('in_stock')),
    stock_quantity: stock,
    energization_available: bool(formData.get('energization_available')),
    whatsapp_customization: bool(formData.get('whatsapp_customization')),
    seo_title: cleanText(formData.get('seo_title'), 120) || null,
    seo_description: cleanText(formData.get('seo_description'), 300) || null,
  };

  const [slugClash] = await sql`SELECT id FROM products WHERE slug = ${slug} AND id <> ${existingId || ''}`;
  if (slugClash) return fail('Another product already uses that URL slug.');

  if (existingId) {
    const [before] = await sql<{ price: number; is_active: boolean; images: number }[]>`
      SELECT price, is_active, (SELECT count(*)::int FROM product_images WHERE product_id = ${existingId}) AS images
      FROM products WHERE id = ${existingId}`;
    if (!before) return fail('Product not found.');
    if (isActive && before.images === 0) return fail('Add at least one image before making the product live.');
    await sql`UPDATE products SET ${sql(values)} WHERE id = ${existingId}`;
    await audit(admin, 'update', 'product', existingId, before.price !== price ? { price: { from: before.price, to: price } } : undefined);
    revalidateTag(CACHE_TAGS.catalog);
    if (testOnly) return ok('Saved as a hidden test-only product. Only signed-in admins can buy it.');
    return ok(before.price !== price ? `Saved. New price ₹${price.toLocaleString('en-IN')} applies to new checkouts.` : 'Product saved.');
  }

  const id = `prod_${slug.replace(/-/g, '_')}`.slice(0, 64);
  const [{ next }] = await sql<{ next: number }[]>`SELECT coalesce(max(sort_order), 0) + 1 AS next FROM products`;
  try {
    // New products start hidden until they have images.
    await sql`INSERT INTO products ${sql({ ...values, id, is_active: false, sort_order: next })}`;
  } catch (e) {
    if ((e as { code?: string }).code === '23505') return fail('A product with this name or slug already exists.');
    throw e;
  }
  await audit(admin, 'create', 'product', id, { price });
  revalidateTag(CACHE_TAGS.catalog);
  redirect(`/admin/products/${id}?created=1`);
}

export async function setProductFlag(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await guard();
  if (!admin) return fail('Not permitted.');
  const id = cleanText(formData.get('id'), 64);
  const flag = String(formData.get('flag'));
  const value = bool(formData.get('value'));
  if (!['is_active', 'featured', 'in_stock'].includes(flag)) return fail('Invalid request.');
  const sql = requireDb();
  if ((flag === 'is_active' || flag === 'featured') && value) {
    const [t] = await sql<{ test_only: boolean }[]>`SELECT test_only FROM products WHERE id = ${id}`;
    if (t?.test_only) return fail('Test-only products always stay hidden from the store.');
  }
  if (flag === 'is_active' && value) {
    const [p] = await sql<{ images: number; archived: boolean }[]>`
      SELECT (SELECT count(*)::int FROM product_images WHERE product_id = ${id}) AS images, archived_at IS NOT NULL AS archived
      FROM products WHERE id = ${id}`;
    if (!p) return fail('Product not found.');
    if (p.archived) return fail('Restore the product from the archive first.');
    if (p.images === 0) return fail('Add at least one image before making the product live.');
  }
  const rows = await sql`UPDATE products SET ${sql({ [flag]: value })} WHERE id = ${id} RETURNING id`;
  if (!rows.length) return fail('Product not found.');
  await audit(admin, 'set_flag', 'product', id, { [flag]: value });
  revalidateTag(CACHE_TAGS.catalog);
  return ok('Updated.');
}

export async function archiveProduct(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await guard();
  if (!admin) return fail('Not permitted.');
  const id = cleanText(formData.get('id'), 64);
  const restore = formData.get('restore') === '1';
  const sql = requireDb();
  const rows = restore
    ? await sql`UPDATE products SET archived_at = NULL WHERE id = ${id} RETURNING id`
    : await sql`UPDATE products SET archived_at = now(), is_active = false, featured = false WHERE id = ${id} RETURNING id`;
  if (!rows.length) return fail('Product not found.');
  await audit(admin, restore ? 'restore' : 'archive', 'product', id);
  revalidateTag(CACHE_TAGS.catalog);
  return ok(restore ? 'Restored (still hidden — switch it live when ready).' : 'Archived and removed from the store.');
}

export async function deleteProduct(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdminAction('catalog.manage').catch(() => null);
  if (!admin) return fail('Not permitted.');
  const id = cleanText(formData.get('id'), 64);
  const sql = requireDb();
  const [used] = await sql`SELECT 1 FROM order_items WHERE item_type = 'product' AND ref_id = ${id} LIMIT 1`;
  if (used) return fail('This product appears in past orders, so it can only be archived, not deleted.');
  const rows = await sql`DELETE FROM products WHERE id = ${id} AND archived_at IS NOT NULL RETURNING id`;
  if (!rows.length) return fail('Archive the product before deleting it permanently.');
  await audit(admin, 'delete', 'product', id);
  revalidateTag(CACHE_TAGS.catalog);
  redirect('/admin/products?deleted=1');
}

export async function moveProduct(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await guard();
  if (!admin) return fail('Not permitted.');
  const id = cleanText(formData.get('id'), 64);
  const dir = formData.get('dir') === 'up' ? 'up' : 'down';
  const sql = requireDb();
  await sql.begin(async (tx) => {
    const [cur] = await tx<{ sort_order: number }[]>`SELECT sort_order FROM products WHERE id = ${id} FOR UPDATE`;
    if (!cur) return;
    const [other] = dir === 'up'
      ? await tx<{ id: string; sort_order: number }[]>`SELECT id, sort_order FROM products WHERE sort_order < ${cur.sort_order} AND archived_at IS NULL ORDER BY sort_order DESC LIMIT 1`
      : await tx<{ id: string; sort_order: number }[]>`SELECT id, sort_order FROM products WHERE sort_order > ${cur.sort_order} AND archived_at IS NULL ORDER BY sort_order ASC LIMIT 1`;
    if (!other) return;
    await tx`UPDATE products SET sort_order = ${other.sort_order} WHERE id = ${id}`;
    await tx`UPDATE products SET sort_order = ${cur.sort_order} WHERE id = ${other.id}`;
  });
  revalidateTag(CACHE_TAGS.catalog);
  return ok('Order updated.');
}

// ── Images ──────────────────────────────────────────────────────────────────

export async function addProductImage(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await guard();
  if (!admin) return fail('Not permitted.');
  const productId = cleanText(formData.get('productId'), 64);
  const src = cleanText(formData.get('src'), 2000);
  const kind = String(formData.get('kind'));
  if (!src || !isSafeLink(src)) return fail('Choose an image from the library or enter a site path.');
  if (!(IMAGE_KINDS as readonly string[]).includes(kind)) return fail('Invalid image type.');
  const sql = requireDb();
  try {
    await sql`
      INSERT INTO product_images (product_id, src, alt, kind, sort_order)
      SELECT ${productId}, ${src}, ${cleanText(formData.get('alt'), 300)}, ${kind},
             coalesce((SELECT max(sort_order) + 1 FROM product_images WHERE product_id = ${productId}), 0)
      WHERE EXISTS (SELECT 1 FROM products WHERE id = ${productId})`;
  } catch (e) {
    if ((e as { code?: string }).code === '23505') return fail('That image is already on this product.');
    throw e;
  }
  await audit(admin, 'add_image', 'product', productId, { src });
  revalidateTag(CACHE_TAGS.catalog);
  return ok('Image added.');
}

export async function updateProductImage(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await guard();
  if (!admin) return fail('Not permitted.');
  const id = String(formData.get('id'));
  const intent = String(formData.get('intent'));
  const sql = requireDb();
  const [img] = await sql<{ product_id: string; sort_order: number }[]>`SELECT product_id, sort_order FROM product_images WHERE id = ${id}`;
  if (!img) return fail('Image not found.');

  if (intent === 'remove') {
    const [{ n }] = await sql<{ n: number }[]>`SELECT count(*)::int AS n FROM product_images WHERE product_id = ${img.product_id}`;
    const [p] = await sql<{ is_active: boolean }[]>`SELECT is_active FROM products WHERE id = ${img.product_id}`;
    if (n <= 1 && p?.is_active) return fail('A live product needs at least one image. Add another first or hide the product.');
    await sql`DELETE FROM product_images WHERE id = ${id}`;
    await audit(admin, 'remove_image', 'product', img.product_id);
    revalidateTag(CACHE_TAGS.catalog);
    return ok('Image removed from product (the file stays in the media library).');
  }
  if (intent === 'up' || intent === 'down') {
    await sql.begin(async (tx) => {
      const [other] = intent === 'up'
        ? await tx<{ id: string; sort_order: number }[]>`SELECT id, sort_order FROM product_images WHERE product_id = ${img.product_id} AND sort_order < ${img.sort_order} ORDER BY sort_order DESC LIMIT 1`
        : await tx<{ id: string; sort_order: number }[]>`SELECT id, sort_order FROM product_images WHERE product_id = ${img.product_id} AND sort_order > ${img.sort_order} ORDER BY sort_order ASC LIMIT 1`;
      if (!other) return;
      await tx`UPDATE product_images SET sort_order = ${other.sort_order} WHERE id = ${id}`;
      await tx`UPDATE product_images SET sort_order = ${img.sort_order} WHERE id = ${other.id}`;
    });
    revalidateTag(CACHE_TAGS.catalog);
    return ok('Image order updated.');
  }
  const kind = String(formData.get('kind'));
  if (!(IMAGE_KINDS as readonly string[]).includes(kind)) return fail('Invalid image type.');
  await sql`UPDATE product_images SET alt = ${cleanText(formData.get('alt'), 300)}, kind = ${kind} WHERE id = ${id}`;
  revalidateTag(CACHE_TAGS.catalog);
  return ok('Image details saved.');
}
