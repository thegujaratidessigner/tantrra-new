import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ArrowUp, Plus } from 'lucide-react';
import { requireAdminPage } from '@/lib/server/admin-auth';
import { requireDb } from '@/lib/server/data';
import { Badge, EmptyState, PageHeader, inrRupees, table } from '@/components/admin/ui';
import { ActionForm, btn } from '@/components/admin/ActionForm';
import { moveProduct, setProductFlag } from './actions';

export const metadata: Metadata = { title: 'Products' };

const VIEWS = { live: 'Live', hidden: 'Hidden', archived: 'Archived', all: 'All' } as const;

export default async function ProductsAdminPage({ searchParams }: { searchParams: Promise<{ view?: string; deleted?: string }> }) {
  await requireAdminPage('catalog.manage');
  const sp = await searchParams;
  const view = (sp.view && sp.view in VIEWS ? sp.view : 'all') as keyof typeof VIEWS;
  const sql = requireDb();
  const cond =
    view === 'live' ? sql`WHERE p.archived_at IS NULL AND p.is_active`
    : view === 'hidden' ? sql`WHERE p.archived_at IS NULL AND NOT p.is_active`
    : view === 'archived' ? sql`WHERE p.archived_at IS NOT NULL`
    : sql`WHERE p.archived_at IS NULL`;

  const rows = await sql<{ id: string; name: string; slug: string; category: string; price: number; compare_price: number | null;
    is_active: boolean; featured: boolean; in_stock: boolean; stock_quantity: number | null; archived_at: Date | null; image: string | null; images: number; test_only: boolean }[]>`
    SELECT p.id, p.name, p.slug, c.name AS category, p.price, p.compare_price, p.is_active, p.featured, p.in_stock,
           p.stock_quantity, p.archived_at, p.test_only,
           (SELECT src FROM product_images i WHERE i.product_id = p.id ORDER BY (kind = 'hero') DESC, sort_order LIMIT 1) AS image,
           (SELECT count(*)::int FROM product_images i WHERE i.product_id = p.id) AS images
    FROM products p JOIN product_categories c ON c.slug = p.category_slug
    ${cond}
    ORDER BY p.sort_order, p.name`;

  const toggle = (id: string, flag: string, value: boolean, label: string, on: boolean) => (
    <ActionForm action={setProductFlag}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="flag" value={flag} />
      <input type="hidden" name="value" value={String(!value)} />
      <button className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${on ? 'bg-[#1B3D2F]/10 text-[#1B3D2F]' : 'bg-stone-100 text-stone-500'} hover:ring-1 hover:ring-[#1B3D2F]/30`} title={`Toggle ${label}`}>
        {label}: {on ? 'On' : 'Off'}
      </button>
    </ActionForm>
  );

  return (
    <>
      <PageHeader
        title="Products"
        description="Prices here are the single source for the store and for checkout. Past orders keep the price they were paid at."
        actions={<><Link href="/admin/products/categories" className={btn.secondary}>Categories</Link><Link href="/admin/products/new" className={btn.primary}><Plus className="h-4 w-4" /> New product</Link></>}
      />
      {sp.deleted && <p className="mb-4 rounded-lg bg-[#1B3D2F]/[0.06] px-4 py-2.5 text-[13px] text-[#1B3D2F]">Product deleted.</p>}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {(Object.keys(VIEWS) as (keyof typeof VIEWS)[]).map((v) => (
          <Link key={v} href={`/admin/products?view=${v}`} className={`rounded-full border px-3 py-1 text-[12px] font-medium ${v === view ? 'border-[#1B3D2F] bg-[#1B3D2F] text-white' : 'border-[#DDD5C3] bg-white text-foreground-muted'}`}>
            {VIEWS[v]}
          </Link>
        ))}
      </div>
      {rows.length === 0 ? (
        <EmptyState title="No products here" action={<Link href="/admin/products/new" className={btn.primary}>Add a product</Link>} />
      ) : (
        <div className={table.wrap}>
          <table className={table.table}>
            <thead><tr>{['', 'Product', 'Price', 'Status', 'Visibility', 'Order'].map((h, i) => <th key={i} className={table.th}>{h}</th>)}</tr></thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className={table.row}>
                  <td className={`${table.td} w-16`}>
                    <div className="h-12 w-12 overflow-hidden rounded-lg bg-[#F6F3EC]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {p.image && <img src={p.image} alt="" className="h-full w-full object-cover" loading="lazy" />}
                    </div>
                  </td>
                  <td className={table.td}>
                    <Link href={`/admin/products/${p.id}`} className="font-semibold text-[#1B3D2F] hover:underline">{p.name}</Link>
                    <p className="text-[12px] text-foreground-muted">{p.category} · /{p.slug} · {p.images} image{p.images === 1 ? '' : 's'}</p>
                  </td>
                  <td className={`${table.td} tabular-nums`}>
                    <span className="font-semibold">{inrRupees(p.price)}</span>
                    {p.compare_price && <span className="ml-1 text-[12px] text-foreground-subtle line-through">{inrRupees(p.compare_price)}</span>}
                  </td>
                  <td className={table.td}>
                    {p.archived_at ? <Badge value="cancelled" label="archived" /> : p.test_only ? <Badge value="test" label="test only" /> : <Badge value={p.is_active ? 'active' : 'inactive'} label={p.is_active ? 'live' : 'hidden'} />}
                    {!p.in_stock && <div className="mt-1"><Badge value="failed" label="out of stock" /></div>}
                    {p.stock_quantity !== null && <p className="mt-1 text-[11.5px] text-foreground-subtle">Stock: {p.stock_quantity}</p>}
                  </td>
                  <td className={table.td}>
                    {!p.archived_at && !p.test_only && (
                      <div className="flex flex-wrap gap-1">
                        {toggle(p.id, 'is_active', p.is_active, 'Live', p.is_active)}
                        {toggle(p.id, 'featured', p.featured, 'Featured', p.featured)}
                        {toggle(p.id, 'in_stock', p.in_stock, 'In stock', p.in_stock)}
                      </div>
                    )}
                  </td>
                  <td className={table.td}>
                    {!p.archived_at && view !== 'archived' && (
                      <div className="flex gap-0.5">
                        {(['up', 'down'] as const).map((dir) => (
                          <ActionForm key={dir} action={moveProduct}>
                            <input type="hidden" name="id" value={p.id} />
                            <input type="hidden" name="dir" value={dir} />
                            <button className={btn.ghost} aria-label={`Move ${p.name} ${dir}`}>{dir === 'up' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}</button>
                          </ActionForm>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
