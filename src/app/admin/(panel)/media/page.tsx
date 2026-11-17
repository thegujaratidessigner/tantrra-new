import type { Metadata } from 'next';
import { requireAdminPage } from '@/lib/server/admin-auth';
import { PageHeader } from '@/components/admin/ui';
import { listMedia } from './actions';
import { MediaLibrary } from './MediaLibrary';

export const metadata: Metadata = { title: 'Media Library' };

export default async function MediaPage({ searchParams }: { searchParams: Promise<{ kind?: string; q?: string }> }) {
  await requireAdminPage('media.manage');
  const { kind = '', q = '' } = await searchParams;
  const safeKind = kind === 'image' || kind === 'video' ? kind : '';
  const items = await listMedia({ kind: safeKind, q });

  return (
    <>
      <PageHeader title="Media Library" description="Images and videos stored in Supabase Storage. Files still used on the website cannot be deleted." />
      <MediaLibrary items={items} kind={safeKind} q={q} />
    </>
  );
}
