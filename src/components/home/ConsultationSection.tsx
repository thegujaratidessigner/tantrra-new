'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { getActiveConsultations } from '@/data/consultations';
import { formatPrice } from '@/lib/utils';
import { Star, Eye, Sparkles, Hash, BookOpen, Pen, Heart, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  tarot: Star,
  'akashik-reading': Eye,
  'seven-chakra-healing': Sparkles,
  'past-life-karma-healing': Heart,
  astrology: Hash,
  numerology: Pen,
  'meditation-guidance': BookOpen,
  default: Sparkles,
};

export function ConsultationSection() {
  const consultations = getActiveConsultations();
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1 },
    [Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  return (
    <section className="bg-green-muted/40 py-10 sm:py-12 lg:py-16">
      <Container>
        <SectionHeading
          label="Spiritual Guidance"
          title="Guidance for the Questions That Matter"
          description="Personal consultations with Tripuransh — Tarot, Akashik Reading, Chakra Healing, Astrology, and more."
        />

        <div className="mt-10">
          <div ref={emblaRef} className="embla -mx-2 overflow-hidden">
            <div className="embla__container">
              {consultations.map((service) => {
                const Icon = iconMap[service.slug] || iconMap.default;
                const lowestPrice = service.packages.length > 0
                  ? Math.min(...service.packages.map(p => p.price))
                  : null;

                return (
                  <div
                    key={service.id}
                    className="embla__slide flex-[0_0_85%] px-2 sm:flex-[0_0_45%] lg:flex-[0_0_30%] xl:flex-[0_0_24%]"
                  >
                    <Link
                      href={`/consultations/${service.slug}`}
                      className="group flex h-full flex-col rounded-lg border border-border bg-white p-5 transition-all duration-300 hover:shadow-md hover:border-gold/25 hover:-translate-y-0.5"
                    >
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/8 text-gold-dark transition-colors group-hover:bg-gold group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-heading text-lg font-semibold text-foreground">
                        {service.name}
                      </h3>
                      <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-foreground-muted">
                        {service.shortDescription}
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        {lowestPrice && (
                          <span className="text-sm font-semibold text-gold-dark">
                            From {formatPrice(lowestPrice)}
                          </span>
                        )}
                        {service.turnaroundDays && (
                          <span className="flex items-center gap-1 text-[11px] text-foreground-subtle">
                            <Clock className="h-3 w-3" />
                            {service.turnaroundDays.replace('after payment', '').trim()}
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-5 flex items-center justify-between">
            <div className="flex gap-1.5">
              {consultations.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === selectedIndex ? 'w-5 bg-gold' : 'w-1.5 bg-foreground/10'
                  }`}
                  aria-label={`Go to service ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => emblaApi?.scrollPrev()}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground-subtle transition hover:border-foreground/20 hover:text-foreground"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => emblaApi?.scrollNext()}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground-subtle transition hover:border-foreground/20 hover:text-foreground"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button href="/consultations" variant="outline" size="md" withArrow>
            Explore All Consultations
          </Button>
        </div>
      </Container>
    </section>
  );
}
