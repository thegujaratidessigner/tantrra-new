import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ArrowUp, ChevronLeft } from 'lucide-react';
import { requireAdminPage } from '@/lib/server/admin-auth';
import { requireDb } from '@/lib/server/data';
import { Card, PageHeader, field } from '@/components/admin/ui';
import { ActionForm, SubmitButton, btn } from '@/components/admin/ActionForm';
import { moveCategory, saveCategory } from './actions';

export const metadata: Metadata = { title: 'Categories' };

interface Cat { slug: string; name: string; title: string | null; description: string | null; is_active: boolean; products: number }

function CategoryFields({ c }: { c?: Cat }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="block"><span className={field.label}>Name (menu label)</span><input name="name" defaultValue={c?.name ?? ''} maxLength={80} required className={field.input} /></label>
      <label className="block"><span className={field.label}>Page title</span><input name="title" defaultValue={c?.title ?? ''} maxLength={120} className={field.input} /></label>
      <label className="block sm:col-span-2"><span className={field.label}>Description</span><textarea name="description" defaultValue={c?.description ?? ''} rows={2} maxLength={400} className={field.input} /></label>
      <label className="flex items-center gap-2 text-[13px] font-medium"><input type="checkbox" name="is_active" defaultChecked={c?.is_active ?? true} className="h-4 w-4 accent-[#1B3D2F]" /> Visible</label>
    </div>
  );
}

export default async function CategoriesPage() {
  await requireAdminPage('catalog.manage');
  const cats = await requireDb()<Cat[]>`
    SELECT c.slug, c.name, c.title, c.description, c.is_active,
           (SELECT count(*)::int FROM products p WHERE p.category_slug = c.slug AND p.archived_at IS NULL) AS products
    FROM product_categories c ORDER BY c.sort_order, c.name`;

  return (
    <>
      <Link href="/admin/products" className="mb-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-foreground-muted hover:text-[#1B3D2F]">
        <ChevronLeft className="h-3.5 w-3.5" /> Products
      </Link>
      <PageHeader title="Categories" description="Used for /products?category=… pages. The slug is part of the link and cannot change." />
      <div className="space-y-3">
        {cats.map((c, i) => (
          <Card key={c.slug} title={`${c.name} · /${c.slug}`} actions={
            <span className="flex items-center gap-1 text-[12px] text-foreground-muted">
              {c.products} product{c.products === 1 ? '' : 's'}
              {i > 0 && <ActionForm action={moveCategory}><input type="hidden" name="slug" value={c.slug} /><input type="hidden" name="dir" value="up" /><button className={btn.ghost} aria-label={`Move ${c.name} up`}><ArrowUp className="h-3.5 w-3.5" /></button></ActionForm>}
              {i < cats.length - 1 && <ActionForm action={moveCategory}><input type="hidden" name="slug" value={c.slug} /><input type="hidden" name="dir" value="down" /><button className={btn.ghost} aria-label={`Move ${c.name} down`}><ArrowDown className="h-3.5 w-3.5" /></button></ActionForm>}
            </span>
          }>
            <ActionForm action={saveCategory} className="space-y-3">
              <input type="hidden" name="slug" value={c.slug} />
              <CategoryFields c={c} />
              <div className="flex justify-end"><SubmitButton variant="secondary">Save</SubmitButton></div>
            </ActionForm>
          </Card>
        ))}
        <Card title="Add category">
          <ActionForm action={saveCategory} resetOnSuccess className="space-y-3">
            <input type="hidden" name="new" value="1" />
            <label className="block"><span className={field.label}>Slug</span><input name="slug" required maxLength={60} pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="e.g. rudraksha" className={field.input} /></label>
            <CategoryFields />
            <div className="flex justify-end"><SubmitButton>Add category</SubmitButton></div>
          </ActionForm>
        </Card>
      </div>
    </>
  );
}
