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
  const heroImage =
    product.images.find((i) => i.type === 'hero') || product.images[0];
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
      className="group h-full"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border/60 bg-white transition-all duration-300 hover:border-gold/25 hover:shadow-lg hover:-translate-y-0.5">
        {/* Image */}
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-[3/4] overflow-hidden bg-cream-dark">
            {heroImage ? (
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-sm text-foreground-subtle">No image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        </Link>

        {/* Info area */}
        <div className="flex flex-1 flex-col p-2.5 sm:p-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-gold-dark sm:text-[10px]">
            {category}
          </p>

          <Link href={`/products/${product.slug}`}>
            <h3 className="mt-0.5 font-heading text-[13px] font-semibold leading-snug text-foreground transition-colors group-hover:text-green sm:mt-1 sm:text-[17px]">
              {product.name}
            </h3>
          </Link>

          <p className="mt-0.5 line-clamp-1 flex-1 text-[10px] leading-snug text-foreground-muted sm:mt-1 sm:line-clamp-2 sm:text-[12px] sm:leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Price + Add to Cart */}
          <div className="mt-2 flex items-center justify-between gap-1 border-t border-border/40 pt-2 sm:mt-3 sm:gap-2 sm:pt-3">
            <p className="text-[13px] font-bold text-green sm:text-[16px]">
              {formatPrice(product.price)}
            </p>

            <button
              onClick={handleAddToCart}
              disabled={added}
              className={`flex items-center justify-center gap-1 rounded-sm p-2 text-[10px] font-semibold tracking-wide transition-all duration-200 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[11px] ${
                added
                  ? 'bg-green/10 text-green'
                  : 'bg-green text-white hover:bg-green-dark active:scale-[0.97]'
              }`}
              aria-label={
                added ? 'Added to cart' : `Add ${product.name} to cart`
              }
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
                    <span className="hidden sm:inline">Added</span>
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
                    <span className="hidden sm:inline">Add</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
