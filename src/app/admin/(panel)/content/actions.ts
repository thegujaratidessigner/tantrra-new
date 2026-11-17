'use server';

import { revalidateTag } from 'next/cache';
import { audit, requireAdminAction } from '@/lib/server/admin-auth';
import { CACHE_TAGS, requireDb } from '@/lib/server/data';
import { fail, ok, type ActionResult } from '@/lib/server/admin-action-result';
import { validateFields } from '@/lib/content/schema';
import { getBlockDef } from '@/lib/content/blocks';
import { SETTINGS_SECTIONS } from '@/lib/admin/settings-schema';

function parsePayload(formData: FormData): unknown {
  try {
    return JSON.parse(String(formData.get('payload') ?? '{}'));
  } catch {
    return null;
  }
}

export async function saveBlock(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdminAction('content.manage').catch(() => null);
  if (!admin) return fail('You do not have permission to edit content.');
  const def = getBlockDef(String(formData.get('key')));
  if (!def) return fail('Unknown content block.');
  const payload = parsePayload(formData);
  if (!payload) return fail('Could not read the form.');
  const { value, errors } = validateFields(def.fields, payload);
  if (errors.length) return fail(errors[0].message);

  const sql = requireDb();
  await sql`
    INSERT INTO content_blocks (key, value, updated_by) VALUES (${def.key}, ${sql.json(value as never)}, ${admin.userId})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_by = EXCLUDED.updated_by`;
  await audit(admin, 'update', 'content_block', def.key);
  revalidateTag(CACHE_TAGS.content);
  return ok('Saved. The website updates immediately.');
}

export async function resetBlock(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdminAction('content.manage').catch(() => null);
  if (!admin) return fail('Not permitted.');
  const key = String(formData.get('key'));
  if (!getBlockDef(key)) return fail('Unknown content block.');
  await requireDb()`DELETE FROM content_blocks WHERE key = ${key}`;
  await audit(admin, 'reset', 'content_block', key);
  revalidateTag(CACHE_TAGS.content);
  return ok('Restored the original content.');
}

export async function saveSettings(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdminAction('settings.manage').catch(() => null);
  if (!admin) return fail('You do not have permission to change settings.');
  const section = SETTINGS_SECTIONS.find((s) => s.key === formData.get('key'));
  if (!section) return fail('Unknown settings section.');
  const payload = parsePayload(formData);
  if (!payload) return fail('Could not read the form.');
  const { value, errors } = validateFields(section.fields, payload);
  if (errors.length) return fail(errors[0].message);
  const problem = section.check?.(value);
  if (problem) return fail(problem);
  const stored = section.toStored ? section.toStored(value) : value;

  const sql = requireDb();
  const [before] = await sql<{ value: unknown }[]>`SELECT value FROM site_settings WHERE key = ${section.key}`;
  await sql`
    INSERT INTO site_settings (key, value, updated_by) VALUES (${section.key}, ${sql.json(stored as never)}, ${admin.userId})
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_by = EXCLUDED.updated_by`;
  await audit(admin, 'update', 'settings', section.key, { before: before?.value ?? null, after: stored } as Record<string, unknown>);
  revalidateTag(CACHE_TAGS.settings);
  return ok(section.key === 'shipping' || section.key === 'checkout' ? 'Saved. Applies to new checkouts immediately.' : 'Saved.');
}
