'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/cart-store';

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const heroImage = product.images.find((i) => i.type === 'hero') || product.images[0];
  const category = product.category?.replace(/-/g, ' ') || 'Sacred';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      quantity: 1,
      priceSnapshot: product.price,
      energization: false,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group"
    >
      <div className="overflow-hidden rounded-lg border border-border/60 bg-white transition-all duration-300 hover:border-gold/25 hover:shadow-md">
        {/* Image */}
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-[3/4] overflow-hidden bg-cream-dark">
            {heroImage && (
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-600 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        </Link>

        {/* Info area */}
        <div className="p-3.5 sm:p-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gold-dark">
            {category}
          </p>

          <Link href={`/products/${product.slug}`}>
            <h3 className="mt-1 font-heading text-[16px] font-semibold leading-snug text-foreground transition-colors group-hover:text-green sm:text-[17px]">
              {product.name}
            </h3>
          </Link>

          <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-foreground-muted">
            {product.shortDescription}
          </p>

          {/* Price + Add to Cart */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <p className="text-[16px] font-bold text-green">
              {formatPrice(product.price)}
            </p>

            <button
              onClick={handleAddToCart}
              disabled={added}
              className={`flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-[11px] font-semibold tracking-wide transition-all duration-200 ${
                added
                  ? 'bg-green/10 text-green'
                  : 'bg-green text-white hover:bg-green-dark active:scale-[0.97]'
              }`}
              aria-label={added ? 'Added to cart' : `Add ${product.name} to cart`}
            >
              <AnimatePresence mode="wait">
                {added ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1"
                  >
                    <Check className="h-3 w-3" />
                    Added
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1"
                  >
                    <ShoppingBag className="h-3 w-3" />
                    Add to Cart
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="mt-2.5 flex items-center gap-1 text-[11px] font-medium text-foreground-subtle transition-colors hover:text-gold-dark"
          >
            View Details
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
