'use server';

import { revalidatePath } from 'next/cache';
import { audit, requireAdminAction, type AdminRole } from '@/lib/server/admin-auth';
import { requireDb } from '@/lib/server/data';
import { fail, ok, type ActionResult } from '@/lib/server/admin-action-result';
import { cleanText } from '@/lib/content/schema';

const ROLES: AdminRole[] = ['super_admin', 'admin', 'editor'];

async function activeSuperAdmins(excluding?: string) {
  const [{ n }] = await requireDb()<{ n: number }[]>`
    SELECT count(*)::int AS n FROM admin_users WHERE role = 'super_admin' AND is_active AND user_id <> ${excluding ?? '00000000-0000-0000-0000-000000000000'}`;
  return n;
}

export async function grantAdmin(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdminAction('admins.manage').catch(() => null);
  if (!admin) return fail('Only a Super Admin can manage the team.');
  const email = cleanText(formData.get('email'), 254).toLowerCase();
  const role = String(formData.get('role')) as AdminRole;
  if (!ROLES.includes(role)) return fail('Choose a role.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return fail('Enter a valid email address.');

  const sql = requireDb();
  const [user] = await sql<{ id: string; confirmed: boolean }[]>`
    SELECT id, email_confirmed_at IS NOT NULL AS confirmed FROM auth.users WHERE lower(email) = ${email}`;
  if (!user) return fail('No account with that email yet. Create it first in Supabase → Authentication → Users → Add user (with a password and “Auto Confirm”).');
  await sql`
    INSERT INTO admin_users (user_id, email, role, display_name, created_by)
    VALUES (${user.id}, ${email}, ${role}, ${cleanText(formData.get('display_name'), 80) || null}, ${admin.userId})
    ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role, is_active = true,
      display_name = coalesce(EXCLUDED.display_name, admin_users.display_name)`;
  await audit(admin, 'grant_role', 'admin_user', user.id, { email, role });
  revalidatePath('/admin/team');
  return ok(`${email} can now sign in as ${role.replace('_', ' ')}.${user.confirmed ? '' : ' Note: the account email is not confirmed yet.'}`);
}

export async function updateAdmin(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdminAction('admins.manage').catch(() => null);
  if (!admin) return fail('Only a Super Admin can manage the team.');
  const userId = String(formData.get('userId'));
  const intent = String(formData.get('intent'));
  if (!/^[0-9a-f-]{36}$/i.test(userId)) return fail('Invalid request.');
  if (userId === admin.userId) return fail('You cannot change your own access. Ask another Super Admin.');

  const sql = requireDb();
  const [target] = await sql<{ role: AdminRole; is_active: boolean; email: string }[]>`SELECT role, is_active, email FROM admin_users WHERE user_id = ${userId}`;
  if (!target) return fail('Team member not found.');

  if (intent === 'role') {
    const role = String(formData.get('role')) as AdminRole;
    if (!ROLES.includes(role)) return fail('Choose a role.');
    if (target.role === 'super_admin' && role !== 'super_admin' && (await activeSuperAdmins(userId)) === 0) return fail('At least one active Super Admin is required.');
    await sql`UPDATE admin_users SET role = ${role} WHERE user_id = ${userId}`;
    await audit(admin, 'change_role', 'admin_user', userId, { from: target.role, to: role });
    revalidatePath('/admin/team');
    return ok(`${target.email} is now ${role.replace('_', ' ')}.`);
  }
  if (intent === 'toggle') {
    const next = !target.is_active;
    if (!next && target.role === 'super_admin' && (await activeSuperAdmins(userId)) === 0) return fail('At least one active Super Admin is required.');
    await sql`UPDATE admin_users SET is_active = ${next} WHERE user_id = ${userId}`;
    await audit(admin, next ? 'enable' : 'disable', 'admin_user', userId);
    revalidatePath('/admin/team');
    return ok(next ? `${target.email} re-enabled.` : `${target.email} can no longer access the admin panel.`);
  }
  return fail('Invalid request.');
}
