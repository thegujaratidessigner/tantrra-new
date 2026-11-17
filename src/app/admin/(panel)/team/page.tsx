import type { Metadata } from 'next';
import { requireAdminPage } from '@/lib/server/admin-auth';
import { requireDb } from '@/lib/server/data';
import { Badge, Card, PageHeader, dateTime, field, table } from '@/components/admin/ui';
import { ActionForm, SubmitButton } from '@/components/admin/ActionForm';
import { grantAdmin, updateAdmin } from './actions';

export const metadata: Metadata = { title: 'Team & Roles' };

const ROLE_INFO = [
  ['super_admin', 'Super Admin', 'Everything, including team management.'],
  ['admin', 'Admin', 'Orders, customers, products, services, content and settings.'],
  ['editor', 'Editor', 'Banners, videos, gallery, testimonials, FAQs, page content and media only.'],
] as const;

export default async function TeamPage() {
  const me = await requireAdminPage('admins.manage');
  const sql = requireDb();
  const [members, log] = await Promise.all([
    sql<{ user_id: string; email: string; role: string; display_name: string | null; is_active: boolean; created_at: Date; last_sign_in_at: Date | null }[]>`
      SELECT a.user_id, a.email, a.role, a.display_name, a.is_active, a.created_at, u.last_sign_in_at
      FROM admin_users a LEFT JOIN auth.users u ON u.id = a.user_id ORDER BY a.created_at`,
    sql<{ actor_email: string | null; action: string; entity: string; entity_id: string | null; created_at: Date }[]>`
      SELECT actor_email, action, entity, entity_id, created_at FROM admin_audit_log ORDER BY created_at DESC LIMIT 30`,
  ]);

  return (
    <>
      <PageHeader title="Team & Roles" description="Who can access the admin panel. Passwords are managed in Supabase → Authentication." />

      <Card title="Add a team member" className="mb-4">
        <ol className="mb-4 list-decimal space-y-1 pl-5 text-[12.5px] text-foreground-muted">
          <li>In Supabase → Authentication → Users, click <strong>Add user → Create new user</strong>, set a strong password and tick <strong>Auto Confirm User</strong>.</li>
          <li>Enter the same email below and choose a role. Share the password with them privately; they can change it later.</li>
        </ol>
        <ActionForm action={grantAdmin} resetOnSuccess className="grid gap-3 sm:grid-cols-[1fr_1fr_180px_auto] sm:items-end">
          <label className="block"><span className={field.label}>Email</span><input name="email" type="email" required className={field.input} /></label>
          <label className="block"><span className={field.label}>Display name</span><input name="display_name" maxLength={80} className={field.input} /></label>
          <label className="block"><span className={field.label}>Role</span>
            <select name="role" defaultValue="editor" className={field.input}>{ROLE_INFO.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          </label>
          <SubmitButton>Grant access</SubmitButton>
        </ActionForm>
        <dl className="mt-4 grid gap-2 text-[12px] sm:grid-cols-3">
          {ROLE_INFO.map(([v, l, d]) => <div key={v} className="rounded-lg bg-[#FAF7EF] px-3 py-2"><dt className="font-semibold">{l}</dt><dd className="text-foreground-muted">{d}</dd></div>)}
        </dl>
      </Card>

      <div className={`${table.wrap} mb-6`}>
        <table className={table.table}>
          <thead><tr>{['Member', 'Role', 'Status', 'Last sign-in', ''].map((h, i) => <th key={i} className={table.th}>{h}</th>)}</tr></thead>
          <tbody>
            {members.map((m) => {
              const self = m.user_id === me.userId;
              return (
                <tr key={m.user_id} className={table.row}>
                  <td className={table.td}><p className="font-medium">{m.display_name || m.email}</p><p className="text-[12px] text-foreground-muted">{m.email}{self ? ' (you)' : ''}</p></td>
                  <td className={table.td}>
                    {self ? <Badge value="live" label={m.role.replace('_', ' ')} /> : (
                      <ActionForm action={updateAdmin} className="flex gap-1.5">
                        <input type="hidden" name="userId" value={m.user_id} /><input type="hidden" name="intent" value="role" />
                        <select name="role" defaultValue={m.role} className={`${field.input} mt-0 w-auto py-1 text-[12.5px]`} aria-label={`Role for ${m.email}`}>
                          {ROLE_INFO.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                        <SubmitButton variant="secondary">Save</SubmitButton>
                      </ActionForm>
                    )}
                  </td>
                  <td className={table.td}><Badge value={m.is_active ? 'active' : 'inactive'} label={m.is_active ? 'active' : 'disabled'} /></td>
                  <td className={`${table.td} text-foreground-muted`}>{m.last_sign_in_at ? dateTime(m.last_sign_in_at) : '—'}</td>
                  <td className={`${table.td} text-right`}>
                    {!self && (
                      <ActionForm action={updateAdmin} confirm={m.is_active ? `Remove admin access for ${m.email}?` : `Restore admin access for ${m.email}?`}>
                        <input type="hidden" name="userId" value={m.user_id} /><input type="hidden" name="intent" value="toggle" />
                        <SubmitButton variant={m.is_active ? 'danger' : 'secondary'}>{m.is_active ? 'Disable' : 'Enable'}</SubmitButton>
                      </ActionForm>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Card title="Recent admin activity">
        {log.length === 0 ? <p className="text-[13px] text-foreground-muted">No activity yet.</p> : (
          <ul className="space-y-1.5 text-[12.5px]">
            {log.map((l, i) => (
              <li key={i} className="flex flex-wrap gap-x-2 text-foreground-muted">
                <span className="text-foreground">{l.actor_email ?? 'system'}</span>
                <span>{l.action.replace(/_/g, ' ')}</span>
                <span>{l.entity.replace(/_/g, ' ')}{l.entity_id ? ` ${l.entity_id.slice(0, 24)}` : ''}</span>
                <span className="ml-auto">{dateTime(l.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
