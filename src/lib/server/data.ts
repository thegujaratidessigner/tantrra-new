import 'server-only';
import { unstable_cache } from 'next/cache';
import type postgres from 'postgres';
import { getSql } from './db';
import { DEFAULT_SETTINGS, mergeSettings, type SiteSettings } from '@/lib/site-settings';

export const CACHE_TAGS = { catalog: 'catalog', settings: 'settings', content: 'content' } as const;
export const CACHE_SECONDS = 3600;

/**
 * Cache keys include the deployment id: Vercel's data cache outlives deployments,
 * and an entry shaped by older code must never be served to newer code.
 */
export const cacheKey = (name: string) => [name, process.env.VERCEL_DEPLOYMENT_ID ?? 'local'];

/** Null when no database is configured (e.g. a deployment without env vars) — callers fall back to static data. */
export function getDbOrNull(): postgres.Sql | null {
  const url = process.env.DATABASE_URL?.trim();
  return url ? getSql(url) : null;
}

export function requireDb(): postgres.Sql {
  const sql = getDbOrNull();
  if (!sql) throw new Error('DATABASE_URL is not configured');
  return sql;
}

async function loadSettingRows(): Promise<{ key: string; value: unknown }[]> {
  const sql = getDbOrNull();
  if (!sql) return [];
  return sql<{ key: string; value: unknown }[]>`SELECT key, value FROM site_settings`;
}

const getSettingRows = unstable_cache(loadSettingRows, cacheKey('site-settings-raw'), {
  tags: [CACHE_TAGS.settings],
  revalidate: CACHE_SECONDS,
});

export async function getSiteSettings(): Promise<SiteSettings> {
  return getDbOrNull() ? mergeSettings(await getSettingRows()) : DEFAULT_SETTINGS;
}

/** Uncached read for money-affecting decisions (checkout pricing). */
export async function getSiteSettingsFresh(): Promise<SiteSettings> {
  return getDbOrNull() ? mergeSettings(await loadSettingRows()) : DEFAULT_SETTINGS;
}
