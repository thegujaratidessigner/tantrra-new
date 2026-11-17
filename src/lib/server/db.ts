import 'server-only';
import postgres from 'postgres';

const globalForDb = globalThis as unknown as { tantrraSql?: postgres.Sql };

type ConnectionMode = 'transaction_pooler' | 'session_pooler' | 'direct' | 'local';

export function detectConnectionMode(databaseUrl: string): ConnectionMode {
  const { hostname, port } = new URL(databaseUrl);
  if (hostname === 'localhost' || hostname === '127.0.0.1') return 'local';
  if (hostname.endsWith('.pooler.supabase.com')) return port === '6543' ? 'transaction_pooler' : 'session_pooler';
  return port === '6543' ? 'transaction_pooler' : 'direct';
}

export function getSql(databaseUrl: string): postgres.Sql {
  if (!globalForDb.tantrraSql) {
    const mode = detectConnectionMode(databaseUrl);
    // Session-mode poolers pin one server connection per client connection, so each
    // serverless instance must hold at most one or concurrent instances exhaust the pool.
    const max = mode === 'session_pooler' || mode === 'direct' ? 1 : 3;
    globalForDb.tantrraSql = postgres(databaseUrl, {
      // Transaction-mode poolers cannot use prepared statements; harmless in the other modes.
      prepare: false,
      // Pipelining several queries on one connection hangs behind Supabase's transaction
      // pooler (verified: 12 concurrent queries on max:3 never resolve). Queue instead.
      max_pipeline: 1,
      max,
      idle_timeout: 20,
      connect_timeout: 10,
      ssl: mode === 'local' ? false : 'require',
    });
  }
  return globalForDb.tantrraSql;
}
