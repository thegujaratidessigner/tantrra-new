import 'server-only';
import postgres from 'postgres';

const globalForDb = globalThis as unknown as { tantrraSql?: postgres.Sql };

export function getSql(databaseUrl: string): postgres.Sql {
  if (!globalForDb.tantrraSql) {
    const host = new URL(databaseUrl).hostname;
    const isLocal = host === 'localhost' || host === '127.0.0.1';
    // prepare:false keeps us compatible with transaction-mode poolers (Supabase :6543, PgBouncer).
    globalForDb.tantrraSql = postgres(databaseUrl, {
      prepare: false,
      max: 3,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: isLocal ? false : 'require',
    });
  }
  return globalForDb.tantrraSql;
}
