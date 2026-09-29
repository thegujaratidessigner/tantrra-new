'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Check } from 'lucide-react';
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
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-[#E8E2D4] bg-white transition-all duration-300 hover:border-gold/30 hover:shadow-[0_8px_30px_rgba(33,29,24,0.08)] hover:-translate-y-0.5">
        {/* Image stage — contain, not cover */}
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#F8F5EE]">
            {heroImage ? (
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-contain p-3 transition-transform duration-600 group-hover:scale-[1.04] sm:p-4"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-sm text-foreground-subtle">No image</span>
              </div>
            )}
          </div>
        </Link>

        {/* Info area */}
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-gold-dark sm:text-[10px]">
            {category}
          </p>

          <Link href={`/products/${product.slug}`}>
            <h3 className="mt-0.5 font-heading text-[13px] font-semibold leading-snug text-foreground transition-colors group-hover:text-green sm:mt-1 sm:text-[16px]">
              {product.name}
            </h3>
          </Link>

          <p className="mt-0.5 line-clamp-1 flex-1 text-[10px] leading-snug text-foreground-muted sm:mt-1 sm:line-clamp-2 sm:text-[12px] sm:leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Price + Add to Cart */}
          <div className="mt-auto flex items-center justify-between gap-1 border-t border-border/40 pt-2.5 sm:gap-2 sm:pt-3">
            <p className="text-[13px] font-bold text-green sm:text-[16px]">
              {formatPrice(product.price)}
            </p>

            <button
              onClick={handleAddToCart}
              disabled={added}
              className={`flex items-center justify-center gap-1 rounded-md p-2 text-[10px] font-semibold tracking-wide transition-all duration-200 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[11px] ${
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
