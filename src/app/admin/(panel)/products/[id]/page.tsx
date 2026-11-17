import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowDown, ArrowUp, ChevronLeft, ExternalLink, Trash2 } from 'lucide-react';
import { requireAdminPage } from '@/lib/server/admin-auth';
import { requireDb } from '@/lib/server/data';
import { Card, PageHeader, field } from '@/components/admin/ui';
import { ActionForm, SubmitButton, btn } from '@/components/admin/ActionForm';
import { MediaField } from '@/components/admin/media/MediaField';
import { ProductForm, type ProductFormValues } from '../ProductForm';
import { addProductImage, archiveProduct, deleteProduct, updateProductImage } from '../actions';
import { TestPurchaseButton } from './TestPurchaseButton';

export const metadata: Metadata = { title: 'Edit product' };
const KINDS = [['hero', 'Main (hero)'], ['gallery', 'Gallery'], ['info', 'Information'], ['preparation', 'Preparation']] as const;

export default async function EditProductPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  await requireAdminPage('catalog.manage');
  const { id } = await params;
  const { created } = await searchParams;
  const sql = requireDb();
  const [[product], categories, images] = await Promise.all([
    sql<(ProductFormValues & { id: string; archived_at: Date | null })[]>`SELECT * FROM products WHERE id = ${id}`,
    sql<{ slug: string; name: string }[]>`SELECT slug, name FROM product_categories ORDER BY sort_order`,
    sql<{ id: string; src: string; alt: string; kind: string }[]>`SELECT id, src, alt, kind FROM product_images WHERE product_id = ${id} ORDER BY sort_order, created_at`,
  ]);
  if (!product) notFound();

  return (
    <>
      <Link href="/admin/products" className="mb-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-foreground-muted hover:text-[#1B3D2F]">
        <ChevronLeft className="h-3.5 w-3.5" /> Products
      </Link>
      <PageHeader
        title={product.name}
        description={product.archived_at ? 'Archived — not shown in the store.' : product.is_active ? 'Live on the website.' : 'Hidden from the website.'}
        actions={!product.archived_at && product.is_active ? (
          <a href={`/products/${product.slug}`} target="_blank" rel="noopener" className={btn.secondary}><ExternalLink className="h-4 w-4" /> View in store</a>
        ) : undefined}
      />
      {created && <p className="mb-4 rounded-lg bg-[#1B3D2F]/[0.06] px-4 py-2.5 text-[13px] text-[#1B3D2F]">Product created (hidden). Add images below, then switch it live.</p>}
      {product.test_only && !product.archived_at && (
        <TestPurchaseButton productId={product.id} name={product.name} price={Number(product.price)} image={images[0]?.src} />
      )}

      <Card title={`Images (${images.length})`} className="mb-4">
        {images.length > 0 && (
          <ul className="mb-4 space-y-3">
            {images.map((img, i) => (
              <li key={img.id} className="flex flex-col gap-3 rounded-xl border border-[#EFEADF] p-3 sm:flex-row sm:items-center">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-[#F6F3EC]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
                </div>
                <ActionForm action={updateProductImage} className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                  <input type="hidden" name="id" value={img.id} />
                  <input type="hidden" name="intent" value="save" />
                  <input name="alt" defaultValue={img.alt} placeholder="Alt text" className={`${field.input} mt-0`} aria-label="Alt text" />
                  <select name="kind" defaultValue={img.kind} className={`${field.input} mt-0 sm:w-40`} aria-label="Image type">
                    {KINDS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                  <SubmitButton variant="secondary">Save</SubmitButton>
                </ActionForm>
                <div className="flex gap-0.5">
                  {i > 0 && (
                    <ActionForm action={updateProductImage}><input type="hidden" name="id" value={img.id} /><input type="hidden" name="intent" value="up" />
                      <button className={btn.ghost} aria-label="Move up"><ArrowUp className="h-3.5 w-3.5" /></button></ActionForm>
                  )}
                  {i < images.length - 1 && (
                    <ActionForm action={updateProductImage}><input type="hidden" name="id" value={img.id} /><input type="hidden" name="intent" value="down" />
                      <button className={btn.ghost} aria-label="Move down"><ArrowDown className="h-3.5 w-3.5" /></button></ActionForm>
                  )}
                  <ActionForm action={updateProductImage} confirm="Remove this image from the product? The file stays in the media library.">
                    <input type="hidden" name="id" value={img.id} /><input type="hidden" name="intent" value="remove" />
                    <button className={`${btn.ghost} text-[#B5342E]`} aria-label="Remove image"><Trash2 className="h-3.5 w-3.5" /></button>
                  </ActionForm>
                </div>
              </li>
            ))}
          </ul>
        )}
        <ActionForm action={addProductImage} resetOnSuccess className="grid gap-3 rounded-xl bg-[#FAF7EF] p-3 sm:grid-cols-[1fr_200px_auto] sm:items-end">
          <input type="hidden" name="productId" value={product.id} />
          <MediaField name="src" label="Add image" accept="image" />
          <div className="space-y-2">
            <input name="alt" placeholder="Alt text" className={`${field.input} mt-0`} aria-label="New image alt text" />
            <select name="kind" defaultValue={images.length ? 'gallery' : 'hero'} className={`${field.input} mt-0`} aria-label="New image type">
              {KINDS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <SubmitButton>Add</SubmitButton>
        </ActionForm>
        <p className={field.help}>The first “Main (hero)” image is used on cards, cart and checkout.</p>
      </Card>

      <ProductForm values={product} categories={categories} />

      <Card title="Archive" className="mt-6 border-[#B5342E]/20">
        {product.archived_at ? (
          <div className="flex flex-wrap gap-2">
            <ActionForm action={archiveProduct}><input type="hidden" name="id" value={product.id} /><input type="hidden" name="restore" value="1" />
              <SubmitButton variant="secondary">Restore from archive</SubmitButton></ActionForm>
            <ActionForm action={deleteProduct} confirm="Permanently delete this product? Only possible if it was never ordered. This cannot be undone.">
              <input type="hidden" name="id" value={product.id} />
              <SubmitButton variant="danger">Delete permanently</SubmitButton>
            </ActionForm>
          </div>
        ) : (
          <ActionForm action={archiveProduct} confirm="Archive this product? It disappears from the store and checkout; past orders are unaffected.">
            <input type="hidden" name="id" value={product.id} />
            <p className="mb-3 text-[13px] text-foreground-muted">Archived products are removed from the store but kept for order history.</p>
            <SubmitButton variant="danger">Archive product</SubmitButton>
          </ActionForm>
        )}
      </Card>
    </>
  );
}
