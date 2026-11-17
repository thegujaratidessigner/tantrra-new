import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { requireAdminPage } from '@/lib/server/admin-auth';
import { requireDb } from '@/lib/server/data';
import { Card, PageHeader, field } from '@/components/admin/ui';
import { ActionForm, SubmitButton } from '@/components/admin/ActionForm';
import { MediaField } from '@/components/admin/media/MediaField';
import { saveGroup } from '../../actions';

export const metadata: Metadata = { title: 'Edit service group' };

export default async function EditGroupPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPage('catalog.manage');
  const id = decodeURIComponent((await params).id);
  const [g] = await requireDb()<{
    id: string; kind: string; slug: string | null; name: string; name_alt: string | null; short_description: string; long_description: string;
    image_url: string | null; turnaround_days: string | null; seo_title: string | null; seo_description: string | null; featured: boolean; is_active: boolean;
  }[]>`SELECT * FROM service_groups WHERE id = ${id}`;
  if (!g) notFound();
  const isConsult = g.kind === 'consultation';
  const backKind = isConsult ? 'consultation' : 'chadava-navagraha';
  const text = (name: string, label: string, value: string | null, help?: string) => (
    <label className="block"><span className={field.label}>{label}</span>
      <input name={name} defaultValue={value ?? ''} maxLength={300} className={field.input} />{help && <span className={field.help}>{help}</span>}</label>
  );

  return (
    <>
      <Link href={`/admin/services?kind=${backKind}`} className="mb-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-foreground-muted hover:text-[#1B3D2F]">
        <ChevronLeft className="h-3.5 w-3.5" /> Back
      </Link>
      <PageHeader title={g.name} description={isConsult ? `Consultation page /consultations/${g.slug}` : 'Navagraha day'} />
      <ActionForm action={saveGroup} className="space-y-4">
        <input type="hidden" name="id" value={g.id} />
        <Card title="Details">
          <div className="grid gap-4 sm:grid-cols-2">
            {text('name', 'Name', g.name)}
            {text('name_alt', isConsult ? 'Alternate name' : 'Hindi name', g.name_alt)}
            {isConsult && text('turnaround_days', 'Approximate scheduling', g.turnaround_days, 'e.g. Within 3-5 days')}
          </div>
          {isConsult && (
            <div className="mt-4 space-y-4">
              <label className="block"><span className={field.label}>Short description</span>
                <textarea name="short_description" rows={2} defaultValue={g.short_description} className={field.input} /></label>
              <label className="block"><span className={field.label}>Full description</span>
                <textarea name="long_description" rows={6} defaultValue={g.long_description} className={field.input} /></label>
              <MediaField name="image_url" label="Card image" accept="image" defaultValue={g.image_url} help="Leave empty to keep the built-in image for this consultation." />
              <div className="grid gap-4 sm:grid-cols-2">
                {text('seo_title', 'SEO title', g.seo_title)}
                {text('seo_description', 'SEO description', g.seo_description)}
              </div>
            </div>
          )}
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <label className="flex items-center gap-2.5 rounded-lg border border-[#EFEADF] px-3 py-2.5 text-[13px] font-medium">
              <input type="checkbox" name="is_active" defaultChecked={g.is_active} className="h-4 w-4 accent-[#1B3D2F]" /> Visible on website
            </label>
            {isConsult && (
              <label className="flex items-center gap-2.5 rounded-lg border border-[#EFEADF] px-3 py-2.5 text-[13px] font-medium">
                <input type="checkbox" name="featured" defaultChecked={g.featured} className="h-4 w-4 accent-[#1B3D2F]" /> Featured
              </label>
            )}
          </div>
        </Card>
        <div className="flex justify-end"><SubmitButton>Save</SubmitButton></div>
      </ActionForm>
    </>
  );
}
