import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient, supabaseConfigured } from '@/lib/supabase/server';
import { getDbOrNull } from './data';

export type AdminRole = 'super_admin' | 'admin' | 'editor';

export interface AdminUser {
  userId: string;
  email: string;
  role: AdminRole;
  displayName: string | null;
}

const ALL: AdminRole[] = ['super_admin', 'admin', 'editor'];
const MANAGERS: AdminRole[] = ['super_admin', 'admin'];

export const PERMISSIONS = {
  'dashboard.view': ALL,
  'orders.view': MANAGERS,
  'orders.manage': MANAGERS,
  'orders.export': MANAGERS,
  'customers.view': MANAGERS,
  'customers.manage': MANAGERS,
  'catalog.manage': MANAGERS,
  'content.manage': ALL,
  'media.manage': ALL,
  'settings.manage': MANAGERS,
  'admins.manage': ['super_admin'] as AdminRole[],
} satisfies Record<string, AdminRole[]>;

export type Permission = keyof typeof PERMISSIONS;

export const can = (admin: Pick<AdminUser, 'role'> | null, permission: Permission) =>
  Boolean(admin && PERMISSIONS[permission].includes(admin.role));

/** The signed-in, active admin for this request, or null. Cached per request. */
export const getCurrentAdmin = cache(async (): Promise<AdminUser | null> => {
  if (!supabaseConfigured()) return null;
  const sql = getDbOrNull();
  if (!sql) return null;
  const supabase = await createSupabaseServerClient();
  // getUser() validates the JWT with Supabase Auth instead of trusting the cookie.
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  const [row] = await sql<{ user_id: string; email: string; role: AdminRole; display_name: string | null }[]>`
    SELECT user_id, email, role, display_name FROM admin_users WHERE user_id = ${data.user.id} AND is_active`;
  return row ? { userId: row.user_id, email: row.email, role: row.role, displayName: row.display_name } : null;
});

export class ForbiddenError extends Error {
  constructor(permission: Permission) {
    super(`Not permitted: ${permission}`);
  }
}

/** Use at the top of every admin page. Redirects anonymous users; renders 'forbidden' for missing roles. */
export async function requireAdminPage(permission: Permission = 'dashboard.view'): Promise<AdminUser> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  if (!can(admin, permission)) redirect('/admin?denied=1');
  return admin;
}

/** Use at the top of every admin server action. Throws instead of redirecting. */
export async function requireAdminAction(permission: Permission): Promise<AdminUser> {
  const admin = await getCurrentAdmin();
  if (!admin || !can(admin, permission)) throw new ForbiddenError(permission);
  return admin;
}

export async function audit(
  admin: AdminUser,
  action: string,
  entity: string,
  entityId: string | null,
  details?: Record<string, unknown>
) {
  const sql = getDbOrNull();
  if (!sql) return;
  await sql`
    INSERT INTO admin_audit_log (actor_id, actor_email, action, entity, entity_id, details)
    VALUES (${admin.userId}, ${admin.email}, ${action}, ${entity}, ${entityId}, ${details ? sql.json(details as never) : null})`;
}
