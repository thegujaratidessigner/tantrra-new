import 'server-only';
import crypto from 'node:crypto';
import { createSupabaseAdminClient } from '@/lib/supabase/server';
import { requireDb } from './data';

export const MEDIA_BUCKET = 'media';
export const MEDIA_LIMITS = {
  image: { maxBytes: 10 * 1024 * 1024, types: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'] },
  video: { maxBytes: 50 * 1024 * 1024, types: ['video/mp4', 'video/webm'] },
} as const;
export type MediaKind = keyof typeof MEDIA_LIMITS;

const EXT: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif', 'image/gif': 'gif',
  'video/mp4': 'mp4', 'video/webm': 'webm',
};

let bucketReady = false;
async function ensureBucket() {
  if (bucketReady) return;
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase.storage.getBucket(MEDIA_BUCKET);
  if (!data) {
    const { error } = await supabase.storage.createBucket(MEDIA_BUCKET, {
      public: true,
      fileSizeLimit: MEDIA_LIMITS.video.maxBytes,
      allowedMimeTypes: [...MEDIA_LIMITS.image.types, ...MEDIA_LIMITS.video.types],
    });
    if (error && !/already exists/i.test(error.message)) throw new Error(`Could not create media bucket: ${error.message}`);
  }
  bucketReady = true;
}

export function validateUpload(kind: string, mime: string, size: number): string | null {
  if (kind !== 'image' && kind !== 'video') return 'Unsupported media type.';
  const limits = MEDIA_LIMITS[kind];
  if (!(limits.types as readonly string[]).includes(mime)) return `Allowed ${kind} formats: ${limits.types.map((t) => t.split('/')[1]).join(', ')}.`;
  if (!Number.isFinite(size) || size <= 0) return 'Empty file.';
  if (size > limits.maxBytes) return `${kind === 'image' ? 'Images' : 'Videos'} must be under ${limits.maxBytes / 1024 / 1024} MB.`;
  return null;
}

function safeBaseName(name: string): string {
  return (name.replace(/\.[^.]+$/, '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'file').slice(0, 50);
}

export async function createUploadTarget(kind: MediaKind, mime: string, originalName: string) {
  await ensureBucket();
  const now = new Date();
  const path = `${kind}s/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}/${crypto.randomUUID().slice(0, 8)}-${safeBaseName(originalName)}.${EXT[mime]}`;
  const { data, error } = await createSupabaseAdminClient().storage.from(MEDIA_BUCKET).createSignedUploadUrl(path);
  if (error || !data) throw new Error(error?.message ?? 'Could not create upload URL');
  return { path: data.path, token: data.token };
}

export async function createReplaceTarget(path: string) {
  await ensureBucket();
  const { data, error } = await createSupabaseAdminClient().storage.from(MEDIA_BUCKET).createSignedUploadUrl(path, { upsert: true });
  if (error || !data) throw new Error(error?.message ?? 'Could not create upload URL');
  return { path: data.path, token: data.token };
}

/** Confirms the object really exists in Storage and returns its stored size/type. */
export async function statObject(path: string): Promise<{ size: number; mime: string } | null> {
  const dir = path.split('/').slice(0, -1).join('/');
  const file = path.split('/').pop()!;
  const { data } = await createSupabaseAdminClient().storage.from(MEDIA_BUCKET).list(dir, { search: file, limit: 5 });
  const hit = data?.find((o) => o.name === file);
  if (!hit) return null;
  const meta = (hit.metadata ?? {}) as { size?: number; mimetype?: string };
  return { size: Number(meta.size ?? 0), mime: String(meta.mimetype ?? '') };
}

export function publicUrl(path: string): string {
  return createSupabaseAdminClient().storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Every place a media URL can be referenced from website content. */
export async function findReferences(url: string): Promise<string[]> {
  const sql = requireDb();
  const like = `%${url}%`;
  const rows = await sql<{ ref: string }[]>`
    SELECT 'Product image: ' || p.name AS ref FROM product_images i JOIN products p ON p.id = i.product_id WHERE i.src = ${url}
    UNION ALL SELECT 'Product video: ' || name FROM products WHERE ${url} = ANY(videos)
    UNION ALL SELECT 'Service: ' || name FROM service_offerings WHERE image_url = ${url}
    UNION ALL SELECT 'Service group: ' || name FROM service_groups WHERE image_url = ${url}
    UNION ALL SELECT 'Banner (' || placement || '): ' || coalesce(heading, alt, '') FROM banners
      WHERE ${url} IN (desktop_src, mobile_src, poster_src)
    UNION ALL SELECT 'Video (' || placement || '): ' || title FROM videos WHERE ${url} IN (src, poster_src)
    UNION ALL SELECT 'Gallery image: ' || coalesce(nullif(alt, ''), src) FROM gallery_images WHERE src = ${url}
    UNION ALL SELECT 'Page content: ' || key FROM content_blocks WHERE value::text LIKE ${like}
    UNION ALL SELECT 'Settings: ' || key FROM site_settings WHERE value::text LIKE ${like}`;
  return rows.map((r) => r.ref);
}

export async function deleteObject(path: string) {
  const { error } = await createSupabaseAdminClient().storage.from(MEDIA_BUCKET).remove([path]);
  if (error) throw new Error(error.message);
}
