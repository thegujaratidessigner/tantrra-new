import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/ui/PageHero';
import { ProductCard } from '@/components/product/ProductCard';
import { getActiveProducts, getProductsByCategory } from '@/data/products';
import { EmptyCategory } from '@/components/product/EmptyCategory';

const categoryMeta: Record<string, { label: string; title: string; description: string }> = {
  kavach: {
    label: 'Sacred Kavach',
    title: 'Sacred Kavach Collection',
    description: 'Spiritually prepared protection Kavach — each consecrated through traditional rituals and sacred recitations.',
  },
  potli: {
    label: 'Sacred Potli',
    title: 'Sacred Potli Collection',
    description: 'Prosperity and intention offerings prepared with devoted purpose.',
  },
  bracelet: {
    label: 'Sacred Bracelets',
    title: 'Sacred Energy Bracelets',
    description: 'Energised bracelets for chakra alignment, planetary balance, and spiritual well-being.',
  },
  mala: {
    label: 'Sadhana Materials',
    title: 'Sadhana Materials & Tools',
    description: 'Mala, tools, and essentials for your daily spiritual practice.',
  },
};

export const metadata: Metadata = {
  title: 'Sacred Products',
  description:
    'Explore spiritually prepared Kavach, sacred bracelets, potli, and Sadhana materials — each consecrated with traditional rituals and devoted intention.',
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const products = category
    ? getProductsByCategory(category)
    : getActiveProducts();

  const meta = category ? categoryMeta[category] : undefined;
  const heroLabel = meta?.label || 'Sacred Collection';
  const heroTitle = meta?.title || 'Explore Our Sacred Products';
  const heroDesc =
    meta?.description ||
    'Each item is spiritually prepared through traditional rituals, sacred recitations, and devoted intention to support your journey.';

  return (
    <>
      <PageHero label={heroLabel} title={heroTitle} description={heroDesc} />

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
