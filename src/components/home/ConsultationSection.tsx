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
      <div className="absolute left-1/2 top-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(184,138,59,0.06),transparent_65%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </div>
  );
}

function GoldDivider() {
  return (
    <div className="mx-auto flex items-center gap-2.5" aria-hidden="true">
      <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold/40" />
      <svg width="8" height="8" viewBox="0 0 8 8" className="text-gold/50">
        <path d="M4 0L7.5 4L4 8L0.5 4Z" fill="currentColor" />
      </svg>
      <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold/40" />
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
    <section className="relative overflow-hidden bg-gradient-to-b from-[#173D32] to-[#1B3D2F] py-14 sm:py-16 lg:py-20">
      <SectionBackground />

      <Container className="relative">
        <SectionHeading
          label="Tarot & Consultation"
          title="Guidance for the Questions That Matter"
          description="Personal consultations with Tripuransh — Tarot, Akashik Reading, Chakra Healing, and more."
          className="[&_h2]:text-white [&_p]:text-white/60 [&>p:first-child]:text-gold-light"
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
                  className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.07] p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/30 hover:bg-white/[0.12] hover:shadow-[0_12px_36px_rgba(0,0,0,0.25)]"
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/0 to-transparent transition-all duration-300 group-hover:via-gold/80" />
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold-light ring-1 ring-gold/20 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-gold group-hover:to-[#A07932] group-hover:text-white group-hover:ring-gold/30 group-hover:shadow-md">
                    <Icon className="h-5 w-5" strokeWidth={1.6} />
                  </div>
                  <h3 className="font-heading text-[17px] font-semibold leading-tight text-white">
                    {service.name}
                  </h3>
                  <p className="mt-2 flex-1 text-[12.5px] leading-relaxed text-white/55 line-clamp-3">
                    {service.shortDescription}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-gold-light transition-colors group-hover:text-gold">
                    Learn More
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
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
                      className="group flex h-full flex-col rounded-xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur-sm transition-all duration-300 hover:border-gold/25 hover:bg-white/[0.12] sm:p-5"
                    >
                      <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold-light transition-colors group-hover:bg-gold group-hover:text-white">
                        <Icon className="h-4.5 w-4.5" strokeWidth={1.6} />
                      </div>
                      <h3 className="font-heading text-[15px] font-semibold leading-tight text-white">
                        {service.name}
                      </h3>
                      <p className="mt-1 flex-1 text-[12px] leading-relaxed text-white/55 line-clamp-2">
                        {service.shortDescription}
                      </p>
                      <div className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-gold-light">
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
                  i === selectedIndex ? 'w-6 bg-gold' : 'w-1.5 bg-white/20'
                }`}
                aria-label={`Go to service ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Button href="/consultations" variant="outline" size="md" withArrow className="border-white/20 text-white hover:bg-white/10">
            Explore All Consultations
          </Button>
        </div>
      </Container>
    </section>
  );
}
