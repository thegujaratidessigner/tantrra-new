import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ArrowUp, Pencil, Plus } from 'lucide-react';
import { requireAdminPage } from '@/lib/server/admin-auth';
import { requireDb } from '@/lib/server/data';
import { SERVICE_KINDS, isServiceKind, type ServiceKind } from '@/lib/admin/service-kinds';
import { Badge, Card, EmptyState, PageHeader, inrRupees, table } from '@/components/admin/ui';
import { ActionForm, btn } from '@/components/admin/ActionForm';
import { moveOffering, setOfferingActive } from './actions';

export const metadata: Metadata = { title: 'Services & Pricing' };

interface Row {
  id: string; name: string; name_alt: string | null; price: number | null; preset_amounts: number[]; allow_custom: boolean;
  is_active: boolean; featured: boolean; group_id: string | null; metadata: Record<string, unknown>; duration: string | null;
}

export default async function ServicesPage({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  await requireAdminPage('catalog.manage');
  const { kind: k } = await searchParams;
  const kind: ServiceKind = isServiceKind(k) ? k : 'puja';
  const sql = requireDb();
  const def = SERVICE_KINDS[kind];

  const [rows, groups] = await Promise.all([
    sql<Row[]>`
      SELECT id, name, name_alt, price, preset_amounts, allow_custom, is_active, featured, group_id, metadata, duration
      FROM service_offerings WHERE kind = ${kind} AND NOT coalesce((metadata->>'legacy')::boolean, false)
      ORDER BY sort_order, name`,
    def.group
      ? sql<{ id: string; name: string; name_alt: string | null; is_active: boolean }[]>`
          SELECT id, name, name_alt, is_active FROM service_groups WHERE kind = ${def.group} ORDER BY sort_order`
      : Promise.resolve([] as { id: string; name: string; name_alt: string | null; is_active: boolean }[]),
  ]);

  const priceCell = (r: Row) =>
    kind === 'daan-seva'
      ? `${r.preset_amounts.map(inrRupees).join(' · ') || '—'}${r.allow_custom ? ' · custom' : ''}`
      : r.price === null ? '—' : inrRupees(r.price);

  const renderRows = (list: Row[]) => (
    <div className={table.wrap}>
      <table className={table.table}>
        <thead><tr>{['Offering', 'Price', 'Status', ''].map((h, i) => <th key={i} className={table.th}>{h}</th>)}</tr></thead>
        <tbody>
          {list.map((r, i) => (
            <tr key={r.id} className={table.row}>
              <td className={table.td}>
                <Link href={`/admin/services/${encodeURIComponent(r.id)}`} className="font-semibold text-[#1B3D2F] hover:underline">{r.name}</Link>
                <p className="text-[12px] text-foreground-muted">
                  {[r.name_alt, r.metadata.deity as string, r.metadata.tier as string, r.metadata.graha as string, r.duration, r.metadata.combined ? 'Combined offering' : null]
                    .filter(Boolean).join(' · ')}
                </p>
              </td>
              <td className={`${table.td} tabular-nums font-medium`}>{priceCell(r)}</td>
              <td className={table.td}>
                <ActionForm action={setOfferingActive}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="value" value={String(!r.is_active)} />
                  <button title="Toggle availability"><Badge value={r.is_active ? 'active' : 'inactive'} label={r.is_active ? 'bookable' : 'hidden'} /></button>
                </ActionForm>
              </td>
              <td className={`${table.td} whitespace-nowrap text-right`}>
                <div className="inline-flex gap-0.5">
                  {i > 0 && <ActionForm action={moveOffering}><input type="hidden" name="id" value={r.id} /><input type="hidden" name="dir" value="up" /><button className={btn.ghost} aria-label="Move up"><ArrowUp className="h-3.5 w-3.5" /></button></ActionForm>}
                  {i < list.length - 1 && <ActionForm action={moveOffering}><input type="hidden" name="id" value={r.id} /><input type="hidden" name="dir" value="down" /><button className={btn.ghost} aria-label="Move down"><ArrowDown className="h-3.5 w-3.5" /></button></ActionForm>}
                  <Link href={`/admin/services/${encodeURIComponent(r.id)}`} className={btn.ghost}><Pencil className="h-3.5 w-3.5" /> Edit</Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <PageHeader
        title="Services & Pricing"
        description="Prices saved here are used immediately by the website and by checkout. Existing bookings keep the price they were paid at."
        actions={<Link href={`/admin/services/new?kind=${kind}`} className={btn.primary}><Plus className="h-4 w-4" /> New {def.single}</Link>}
      />
      <div className="mb-5 flex flex-wrap gap-1.5">
        {(Object.keys(SERVICE_KINDS) as ServiceKind[]).map((key) => (
          <Link key={key} href={`/admin/services?kind=${key}`} className={`rounded-full border px-3 py-1 text-[12px] font-medium ${key === kind ? 'border-[#1B3D2F] bg-[#1B3D2F] text-white' : 'border-[#DDD5C3] bg-white text-foreground-muted'}`}>
            {SERVICE_KINDS[key].label}
          </Link>
        ))}
      </div>

      {rows.length === 0 && groups.length === 0 ? (
        <EmptyState title={`No ${def.label.toLowerCase()} yet`} />
      ) : def.group ? (
        <div className="space-y-4">
          {kind === 'chadava-navagraha' && rows.some((r) => !r.group_id) && (
            <Card title="Combined offering">{renderRows(rows.filter((r) => !r.group_id))}</Card>
          )}
          {groups.map((g) => {
            const list = rows.filter((r) => r.group_id === g.id);
            return (
              <Card
                key={g.id}
                title={`${g.name}${g.name_alt ? ` · ${g.name_alt}` : ''}`}
                actions={
                  <span className="flex items-center gap-2">
                    {!g.is_active && <Badge value="inactive" label="hidden" />}
                    <Link href={`/admin/services/groups/${encodeURIComponent(g.id)}`} className={btn.ghost}><Pencil className="h-3.5 w-3.5" /> {kind === 'consultation' ? 'Edit service page' : 'Edit day'}</Link>
                  </span>
                }
              >
                {list.length ? renderRows(list) : <p className="text-[13px] text-foreground-muted">No offerings.</p>}
              </Card>
            );
          })}
        </div>
      ) : (
        renderRows(rows)
      )}
    </>
  );
}
