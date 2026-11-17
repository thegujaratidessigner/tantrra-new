// Usage: npm run db:check | npm run db:migrate   (reads DATABASE_URL from .env.local)
// Never prints the connection string or password.
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import postgres from 'postgres';

const MIGRATIONS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'db', 'migrations');
const command = process.argv[2];

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error('DATABASE_URL is empty. Add it to .env.local first.');
  process.exit(1);
}

let parsed;
try {
  parsed = new URL(url);
} catch {
  console.error('DATABASE_URL is not a valid URL (check for unescaped special characters in the password).');
  process.exit(1);
}

const host = parsed.hostname;
const port = parsed.port || '5432';
const mode = host.endsWith('.pooler.supabase.com')
  ? port === '6543' ? 'Transaction pooler' : 'Session pooler'
  : host.startsWith('db.') && host.endsWith('.supabase.co') ? 'Direct connection (IPv6-only; not reachable from Vercel)' : 'Other';

const sql = postgres(url, { prepare: false, max: 1, connect_timeout: 15, ssl: host === 'localhost' || host === '127.0.0.1' ? false : 'require', onnotice: () => {} });

async function check() {
  console.log(`Host: ${host}:${port}  |  Mode: ${mode}  |  User: ${decodeURIComponent(parsed.username)}`);
  const [{ version }] = await sql`SELECT current_setting('server_version') AS version`;
  console.log(`Connected. PostgreSQL ${version}`);

  const tables = await sql`
    SELECT c.relname AS name, c.relrowsecurity AS rls,
           (SELECT count(*) FROM pg_policies p WHERE p.schemaname = 'public' AND p.tablename = c.relname)::int AS policies
    FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind = 'r' ORDER BY c.relname`;
  console.log(`\nPublic tables (${tables.length}):`);
  for (const t of tables) console.log(`  ${t.name.padEnd(24)} RLS ${t.rls ? 'on ' : 'OFF'}  policies: ${t.policies}`);

  const hasLedger = tables.some((t) => t.name === 'schema_migrations');
  const applied = hasLedger ? await sql`SELECT filename, applied_at FROM schema_migrations ORDER BY filename` : [];
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql')).sort();
  console.log('\nMigrations:');
  for (const f of files) {
    const row = applied.find((a) => a.filename === f);
    console.log(`  ${row ? 'applied ' : 'PENDING '} ${f}${row ? `  (${row.applied_at.toISOString()})` : ''}`);
  }
}

async function migrate() {
  await sql`CREATE TABLE IF NOT EXISTS schema_migrations (
    filename text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())`;
  await sql`ALTER TABLE schema_migrations ENABLE ROW LEVEL SECURITY`;

  const applied = new Map((await sql`SELECT filename, checksum FROM schema_migrations`).map((r) => [r.filename, r.checksum]));
  const files = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql')).sort();

  for (const f of files) {
    const body = readFileSync(join(MIGRATIONS_DIR, f), 'utf8');
    const checksum = createHash('sha256').update(body).digest('hex');
    if (applied.has(f)) {
      if (applied.get(f) !== checksum) {
        console.error(`STOP: ${f} was already applied but its contents changed. Write a new migration instead.`);
        process.exitCode = 1;
        return;
      }
      console.log(`skip     ${f}`);
      continue;
    }
    console.log(`apply    ${f} ...`);
    // Migration files manage their own BEGIN/COMMIT and are written to be re-runnable.
    await sql.unsafe(body);
    await sql`INSERT INTO schema_migrations (filename, checksum) VALUES (${f}, ${checksum})`;
    console.log(`done     ${f}`);
  }
}

try {
  if (command === 'check') await check();
  else if (command === 'migrate') { await migrate(); await check(); }
  else { console.error('Usage: node scripts/db.mjs <check|migrate>'); process.exitCode = 1; }
} catch (err) {
  console.error(`Database error: ${err.code ?? ''} ${err.message}`.trim());
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}
