'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';
import type { FieldDef } from '@/lib/content/schema';
import type { ActionResult } from '@/lib/server/admin-action-result';
import { ActionForm, SubmitButton, btn } from './ActionForm';
import { MediaField } from './media/MediaField';
import { field as styles } from './ui';

type Values = Record<string, unknown>;

function emptyFor(fields: FieldDef[]): Values {
  const v: Values = {};
  for (const f of fields) {
    v[f.key] = f.kind === 'boolean' ? false : f.kind === 'list' || f.kind === 'strings' ? [] : f.kind === 'select' ? f.options[0]?.value ?? '' : f.kind === 'number' ? null : '';
  }
  return v;
}

function move<T>(arr: T[], i: number, d: -1 | 1): T[] {
  const next = [...arr];
  const j = i + d;
  if (j < 0 || j >= next.length) return arr;
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function Field({ f, value, onChange, siblings }: { f: FieldDef; value: unknown; onChange: (v: unknown) => void; siblings: Values }) {
  const label = (
    <span className={styles.label}>
      {f.label}
      {'required' in f && f.required && <span className="text-[#B5342E]"> *</span>}
    </span>
  );
  const help = f.help ? <span className={styles.help}>{f.help}</span> : null;

  switch (f.kind) {
    case 'text':
    case 'link':
      return (
        <label className="block">
          {label}
          <input
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            maxLength={f.kind === 'text' ? f.max ?? 300 : 2000}
            placeholder={f.kind === 'link' ? '/page or https://…' : undefined}
            className={styles.input}
          />
          {help}
        </label>
      );
    case 'textarea':
      return (
        <label className="block">
          {label}
          <textarea value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} rows={f.rows ?? 3} maxLength={f.max ?? 5000} className={styles.input} />
          {help}
        </label>
      );
    case 'number':
      return (
        <label className="block">
          {label}
          <input
            type="number"
            value={value === null || value === undefined ? '' : String(value)}
            onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
            min={f.min}
            max={f.max}
            step={1}
            className={styles.input}
          />
          {help}
        </label>
      );
    case 'boolean':
      return (
        <label className="flex items-start gap-2.5 rounded-lg border border-[#EFEADF] px-3 py-2.5">
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#1B3D2F]" />
          <span><span className="text-[13px] font-medium">{f.label}</span>{help}</span>
        </label>
      );
    case 'select':
      return (
        <label className="block">
          {label}
          <select value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} className={styles.input}>
            {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {help}
        </label>
      );
    case 'media': {
      const accept = f.acceptFromField && siblings[f.acceptFromField] === 'video' ? 'video' : f.accept;
      return <MediaField key={accept} name={`_media_${f.key}`} label={f.label} accept={accept} defaultValue={(value as string) ?? ''} help={f.help} onChange={onChange} />;
    }
    case 'strings': {
      const items = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div>
          {label}
          <ul className="mt-1 space-y-1.5">
            {items.map((item, i) => (
              <li key={i} className="flex gap-1.5">
                {(f.itemMax ?? 500) > 160 ? (
                  <textarea value={item} rows={4} maxLength={f.itemMax} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} className={`${styles.input} mt-0`} />
                ) : (
                  <input value={item} maxLength={f.itemMax} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} className={`${styles.input} mt-0`} />
                )}
                <div className="flex shrink-0 flex-col">
                  <button type="button" className={btn.ghost} onClick={() => onChange(move(items, i, -1))} aria-label="Move up"><ArrowUp className="h-3.5 w-3.5" /></button>
                  <button type="button" className={btn.ghost} onClick={() => onChange(move(items, i, 1))} aria-label="Move down"><ArrowDown className="h-3.5 w-3.5" /></button>
                  <button type="button" className={`${btn.ghost} text-[#B5342E]`} onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label="Remove"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </li>
            ))}
          </ul>
          {items.length < (f.max ?? 50) && (
            <button type="button" className={`${btn.ghost} mt-1.5`} onClick={() => onChange([...items, ''])}><Plus className="h-3.5 w-3.5" /> Add</button>
          )}
          {help}
        </div>
      );
    }
    case 'list': {
      const items = Array.isArray(value) ? (value as Values[]) : [];
      return (
        <div>
          {label}
          {help}
          <ol className="mt-2 space-y-3">
            {items.map((item, i) => (
              <li key={i} className="rounded-xl border border-[#E8E2D4] bg-[#FCFAF5] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[12px] font-semibold uppercase tracking-wide text-foreground-subtle">{f.itemLabel} {i + 1}</span>
                  <span className="flex">
                    <button type="button" className={btn.ghost} onClick={() => onChange(move(items, i, -1))} aria-label="Move up"><ArrowUp className="h-3.5 w-3.5" /></button>
                    <button type="button" className={btn.ghost} onClick={() => onChange(move(items, i, 1))} aria-label="Move down"><ArrowDown className="h-3.5 w-3.5" /></button>
                    <button type="button" className={`${btn.ghost} text-[#B5342E]`} onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label={`Remove ${f.itemLabel}`}><Trash2 className="h-3.5 w-3.5" /></button>
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {f.fields.map((sub) => (
                    <div key={sub.key} className={sub.kind === 'textarea' || sub.kind === 'list' || sub.kind === 'media' || sub.kind === 'strings' ? 'sm:col-span-2' : ''}>
                      <Field f={sub} value={item[sub.key]} siblings={item} onChange={(v) => onChange(items.map((x, j) => (j === i ? { ...x, [sub.key]: v } : x)))} />
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ol>
          {items.length < (f.max ?? 50) && (
            <button type="button" className={`${btn.secondary} mt-2`} onClick={() => onChange([...items, emptyFor(f.fields)])}>
              <Plus className="h-4 w-4" /> Add {f.itemLabel.toLowerCase()}
            </button>
          )}
        </div>
      );
    }
  }
}

interface Props {
  fields: FieldDef[];
  initial: Values;
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  hidden?: Record<string, string>;
  submitLabel?: string;
  extraActions?: React.ReactNode;
}

/** Renders any field schema and submits the whole value as JSON; the server re-validates with the same schema. */
export function SchemaForm({ fields, initial, action, hidden = {}, submitLabel = 'Save', extraActions }: Props) {
  const [values, setValues] = useState<Values>({ ...emptyFor(fields), ...initial });
  const wide = (f: FieldDef) => f.kind === 'textarea' || f.kind === 'list' || f.kind === 'media' || f.kind === 'strings';

  return (
    <ActionForm action={action} className="space-y-4">
      {Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      <input type="hidden" name="payload" value={JSON.stringify(values)} />
      <div className="grid gap-4 rounded-2xl border border-[#E8E2D4] bg-white p-4 sm:grid-cols-2 sm:p-5">
        {fields.map((f) => (
          <div key={f.key} className={wide(f) ? 'sm:col-span-2' : ''}>
            <Field f={f} value={values[f.key]} siblings={values} onChange={(v) => setValues((prev) => ({ ...prev, [f.key]: v }))} />
          </div>
        ))}
      </div>
      <div className="sticky bottom-0 -mx-4 flex flex-wrap justify-end gap-2 border-t border-[#E8E2D4] bg-[#F6F3EC]/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {extraActions}
        <SubmitButton>{submitLabel}</SubmitButton>
      </div>
    </ActionForm>
  );
}
