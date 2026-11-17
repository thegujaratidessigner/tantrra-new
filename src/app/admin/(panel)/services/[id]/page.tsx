import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { requireAdminPage } from '@/lib/server/admin-auth';
import { requireDb } from '@/lib/server/data';
import { SERVICE_KINDS, isServiceKind } from '@/lib/admin/service-kinds';
import { PageHeader } from '@/components/admin/ui';
import { OfferingForm, type OfferingValues } from '../OfferingForm';

export const metadata: Metadata = { title: 'Edit service' };

export default async function EditOfferingPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  await requireAdminPage('catalog.manage');
  const id = decodeURIComponent((await params).id);
  const { created } = await searchParams;
  const sql = requireDb();
  const [offering] = await sql<OfferingValues[]>`SELECT * FROM service_offerings WHERE id = ${id}`;
  if (!offering || !isServiceKind(offering.kind)) notFound();
  const groupKind = SERVICE_KINDS[offering.kind].group;
  const groups = groupKind ? await sql<{ id: string; name: string }[]>`SELECT id, name FROM service_groups WHERE kind = ${groupKind} ORDER BY sort_order` : [];

  return (
    <>
      <Link href={`/admin/services?kind=${offering.kind}`} className="mb-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-foreground-muted hover:text-[#1B3D2F]">
        <ChevronLeft className="h-3.5 w-3.5" /> {SERVICE_KINDS[offering.kind].label}
      </Link>
      <PageHeader title={offering.name} description={`Booking ID ${offering.id} — used by carts and orders, never changes.`} />
      {created && <p className="mb-4 rounded-lg bg-[#1B3D2F]/[0.06] px-4 py-2.5 text-[13px] text-[#1B3D2F]">Created.</p>}
      <OfferingForm values={offering} groups={groups} />
    </>
  );
}
