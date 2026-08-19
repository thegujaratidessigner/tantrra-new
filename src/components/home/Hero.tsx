'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { getFeaturedProducts } from '@/data/products';
import { formatPrice } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Lock, HeartHandshake } from 'lucide-react';

const products = getFeaturedProducts();

const trustItems = [
  { icon: ShieldCheck, label: 'Spiritually Prepared' },
  { icon: Sparkles, label: 'Energised & Activated' },
  { icon: HeartHandshake, label: 'Guided by Tripuransh' },
  { icon: Lock, label: 'Secure & Confidential' },
];

export function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1 },
    [Autoplay({ delay: 3500, stopOnInteraction: true, stopOnMouseEnter: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  return (
    <section className="relative overflow-hidden bg-foreground">
      {/* Layered sacred ambient background */}
      <div className="absolute inset-0">
        {/* Warm gold bloom around product area */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_40%,rgba(185,144,69,0.15),transparent_55%)]" />
        {/* Maroon ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_60%,rgba(116,28,44,0.08),transparent_50%)]" />
        {/* Diya-like warm highlight at bottom */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(185,144,69,0.08),transparent_40%)]" />

        {/* Sacred yantra/mandala geometry pattern */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="sacred-yantra" width="200" height="200" patternUnits="userSpaceOnUse">
              {/* Outer circle */}
              <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(185,144,69,1)" strokeWidth="0.4" />
              {/* Inner circle */}
              <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(185,144,69,1)" strokeWidth="0.4" />
              {/* Core circle */}
              <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(185,144,69,1)" strokeWidth="0.3" />
              {/* Lotus petal arcs */}
              <path d="M100 10 Q130 50 100 100 Q70 50 100 10" fill="none" stroke="rgba(185,144,69,1)" strokeWidth="0.3" />
              <path d="M190 100 Q150 130 100 100 Q150 70 190 100" fill="none" stroke="rgba(185,144,69,1)" strokeWidth="0.3" />
              <path d="M100 190 Q70 150 100 100 Q130 150 100 190" fill="none" stroke="rgba(185,144,69,1)" strokeWidth="0.3" />
              <path d="M10 100 Q50 70 100 100 Q50 130 10 100" fill="none" stroke="rgba(185,144,69,1)" strokeWidth="0.3" />
              {/* Diagonal cross */}
              <line x1="30" y1="30" x2="170" y2="170" stroke="rgba(185,144,69,1)" strokeWidth="0.2" />
              <line x1="170" y1="30" x2="30" y2="170" stroke="rgba(185,144,69,1)" strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sacred-yantra)" />
        </svg>

        {/* Subtle smoke/mist texture at top */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/[0.02] to-transparent" />
      </div>

      <Container className="relative">
        {/* Desktop: 58% left / 35% right with negative space */}
        <div className="grid items-center gap-6 py-10 sm:py-14 lg:grid-cols-[1fr_38%] lg:gap-8 lg:py-16 xl:gap-12 xl:py-20">
          {/* Left: Text Content — 58-62% */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="text-center lg:text-left"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-light sm:text-xs"
            >
              Sacred Protection &middot; Guided with Purpose
            </motion.p>

            <h1 className="font-heading text-[clamp(2.25rem,4.5vw,4rem)] font-semibold leading-[1.08] text-white">
              Begin Your{' '}
              <span className="gold-gradient">Sacred</span>
              <br className="hidden sm:block" />
              {' '}Journey
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mx-auto mt-5 max-w-[440px] text-[15px] leading-relaxed text-white/60 lg:mx-0"
            >
              Discover spiritually prepared Kavach, sacred offerings, personalised
              guidance and Sadhana experiences designed to support your spiritual
              journey.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start"
            >
              <Button href="/products" variant="gold" size="lg" withArrow>
                Explore Sacred Products
              </Button>
              <Button href="/consultations" variant="outline" size="md" className="border-white/15 text-white hover:bg-white/8">
                Book a Consultation
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-8 hidden gap-x-5 gap-y-2 lg:flex lg:flex-wrap"
            >
              {trustItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <item.icon className="h-3.5 w-3.5 text-gold/60" />
                  <span className="text-[11px] font-medium tracking-wide text-white/40">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Compact Product Carousel — 35-38% */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            {/* Gold glow behind carousel */}
            <div className="pointer-events-none absolute -inset-8 hidden rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(185,144,69,0.08),transparent_70%)] lg:block" />

            <div ref={emblaRef} className="embla overflow-hidden rounded-lg">
              <div className="embla__container">
                {products.map((product, i) => {
                  const heroImg = product.images.find((img) => img.type === 'hero');
                  if (!heroImg) return null;
                  return (
                    <div
                      key={product.id}
                      className="embla__slide flex-[0_0_70%] pr-3 sm:flex-[0_0_48%] lg:flex-[0_0_50%] lg:pr-3"
                    >
                      <Link href={`/products/${product.slug}`} className="group block">
                        <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-white/10 shadow-lg shadow-black/20">
                          <Image
                            src={heroImg.src}
                            alt={heroImg.alt}
                            fill
                            sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 20vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-3.5">
                            <p className="text-[9px] uppercase tracking-[0.2em] text-gold-light/70">
                              {product.purpose.split(',')[0]}
                            </p>
                            <h3 className="mt-0.5 font-heading text-base font-semibold leading-tight text-white lg:text-[15px]">
                              {product.name}
                            </h3>
                            <p className="mt-1 text-[13px] font-semibold text-gold-light">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Carousel controls */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-1.5">
                {products.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => emblaApi?.scrollTo(i)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === selectedIndex ? 'w-5 bg-gold' : 'w-1.5 bg-white/20'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={scrollPrev}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/12 text-white/50 transition-colors hover:border-white/25 hover:text-white"
                  aria-label="Previous product"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={scrollNext}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/12 text-white/50 transition-colors hover:border-white/25 hover:text-white"
                  aria-label="Next product"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-x-4 gap-y-2 pb-8 lg:hidden"
        >
          {trustItems.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <item.icon className="h-3 w-3 text-gold/60" />
              <span className="text-[10px] font-medium tracking-wide text-white/40">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
