// Grant/revoke admin roles for users that already exist in Supabase Auth.
// The account (and its password) is created by you in Supabase → Authentication → Users.
// Usage:
//   npm run admin -- list
//   npm run admin -- grant you@example.com super_admin   (roles: super_admin | admin | editor)
//   npm run admin -- revoke you@example.com
import postgres from 'postgres';

const [command, emailArg, roleArg] = process.argv.slice(2);
const ROLES = ['super_admin', 'admin', 'editor'];
const sql = postgres(process.env.DATABASE_URL, { prepare: false, max_pipeline: 1, max: 1, ssl: 'require', onnotice: () => {} });

try {
  if (command === 'list') {
    const rows = await sql`SELECT email, role, is_active, created_at FROM admin_users ORDER BY created_at`;
    if (!rows.length) console.log('No admin users yet.');
    for (const r of rows) console.log(`${r.email.padEnd(36)} ${r.role.padEnd(12)} ${r.is_active ? 'active' : 'DISABLED'}`);
  } else if (command === 'grant') {
    const email = (emailArg ?? '').trim().toLowerCase();
    if (!email || !ROLES.includes(roleArg)) throw new Error('Usage: npm run admin -- grant <email> <super_admin|admin|editor>');
    const [user] = await sql`SELECT id, email, email_confirmed_at FROM auth.users WHERE lower(email) = ${email}`;
    if (!user) throw new Error(`No Supabase Auth user with email ${email}. Create it first in Supabase → Authentication → Users → Add user.`);
    if (!user.email_confirmed_at) console.warn('Note: this user has not confirmed their email yet (use "Auto Confirm User" when creating it).');
    await sql`
      INSERT INTO admin_users (user_id, email, role) VALUES (${user.id}, ${email}, ${roleArg})
      ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role, email = EXCLUDED.email, is_active = true`;
    await sql`INSERT INTO admin_audit_log (actor_email, action, entity, entity_id, details)
              VALUES ('cli', 'grant_role', 'admin_user', ${user.id}, ${sql.json({ role: roleArg })})`;
    console.log(`Granted ${roleArg} to ${email}.`);
  } else if (command === 'revoke') {
    const email = (emailArg ?? '').trim().toLowerCase();
    const rows = await sql`UPDATE admin_users SET is_active = false WHERE lower(email) = ${email} RETURNING user_id`;
    console.log(rows.length ? `Disabled admin access for ${email}.` : `No admin user ${email}.`);
  } else {
    console.log('Usage: npm run admin -- <list | grant <email> <role> | revoke <email>>');
  }
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
