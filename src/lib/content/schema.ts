export type FieldDef =
  | { kind: 'text'; key: string; label: string; max?: number; required?: boolean; help?: string }
  | { kind: 'textarea'; key: string; label: string; max?: number; required?: boolean; help?: string; rows?: number }
  | { kind: 'link'; key: string; label: string; required?: boolean; help?: string }
  | { kind: 'media'; key: string; label: string; accept: 'image' | 'video'; required?: boolean; help?: string }
  | { kind: 'number'; key: string; label: string; min?: number; max?: number; nullable?: boolean; help?: string }
  | { kind: 'boolean'; key: string; label: string; help?: string }
  | { kind: 'select'; key: string; label: string; options: { value: string; label: string }[]; help?: string }
  | { kind: 'strings'; key: string; label: string; max?: number; itemMax?: number; help?: string }
  | { kind: 'list'; key: string; label: string; itemLabel: string; fields: FieldDef[]; max?: number; help?: string };

export type FieldValue = string | number | boolean | null | string[] | Record<string, unknown>[];

const CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;

export function cleanText(v: unknown, max: number): string {
  return typeof v === 'string' ? v.replace(CONTROL, '').trim().slice(0, max) : '';
}

/** Accepts site-relative paths ("/products"), anchors ("#x"), https URLs, mailto: and tel:. Rejects javascript: etc. */
export function isSafeLink(v: string): boolean {
  if (!v) return true;
  if (v.startsWith('/') && !v.startsWith('//')) return true;
  if (v.startsWith('#')) return true;
  if (/^(mailto|tel):[^\s<>"]+$/i.test(v)) return true;
  try {
    const u = new URL(v);
    return u.protocol === 'https:';
  } catch {
    return false;
  }
}

export interface ValidationError {
  path: string;
  message: string;
}

/**
 * Coerces untrusted input into the declared shape. Unknown keys are dropped.
 * Returns errors for values that fail required/format checks.
 */
export function validateFields(
  fields: FieldDef[],
  input: unknown,
  path = ''
): { value: Record<string, FieldValue>; errors: ValidationError[] } {
  const src = typeof input === 'object' && input !== null && !Array.isArray(input) ? (input as Record<string, unknown>) : {};
  const value: Record<string, FieldValue> = {};
  const errors: ValidationError[] = [];

  for (const f of fields) {
    const p = path ? `${path}.${f.key}` : f.key;
    const raw = src[f.key];
    switch (f.kind) {
      case 'text':
      case 'textarea': {
        const s = cleanText(raw, f.max ?? (f.kind === 'text' ? 300 : 5000));
        if (f.required && !s) errors.push({ path: p, message: `${f.label} is required` });
        value[f.key] = s;
        break;
      }
      case 'link':
      case 'media': {
        const s = cleanText(raw, 2000);
        if (f.required && !s) errors.push({ path: p, message: `${f.label} is required` });
        else if (s && !isSafeLink(s)) errors.push({ path: p, message: `${f.label} must be a site path (/...) or an https:// link` });
        value[f.key] = s;
        break;
      }
      case 'number': {
        if ((raw === '' || raw === null || raw === undefined) && f.nullable) {
          value[f.key] = null;
          break;
        }
        const n = typeof raw === 'number' ? raw : Number(raw);
        if (!Number.isFinite(n)) errors.push({ path: p, message: `${f.label} must be a number` });
        else if (f.min !== undefined && n < f.min) errors.push({ path: p, message: `${f.label} must be at least ${f.min}` });
        else if (f.max !== undefined && n > f.max) errors.push({ path: p, message: `${f.label} must be at most ${f.max}` });
        value[f.key] = Number.isFinite(n) ? n : null;
        break;
      }
      case 'boolean':
        value[f.key] = raw === true || raw === 'true' || raw === 'on';
        break;
      case 'select': {
        const s = typeof raw === 'string' ? raw : '';
        value[f.key] = f.options.some((o) => o.value === s) ? s : f.options[0]?.value ?? '';
        break;
      }
      case 'strings': {
        const arr = Array.isArray(raw) ? raw : [];
        value[f.key] = arr
          .map((x) => cleanText(x, f.itemMax ?? 500))
          .filter(Boolean)
          .slice(0, f.max ?? 50);
        break;
      }
      case 'list': {
        const arr = Array.isArray(raw) ? raw.slice(0, f.max ?? 50) : [];
        const items: Record<string, unknown>[] = [];
        arr.forEach((item, i) => {
          const r = validateFields(f.fields, item, `${p}[${i}]`);
          items.push(r.value);
          errors.push(...r.errors);
        });
        value[f.key] = items;
        break;
      }
    }
  }
  return { value, errors };
}
