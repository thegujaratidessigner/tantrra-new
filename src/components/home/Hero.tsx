'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { getFeaturedProducts } from '@/data/products';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/lib/cart-store';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Check,
  ShieldCheck,
  Sparkles,
  Lock,
  HeartHandshake,
  ArrowRight,
} from 'lucide-react';

const products = getFeaturedProducts();

const trustItems = [
  { icon: ShieldCheck, label: 'Ritually Prepared' },
  { icon: Sparkles, label: 'Energised & Activated' },
  { icon: HeartHandshake, label: 'Guided by Tripuransh' },
  { icon: Lock, label: 'Secure & Confidential' },
];

export function Hero() {
  const addItem = useCartStore((s) => s.addItem);
  const [addedId, setAddedId] = useState<string | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1 },
    [Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  const handleAddToCart = (e: React.MouseEvent, product: (typeof products)[0]) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      quantity: 1,
      priceSnapshot: product.price,
      energization: false,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <section className="relative overflow-hidden bg-foreground">
      {/* Hero background image */}
      <div className="absolute inset-0">
        <Image
          src="/hero-banner.png"
          alt=""
          fill
          priority
          className="object-cover object-center sm:object-[center_85%] lg:object-[center_70%]"
          sizes="100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent lg:from-black/65 lg:via-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
      </div>

      <Container className="relative">
        {/* Mobile: flex-row (side-by-side like desktop). sm+: flex-col with absolute carousel (unchanged) */}
        <div className="relative flex min-h-[48vh] flex-row items-center gap-2 py-4 sm:min-h-[88vh] sm:flex-col sm:items-stretch sm:justify-center sm:gap-0 sm:pt-12 sm:pb-[210px] lg:min-h-[640px] lg:py-16 xl:min-h-[680px] xl:py-20">
          {/* Text content — left 50% on mobile, full-width on sm+ */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="w-1/2 shrink-0 text-left sm:w-auto sm:max-w-xl lg:max-w-lg xl:max-w-xl"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-1.5 text-[7px] font-semibold uppercase tracking-[0.15em] text-gold-light sm:mb-5 sm:text-xs sm:tracking-[0.3em]"
            >
              Sacred Protection &middot; Guided by Tradition
            </motion.p>

            <h1 className="font-heading text-[clamp(14px,4.5vw,18px)] font-semibold leading-[1.1] text-white sm:text-[clamp(2.5rem,5vw,4.25rem)] sm:leading-[1.05]">
              Begin Your
              <br />
              <span className="gold-gradient">Sacred Journey</span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-1.5 line-clamp-3 text-[8px] leading-tight text-white/55 sm:mt-5 sm:max-w-[460px] sm:text-[15px] sm:leading-relaxed sm:text-white/65 lg:text-base"
            >
              Authentic Kavach, sacred offerings and personalised spiritual
              guidance — prepared with devotion, empowered by rituals, and
              guided by ancient wisdom.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
            >
              {/* Mobile compact CTAs */}
              <div className="mt-2.5 flex flex-col gap-1.5 sm:hidden">
                <Link
                  href="/products"
                  className="inline-flex w-fit items-center gap-1 rounded-sm bg-gold px-2.5 py-1 text-[8px] font-semibold tracking-wide text-white"
                >
                  Explore Products
                  <ArrowRight className="h-2.5 w-2.5" />
                </Link>
                <Link
                  href="/consultations"
                  className="w-fit text-[7px] font-medium text-white/50 underline underline-offset-2"
                >
                  Book Consultation
                </Link>
              </div>
              {/* Tablet/Desktop CTAs — unchanged */}
              <div className="mt-8 hidden gap-3 sm:flex sm:flex-row">
                <Button href="/products" variant="gold" size="lg" withArrow>
                  Explore Sacred Products
                </Button>
                <Button
                  href="/consultations"
                  variant="outline"
                  size="md"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Book a Consultation
                </Button>
              </div>
            </motion.div>

            {/* Trust indicators — scaled down on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-2 flex flex-wrap gap-x-2 gap-y-1 sm:mt-8 sm:gap-x-5 sm:gap-y-2 lg:mt-10"
            >
              {trustItems.map((item) => (
                <div key={item.label} className="flex items-center gap-1 sm:gap-2">
                  <item.icon className="h-2 w-2 text-gold/70 sm:h-3.5 sm:w-3.5" />
                  <span className="text-[6px] font-medium tracking-normal text-white/40 sm:text-[11px] sm:tracking-wide sm:text-white/45">
                    {item.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Kavach Carousel — right 50% in-flow on mobile, absolute overlay on sm+ (unchanged) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative w-1/2 shrink-0 self-end sm:absolute sm:bottom-4 sm:right-4 sm:w-[340px] md:w-[380px] lg:bottom-8 lg:right-8 lg:w-[440px] xl:bottom-10 xl:right-12 xl:w-[480px]"
          >
            <div className="rounded-lg bg-black/40 p-2 backdrop-blur-md border border-white/8 sm:rounded-xl sm:p-4">
              {/* Carousel header */}
              <div className="mb-2 flex items-center justify-between sm:mb-3">
                <h3 className="text-[7px] font-semibold uppercase tracking-[0.1em] text-gold-light/80 sm:text-[11px] sm:tracking-[0.15em]">
                  Sacred Kavach Collection
                </h3>
                <Link
                  href="/products"
                  className="hidden items-center gap-1 text-[10px] font-medium text-white/50 transition-colors hover:text-gold-light sm:flex sm:text-[11px]"
                >
                  View All
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Product slides */}
              <div ref={emblaRef} className="embla overflow-hidden rounded-lg">
                <div className="embla__container">
                  {products.map((product) => {
                    const heroImg = product.images.find(
                      (img) => img.type === 'hero'
                    );
                    if (!heroImg) return null;
                    const isAdded = addedId === product.id;

                    return (
                      <div
                        key={product.id}
                        className="embla__slide flex-[0_0_44%] pr-1.5 sm:flex-[0_0_36%] sm:pr-2.5 lg:flex-[0_0_38%]"
                      >
                        <Link
                          href={`/products/${product.slug}`}
                          className="group block"
                        >
                          <div className="relative aspect-[3/4] overflow-hidden rounded border border-white/10 sm:rounded-lg">
                            <Image
                              src={heroImg.src}
                              alt={heroImg.alt}
                              fill
                              sizes="(max-width: 640px) 22vw, (max-width: 1024px) 42vw, 180px"
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-1 sm:p-2.5">
                              <h4 className="line-clamp-1 font-heading text-[7px] font-semibold leading-tight text-white sm:text-sm">
                                {product.name}
                              </h4>
                              <div className="mt-0.5 flex items-center justify-between gap-1 sm:mt-1.5 sm:gap-1.5">
                                <span className="text-[7px] font-semibold text-gold-light sm:text-[13px]">
                                  {formatPrice(product.price)}
                                </span>
                                <button
                                  onClick={(e) => handleAddToCart(e, product)}
                                  disabled={isAdded}
                                  className={`flex h-4 w-4 items-center justify-center rounded-full transition-all duration-200 sm:h-7 sm:w-7 ${
                                    isAdded
                                      ? 'bg-green/80 text-white'
                                      : 'bg-white/15 text-white hover:bg-gold hover:text-white'
                                  }`}
                                  aria-label={
                                    isAdded
                                      ? 'Added'
                                      : `Add ${product.name} to cart`
                                  }
                                >
                                  <AnimatePresence mode="wait">
                                    {isAdded ? (
                                      <motion.span
                                        key="check"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                      >
                                        <Check className="h-2 w-2 sm:h-3.5 sm:w-3.5" />
                                      </motion.span>
                                    ) : (
                                      <motion.span
                                        key="bag"
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0.8 }}
                                      >
                                        <ShoppingBag className="h-2 w-2 sm:h-3.5 sm:w-3.5" />
                                      </motion.span>
                                    )}
                                  </AnimatePresence>
                                </button>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Carousel controls */}
              <div className="mt-1.5 flex items-center justify-between sm:mt-2.5">
                <div className="flex gap-1 sm:gap-1.5">
                  {products.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => emblaApi?.scrollTo(i)}
                      className={`h-[2px] rounded-full transition-all duration-300 sm:h-[3px] ${
                        i === selectedIndex
                          ? 'w-3 bg-gold sm:w-5'
                          : 'w-1.5 bg-white/20 sm:w-2'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
                <div className="flex gap-1 sm:gap-1.5">
                  <button
                    onClick={scrollPrev}
                    className="flex h-5 w-5 items-center justify-center rounded-full border border-white/15 text-white/50 transition-colors hover:border-gold/40 hover:text-gold-light sm:h-7 sm:w-7"
                    aria-label="Previous product"
                  >
                    <ChevronLeft className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                  </button>
                  <button
                    onClick={scrollNext}
                    className="flex h-5 w-5 items-center justify-center rounded-full border border-white/15 text-white/50 transition-colors hover:border-gold/40 hover:text-gold-light sm:h-7 sm:w-7"
                    aria-label="Next product"
                  >
                    <ChevronRight className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
