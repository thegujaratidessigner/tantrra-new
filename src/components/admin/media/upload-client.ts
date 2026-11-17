'use client';

import { createClient } from '@supabase/supabase-js';
import { completeUpload, requestReplace, requestUpload, type MediaAsset } from '@/app/admin/(panel)/media/actions';

const MAX_EDGE = 2400;

let client: ReturnType<typeof createClient> | null = null;
function storage() {
  if (!client) {
    client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client.storage.from('media');
}

interface Prepared { blob: Blob; mime: string; width: number | null; height: number | null; name: string }

/** Downscales large photos and re-encodes them as WebP; leaves GIFs and videos untouched. */
async function prepare(file: File): Promise<Prepared> {
  if (file.type.startsWith('video/')) {
    const dims = await new Promise<{ w: number | null; h: number | null }>((resolve) => {
      const v = document.createElement('video');
      v.preload = 'metadata';
      v.onloadedmetadata = () => { resolve({ w: v.videoWidth || null, h: v.videoHeight || null }); URL.revokeObjectURL(v.src); };
      v.onerror = () => resolve({ w: null, h: null });
      v.src = URL.createObjectURL(file);
    });
    return { blob: file, mime: file.type, width: dims.w, height: dims.h, name: file.name };
  }
  if (file.type === 'image/gif') {
    const bmp = await createImageBitmap(file).catch(() => null);
    return { blob: file, mime: file.type, width: bmp?.width ?? null, height: bmp?.height ?? null, name: file.name };
  }
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * scale);
  const h = Math.round(bmp.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, w, h);
  const webp = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', 0.85));
  if (webp && (webp.size < file.size || scale < 1)) {
    return { blob: webp, mime: 'image/webp', width: w, height: h, name: file.name.replace(/\.[^.]+$/, '') + '.webp' };
  }
  return { blob: file, mime: file.type, width: bmp.width, height: bmp.height, name: file.name };
}

export async function uploadMedia(file: File, alt = ''): Promise<MediaAsset> {
  const p = await prepare(file);
  const kind = p.mime.startsWith('video/') ? 'video' : 'image';
  const target = await requestUpload({ kind, mime: p.mime, size: p.blob.size, name: p.name });
  if (!target.ok) throw new Error(target.error);
  const { error } = await storage().uploadToSignedUrl(target.path, target.token, p.blob, { contentType: p.mime, cacheControl: '300' });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  const done = await completeUpload({ path: target.path, kind, alt, width: p.width, height: p.height, name: file.name });
  if (!done.ok) throw new Error(done.error);
  return done.asset;
}

/** Overwrites an existing asset's file in place so every page using its URL updates. */
export async function replaceMedia(asset: MediaAsset, file: File): Promise<MediaAsset> {
  const p = await prepare(file);
  if (p.mime !== asset.mime_type) throw new Error(`The replacement must be the same format (${asset.mime_type}).`);
  const target = await requestReplace(asset.id);
  if (!target.ok) throw new Error(target.error);
  const { error } = await storage().uploadToSignedUrl(target.path, target.token, p.blob, { contentType: p.mime, cacheControl: '300', upsert: true });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  const done = await completeUpload({ path: asset.path, kind: asset.kind, alt: asset.alt, width: p.width, height: p.height, name: file.name });
  if (!done.ok) throw new Error(done.error);
  return done.asset;
}

export const formatBytes = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
