import 'server-only';
import crypto from 'node:crypto';
import type postgres from 'postgres';

export function clientKey(request: Request): string {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip')?.trim() ||
    'unknown';
  // Store a hash, not the raw IP address.
  return crypto.createHash('sha256').update(ip).digest('hex').slice(0, 24);
}

/** Fixed-window counter. Returns false once `limit` hits occur within the window. */
export async function withinRateLimit(
  sql: postgres.Sql,
  bucket: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  const windowMs = windowSeconds * 1000;
  const windowStart = new Date(Math.floor(Date.now() / windowMs) * windowMs);
  const [row] = await sql<{ hits: number }[]>`
    INSERT INTO rate_limits (bucket, window_start, hits) VALUES (${bucket}, ${windowStart}, 1)
    ON CONFLICT (bucket, window_start) DO UPDATE SET hits = rate_limits.hits + 1
    RETURNING hits`;
  if (Math.random() < 0.02) {
    await sql`DELETE FROM rate_limits WHERE window_start < now() - interval '1 day'`;
  }
  return row.hits <= limit;
}
