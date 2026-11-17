import { siteConfig } from '@/data/site-config';

export interface SiteSettings {
  contact: { whatsappNumber: string; email: string; phone: string; supportHours: string };
  social: { instagram: string; youtube: string; facebook: string; youtubePlaylist: string };
  checkout: { energizationPrice: number; dakshinaOptions: number[] };
  shipping: { freeShippingThreshold: number; feeBelowThreshold: number | null; note: string };
  chadava: { panchopcharItems: string[]; panchopcharImages: { pujaThali: string; panchopcharItems: string } };
}

export type SettingsKey = keyof SiteSettings;

export const DEFAULT_SETTINGS: SiteSettings = {
  contact: {
    whatsappNumber: siteConfig.whatsappNumber,
    email: siteConfig.email,
    phone: siteConfig.phone,
    supportHours: 'Mon – Sat | 10 AM – 7 PM',
  },
  social: {
    instagram: siteConfig.socialLinks.instagram ?? '',
    youtube: siteConfig.socialLinks.youtube ?? '',
    facebook: siteConfig.socialLinks.facebook ?? '',
    youtubePlaylist: 'https://youtube.com/playlist?list=PLLNEa6I_FvJc',
  },
  checkout: { energizationPrice: siteConfig.energizationPrice, dakshinaOptions: siteConfig.dakshinaOptions },
  shipping: {
    freeShippingThreshold: siteConfig.freeShippingThreshold,
    feeBelowThreshold: siteConfig.shippingFeeBelowThreshold,
    note: siteConfig.shippingNote,
  },
  chadava: {
    panchopcharItems: ['Dhoop', 'Deepam', 'Pushpa', 'Gandham', 'Naivedya'],
    panchopcharImages: {
      pujaThali: '/images/tantrra/chadava/maha-poojan-thali.webp',
      panchopcharItems: '/images/tantrra/chadava/panchopchar-thali.webp',
    },
  },
};

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

/** Overlays stored values onto defaults, keeping only fields whose type matches the default. */
function overlay<T>(defaults: T, stored: unknown): T {
  if (!isRecord(stored) || !isRecord(defaults)) return defaults;
  const out: Record<string, unknown> = { ...defaults };
  for (const [k, def] of Object.entries(defaults)) {
    const v = stored[k];
    if (v === undefined) continue;
    if (def === null) out[k] = typeof v === 'number' || v === null ? v : def;
    else if (Array.isArray(def)) out[k] = Array.isArray(v) && v.every((x) => typeof x === typeof (def[0] ?? x)) ? v : def;
    else if (isRecord(def)) out[k] = overlay(def, v);
    else if (typeof v === typeof def) out[k] = v;
  }
  return out as T;
}

/** The legacy `siteConfig` shape, built from live settings, so existing components need minimal changes. */
export function toSiteConfig(s: SiteSettings) {
  return {
    whatsappNumber: s.contact.whatsappNumber,
    email: s.contact.email,
    phone: s.contact.phone,
    socialLinks: { instagram: s.social.instagram, youtube: s.social.youtube, facebook: s.social.facebook },
    energizationPrice: s.checkout.energizationPrice,
    dakshinaOptions: s.checkout.dakshinaOptions,
    shippingNote: s.shipping.note,
  };
}

export function mergeSettings(rows: { key: string; value: unknown }[]): SiteSettings {
  const byKey = new Map(rows.map((r) => [r.key, r.value]));
  const merged = {} as SiteSettings;
  for (const key of Object.keys(DEFAULT_SETTINGS) as SettingsKey[]) {
    (merged as unknown as Record<string, unknown>)[key] = overlay(DEFAULT_SETTINGS[key], byKey.get(key));
  }
  // shipping fee can legitimately be null (rate not confirmed)
  const fee = (byKey.get('shipping') as { feeBelowThreshold?: unknown } | undefined)?.feeBelowThreshold;
  merged.shipping.feeBelowThreshold = typeof fee === 'number' && fee > 0 ? fee : null;
  return merged;
}
