'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { getFeaturedProducts } from '@/data/products';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/cart-store';
import { ShoppingBag, Check, ChevronLeft, ChevronRight } from 'lucide-react';

export function FeaturedProducts() {
  const products = getFeaturedProducts();
  const addItem = useCartStore((s) => s.addItem);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start', slidesToScroll: 1 });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const updateButtons = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', updateButtons);
    emblaApi.on('reInit', updateButtons);
    updateButtons();
  }, [emblaApi, updateButtons]);

  const handleAddToCart = (e: React.MouseEvent, product: typeof products[0]) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      quantity: 1,
      priceSnapshot: product.price,
      energization: false,
    });
    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);
  };

  return (
    <section className="py-10 sm:py-12 lg:py-16">
      <Container>
        {/* Section header with controls */}
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold sm:text-xs">
              Sacred Products
            </p>
            <h2 className="font-heading text-[clamp(1.75rem,3vw,2.75rem)] font-semibold leading-tight text-foreground">
              Consecrated for Your Journey
            </h2>
            {/* Gold divider */}
            <div className="mt-3 h-[1px] w-16 bg-gradient-to-r from-gold/60 to-transparent" />
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-foreground-muted">
              Each Kavach is spiritually prepared through traditional rituals, sacred
              recitations, and devoted intention.
            </p>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Button href="/products" variant="outline" size="sm" withArrow>
              View All Products
            </Button>
            <div className="flex gap-1.5">
              <button
                onClick={() => emblaApi?.scrollPrev()}
                disabled={!canScrollPrev}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground-subtle transition-all hover:border-foreground/20 hover:text-foreground disabled:opacity-25"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => emblaApi?.scrollNext()}
                disabled={!canScrollNext}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground-subtle transition-all hover:border-foreground/20 hover:text-foreground disabled:opacity-25"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Product carousel */}
        <div className="mt-8">
          <div ref={emblaRef} className="embla -mx-2 overflow-hidden">
            <div className="embla__container">
              {products.map((product, i) => {
                const heroImage = product.images.find((img) => img.type === 'hero') || product.images[0];
                const isAdded = addedIds.has(product.id);
                const category = product.category?.replace(/-/g, ' ') || 'Kavach';

                return (
                  <div
                    key={product.id}
                    className="embla__slide flex-[0_0_78%] px-2 sm:flex-[0_0_44%] lg:flex-[0_0_30%] xl:flex-[0_0_23.5%]"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      className="group"
                    >
                      {/* Card container */}
                      <div className="overflow-hidden rounded-lg border border-border/60 bg-white transition-all duration-300 hover:border-gold/25 hover:shadow-lg hover:-translate-y-0.5">
                        {/* Image */}
                        <Link href={`/products/${product.slug}`} className="block">
                          <div className="relative aspect-[3/4] overflow-hidden bg-cream-dark">
                            {heroImage && (
                              <Image
                                src={heroImage.src}
                                alt={heroImage.alt}
                                fill
                                sizes="(max-width: 640px) 78vw, (max-width: 1024px) 44vw, 23vw"
                                className="object-cover transition-transform duration-600 group-hover:scale-105"
                              />
                            )}
                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                          </div>
                        </Link>

                        {/* Info area */}
                        <div className="p-3.5 sm:p-4">
                          {/* Category */}
                          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gold-dark">
                            {category}
                          </p>

                          {/* Product name */}
                          <Link href={`/products/${product.slug}`}>
                            <h3 className="mt-1 font-heading text-[16px] font-semibold leading-snug text-foreground transition-colors group-hover:text-green sm:text-[17px]">
                              {product.name}
                            </h3>
                          </Link>

                          {/* Purpose / short description */}
                          <p className="mt-1 line-clamp-1 text-[12px] leading-relaxed text-foreground-muted">
                            {product.shortDescription}
                          </p>

                          {/* Price + Add to Cart row */}
                          <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/40 pt-3">
                            <p className="text-[16px] font-bold text-green">
                              {formatPrice(product.price)}
                            </p>

                            <button
                              onClick={(e) => handleAddToCart(e, product)}
                              disabled={isAdded}
                              className={`flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-[11px] font-semibold tracking-wide transition-all duration-200 ${
                                isAdded
                                  ? 'bg-green/10 text-green'
                                  : 'bg-green text-white hover:bg-green-dark active:scale-[0.97]'
                              }`}
                              aria-label={isAdded ? 'Added to cart' : `Add ${product.name} to cart`}
                            >
                              <AnimatePresence mode="wait">
                                {isAdded ? (
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

                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile: View All CTA */}
        <div className="mt-6 text-center lg:hidden">
          <Button href="/products" variant="outline" size="md" withArrow>
            View All Products
          </Button>
        </div>
      </Container>
    </section>
  );
}
