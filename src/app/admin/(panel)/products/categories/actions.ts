'use server';

import { revalidateTag } from 'next/cache';
import { audit, requireAdminAction } from '@/lib/server/admin-auth';
import { CACHE_TAGS, requireDb } from '@/lib/server/data';
import { fail, ok, type ActionResult } from '@/lib/server/admin-action-result';
import { cleanText } from '@/lib/content/schema';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function saveCategory(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdminAction('catalog.manage').catch(() => null);
  if (!admin) return fail('You do not have permission to manage categories.');
  const isNew = formData.get('new') === '1';
  const slug = cleanText(formData.get('slug'), 60).toLowerCase();
  const name = cleanText(formData.get('name'), 80);
  if (!SLUG.test(slug)) return fail('Use a lowercase slug with letters, numbers and hyphens, e.g. "rudraksha".');
  if (!name) return fail('Name is required.');
  const values = {
    name,
    title: cleanText(formData.get('title'), 120) || null,
    description: cleanText(formData.get('description'), 400) || null,
    is_active: formData.get('is_active') === 'on',
  };
  const sql = requireDb();
  if (isNew) {
    const [{ next }] = await sql<{ next: number }[]>`SELECT coalesce(max(sort_order), -1) + 1 AS next FROM product_categories`;
    const rows = await sql`INSERT INTO product_categories ${sql({ ...values, slug, sort_order: next })} ON CONFLICT (slug) DO NOTHING RETURNING slug`;
    if (!rows.length) return fail('A category with that slug already exists.');
    await audit(admin, 'create', 'category', slug);
  } else {
    if (!values.is_active) {
      const [{ n }] = await sql<{ n: number }[]>`SELECT count(*)::int AS n FROM products WHERE category_slug = ${slug} AND is_active AND archived_at IS NULL`;
      if (n > 0) return fail(`${n} live product${n === 1 ? ' uses' : 's use'} this category. Move or hide them first.`);
    }
    const rows = await sql`UPDATE product_categories SET ${sql(values)} WHERE slug = ${slug} RETURNING slug`;
    if (!rows.length) return fail('Category not found.');
    await audit(admin, 'update', 'category', slug);
  }
  revalidateTag(CACHE_TAGS.catalog);
  return ok(isNew ? 'Category added.' : 'Category saved.');
}

export async function moveCategory(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdminAction('catalog.manage').catch(() => null);
  if (!admin) return fail('Not permitted.');
  const slug = cleanText(formData.get('slug'), 60);
  const up = formData.get('dir') === 'up';
  const sql = requireDb();
  await sql.begin(async (tx) => {
    const [cur] = await tx<{ sort_order: number }[]>`SELECT sort_order FROM product_categories WHERE slug = ${slug} FOR UPDATE`;
    if (!cur) return;
    const [other] = up
      ? await tx<{ slug: string; sort_order: number }[]>`SELECT slug, sort_order FROM product_categories WHERE sort_order < ${cur.sort_order} ORDER BY sort_order DESC LIMIT 1`
      : await tx<{ slug: string; sort_order: number }[]>`SELECT slug, sort_order FROM product_categories WHERE sort_order > ${cur.sort_order} ORDER BY sort_order ASC LIMIT 1`;
    if (!other) return;
    await tx`UPDATE product_categories SET sort_order = ${other.sort_order} WHERE slug = ${slug}`;
    await tx`UPDATE product_categories SET sort_order = ${cur.sort_order} WHERE slug = ${other.slug}`;
  });
  revalidateTag(CACHE_TAGS.catalog);
  return ok('Order updated.');
}
