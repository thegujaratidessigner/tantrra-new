import 'server-only';
import { unstable_cache } from 'next/cache';
import type postgres from 'postgres';
import { getSql } from './db';
import { DEFAULT_SETTINGS, mergeSettings, type SiteSettings } from '@/lib/site-settings';

export const CACHE_TAGS = { catalog: 'catalog', settings: 'settings', content: 'content' } as const;
export const CACHE_SECONDS = 3600;

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

async function loadSettings(): Promise<SiteSettings> {
  const sql = getDbOrNull();
  if (!sql) return DEFAULT_SETTINGS;
  const rows = await sql<{ key: string; value: unknown }[]>`SELECT key, value FROM site_settings`;
  return mergeSettings(rows);
}

export const getSiteSettings = unstable_cache(loadSettings, ['site-settings'], {
  tags: [CACHE_TAGS.settings],
  revalidate: CACHE_SECONDS,
});

/** Uncached read for money-affecting decisions (checkout pricing). */
export const getSiteSettingsFresh = loadSettings;
