'use client';

import { siteConfig } from '@/data/site-config';
import { Button } from '@/components/ui/Button';

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        Site Settings
      </h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Configure your TANTRRA platform settings.
      </p>

      <div className="mt-6 space-y-8">
        {/* Contact Info */}
        <div className="rounded-sm border border-border bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Contact Information
          </h2>
          <p className="mt-1 text-xs text-foreground-muted">
            Currently managed in src/data/site-config.ts. Database-backed
            settings will be available after Supabase integration.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground">
                WhatsApp Number
              </label>
              <input
                type="text"
                defaultValue={siteConfig.whatsappNumber}
                placeholder="e.g., 919876543210"
                className="mt-1 w-full rounded-sm border border-border bg-cream px-4 py-2.5 text-sm text-foreground-muted"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                type="email"
                defaultValue={siteConfig.email}
                placeholder="e.g., contact@tantrra.in"
                className="mt-1 w-full rounded-sm border border-border bg-cream px-4 py-2.5 text-sm text-foreground-muted"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Phone
              </label>
              <input
                type="tel"
                defaultValue={siteConfig.phone}
                placeholder="e.g., +91 98765 43210"
                className="mt-1 w-full rounded-sm border border-border bg-cream px-4 py-2.5 text-sm text-foreground-muted"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Pricing Config */}
        <div className="rounded-sm border border-border bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Pricing Configuration
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground">
                Energization Price
              </label>
              <input
                type="text"
                defaultValue={`₹${siteConfig.energizationPrice}`}
                className="mt-1 w-full rounded-sm border border-border bg-cream px-4 py-2.5 text-sm text-foreground-muted"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Dakshina Options
              </label>
              <input
                type="text"
                defaultValue={siteConfig.dakshinaOptions
                  .map((d) => `₹${d}`)
                  .join(', ')}
                className="mt-1 w-full rounded-sm border border-border bg-cream px-4 py-2.5 text-sm text-foreground-muted"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="rounded-sm border border-border bg-white p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Social Media
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {Object.entries(siteConfig.socialLinks).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium capitalize text-foreground">
                  {key}
                </label>
                <input
                  type="url"
                  defaultValue={value || ''}
                  placeholder={`https://${key}.com/tantrra`}
                  className="mt-1 w-full rounded-sm border border-border bg-cream px-4 py-2.5 text-sm text-foreground-muted"
                  readOnly
                />
              </div>
            ))}
          </div>
        </div>

        {/* Integration Status */}
        <div className="rounded-sm border border-gold/20 bg-gold-muted/20 p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Integrations
          </h2>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-foreground-muted">Supabase (Database & Auth)</span>
              <span className="rounded-full bg-cream-dark px-2.5 py-0.5 text-xs font-medium text-foreground-subtle">
                Not Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground-muted">Payment Gateway</span>
              <span className="rounded-full bg-cream-dark px-2.5 py-0.5 text-xs font-medium text-foreground-subtle">
                Not Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground-muted">Email Service</span>
              <span className="rounded-full bg-cream-dark px-2.5 py-0.5 text-xs font-medium text-foreground-subtle">
                Not Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
