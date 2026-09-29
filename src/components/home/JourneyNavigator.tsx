'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  ShieldCheck, Flame, Star, Sparkles, ArrowRight,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';

const ecosystemCards = [
  {
    title: 'Sacred Products',
    description:
      'Protection, prosperity and spiritual support through consecrated items.',
    href: '/products',
    icon: ShieldCheck,
    image: '/images/home/ecosystem-products.jpg',
    imageAlt: 'Sacred spiritual products — Kavach, Yantra, and ritual items',
    iconBg: '#1B3D2F',
  },
  {
    title: 'Chadava',
    description:
      'Sacred offerings — Deity Anushthan, Navagraha Poojan, Tithi Poojan and Daan Seva.',
    href: '/chadava',
    icon: Flame,
    image: '/images/home/ecosystem-puja.jpg',
    imageAlt: 'Traditional puja and havan ceremony',
    iconBg: '#7A2E3B',
  },
  {
    title: 'Consult',
    description:
      'Tarot, Akashic Reading, Chakra Healing and personalised spiritual guidance.',
    href: '/consultations',
    icon: Star,
    image: '/images/home/ecosystem-consultation.jpg',
    imageAlt: 'Spiritual consultation and guidance session',
    iconBg: '#2D5A3D',
  },
  {
    title: 'Puja',
    description:
      'Specialized Puja performed individually with your Name, Sankalp and Gotra.',
    href: '/puja',
    icon: Sparkles,
    image: '/images/home/ecosystem-tarot.jpg',
    imageAlt: 'Sacred puja and fire ritual ceremony',
    iconBg: '#B88A3B',
  },
];

function MandalaBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Radial warm glow */}
      <div className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(184,138,59,0.045),transparent_65%)]" />

      {/* Subtle mandala center */}
      <svg
        className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 opacity-[0.025]"
        viewBox="0 0 500 500"
        fill="none"
      >
        <circle cx="250" cy="250" r="240" stroke="#B88A3B" strokeWidth="0.5" />
        <circle cx="250" cy="250" r="200" stroke="#B88A3B" strokeWidth="0.4" />
        <circle cx="250" cy="250" r="160" stroke="#B88A3B" strokeWidth="0.3" />
        <circle cx="250" cy="250" r="120" stroke="#B88A3B" strokeWidth="0.3" />
        {/* Petal shapes */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <ellipse
            key={angle}
            cx="250"
            cy="120"
            rx="28"
            ry="70"
            stroke="#B88A3B"
            strokeWidth="0.4"
            transform={`rotate(${angle} 250 250)`}
          />
        ))}
        {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => (
          <ellipse
            key={angle}
            cx="250"
            cy="150"
            rx="20"
            ry="50"
            stroke="#7A9B68"
            strokeWidth="0.3"
            transform={`rotate(${angle} 250 250)`}
          />
        ))}
      </svg>

      {/* Left leaf ornament */}
      <svg
        className="absolute -left-2 bottom-[10%] h-[160px] w-[70px] opacity-[0.04]"
        viewBox="0 0 70 160"
        fill="none"
      >
        <path d="M35 160C35 160 8 125 8 90C8 55 25 28 35 10C45 28 62 55 62 90C62 125 35 160 35 160Z" stroke="#7A9B68" strokeWidth="0.8" />
        <path d="M35 10L35 160" stroke="#7A9B68" strokeWidth="0.4" />
      </svg>

      {/* Right leaf ornament */}
      <svg
        className="absolute -right-2 top-[10%] h-[160px] w-[70px] opacity-[0.04]"
        viewBox="0 0 70 160"
        fill="none"
      >
        <path d="M35 0C35 0 62 35 62 70C62 105 45 132 35 150C25 132 8 105 8 70C8 35 35 0 35 0Z" stroke="#7A9B68" strokeWidth="0.8" />
        <path d="M35 0L35 150" stroke="#7A9B68" strokeWidth="0.4" />
      </svg>
    </div>
  );
}

function LotusOrnament() {
  return (
    <div className="mx-auto flex items-center gap-3" aria-hidden="true">
      <span className="h-[1px] w-10 bg-gradient-to-r from-transparent to-[#B88A3B]/35 sm:w-14" />
      <svg width="24" height="20" viewBox="0 0 28 24" fill="none" className="text-[#B88A3B]/50">
        <path d="M14 3C14 3 11 7 11 11C11 13.5 12.5 15 14 15C15.5 15 17 13.5 17 11C17 7 14 3 14 3Z" fill="currentColor" opacity="0.5" />
        <path d="M14 6C14 6 8 9 8 13C8 16 10.5 18 14 18C17.5 18 20 16 20 13C20 9 14 6 14 6Z" fill="currentColor" opacity="0.3" />
        <path d="M14 10C14 10 5 12.5 5 16C5 19 9 21 14 21C19 21 23 19 23 16C23 12.5 14 10 14 10Z" fill="currentColor" opacity="0.15" />
      </svg>
      <span className="h-[1px] w-10 bg-gradient-to-l from-transparent to-[#B88A3B]/35 sm:w-14" />
    </div>
  );
}

function EcosystemCard({ card }: { card: (typeof ecosystemCards)[number] }) {
  const Icon = card.icon;

  return (
    <Link
      href={card.href}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-[#E8E2D4] bg-white shadow-[0_1px_3px_rgba(33,29,24,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#B88A3B]/30 hover:shadow-[0_8px_30px_rgba(33,29,24,0.08)]"
    >
      {/* Image area — consistent 4:3 ratio */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={card.image}
          alt={card.imageAlt}
          fill
          sizes="(max-width: 640px) 48vw, (max-width: 1024px) 44vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
      </div>

      {/* Icon medallion */}
      <div className="relative z-10 -mt-5 flex justify-center">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full shadow-md ring-[3px] ring-white transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: card.iconBg }}
        >
          <Icon className="h-4 w-4 text-white" strokeWidth={1.8} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-2.5 text-center sm:px-5 sm:pb-5">
        <h3 className="font-heading text-[15px] font-semibold text-foreground sm:text-[17px]">
          {card.title}
        </h3>
        <p className="mt-1.5 flex-1 text-[11.5px] leading-relaxed text-foreground-muted sm:text-[12.5px]">
          {card.description}
        </p>
        <div className="mt-3 inline-flex items-center justify-center gap-1 text-[11.5px] font-semibold text-[#B88A3B] transition-colors group-hover:text-[#A07932] sm:mt-4 sm:text-[12.5px]">
          Explore
          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>

      {/* Subtle gold top accent on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#B88A3B]/0 to-transparent transition-all duration-300 group-hover:via-[#B88A3B]/50" />
    </Link>
  );
}

export function JourneyNavigator() {
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

  return (
    <section className="relative overflow-hidden bg-[#FAF7EF] py-12 sm:py-14 lg:py-16">
      <MandalaBackground />

      <Container className="relative">
        {/* Section intro */}
        <div className="mx-auto max-w-2xl text-center">
          <LotusOrnament />
          <div className="h-2" />
        </div>

        {/* Desktop: 4-column grid */}
        <div className="mt-8 hidden lg:grid lg:grid-cols-4 lg:gap-5 xl:gap-6">
          {ecosystemCards.map((card, i) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <EcosystemCard card={card} />
            </motion.div>
          ))}
        </div>

        {/* Mobile/Tablet: Embla carousel */}
        <div className="mt-8 lg:hidden">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {ecosystemCards.map((card) => (
                <div
                  key={card.href}
                  className="flex-[0_0_72%] px-2 sm:flex-[0_0_44%]"
                >
                  <EcosystemCard card={card} />
                </div>
              ))}
            </div>
          </div>

          {/* Dot indicators */}
          <div className="mt-5 flex justify-center gap-1.5">
            {ecosystemCards.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === selectedIndex ? 'w-6 bg-gold' : 'w-1.5 bg-foreground/10'
                }`}
                aria-label={`Go to card ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
