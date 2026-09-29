'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { getActiveConsultations } from '@/data/consultations';

import { Star, Eye, Sparkles, BookOpen, Heart, ArrowRight } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  tarot: Star,
  'akashik-reading': Eye,
  'seven-chakra-healing': Sparkles,
  'past-life-karma-healing': Heart,
  'meditation-guidance': BookOpen,
  default: Sparkles,
};

function SectionBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(122,155,104,0.06),transparent_65%)]" />
      {/* Ornamental top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7A9B68]/15 to-transparent" />
    </div>
  );
}

function GoldDivider() {
  return (
    <div className="mx-auto flex items-center gap-2.5" aria-hidden="true">
      <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold/30" />
      <svg width="8" height="8" viewBox="0 0 8 8" className="text-gold/40">
        <path d="M4 0L7.5 4L4 8L0.5 4Z" fill="currentColor" />
      </svg>
      <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold/30" />
    </div>
  );
}

export function ConsultationSection() {
  const consultations = getActiveConsultations();
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1 },
    [Autoplay({ delay: 3500, stopOnInteraction: true, stopOnMouseEnter: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  const cards = consultations.map((service) => {
    const Icon = iconMap[service.slug] || iconMap.default;
    return (
      <Link
        key={service.id}
        href={`/consultations/${service.slug}`}
        className="group flex h-full flex-col rounded-xl border border-[#E8E2D4] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold/25 hover:shadow-[0_8px_30px_rgba(33,29,24,0.08)] sm:p-6"
      >
        {/* Icon medallion */}
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-gold/8 text-gold-dark transition-all duration-300 group-hover:bg-gold group-hover:text-white">
          <Icon className="h-5 w-5" strokeWidth={1.6} />
        </div>
        <h3 className="font-heading text-[16px] font-semibold leading-tight text-foreground sm:text-[17px]">
          {service.name}
        </h3>
        <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-foreground-muted line-clamp-3">
          {service.shortDescription}
        </p>
        <div className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-semibold text-gold-dark transition-colors group-hover:text-gold">
          Learn More
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </Link>
    );
  });

  return (
    <section className="relative overflow-hidden bg-[#F4F0E6] py-12 sm:py-14 lg:py-16">
      <SectionBackground />

      <Container className="relative">
        <SectionHeading
          label="Spiritual Guidance"
          title="Guidance for the Questions That Matter"
          description="Personal consultations with Tripuransh — Tarot, Akashik Reading, Chakra Healing, Astrology, and more."
        />

        <div className="mt-2">
          <GoldDivider />
        </div>

        {/* Desktop: 4-column grid */}
        <div className="mt-10 hidden lg:grid lg:grid-cols-4 lg:gap-5">
          {consultations.map((service, i) => {
            const Icon = iconMap[service.slug] || iconMap.default;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link
                  href={`/consultations/${service.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-[#E8E2D4] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold/25 hover:shadow-[0_8px_30px_rgba(33,29,24,0.08)]"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-gold/8 text-gold-dark transition-all duration-300 group-hover:bg-gold group-hover:text-white">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </div>
                  <h3 className="font-heading text-[17px] font-semibold leading-tight text-foreground">
                    {service.name}
                  </h3>
                  <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-foreground-muted line-clamp-3">
                    {service.shortDescription}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1 text-[12.5px] font-semibold text-gold-dark transition-colors group-hover:text-gold">
                    Learn More
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile/Tablet: carousel */}
        <div className="mt-10 lg:hidden">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {consultations.map((service) => {
                const Icon = iconMap[service.slug] || iconMap.default;
                return (
                  <div
                    key={service.id}
                    className="flex-[0_0_78%] px-2 sm:flex-[0_0_44%]"
                  >
                    <Link
                      href={`/consultations/${service.slug}`}
                      className="group flex h-full flex-col rounded-xl border border-[#E8E2D4] bg-white p-4 transition-all duration-300 hover:border-gold/25 hover:shadow-md sm:p-5"
                    >
                      <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-gold/8 text-gold-dark transition-colors group-hover:bg-gold group-hover:text-white">
                        <Icon className="h-4.5 w-4.5" strokeWidth={1.6} />
                      </div>
                      <h3 className="font-heading text-[15px] font-semibold leading-tight text-foreground">
                        {service.name}
                      </h3>
                      <p className="mt-1 flex-1 text-[12px] leading-relaxed text-foreground-muted line-clamp-2">
                        {service.shortDescription}
                      </p>
                      <div className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-gold-dark">
                        Learn More
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots */}
          <div className="mt-5 flex justify-center gap-1.5">
            {consultations.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === selectedIndex ? 'w-6 bg-gold' : 'w-1.5 bg-foreground/10'
                }`}
                aria-label={`Go to service ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Button href="/consultations" variant="outline" size="md" withArrow>
            Explore All Consultations
          </Button>
        </div>
      </Container>
    </section>
  );
}
