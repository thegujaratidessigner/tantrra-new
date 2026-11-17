import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';
import { requireAdminPage } from '@/lib/server/admin-auth';
import { getSiteSettingsFresh } from '@/lib/server/data';
import { getPaymentConfig } from '@/lib/server/config';
import { SETTINGS_SECTIONS } from '@/lib/admin/settings-schema';
import { Card, PageHeader } from '@/components/admin/ui';
import { SchemaForm } from '@/components/admin/SchemaForm';
import { saveSettings } from '../content/actions';

export const metadata: Metadata = { title: 'Settings' };

export default async function SettingsPage() {
  await requireAdminPage('settings.manage');
  const settings = await getSiteSettingsFresh();
  const payments = getPaymentConfig();

  return (
    <>
      <PageHeader title="Settings" description="Announcement bar, ticker and footer text are under Page Content." />

      <Card title="Payments" className="mb-6">
        <div className="flex items-start gap-3 text-[13px]">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#1B3D2F]" />
          <div>
            <p className="font-medium">
              Razorpay status:{' '}
              {payments.ok ? (payments.config.mode === 'live' ? 'Live payments enabled' : 'Test mode') : 'Online payment unavailable'}
            </p>
            <p className="mt-1 text-foreground-muted">
              API keys and webhook secrets are configured only in the hosting environment (Vercel) and are never shown or editable here.
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-8">
        {SETTINGS_SECTIONS.map((section) => (
          <section key={section.key}>
            <h2 className="text-[15px] font-semibold text-foreground">{section.title}</h2>
            <p className="mb-3 text-[12.5px] text-foreground-muted">{section.description}</p>
            <SchemaForm fields={section.fields} initial={section.toForm(settings)} action={saveSettings} hidden={{ key: section.key }} submitLabel={`Save ${section.title.toLowerCase()}`} />
          </section>
        ))}
      </div>
    </>
  );
}
