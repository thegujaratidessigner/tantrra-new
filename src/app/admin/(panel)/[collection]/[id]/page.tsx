import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { requireAdminPage } from '@/lib/server/admin-auth';
import { requireDb } from '@/lib/server/data';
import { getCollection } from '@/lib/admin/collections';
import { PageHeader } from '@/components/admin/ui';
import { ActionForm, SubmitButton } from '@/components/admin/ActionForm';
import { SchemaForm } from '@/components/admin/SchemaForm';
import { deleteCollectionItem, saveCollectionItem } from '../../collections/actions';

export const metadata: Metadata = { title: 'Edit' };

export default async function CollectionItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ collection: string; id: string }>;
  searchParams: Promise<{ created?: string; placement?: string }>;
}) {
  await requireAdminPage('content.manage');
  const { collection, id } = await params;
  const def = getCollection(collection);
  if (!def) notFound();
  const sp = await searchParams;
  const isNew = id === 'new';
  if (!isNew && !/^[0-9a-f-]{36}$/i.test(id)) notFound();

  let initial: Record<string, unknown> = {};
  if (!isNew) {
    const sql = requireDb();
    const [row] = await sql<Record<string, unknown>[]>`SELECT * FROM ${sql(def.table)} WHERE id = ${id}`;
    if (!row) notFound();
    for (const f of def.fields) initial[f.key] = row[f.key] === null ? '' : f.key === 'rating' ? String(row[f.key]) : row[f.key];
  } else {
    if (def.groupColumn && sp.placement && def.groups && sp.placement in def.groups) initial = { placement: sp.placement };
    if (def.key === 'gallery') initial.show_on_home = true;
  }

  return (
    <>
      <Link href={`/admin/${def.key}`} className="mb-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-foreground-muted hover:text-[#1B3D2F]">
        <ChevronLeft className="h-3.5 w-3.5" /> {def.title}
      </Link>
      <PageHeader title={isNew ? `Add ${def.single}` : `Edit ${def.single}`} description={isNew ? 'New items go live as soon as they are saved — hide them from the list if you are not ready.' : undefined} />
      {sp.created && <p className="mb-4 rounded-lg bg-[#1B3D2F]/[0.06] px-4 py-2.5 text-[13px] text-[#1B3D2F]">Created and live on the website.</p>}
      <SchemaForm
        fields={def.fields}
        initial={initial}
        action={saveCollectionItem}
        hidden={{ collection: def.key, id: isNew ? '' : id }}
        submitLabel={isNew ? `Add ${def.single}` : 'Save changes'}
      />
      {!isNew && (
        <ActionForm action={deleteCollectionItem} confirm={`Delete this ${def.single}? Media files stay in the media library.`} className="mt-6">
          <input type="hidden" name="collection" value={def.key} />
          <input type="hidden" name="id" value={id} />
          <SubmitButton variant="danger">Delete {def.single}</SubmitButton>
        </ActionForm>
      )}
    </>
  );
}
