import type { FieldDef } from './schema';
import { DEFAULT_LAYOUT_CONTENT } from './layout-defaults';

export interface BlockDef {
  key: string;
  title: string;
  group: 'Site-wide' | 'Homepage' | 'About' | 'Pages';
  description?: string;
  fields: FieldDef[];
  defaults: Record<string, unknown>;
}

const heading = (label: string, title: string, description: string): Record<string, string> => ({ label, title, description });
const headingFields: FieldDef[] = [
  { kind: 'text', key: 'label', label: 'Small label above heading', max: 80 },
  { kind: 'text', key: 'title', label: 'Heading', max: 160, required: true },
  { kind: 'textarea', key: 'description', label: 'Description', max: 600, rows: 3 },
];

export const BLOCKS: BlockDef[] = [
  {
    key: 'layout.announcement',
    title: 'Announcement bar',
    group: 'Site-wide',
    description: 'Dark green bar at the very top. Use {threshold} to insert the free-shipping amount from Settings.',
    fields: [
      { kind: 'strings', key: 'desktopLeft', label: 'Desktop — left items', max: 5, itemMax: 60 },
      { kind: 'text', key: 'desktopCenter', label: 'Desktop — centre text', max: 80 },
      { kind: 'text', key: 'desktopRight', label: 'Desktop — right text', max: 120 },
      { kind: 'strings', key: 'tablet', label: 'Tablet items', max: 4, itemMax: 60 },
      { kind: 'strings', key: 'mobile', label: 'Mobile items', max: 3, itemMax: 50 },
    ],
    defaults: DEFAULT_LAYOUT_CONTENT.announcement,
  },
  {
    key: 'layout.ticker',
    title: 'Trust ticker',
    group: 'Site-wide',
    description: 'Scrolling strip under the header.',
    fields: [
      {
        kind: 'list', key: 'items', label: 'Messages', itemLabel: 'Message', max: 10,
        fields: [
          { kind: 'text', key: 'text', label: 'Main text', max: 60, required: true },
          { kind: 'text', key: 'sub', label: 'Secondary text', max: 60 },
        ],
      },
    ],
    defaults: { items: DEFAULT_LAYOUT_CONTENT.ticker },
  },
  {
    key: 'layout.footer',
    title: 'Footer',
    group: 'Site-wide',
    description: 'Contact details and social links are edited under Settings.',
    fields: [
      { kind: 'textarea', key: 'blurb', label: 'Brand description (desktop/tablet)', max: 300, rows: 3 },
      { kind: 'textarea', key: 'blurbShort', label: 'Brand description (mobile)', max: 200, rows: 2 },
      {
        kind: 'list', key: 'sections', label: 'Link columns', itemLabel: 'Column', max: 5,
        fields: [
          { kind: 'text', key: 'title', label: 'Column title', max: 40, required: true },
          {
            kind: 'list', key: 'links', label: 'Links', itemLabel: 'Link', max: 10,
            fields: [
              { kind: 'text', key: 'label', label: 'Label', max: 50, required: true },
              { kind: 'link', key: 'href', label: 'Link', required: true },
            ],
          },
        ],
      },
    ],
    defaults: DEFAULT_LAYOUT_CONTENT.footer as unknown as Record<string, unknown>,
  },
];

export const headingBlock = (key: string, title: string, defaults: Record<string, string>, extra: FieldDef[] = []): BlockDef => ({
  key,
  title,
  group: 'Homepage',
  fields: [...headingFields, ...extra],
  defaults,
});

export { heading, headingFields };

export const getBlockDef = (key: string) => BLOCKS.find((b) => b.key === key);
