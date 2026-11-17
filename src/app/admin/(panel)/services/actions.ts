'use server';

import crypto from 'node:crypto';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { audit, requireAdminAction } from '@/lib/server/admin-auth';
import { CACHE_TAGS, requireDb } from '@/lib/server/data';
import { fail, ok, type ActionResult } from '@/lib/server/admin-action-result';
import { cleanText, isSafeLink } from '@/lib/content/schema';
import { SERVICE_KINDS, TITHI_ICONS, isServiceKind } from '@/lib/admin/service-kinds';

const MAX_PRICE = 1_000_000;
const bool = (v: FormDataEntryValue | null) => v === 'on' || v === 'true';
const lines = (v: FormDataEntryValue | null) =>
  String(v ?? '').split(/\r?\n/).map((s) => cleanText(s, 200)).filter(Boolean).slice(0, 30);
const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

function parsePrice(v: FormDataEntryValue | null): number | null | 'invalid' {
  const s = String(v ?? '').trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isInteger(n) && n >= 1 && n <= MAX_PRICE ? n : 'invalid';
}

async function guard() {
  return requireAdminAction('catalog.manage').catch(() => null);
}

export async function saveOffering(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await guard();
  if (!admin) return fail('You do not have permission to manage services.');
  const sql = requireDb();

  const existingId = cleanText(formData.get('id'), 80);
  const kind = String(formData.get('kind'));
  if (!isServiceKind(kind)) return fail('Invalid service type.');

  const name = cleanText(formData.get('name'), 160);
  if (!name) return fail('Name is required.');
  const isActive = bool(formData.get('is_active'));
  const price = parsePrice(formData.get('price'));
  if (price === 'invalid') return fail(`Price must be a whole number of rupees between 1 and ${MAX_PRICE.toLocaleString('en-IN')}.`);
  if (kind !== 'daan-seva' && price === null && isActive) return fail('A price is required for an active offering.');

  const image = cleanText(formData.get('image_url'), 2000);
  if (image && !isSafeLink(image)) return fail('Image must be a site path or an https link.');

  const values: Record<string, unknown> = {
    name,
    name_alt: cleanText(formData.get('name_alt'), 120) || null,
    short_description: cleanText(formData.get('short_description'), 1000),
    long_description: cleanText(formData.get('long_description'), 5000),
    includes: lines(formData.get('includes')),
    image_url: image || null,
    price,
    duration: cleanText(formData.get('duration'), 60) || null,
    featured: bool(formData.get('featured')),
    is_active: isActive,
  };

  const [current] = existingId
    ? await sql<{ kind: string; price: number | null; metadata: Record<string, unknown> }[]>`
        SELECT kind, price, metadata FROM service_offerings WHERE id = ${existingId}`
    : [undefined];
  if (existingId && !current) return fail('Offering not found.');
  if (current && current.kind !== kind) return fail('Service type cannot be changed.');
  const metadata: Record<string, unknown> = { ...(current?.metadata ?? {}) };

  const kindDef = SERVICE_KINDS[kind];
  // The combined Navagraha Shanti offering belongs to no day.
  if (kindDef.group && !metadata.combined) {
    const groupId = cleanText(formData.get('group_id'), 80);
    const [g] = await sql`SELECT id FROM service_groups WHERE id = ${groupId} AND kind = ${kindDef.group}`;
    if (!g) return fail(kind === 'consultation' ? 'Choose a consultation service.' : 'Choose a day.');
    values.group_id = groupId;
  }

  if (kind === 'puja') {
    const slug = slugify(cleanText(formData.get('slug'), 80) || name);
    const [clash] = await sql`SELECT id FROM service_offerings WHERE kind = 'puja' AND slug = ${slug} AND id <> ${existingId || ''}`;
    if (clash) return fail('Another Puja already uses that URL slug.');
    values.slug = slug;
  }
  if (kind === 'daan-seva') {
    const presets = String(formData.get('preset_amounts') ?? '')
      .split(/[,\s]+/).filter(Boolean).map(Number);
    if (presets.some((n) => !Number.isInteger(n) || n < 1 || n > MAX_PRICE)) return fail('Preset amounts must be whole rupees, separated by commas.');
    values.preset_amounts = [...new Set(presets)].slice(0, 8);
    values.allow_custom = bool(formData.get('allow_custom'));
    values.slug = slugify(cleanText(formData.get('slug'), 80) || name);
    if (isActive && !(values.preset_amounts as number[]).length && !values.allow_custom) return fail('Add preset amounts or allow a custom amount.');
  }
  if (kind === 'chadava-deity') {
    metadata.deity = cleanText(formData.get('deity'), 80);
    metadata.tier = cleanText(formData.get('tier'), 40);
    if (!metadata.deity) return fail('Deity is required.');
  }
  if (kind === 'chadava-navagraha' && !metadata.combined) {
    metadata.graha = cleanText(formData.get('graha'), 40);
    if (!metadata.graha) return fail('Graha is required.');
  }
  if (kind === 'chadava-navagraha' && metadata.combined) {
    metadata.note = cleanText(formData.get('note'), 600);
    metadata.panchopchar = lines(formData.get('panchopchar'));
  }
  if (kind === 'chadava-tithi') {
    metadata.deity = cleanText(formData.get('deity'), 80);
    const icon = String(formData.get('icon') ?? '');
    metadata.icon = (TITHI_ICONS as readonly string[]).includes(icon) ? icon : null;
  }
  values.metadata = sql.json(metadata as never);

  if (existingId) {
    await sql`UPDATE service_offerings SET ${sql(values)} WHERE id = ${existingId}`;
    await audit(admin, 'update', 'service', existingId, current!.price !== price ? { price: { from: current!.price, to: price } } : undefined);
    revalidateTag(CACHE_TAGS.catalog);
    return ok(current!.price !== price ? 'Saved. The new price applies to new checkouts.' : 'Saved.');
  }

  const sourceId = `${slugify(name).replace(/-/g, '_').slice(0, 40)}_${crypto.randomBytes(2).toString('hex')}`;
  const id = `${kindDef.idPrefix}${sourceId}`;
  const [{ next }] = await sql<{ next: number }[]>`SELECT coalesce(max(sort_order), 0) + 1 AS next FROM service_offerings`;
  await sql`INSERT INTO service_offerings ${sql({ ...values, id, kind, source_id: sourceId, sort_order: next })}`;
  await audit(admin, 'create', 'service', id, { price });
  revalidateTag(CACHE_TAGS.catalog);
  redirect(`/admin/services/${encodeURIComponent(id)}?created=1`);
}

export async function setOfferingActive(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await guard();
  if (!admin) return fail('Not permitted.');
  const id = cleanText(formData.get('id'), 80);
  const value = bool(formData.get('value'));
  const sql = requireDb();
  const [o] = await sql<{ kind: string; price: number | null; allow_custom: boolean; presets: number }[]>`
    SELECT kind, price, allow_custom, cardinality(preset_amounts) AS presets FROM service_offerings WHERE id = ${id}`;
  if (!o) return fail('Offering not found.');
  if (value && o.kind !== 'daan-seva' && o.price === null) return fail('Set a price before activating.');
  if (value && o.kind === 'daan-seva' && !o.allow_custom && !o.presets) return fail('Add amounts before activating.');
  await sql`UPDATE service_offerings SET is_active = ${value} WHERE id = ${id}`;
  await audit(admin, value ? 'activate' : 'deactivate', 'service', id);
  revalidateTag(CACHE_TAGS.catalog);
  return ok(value ? 'Now available for booking.' : 'Hidden — no longer bookable.');
}

export async function moveOffering(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await guard();
  if (!admin) return fail('Not permitted.');
  const id = cleanText(formData.get('id'), 80);
  const up = formData.get('dir') === 'up';
  const sql = requireDb();
  await sql.begin(async (tx) => {
    const [cur] = await tx<{ kind: string; sort_order: number; group_id: string | null }[]>`
      SELECT kind, sort_order, group_id FROM service_offerings WHERE id = ${id} FOR UPDATE`;
    if (!cur) return;
    const sameGroup = cur.group_id ? tx`AND group_id = ${cur.group_id}` : tx``;
    const [other] = up
      ? await tx<{ id: string; sort_order: number }[]>`SELECT id, sort_order FROM service_offerings WHERE kind = ${cur.kind} ${sameGroup} AND sort_order < ${cur.sort_order} ORDER BY sort_order DESC LIMIT 1`
      : await tx<{ id: string; sort_order: number }[]>`SELECT id, sort_order FROM service_offerings WHERE kind = ${cur.kind} ${sameGroup} AND sort_order > ${cur.sort_order} ORDER BY sort_order ASC LIMIT 1`;
    if (!other) return;
    await tx`UPDATE service_offerings SET sort_order = ${other.sort_order} WHERE id = ${id}`;
    await tx`UPDATE service_offerings SET sort_order = ${cur.sort_order} WHERE id = ${other.id}`;
  });
  revalidateTag(CACHE_TAGS.catalog);
  return ok('Order updated.');
}

export async function saveGroup(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await guard();
  if (!admin) return fail('Not permitted.');
  const id = cleanText(formData.get('id'), 80);
  const sql = requireDb();
  const [g] = await sql<{ kind: string }[]>`SELECT kind FROM service_groups WHERE id = ${id}`;
  if (!g) return fail('Not found.');
  const name = cleanText(formData.get('name'), 120);
  if (!name) return fail('Name is required.');
  const image = cleanText(formData.get('image_url'), 2000);
  if (image && !isSafeLink(image)) return fail('Image must be a site path or an https link.');
  await sql`UPDATE service_groups SET ${sql({
    name,
    name_alt: cleanText(formData.get('name_alt'), 120) || null,
    short_description: cleanText(formData.get('short_description'), 1000),
    long_description: cleanText(formData.get('long_description'), 5000),
    turnaround_days: cleanText(formData.get('turnaround_days'), 60) || null,
    image_url: image || null,
    seo_title: cleanText(formData.get('seo_title'), 120) || null,
    seo_description: cleanText(formData.get('seo_description'), 300) || null,
    featured: bool(formData.get('featured')),
    is_active: bool(formData.get('is_active')),
  })} WHERE id = ${id}`;
  await audit(admin, 'update', 'service_group', id);
  revalidateTag(CACHE_TAGS.catalog);
  return ok('Saved.');
}
