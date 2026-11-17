import 'server-only';
import { unstable_cache } from 'next/cache';
import { BLOCKS, getBlockDef } from '@/lib/content/blocks';
import { validateFields } from '@/lib/content/schema';
import { DEFAULT_LAYOUT_CONTENT, type LayoutContent } from '@/lib/content/layout-defaults';
import { CACHE_SECONDS, CACHE_TAGS, getDbOrNull } from './data';

async function loadBlocks(): Promise<Record<string, Record<string, unknown>>> {
  const out: Record<string, Record<string, unknown>> = {};
  for (const b of BLOCKS) out[b.key] = b.defaults;
  const sql = getDbOrNull();
  if (!sql) return out;
  const rows = await sql<{ key: string; value: unknown }[]>`SELECT key, value FROM content_blocks`;
  for (const row of rows) {
    const def = getBlockDef(row.key);
    if (!def) continue;
    // Stored values are re-validated so a malformed row can never break rendering.
    const { value, errors } = validateFields(def.fields, row.value);
    if (errors.length === 0) out[row.key] = value;
  }
  return out;
}

export const getContentBlocks = unstable_cache(loadBlocks, ['content-blocks'], {
  tags: [CACHE_TAGS.content],
  revalidate: CACHE_SECONDS,
});

export async function getBlock<T = Record<string, unknown>>(key: string): Promise<T> {
  return (await getContentBlocks())[key] as T;
}

export async function getLayoutContent(): Promise<LayoutContent> {
  const blocks = await getContentBlocks();
  return {
    announcement: (blocks['layout.announcement'] as LayoutContent['announcement']) ?? DEFAULT_LAYOUT_CONTENT.announcement,
    ticker: ((blocks['layout.ticker'] as { items?: LayoutContent['ticker'] })?.items) ?? DEFAULT_LAYOUT_CONTENT.ticker,
    footer: (blocks['layout.footer'] as unknown as LayoutContent['footer']) ?? DEFAULT_LAYOUT_CONTENT.footer,
  };
}
