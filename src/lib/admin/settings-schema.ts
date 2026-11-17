import type { FieldDef } from '@/lib/content/schema';
import type { SettingsKey, SiteSettings } from '@/lib/site-settings';

export interface SettingsSection {
  key: SettingsKey;
  title: string;
  description: string;
  fields: FieldDef[];
  toForm: (s: SiteSettings) => Record<string, unknown>;
  toStored?: (v: Record<string, unknown>) => unknown;
  check?: (v: Record<string, unknown>) => string | null;
}

const parseAmounts = (s: unknown) => String(s ?? '').split(/[,\s]+/).filter(Boolean).map(Number);

export const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    key: 'contact',
    title: 'Contact details',
    description: 'Shown in the header, footer, contact page and WhatsApp button. Empty fields are hidden on the website.',
    fields: [
      { kind: 'text', key: 'whatsappNumber', label: 'WhatsApp number', max: 20, help: 'Digits with country code, e.g. 919876543210' },
      { kind: 'text', key: 'phone', label: 'Phone', max: 20 },
      { kind: 'text', key: 'email', label: 'Support email', max: 120 },
      { kind: 'text', key: 'supportHours', label: 'Support hours', max: 60 },
    ],
    toForm: (s) => s.contact,
    check: (v) => {
      if (v.whatsappNumber && !/^\d{10,15}$/.test(String(v.whatsappNumber))) return 'WhatsApp number must be 10–15 digits (country code, no + or spaces).';
      if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v.email))) return 'Enter a valid email address.';
      return null;
    },
  },
  {
    key: 'social',
    title: 'Social links',
    description: 'Footer social icons and the YouTube playlist link.',
    fields: [
      { kind: 'link', key: 'instagram', label: 'Instagram URL' },
      { kind: 'link', key: 'youtube', label: 'YouTube channel URL' },
      { kind: 'link', key: 'facebook', label: 'Facebook URL' },
      { kind: 'link', key: 'youtubePlaylist', label: 'YouTube playlist URL' },
    ],
    toForm: (s) => s.social,
  },
  {
    key: 'shipping',
    title: 'Shipping',
    description: 'Shipping is never charged on service-only orders. Changes apply to new checkouts immediately.',
    fields: [
      { kind: 'number', key: 'freeShippingThreshold', label: 'Free shipping from (₹ of products)', min: 0, max: 1000000 },
      { kind: 'number', key: 'feeBelowThreshold', label: 'Shipping charge below that (₹)', min: 1, max: 10000, nullable: true, help: 'Leave EMPTY while the rate is unconfirmed — nothing is charged and orders are flagged for review.' },
      { kind: 'textarea', key: 'note', label: 'Shipping note', max: 300, rows: 2 },
    ],
    toForm: (s) => s.shipping,
    check: (v) => (Number.isInteger(v.freeShippingThreshold) ? null : 'Free-shipping threshold must be a whole number of rupees.'),
  },
  {
    key: 'checkout',
    title: 'Checkout add-ons',
    description: 'Energization price per product and the Brahmin Dakshina options offered in the cart.',
    fields: [
      { kind: 'number', key: 'energizationPrice', label: 'Energization price (₹ per item)', min: 1, max: 100000 },
      { kind: 'text', key: 'dakshinaOptions', label: 'Dakshina options (₹, comma separated)', max: 80, help: 'e.g. 21, 51, 101, 501' },
    ],
    toForm: (s) => ({ energizationPrice: s.checkout.energizationPrice, dakshinaOptions: s.checkout.dakshinaOptions.join(', ') }),
    toStored: (v) => ({ energizationPrice: v.energizationPrice, dakshinaOptions: [...new Set(parseAmounts(v.dakshinaOptions))].slice(0, 6) }),
    check: (v) => {
      if (!Number.isInteger(v.energizationPrice)) return 'Energization price must be a whole number of rupees.';
      const a = parseAmounts(v.dakshinaOptions);
      if (!a.length || a.some((n) => !Number.isInteger(n) || n < 1 || n > 100000)) return 'Dakshina options must be whole rupee amounts, separated by commas.';
      return null;
    },
  },
];
