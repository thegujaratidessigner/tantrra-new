import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { requireAdminPage } from '@/lib/server/admin-auth';
import { getContentBlocks } from '@/lib/server/content';
import { getBlockDef } from '@/lib/content/blocks';
import { PageHeader } from '@/components/admin/ui';
import { ActionForm, SubmitButton } from '@/components/admin/ActionForm';
import { SchemaForm } from '@/components/admin/SchemaForm';
import { resetBlock, saveBlock } from '../actions';

export const metadata: Metadata = { title: 'Edit content' };

export default async function EditBlockPage({ params }: { params: Promise<{ key: string }> }) {
  await requireAdminPage('content.manage');
  const key = decodeURIComponent((await params).key);
  const def = getBlockDef(key);
  if (!def) notFound();
  const current = (await getContentBlocks())[key];

  return (
    <>
      <Link href="/admin/content" className="mb-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-foreground-muted hover:text-[#1B3D2F]">
        <ChevronLeft className="h-3.5 w-3.5" /> Page Content
      </Link>
      <PageHeader title={def.title} description={def.description} />
      <SchemaForm fields={def.fields} initial={current} action={saveBlock} hidden={{ key }} />
      <ActionForm action={resetBlock} confirm="Restore the original text for this section? Your edits will be discarded." className="mt-6">
        <input type="hidden" name="key" value={key} />
        <SubmitButton variant="secondary">Restore original content</SubmitButton>
      </ActionForm>
    </>
  );
}
