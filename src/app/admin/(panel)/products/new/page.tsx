import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { requireAdminPage } from '@/lib/server/admin-auth';
import { requireDb } from '@/lib/server/data';
import { PageHeader } from '@/components/admin/ui';
import { ProductForm } from '../ProductForm';

export const metadata: Metadata = { title: 'New product' };

export default async function NewProductPage() {
  await requireAdminPage('catalog.manage');
  const categories = await requireDb()<{ slug: string; name: string }[]>`SELECT slug, name FROM product_categories ORDER BY sort_order`;
  return (
    <>
      <Link href="/admin/products" className="mb-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-foreground-muted hover:text-[#1B3D2F]">
        <ChevronLeft className="h-3.5 w-3.5" /> Products
      </Link>
      <PageHeader title="New product" description="The product is created hidden. Add images on the next screen, then switch it live." />
      <ProductForm
        categories={categories}
        values={{
          name: '', slug: '', category_slug: categories[0]?.slug ?? '', short_description: '', long_description: '', purpose: '',
          price: '', compare_price: null, sku: null, weight: null, preparation_info: null, how_to_use: null, care_instructions: null,
          benefits: [], recommended_for: [], kit_includes: [], badge: null, featured: false, is_active: false, in_stock: true,
          stock_quantity: null, energization_available: false, whatsapp_customization: false, seo_title: null, seo_description: null,
        }}
      />
    </>
  );
}
