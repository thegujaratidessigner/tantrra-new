'use client';

import { useState } from 'react';
import { ImageIcon, Film, X } from 'lucide-react';
import { MediaPicker } from './MediaPicker';
import { btn } from '../ActionForm';
import { field } from '../ui';

interface Props {
  name: string;
  label: string;
  accept: 'image' | 'video';
  defaultValue?: string | null;
  help?: string;
  required?: boolean;
  onChange?: (url: string) => void;
}

/** Form field holding a media URL: pick from the library, upload, or paste an existing site path. */
export function MediaField({ name, label, accept, defaultValue, help, required, onChange }: Props) {
  const [value, setValue] = useState(defaultValue ?? '');
  const [open, setOpen] = useState(false);
  const set = (v: string) => { setValue(v); onChange?.(v); };

  return (
    <div>
      <span className={field.label}>{label}{required && <span className="text-[#B5342E]"> *</span>}</span>
      <div className="mt-1 flex gap-3">
        <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#E8E2D4] bg-[#F6F3EC]">
          {value ? (
            accept === 'image' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="" className="h-full w-full object-cover" />
            ) : (
              <video src={value} preload="metadata" muted className="h-full w-full object-cover" />
            )
          ) : accept === 'image' ? <ImageIcon className="h-5 w-5 text-foreground-subtle" /> : <Film className="h-5 w-5 text-foreground-subtle" />}
        </div>
        <div className="min-w-0 flex-1 space-y-1.5">
          <input
            name={name}
            value={value}
            onChange={(e) => set(e.target.value)}
            required={required}
            placeholder={accept === 'image' ? '/images/... or choose from library' : '/videos/... or choose from library'}
            className={`${field.input} mt-0`}
          />
          <div className="flex gap-1.5">
            <button type="button" className={btn.secondary} onClick={() => setOpen(true)}>Choose / upload</button>
            {value && <button type="button" className={btn.ghost} onClick={() => set('')}><X className="h-3.5 w-3.5" /> Clear</button>}
          </div>
        </div>
      </div>
      {help && <p className={field.help}>{help}</p>}
      {open && <MediaPicker accept={accept} onClose={() => setOpen(false)} onSelect={(m) => { set(m.public_url); setOpen(false); }} />}
    </div>
  );
}
