import type { Metadata } from 'next';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { requireAdminPage } from '@/lib/server/admin-auth';
import { requireDb } from '@/lib/server/data';
import { BLOCKS } from '@/lib/content/blocks';
import { Badge, Card, PageHeader, dateTime } from '@/components/admin/ui';
import { btn } from '@/components/admin/ActionForm';

export const metadata: Metadata = { title: 'Page Content' };

export default async function ContentPage() {
  await requireAdminPage('content.manage');
  const edited = await requireDb()<{ key: string; updated_at: Date }[]>`SELECT key, updated_at FROM content_blocks`;
  const editedAt = new Map(edited.map((e) => [e.key, e.updated_at]));
  const groups = [...new Set(BLOCKS.map((b) => b.group))];

  return (
    <>
      <PageHeader
        title="Page Content"
        description="Text and links in designed sections. Layouts stay the same; only the words, links and images change. Banners, videos, gallery and FAQs have their own pages."
      />
      <div className="space-y-4">
        {groups.map((g) => (
          <Card key={g} title={g}>
            <ul className="divide-y divide-[#F1ECE1]">
              {BLOCKS.filter((b) => b.group === g).map((b) => (
                <li key={b.key} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div className="min-w-0">
                    <Link href={`/admin/content/${encodeURIComponent(b.key)}`} className="text-[13.5px] font-semibold text-[#1B3D2F] hover:underline">{b.title}</Link>
                    {b.description && <p className="text-[12px] text-foreground-muted">{b.description}</p>}
                  </div>
                  <span className="flex items-center gap-2">
                    {editedAt.has(b.key) ? <Badge value="active" label={`edited ${dateTime(editedAt.get(b.key)!)}`} /> : <Badge value="draft" label="original" />}
                    <Link href={`/admin/content/${encodeURIComponent(b.key)}`} className={btn.ghost}><Pencil className="h-3.5 w-3.5" /> Edit</Link>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}
