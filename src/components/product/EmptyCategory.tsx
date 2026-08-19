import Link from 'next/link';
import { Package, ArrowRight } from 'lucide-react';

const categoryNames: Record<string, string> = {
  potli: 'Sacred Potli',
  bracelet: 'Sacred Bracelets',
  mala: 'Sadhana Materials',
  'sadhana-material': 'Sadhana Materials',
  candle: 'Sacred Candles',
  oil: 'Sacred Oils',
  frame: 'Sacred Frames',
};

export function EmptyCategory({ category }: { category?: string }) {
  const name = category ? categoryNames[category] || 'This collection' : 'Products';

  return (
    <div className="mx-auto max-w-lg py-16 text-center sm:py-20">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/8">
        <Package className="h-7 w-7 text-gold-dark" />
      </div>

      <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
        Sacred Offerings Coming Soon
      </h2>

      <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-foreground-muted">
        Our {name.toLowerCase()} collection is being thoughtfully prepared with
        devotion and spiritual intention. Each item will be ritually consecrated
        before becoming available.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/products?category=kavach"
          className="inline-flex items-center gap-2 rounded-sm bg-green px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-green-dark"
        >
          Explore Kavach
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-sm border border-foreground/15 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
        >
          View All Products
        </Link>
      </div>
    </div>
  );
}
