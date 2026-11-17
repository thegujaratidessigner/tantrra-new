import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowDown, ArrowUp, Film, Pencil, Plus } from 'lucide-react';
import { requireAdminPage } from '@/lib/server/admin-auth';
import { requireDb } from '@/lib/server/data';
import { getCollection } from '@/lib/admin/collections';
import { Badge, Card, EmptyState, PageHeader } from '@/components/admin/ui';
import { ActionForm, btn } from '@/components/admin/ActionForm';
import { moveCollectionItem, setCollectionItemActive } from '../collections/actions';

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }): Promise<Metadata> {
  return { title: getCollection((await params).collection)?.title ?? 'Not found' };
}

type Row = Record<string, unknown> & { id: string; sort_order: number };

export default async function CollectionPage({ params, searchParams }: { params: Promise<{ collection: string }>; searchParams: Promise<{ deleted?: string }> }) {
  await requireAdminPage('content.manage');
  const def = getCollection((await params).collection);
  if (!def) notFound();
  const { deleted } = await searchParams;
  const sql = requireDb();
  const rows = await sql<Row[]>`SELECT * FROM ${sql(def.table)} ORDER BY ${def.groupColumn ? sql`placement,` : sql``} sort_order, created_at`;

  const groups = def.groupColumn && def.groups
    ? Object.entries(def.groups).map(([key, g]) => ({ key, ...g, rows: rows.filter((r) => r.placement === key) }))
    : [{ key: 'all', label: '', help: '', rows }];

  const label = (r: Row) => {
    for (const c of def.labelColumns) {
      const v = r[c];
      if (typeof v === 'string' && v.trim()) return v.length > 120 ? `${v.slice(0, 117)}…` : v;
    }
    return `Untitled ${def.single}`;
  };

  const list = (items: Row[]) => (
    <ul className="divide-y divide-[#F1ECE1]">
      {items.map((r, i) => {
        const thumb = def.thumbColumn ? (r[def.thumbColumn] as string | null) : null;
        const isVideo = typeof thumb === 'string' && /\.(mp4|webm)(\?|$)/i.test(thumb);
        const active = Boolean(r[def.activeColumn]);
        return (
          <li key={r.id} className="flex flex-wrap items-center gap-3 py-3">
            {def.thumbColumn && (
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-[#F6F3EC]">
                {thumb && !isVideo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt="" loading="lazy" className="h-full w-full object-cover" />
                )}
                {(isVideo || (!thumb && def.key === 'videos')) && (
                  <div className="flex h-full w-full items-center justify-center"><Film className="h-5 w-5 text-foreground-subtle" /></div>
                )}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <Link href={`/admin/${def.key}/${r.id}`} className="block truncate text-[13.5px] font-semibold text-[#1B3D2F] hover:underline">{label(r)}</Link>
              {def.key === 'videos' && <p className="truncate text-[12px] text-foreground-muted">{(r.youtube_id as string) ? `YouTube ${r.youtube_id}` : (r.src as string)}</p>}
              {def.key === 'banners' && <p className="text-[12px] capitalize text-foreground-muted">{String(r.media_type)}</p>}
            </div>
            <ActionForm action={setCollectionItemActive}>
              <input type="hidden" name="collection" value={def.key} />
              <input type="hidden" name="id" value={r.id} />
              <input type="hidden" name="value" value={String(!active)} />
              <button title="Toggle"><Badge value={active ? 'active' : 'inactive'} label={active ? def.activeLabel[0] : def.activeLabel[1]} /></button>
            </ActionForm>
            <div className="flex">
              {i > 0 && (
                <ActionForm action={moveCollectionItem}>
                  <input type="hidden" name="collection" value={def.key} /><input type="hidden" name="id" value={r.id} /><input type="hidden" name="dir" value="up" />
                  <button className={btn.ghost} aria-label="Move up"><ArrowUp className="h-3.5 w-3.5" /></button>
                </ActionForm>
              )}
              {i < items.length - 1 && (
                <ActionForm action={moveCollectionItem}>
                  <input type="hidden" name="collection" value={def.key} /><input type="hidden" name="id" value={r.id} /><input type="hidden" name="dir" value="down" />
                  <button className={btn.ghost} aria-label="Move down"><ArrowDown className="h-3.5 w-3.5" /></button>
                </ActionForm>
              )}
              <Link href={`/admin/${def.key}/${r.id}`} className={btn.ghost}><Pencil className="h-3.5 w-3.5" /> Edit</Link>
            </div>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <PageHeader
        title={def.title}
        description={def.description}
        actions={
          <>
            {def.related && <Link href={def.related.href} className={btn.secondary}>{def.related.label}</Link>}
            <Link href={`/admin/${def.key}/new`} className={btn.primary}><Plus className="h-4 w-4" /> Add {def.single}</Link>
          </>
        }
      />
      {deleted && <p className="mb-4 rounded-lg bg-[#1B3D2F]/[0.06] px-4 py-2.5 text-[13px] text-[#1B3D2F]">Deleted.</p>}
      {rows.length === 0 ? (
        <EmptyState title={`No ${def.title.toLowerCase()} yet`} action={<Link href={`/admin/${def.key}/new`} className={btn.primary}>Add {def.single}</Link>} />
      ) : (
        <div className="space-y-4">
          {groups.map((g) =>
            def.groupColumn ? (
              <Card
                key={g.key}
                title={g.label}
                actions={<Link href={`/admin/${def.key}/new?placement=${g.key}`} className={btn.ghost}><Plus className="h-3.5 w-3.5" /> Add</Link>}
              >
                <p className="-mt-2 mb-2 text-[12px] text-foreground-subtle">{g.help}</p>
                {g.rows.length ? list(g.rows) : <p className="text-[13px] text-foreground-muted">Nothing here — this section is hidden on the website.</p>}
              </Card>
            ) : (
              <Card key={g.key}>{list(g.rows)}</Card>
            )
          )}
        </div>
      )}
    </>
  );
}
