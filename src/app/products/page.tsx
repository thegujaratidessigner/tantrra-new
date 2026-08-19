import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/ui/PageHero';
import { ProductCard } from '@/components/product/ProductCard';
import { getActiveProducts } from '@/data/products';

export const metadata: Metadata = {
  title: 'Sacred Products',
  description:
    'Explore spiritually prepared Kavach, sacred bracelets, potli, and Sadhana materials — each consecrated with traditional rituals and devoted intention.',
};

export default function ProductsPage() {
  const products = getActiveProducts();

  return (
    <>
      <PageHero
        label="Sacred Collection"
        title="Explore Our Sacred Products"
        description="Each item is spiritually prepared through traditional rituals, sacred recitations, and devoted intention to support your journey."
      />

      <section className="py-10 sm:py-12 lg:py-16">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="mt-16 text-center">
              <p className="text-[15px] text-foreground-muted">
                No products are currently available. Please check back soon.
              </p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
