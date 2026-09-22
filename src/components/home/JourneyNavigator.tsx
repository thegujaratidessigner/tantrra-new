'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ShieldCheck, Flame, Sparkles, BookOpen, ArrowRight,
  Truck, Lock, Star,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';

/* ----------------------------------------------------------------
   DATA
   ---------------------------------------------------------------- */

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
    title: 'Puja & Chadava',
    description:
      'Participate in sacred rituals, Chadava offerings and divine service.',
    href: '/puja',
    icon: Flame,
    image: '/images/home/ecosystem-puja.jpg',
    imageAlt: 'Traditional puja and havan ceremony',
    iconBg: '#7A2E3B',
  },
  {
    title: 'Tarot',
    description:
      'Seek clarity and insight through personalised Tarot readings by Tripuransh.',
    href: '/tarot',
    icon: Sparkles,
    image: '/images/home/ecosystem-tarot.jpg',
    imageAlt: 'Tarot cards — guidance, clarity, self-discovery',
    iconBg: '#B88A3B',
    featured: true,
  },
  {
    title: 'Consultation',
    description:
      'Personal spiritual guidance and healing sessions with Tripuransh.',
    href: '/consultations',
    icon: Star,
    image: '/images/home/ecosystem-consultation.jpg',
    imageAlt: 'Spiritual consultation and guidance session',
    iconBg: '#2D5A3D',
  },
  {
    title: 'Sadhana',
    description:
      'Learn, practice and deepen your spiritual journey with guided content.',
    href: '/sadhana',
    icon: BookOpen,
    image: '/images/home/ecosystem-sadhana.jpg',
    imageAlt: 'Meditation and spiritual practice',
    iconBg: '#5C3030',
  },
];

const trustItems = [
  { icon: ShieldCheck, label: 'Ritually Prepared', sub: 'With mantras & intention' },
  { icon: Sparkles, label: 'Energised & Activated', sub: 'Through sacred processes' },
  { icon: Flame, label: 'Guided by Tripuransh', sub: 'Authentic spiritual guidance' },
  { icon: Lock, label: 'Secure & Confidential', sub: 'Your trust is sacred' },
  { icon: Truck, label: 'Fast & Safe Delivery', sub: 'Across India' },
];

/* ----------------------------------------------------------------
   DECORATIVE BACKGROUND
   ---------------------------------------------------------------- */

function SectionBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Warm radial glow behind heading */}
      <div className="absolute left-1/2 top-[10%] h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(185,144,69,0.06),transparent_70%)]" />

      {/* Subtle botanical linework — left */}
      <svg
        className="absolute -left-4 bottom-[15%] h-[180px] w-[80px] opacity-[0.06]"
        viewBox="0 0 80 180" fill="none"
      >
        <path d="M40 180C40 180 10 140 10 100C10 60 30 30 40 10C50 30 70 60 70 100C70 140 40 180 40 180Z" stroke="#7A9B68" strokeWidth="0.8" />
        <path d="M40 160C40 160 20 130 20 100C20 70 35 45 40 30C45 45 60 70 60 100C60 130 40 160 40 160Z" stroke="#7A9B68" strokeWidth="0.6" />
        <path d="M40 10L40 180" stroke="#7A9B68" strokeWidth="0.4" />
      </svg>

      {/* Subtle botanical linework — right */}
      <svg
        className="absolute -right-4 top-[20%] h-[180px] w-[80px] opacity-[0.06]"
        viewBox="0 0 80 180" fill="none"
      >
        <path d="M40 0C40 0 70 40 70 80C70 120 50 150 40 170C30 150 10 120 10 80C10 40 40 0 40 0Z" stroke="#7A9B68" strokeWidth="0.8" />
        <path d="M40 20C40 20 60 50 60 80C60 110 45 135 40 150C35 135 20 110 20 80C20 50 40 20 40 20Z" stroke="#7A9B68" strokeWidth="0.6" />
        <path d="M40 0L40 170" stroke="#7A9B68" strokeWidth="0.4" />
      </svg>
    </div>
  );
}

/* ----------------------------------------------------------------
   LOTUS ORNAMENT (divider)
   ---------------------------------------------------------------- */

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

/* ----------------------------------------------------------------
   ECOSYSTEM CARD
   ---------------------------------------------------------------- */

function EcosystemCard({
  card,
  index,
}: {
  card: (typeof ecosystemCards)[number];
  index: number;
}) {
  const Icon = card.icon;
  const isFeatured = 'featured' in card && card.featured;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="h-full"
    >
      <Link
        href={card.href}
        className={`group relative flex h-full flex-col overflow-hidden rounded-[16px] border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] ${
          isFeatured
            ? 'border-[#B88A3B]/30 hover:border-[#B88A3B]/50'
            : 'border-[#E8E2D4]/80 hover:border-[#B88A3B]/25'
        }`}
      >
        {/* Image area */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={card.image}
            alt={card.imageAlt}
            fill
            sizes="(max-width: 640px) 82vw, (max-width: 1024px) 44vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            unoptimized
          />
          {/* Subtle gradient at bottom for icon contrast */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/10 to-transparent" />

          {/* Featured gold shimmer line for Tarot */}
          {isFeatured && (
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#B88A3B] to-transparent" />
          )}
        </div>

        {/* Overlapping icon medallion */}
        <div className="relative z-10 -mt-5 flex justify-center">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full shadow-md ring-[3px] ring-white transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundColor: card.iconBg }}
          >
            <Icon className="h-[18px] w-[18px] text-white" strokeWidth={1.8} />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-4 pb-4 pt-3 text-center sm:px-5 sm:pb-5">
          <h3 className="font-heading text-[16px] font-semibold text-foreground sm:text-[17px]">
            {card.title}
          </h3>
          <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-foreground-muted sm:text-[13px]">
            {card.description}
          </p>
          <div className="mt-3 flex items-center justify-center gap-1 text-[12px] font-medium text-foreground-subtle transition-colors group-hover:text-[#B88A3B] sm:mt-4 sm:text-[13px]">
            Explore
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-250 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ----------------------------------------------------------------
   TRUST STRIP
   ---------------------------------------------------------------- */

function TrustStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-10 rounded-[14px] border border-[#E8E2D4]/80 bg-white/70 px-5 py-4 backdrop-blur-sm lg:mt-12 lg:px-8 lg:py-5"
    >
      {/* Desktop: row with separators */}
      <div className="hidden lg:flex lg:items-center lg:justify-between">
        {trustItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-5">
              {i > 0 && (
                <div className="h-8 w-[1px] bg-[#E8E2D4]" />
              )}
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B88A3B]/8">
                  <Icon className="h-3.5 w-3.5 text-[#B88A3B]" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-foreground">{item.label}</p>
                  <p className="text-[10px] text-foreground-muted">{item.sub}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile/Tablet: 2-col grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 lg:hidden">
        {trustItems.map((item, i) => {
          const Icon = item.icon;
          const isLast = i === trustItems.length - 1;
          return (
            <div
              key={item.label}
              className={`flex items-center gap-2 ${isLast ? 'col-span-2 justify-center' : ''}`}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#B88A3B]/8">
                <Icon className="h-3 w-3 text-[#B88A3B]" strokeWidth={1.8} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-foreground sm:text-[12px]">{item.label}</p>
                <p className="text-[9px] text-foreground-muted sm:text-[10px]">{item.sub}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ================================================================
   MAIN SECTION
   ================================================================ */

export function JourneyNavigator() {
  return (
    <section className="relative bg-[#FAF7EF] py-12 sm:py-14 lg:py-16">
      <SectionBackground />

      <Container className="relative">
        {/* Section intro */}
        <div className="mx-auto max-w-2xl text-center">
          <LotusOrnament />
          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold sm:text-xs">
            Your Spiritual Path
          </p>
          <h2 className="mt-2.5 font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-tight text-foreground">
            Explore the{' '}
            <span className="text-[#B88A3B]">TANTRRA</span>{' '}
            Ecosystem
          </h2>
          <p className="mt-3 text-[14px] leading-relaxed text-foreground-muted sm:text-[15px]">
            Five interconnected paths designed to support every dimension of
            your spiritual journey.
          </p>
        </div>

        {/* Cards — horizontal scroll on mobile, 5-col grid on desktop */}
        <div className="mt-8 sm:mt-10">
          {/* Mobile/Tablet scroll */}
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 snap-x snap-mandatory scrollbar-hide sm:-mx-6 sm:gap-5 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:px-0">
            {ecosystemCards.map((card, i) => (
              <div
                key={card.href}
                className="min-w-[78vw] snap-start sm:min-w-[42vw] lg:min-w-0"
              >
                <EcosystemCard card={card} index={i} />
              </div>
            ))}
          </div>
        </div>

        {/* Trust strip */}
        <TrustStrip />
      </Container>
    </section>
  );
}
