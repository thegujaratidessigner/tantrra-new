'use server';

import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { audit, requireAdminAction } from '@/lib/server/admin-auth';
import { CACHE_TAGS, requireDb } from '@/lib/server/data';
import { fail, ok, type ActionResult } from '@/lib/server/admin-action-result';
import { validateFields } from '@/lib/content/schema';
import { getCollection, type CollectionDef } from '@/lib/admin/collections';

const UUID = /^[0-9a-f-]{36}$/i;

function parsePayload(formData: FormData): unknown {
  try {
    return JSON.parse(String(formData.get('payload') ?? '{}'));
  } catch {
    return null;
  }
}

/** Collection-specific rules on top of the field schema. Returns an error message or null. */
function checkRules(def: CollectionDef, v: Record<string, unknown>): string | null {
  if (def.key === 'banners') {
    const textOnly = v.placement === 'page_hero_about' || v.placement === 'page_hero_contact';
    if (!textOnly && !v.desktop_src) return 'Choose the banner media.';
    if (v.media_type === 'video' && !v.poster_src && v.placement !== 'home_hero') return 'Video banners need a poster image (shown while loading or if video fails).';
    if (v.placement === 'home_hero' && !v.heading) return 'Homepage hero banners need a heading.';
  }
  if (def.key === 'videos') {
    if (v.placement === 'youtube') {
      if (!/^[A-Za-z0-9_-]{6,20}$/.test(String(v.youtube_id ?? ''))) return 'Enter a valid YouTube video ID.';
    } else if (!v.src) return 'Choose a video file.';
  }
  return null;
}

function toRow(def: CollectionDef, v: Record<string, unknown>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  for (const f of def.fields) {
    let val = v[f.key];
    if (typeof val === 'string' && val === '' && f.kind !== 'textarea' && !('required' in f && f.required)) val = null;
    if (def.key === 'testimonials' && f.key === 'rating') val = Number(val) || 5;
    if (def.key === 'banners' && f.key === 'object_position' && !val) val = 'center';
    if ((f.key === 'alt') && val === null) val = '';
    row[f.key] = val;
  }
  if (def.key === 'videos' && row.placement !== 'youtube') row.youtube_id = null;
  if (def.key === 'videos' && row.placement === 'youtube') row.src = null;
  return row;
}

export async function saveCollectionItem(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdminAction('content.manage').catch(() => null);
  if (!admin) return fail('You do not have permission to edit website content.');
  const def = getCollection(String(formData.get('collection')));
  if (!def) return fail('Unknown section.');
  const id = String(formData.get('id') ?? '');
  if (id && !UUID.test(id)) return fail('Invalid item.');

  const payload = parsePayload(formData);
  if (!payload) return fail('Could not read the form. Please try again.');
  const { value, errors } = validateFields(def.fields, payload);
  if (errors.length) return fail(errors[0].message);
  const ruleError = checkRules(def, value);
  if (ruleError) return fail(ruleError);
  const row = toRow(def, value);
  const isActive = (payload as Record<string, unknown>).__active !== false;

  const sql = requireDb();
  try {
    if (id) {
      const updated = await sql`UPDATE ${sql(def.table)} SET ${sql(row)} WHERE id = ${id} RETURNING id`;
      if (!updated.length) return fail('Item not found.');
      await audit(admin, 'update', def.table, id);
    } else {
      const group = def.groupColumn ? row[def.groupColumn] : null;
      const [{ next }] = def.groupColumn
        ? await sql<{ next: number }[]>`SELECT coalesce(max(sort_order), -1) + 1 AS next FROM ${sql(def.table)} WHERE ${sql(def.groupColumn)} = ${group as string}`
        : await sql<{ next: number }[]>`SELECT coalesce(max(sort_order), -1) + 1 AS next FROM ${sql(def.table)}`;
      const [created] = await sql<{ id: string }[]>`
        INSERT INTO ${sql(def.table)} ${sql({ ...row, sort_order: next, [def.activeColumn]: isActive })} RETURNING id`;
      await audit(admin, 'create', def.table, created.id);
      revalidateTag(CACHE_TAGS.content);
      redirect(`/admin/${def.key}/${created.id}?created=1`);
    }
  } catch (e) {
    if ((e as { code?: string }).code === '23505') return fail('An identical item already exists.');
    throw e;
  }
  revalidateTag(CACHE_TAGS.content);
  return ok('Saved. The website updates immediately.');
}

export async function setCollectionItemActive(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdminAction('content.manage').catch(() => null);
  if (!admin) return fail('Not permitted.');
  const def = getCollection(String(formData.get('collection')));
  const id = String(formData.get('id') ?? '');
  if (!def || !UUID.test(id)) return fail('Invalid request.');
  const value = formData.get('value') === 'true';
  const sql = requireDb();
  const rows = await sql`UPDATE ${sql(def.table)} SET ${sql({ [def.activeColumn]: value })} WHERE id = ${id} RETURNING id`;
  if (!rows.length) return fail('Item not found.');
  await audit(admin, value ? 'activate' : 'deactivate', def.table, id);
  revalidateTag(CACHE_TAGS.content);
  return ok(value ? `${def.activeLabel[0]}.` : `${def.activeLabel[1]}.`);
}

export async function moveCollectionItem(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdminAction('content.manage').catch(() => null);
  if (!admin) return fail('Not permitted.');
  const def = getCollection(String(formData.get('collection')));
  const id = String(formData.get('id') ?? '');
  if (!def || !UUID.test(id)) return fail('Invalid request.');
  const up = formData.get('dir') === 'up';
  const sql = requireDb();
  await sql.begin(async (tx) => {
    const [cur] = await tx<{ sort_order: number; grp: string | null }[]>`
      SELECT sort_order, ${def.groupColumn ? tx`placement` : tx`NULL::text`} AS grp FROM ${tx(def.table)} WHERE id = ${id} FOR UPDATE`;
    if (!cur) return;
    const sameGroup = def.groupColumn ? tx`AND placement = ${cur.grp}` : tx``;
    const [other] = up
      ? await tx<{ id: string; sort_order: number }[]>`SELECT id, sort_order FROM ${tx(def.table)} WHERE sort_order < ${cur.sort_order} ${sameGroup} ORDER BY sort_order DESC LIMIT 1`
      : await tx<{ id: string; sort_order: number }[]>`SELECT id, sort_order FROM ${tx(def.table)} WHERE sort_order > ${cur.sort_order} ${sameGroup} ORDER BY sort_order ASC LIMIT 1`;
    if (!other) return;
    await tx`UPDATE ${tx(def.table)} SET sort_order = ${other.sort_order} WHERE id = ${id}`;
    await tx`UPDATE ${tx(def.table)} SET sort_order = ${cur.sort_order} WHERE id = ${other.id}`;
  });
  revalidateTag(CACHE_TAGS.content);
  return ok('Order updated.');
}

export async function deleteCollectionItem(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdminAction('content.manage').catch(() => null);
  if (!admin) return fail('Not permitted.');
  const def = getCollection(String(formData.get('collection')));
  const id = String(formData.get('id') ?? '');
  if (!def || !UUID.test(id)) return fail('Invalid request.');
  const sql = requireDb();
  const rows = await sql`DELETE FROM ${sql(def.table)} WHERE id = ${id} RETURNING id`;
  if (!rows.length) return fail('Item not found.');
  await audit(admin, 'delete', def.table, id);
  revalidateTag(CACHE_TAGS.content);
  redirect(`/admin/${def.key}?deleted=1`);
}
