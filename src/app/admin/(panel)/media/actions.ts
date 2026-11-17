'use server';

import { revalidatePath } from 'next/cache';
import { audit, requireAdminAction } from '@/lib/server/admin-auth';
import { requireDb } from '@/lib/server/data';
import { fail, ok, type ActionResult } from '@/lib/server/admin-action-result';
import { cleanText } from '@/lib/content/schema';
import {
  MEDIA_BUCKET, createReplaceTarget, createUploadTarget, deleteObject, findReferences, publicUrl, statObject, validateUpload,
  type MediaKind,
} from '@/lib/server/media';

export interface MediaAsset {
  id: string;
  public_url: string;
  path: string;
  kind: 'image' | 'video';
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  alt: string;
  original_name: string | null;
  created_at: string;
}

type Target = { ok: true; path: string; token: string } | { ok: false; error: string };

export async function requestUpload(input: { kind: string; mime: string; size: number; name: string }): Promise<Target> {
  try {
    await requireAdminAction('media.manage');
  } catch {
    return { ok: false, error: 'You do not have permission to upload media.' };
  }
  const problem = validateUpload(input.kind, input.mime, input.size);
  if (problem) return { ok: false, error: problem };
  try {
    const target = await createUploadTarget(input.kind as MediaKind, input.mime, String(input.name).slice(0, 200));
    return { ok: true, ...target };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function completeUpload(input: {
  path: string; kind: string; alt: string; width: number | null; height: number | null; name: string;
}): Promise<{ ok: true; asset: MediaAsset } | { ok: false; error: string }> {
  let admin;
  try {
    admin = await requireAdminAction('media.manage');
  } catch {
    return { ok: false, error: 'You do not have permission to upload media.' };
  }
  if (!/^(images|videos)\/\d{4}\/\d{2}\/[a-z0-9-]+\.[a-z0-9]+$/.test(input.path)) return { ok: false, error: 'Invalid upload path.' };
  const stat = await statObject(input.path);
  if (!stat) return { ok: false, error: 'Upload not found in storage. Please try again.' };
  const kind = input.path.startsWith('videos/') ? 'video' : 'image';
  const problem = validateUpload(kind, stat.mime, stat.size);
  if (problem) {
    await deleteObject(input.path).catch(() => {});
    return { ok: false, error: problem };
  }

  const dim = (n: number | null) => (Number.isInteger(n) && n! > 0 && n! < 20000 ? n : null);
  const sql = requireDb();
  const [asset] = await sql<MediaAsset[]>`
    INSERT INTO media_assets (bucket, path, public_url, kind, mime_type, size_bytes, width, height, alt, original_name, uploaded_by)
    VALUES (${MEDIA_BUCKET}, ${input.path}, ${publicUrl(input.path)}, ${kind}, ${stat.mime}, ${stat.size},
            ${dim(input.width)}, ${dim(input.height)}, ${cleanText(input.alt, 300)}, ${cleanText(input.name, 200)}, ${admin.userId})
    ON CONFLICT (bucket, path) DO UPDATE SET size_bytes = EXCLUDED.size_bytes, mime_type = EXCLUDED.mime_type,
      width = coalesce(EXCLUDED.width, media_assets.width), height = coalesce(EXCLUDED.height, media_assets.height)
    RETURNING id, public_url, path, kind, mime_type, size_bytes::int, width, height, alt, original_name, created_at::text`;
  await audit(admin, 'upload', 'media', asset.id, { path: input.path, size: stat.size });
  revalidatePath('/admin/media');
  return { ok: true, asset };
}

export async function requestReplace(id: string): Promise<Target> {
  try {
    await requireAdminAction('media.manage');
  } catch {
    return { ok: false, error: 'You do not have permission to replace media.' };
  }
  const [row] = await requireDb()<{ path: string }[]>`SELECT path FROM media_assets WHERE id = ${id}`;
  if (!row) return { ok: false, error: 'Media not found.' };
  try {
    return { ok: true, ...(await createReplaceTarget(row.path)) };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function listMedia(input: { kind?: string; q?: string; offset?: number }): Promise<MediaAsset[]> {
  await requireAdminAction('media.manage');
  const sql = requireDb();
  const like = `%${(input.q ?? '').slice(0, 100).replace(/[\\%_]/g, (m) => `\\${m}`)}%`;
  return sql<MediaAsset[]>`
    SELECT id, public_url, path, kind, mime_type, size_bytes::int, width, height, alt, original_name, created_at::text
    FROM media_assets
    WHERE (${input.kind ?? ''} = '' OR kind = ${input.kind ?? ''})
      AND (${input.q ?? ''} = '' OR alt ILIKE ${like} OR original_name ILIKE ${like} OR path ILIKE ${like})
    ORDER BY created_at DESC
    LIMIT 60 OFFSET ${Math.max(0, Math.min(5000, input.offset ?? 0))}`;
}

export async function updateMediaAlt(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdminAction('media.manage').catch(() => null);
  if (!admin) return fail('Not permitted.');
  const id = String(formData.get('id') ?? '');
  const rows = await requireDb()`UPDATE media_assets SET alt = ${cleanText(formData.get('alt'), 300)} WHERE id = ${id} RETURNING id`;
  if (!rows.length) return fail('Media not found.');
  revalidatePath('/admin/media');
  return ok('Description saved.');
}

export async function deleteMedia(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdminAction('media.manage').catch(() => null);
  if (!admin) return fail('Not permitted.');
  const id = String(formData.get('id') ?? '');
  const sql = requireDb();
  const [row] = await sql<{ path: string; public_url: string }[]>`SELECT path, public_url FROM media_assets WHERE id = ${id}`;
  if (!row) return fail('Media not found.');
  const refs = await findReferences(row.public_url);
  if (refs.length) {
    return fail(`Still in use — remove it from these first: ${refs.slice(0, 5).join('; ')}${refs.length > 5 ? ` (+${refs.length - 5} more)` : ''}.`);
  }
  await deleteObject(row.path);
  await sql`DELETE FROM media_assets WHERE id = ${id}`;
  await audit(admin, 'delete', 'media', id, { path: row.path });
  revalidatePath('/admin/media');
  return ok('Media deleted.');
}
