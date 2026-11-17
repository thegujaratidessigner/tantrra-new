import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { requireAdminPage } from '@/lib/server/admin-auth';
import { requireDb } from '@/lib/server/data';
import { SERVICE_KINDS, isServiceKind, type ServiceKind } from '@/lib/admin/service-kinds';
import { PageHeader } from '@/components/admin/ui';
import { OfferingForm } from '../OfferingForm';

export const metadata: Metadata = { title: 'New service' };

export default async function NewOfferingPage({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  await requireAdminPage('catalog.manage');
  const { kind: k } = await searchParams;
  const kind: ServiceKind = isServiceKind(k) ? k : 'puja';
  const groupKind = SERVICE_KINDS[kind].group;
  const groups = groupKind ? await requireDb()<{ id: string; name: string }[]>`SELECT id, name FROM service_groups WHERE kind = ${groupKind} ORDER BY sort_order` : [];

  return (
    <>
      <Link href={`/admin/services?kind=${kind}`} className="mb-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-foreground-muted hover:text-[#1B3D2F]">
        <ChevronLeft className="h-3.5 w-3.5" /> {SERVICE_KINDS[kind].label}
      </Link>
      <PageHeader title={`New ${SERVICE_KINDS[kind].single}`} />
      <OfferingForm
        groups={groups}
        values={{
          kind, group_id: null, slug: null, name: '', name_alt: null, short_description: '', long_description: '', includes: [],
          image_url: null, price: null, preset_amounts: [], allow_custom: kind === 'daan-seva', duration: null, metadata: {},
          featured: false, is_active: true,
        }}
      />
    </>
  );
}
