import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/product/ProductCard';
import { PageBanner } from '@/components/ui/PageBanner';
import { getActiveProducts, getProductsByCategory, getProductCategories } from '@/lib/server/catalog';
import { EmptyCategory } from '@/components/product/EmptyCategory';


export const metadata: Metadata = {
  title: 'Sacred Products',
  description:
    'Explore spiritually prepared Kavach, sacred Potli, Yantra, and spiritual items — each consecrated with traditional rituals and devoted intention.',
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [products, categories] = await Promise.all([
    category ? getProductsByCategory(category) : getActiveProducts(),
    getProductCategories(),
  ]);

  const cat = category ? categories.find((c) => c.slug === category) : undefined;
  const meta = cat?.title ? { label: cat.name, title: cat.title, description: cat.description ?? '' } : undefined;
  const heroLabel = meta?.label || 'Sacred Collection';
  const heroTitle = meta?.title || 'Explore Our Sacred Products';
  const heroDesc =
    meta?.description ||
    'Each item is spiritually prepared through traditional rituals, sacred recitations, and devoted intention to support your journey.';

  return (
    <>
      {/* Hero banner — video with image fallback */}
      <PageBanner placement="page_hero_products" />

      <section className="py-10 sm:py-12 lg:py-16">
        <Container>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <EmptyCategory category={category} />
          )}
        </Container>
      </section>
    </>
  );
}
