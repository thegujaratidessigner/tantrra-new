'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Film, Loader2, RefreshCw, Trash2, Upload } from 'lucide-react';
import { ActionForm, btn } from '@/components/admin/ActionForm';
import { useToast } from '@/components/admin/Toast';
import { field } from '@/components/admin/ui';
import { formatBytes, replaceMedia, uploadMedia } from '@/components/admin/media/upload-client';
import { deleteMedia, updateMediaAlt, type MediaAsset } from './actions';

export function MediaLibrary({ items, kind, q }: { items: MediaAsset[]; kind: string; q: string }) {
  const router = useRouter();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const uploadAll = async (files: FileList | File[]) => {
    const list = Array.from(files).slice(0, 20);
    let done = 0;
    for (const f of list) {
      setProgress(`Uploading ${done + 1} of ${list.length}: ${f.name}`);
      try {
        await uploadMedia(f);
        done++;
      } catch (e) {
        toast('error', `${f.name}: ${(e as Error).message}`);
      }
    }
    setProgress(null);
    if (done) toast('success', `${done} file${done === 1 ? '' : 's'} uploaded.`);
    router.refresh();
  };

  const onReplace = async (asset: MediaAsset, file: File | undefined) => {
    if (!file) return;
    setProgress(`Replacing ${asset.original_name ?? asset.path}`);
    try {
      await replaceMedia(asset, file);
      toast('success', 'File replaced. Pages using it update within a few minutes (CDN cache).');
      router.refresh();
    } catch (e) {
      toast('error', (e as Error).message);
    } finally {
      setProgress(null);
    }
  };

  return (
    <>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); uploadAll(e.dataTransfer.files); }}
        className={`mb-5 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition ${dragging ? 'border-[#1B3D2F] bg-[#1B3D2F]/[0.04]' : 'border-[#DDD5C3] bg-white'}`}
      >
        <Upload className="h-6 w-6 text-[#B88A3B]" />
        <p className="text-[13.5px] font-medium">Drag images or videos here, or</p>
        <input ref={fileRef} type="file" multiple hidden accept="image/jpeg,image/png,image/webp,image/avif,image/gif,video/mp4,video/webm" onChange={(e) => e.target.files && uploadAll(e.target.files)} />
        <button className={btn.primary} disabled={!!progress} onClick={() => fileRef.current?.click()}>Choose files</button>
        <p className="text-[11.5px] text-foreground-subtle">Images ≤ 10 MB (resized to 2400px & converted to WebP) · Videos MP4/WebM ≤ 50 MB</p>
        {progress && <p className="flex items-center gap-1.5 text-[12.5px] text-[#1B3D2F]"><Loader2 className="h-3.5 w-3.5 animate-spin" />{progress}</p>}
      </div>

      <form className="mb-4 flex flex-col gap-2 sm:flex-row" action="/admin/media">
        <input name="q" defaultValue={q} placeholder="Search media" className={`${field.input} mt-0 flex-1`} />
        <select name="kind" defaultValue={kind} className={`${field.input} mt-0 sm:w-40`} aria-label="Type">
          <option value="">All types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </select>
        <button className={btn.secondary}>Filter</button>
      </form>

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[#DDD5C3] bg-white/60 py-12 text-center text-[13px] text-foreground-muted">
          Nothing uploaded yet. Existing site images in /public keep working and can be used by path.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {items.map((m) => (
            <li key={m.id} className="overflow-hidden rounded-2xl border border-[#E8E2D4] bg-white">
              <div className="relative aspect-[4/3] bg-[#F6F3EC]">
                {m.kind === 'image' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.public_url} alt={m.alt} loading="lazy" className="h-full w-full object-contain" />
                ) : (
                  <video src={m.public_url} preload="metadata" controls muted className="h-full w-full object-contain" />
                )}
                {m.kind === 'video' && <Film className="absolute left-2 top-2 h-4 w-4 text-white drop-shadow" />}
              </div>
              <div className="space-y-2 p-3">
                <p className="truncate text-[12px] text-foreground-muted" title={m.original_name ?? m.path}>
                  {m.original_name ?? m.path.split('/').pop()} · {formatBytes(m.size_bytes)}{m.width && m.height ? ` · ${m.width}×${m.height}` : ''}
                </p>
                <ActionForm action={updateMediaAlt} className="flex gap-1.5">
                  <input type="hidden" name="id" value={m.id} />
                  <input name="alt" defaultValue={m.alt} placeholder="Describe the image (alt text)" className={`${field.input} mt-0 py-1.5 text-[12.5px]`} />
                  <button className={btn.secondary}>Save</button>
                </ActionForm>
                <div className="flex flex-wrap items-center gap-1">
                  <button className={btn.ghost} onClick={() => navigator.clipboard.writeText(m.public_url).then(() => toast('success', 'URL copied.'))}>
                    <Copy className="h-3.5 w-3.5" /> Copy URL
                  </button>
                  <label className={`${btn.ghost} cursor-pointer`}>
                    <RefreshCw className="h-3.5 w-3.5" /> Replace
                    <input type="file" hidden accept={m.mime_type} onChange={(e) => onReplace(m, e.target.files?.[0])} />
                  </label>
                  <ActionForm action={deleteMedia} confirm="Delete this file permanently? It is refused automatically if any page still uses it.">
                    <input type="hidden" name="id" value={m.id} />
                    <button className={`${btn.ghost} text-[#B5342E]`}><Trash2 className="h-3.5 w-3.5" /> Delete</button>
                  </ActionForm>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
