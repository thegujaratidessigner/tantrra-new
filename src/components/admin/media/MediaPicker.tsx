'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, Search, Upload, X, Film } from 'lucide-react';
import { listMedia, type MediaAsset } from '@/app/admin/(panel)/media/actions';
import { uploadMedia, formatBytes } from './upload-client';
import { useToast } from '../Toast';
import { btn } from '../ActionForm';

interface Props {
  accept: 'image' | 'video';
  onSelect: (asset: MediaAsset) => void;
  onClose: () => void;
}

export function MediaPicker({ accept, onSelect, onClose }: Props) {
  const [items, setItems] = useState<MediaAsset[] | null>(null);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const load = useCallback(async (query: string) => {
    setItems(null);
    try {
      setItems(await listMedia({ kind: accept, q: query }));
    } catch {
      setItems([]);
      toast('error', 'Could not load the media library.');
    }
  }, [accept, toast]);

  useEffect(() => { load(''); }, [load]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const onUpload = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const asset = await uploadMedia(file);
      toast('success', 'Uploaded.');
      onSelect(asset);
    } catch (e) {
      toast('error', (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[65] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label="Choose media">
      <button className="absolute inset-0 bg-black/45" aria-label="Close" onClick={onClose} />
      <div className="relative flex max-h-[90dvh] w-full max-w-4xl flex-col rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <div className="flex items-center gap-2 border-b border-[#EFEADF] p-4">
          <h2 className="flex-1 text-[15px] font-semibold">Choose {accept}</h2>
          <button className={btn.ghost} onClick={onClose} aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        <div className="flex flex-col gap-2 border-b border-[#EFEADF] p-4 sm:flex-row">
          <form className="relative flex-1" onSubmit={(e) => { e.preventDefault(); load(q); }}>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or description" className="w-full rounded-lg border border-[#DDD5C3] py-2 pl-9 pr-3 text-[13px] focus:border-[#1B3D2F] focus:outline-none" />
          </form>
          <input ref={fileRef} type="file" hidden accept={accept === 'image' ? 'image/jpeg,image/png,image/webp,image/avif,image/gif' : 'video/mp4,video/webm'} onChange={(e) => onUpload(e.target.files?.[0])} />
          <button className={btn.primary} disabled={busy} onClick={() => fileRef.current?.click()}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload new
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {items === null ? (
            <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-foreground-subtle" /></div>
          ) : items.length === 0 ? (
            <p className="py-12 text-center text-[13px] text-foreground-muted">No {accept}s yet — upload one.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {items.map((m) => (
                <li key={m.id}>
                  <button onClick={() => onSelect(m)} className="group block w-full overflow-hidden rounded-xl border border-[#EFEADF] text-left hover:border-[#1B3D2F]">
                    <div className="relative aspect-[4/3] bg-[#F6F3EC]">
                      {m.kind === 'image' ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.public_url} alt={m.alt} loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        <video src={m.public_url} preload="metadata" muted className="h-full w-full object-cover" />
                      )}
                      {m.kind === 'video' && <Film className="absolute right-2 top-2 h-4 w-4 text-white drop-shadow" />}
                    </div>
                    <p className="truncate px-2 py-1.5 text-[11.5px] text-foreground-muted">
                      {m.alt || m.original_name || m.path.split('/').pop()} · {formatBytes(m.size_bytes)}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
