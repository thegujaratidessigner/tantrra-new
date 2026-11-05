'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { NavagrahaSelector } from '@/components/chadava/NavagrahaSelector';
import { SevaCard } from '@/components/puja/SevaCard';
import { ChadavaBookingModal } from '@/components/chadava/ChadavaBookingModal';
import { deityAnushthan, tithiPoojan, getActiveDaanSeva, panchopcharItems, panchopcharImages } from '@/data/chadava';
import { formatPrice } from '@/lib/utils';
import { Flame, Sun, Calendar, Heart, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import type { ServiceType } from '@/lib/types';

const categories = [
  {
    id: 'deity-anushthan',
    title: 'Deity Anushthan',
    description: 'Sacred offerings for Maa Kamakhya, Sadashiv and Dash Mahavidya with Panchopchar and Maha Poojan options.',
    icon: Flame,
    color: 'bg-[#B88A3B]/10 text-[#B88A3B]',
    borderHover: 'hover:border-[#B88A3B]/30',
    image: '/images/chadava/deity-chadava.webp',
  },
  {
    id: 'navagraha',
    title: 'Navagraha Poojan & Chadava',
    description: 'Day-wise sacred offerings for the nine celestial bodies with Panchopchar Poojan.',
    icon: Sun,
    color: 'bg-[#B88A3B]/10 text-[#B88A3B]',
    borderHover: 'hover:border-[#B88A3B]/30',
    image: '/images/chadava/navgrah-chadava.webp',
  },
  {
    id: 'tithi-tewar',
    title: 'Tithi & Tewar Panchopchar Poojan',
    description: 'Panchopchar Poojan on auspicious Tithis — Dhoop, Deepam, Pushpa, Gandham and Naivedya.',
    icon: Calendar,
    color: 'bg-[#7A9B68]/10 text-[#7A9B68]',
    borderHover: 'hover:border-[#7A9B68]/30',
    image: '/images/chadava/tithi-tyohar-chadawa.webp',
  },
  {
    id: 'daan-seva',
    title: 'Daan Seva',
    description: 'Contribute to sacred causes — Brahmin Seva, Gau Seva, Kanya Pujan and community welfare.',
    icon: Heart,
    color: 'bg-[#B5342E]/8 text-[#B5342E]',
    borderHover: 'hover:border-[#B5342E]/30',
  },
];

function CategoryCard({
  category,
  onSelect,
  index,
}: {
  category: (typeof categories)[number];
  onSelect: () => void;
  index: number;
}) {
  const Icon = category.icon;
  return (
    <AnimatedSection delay={index * 0.08}>
      <button
        onClick={onSelect}
        className={`group flex w-full flex-col overflow-hidden rounded-xl border border-[#E8E2D4] bg-white text-left transition-all hover:shadow-[0_8px_30px_rgba(33,29,24,0.08)] ${category.borderHover}`}
      >
        {'image' in category && category.image && (
          <div className="relative h-[200px] w-full overflow-hidden sm:h-[260px]">
            <Image
              src={category.image}
              alt={category.title}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}
        <div className="flex items-start gap-4 p-5 sm:p-6">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${category.color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-heading text-[16px] font-semibold text-foreground sm:text-[18px]">
              {category.title}
            </h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-foreground-muted sm:text-[14px]">
              {category.description}
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-[#B88A3B]">
              View Offerings
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </button>
    </AnimatedSection>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground-muted transition-colors hover:text-foreground"
    >
      <ChevronLeft className="h-4 w-4" />
      All Categories
    </button>
  );
}

interface BookingState {
  open: boolean;
  name: string;
  id: string;
  price: number;
  serviceType: ServiceType;
  metadata?: Record<string, string>;
}

function DeityAnushthanContent() {
  const [booking, setBooking] = useState<BookingState>({
    open: false, name: '', id: '', price: 0, serviceType: 'chadava-deity',
  });

  const kamakhya = deityAnushthan.filter((d) => d.deity === 'Maa Kamakhya');
  const sadashiv = deityAnushthan.filter((d) => d.deity === 'Sadashiv');
  const dashMahavidya = deityAnushthan.filter((d) => d.deity === 'Dash Mahavidya');

  const groups = [
    { deity: 'Maa Kamakhya', offerings: kamakhya },
    { deity: 'Sadashiv', offerings: sadashiv },
    { deity: 'Dash Mahavidya', offerings: dashMahavidya },
  ];

  return (
    <>
      <div className="mb-8 grid grid-cols-2 gap-4">
        <div className="overflow-hidden rounded-xl border border-[#E8E2D4]">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={panchopcharImages.panchopcharItems}
              alt="Panchopchar Poojan Thali"
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover"
              unoptimized
            />
          </div>
          <p className="px-3 py-2 text-center text-[12px] font-medium text-foreground-muted">Panchopchar Thali</p>
        </div>
        <div className="overflow-hidden rounded-xl border border-[#E8E2D4]">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={panchopcharImages.pujaThali}
              alt="Maha Poojan Thali"
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover"
              unoptimized
            />
          </div>
          <p className="px-3 py-2 text-center text-[12px] font-medium text-foreground-muted">Maha Poojan Thali</p>
        </div>
      </div>

      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.deity}>
            <h3 className="mb-3 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-foreground-subtle">
              <span className="h-px w-4 bg-gold/30" />
              {group.deity}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {group.offerings.map((offering, i) => (
                <AnimatedSection key={offering.id} delay={i * 0.06}>
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E8E2D4] bg-white px-5 py-4 transition-all hover:border-gold/25 hover:shadow-[0_4px_16px_rgba(33,29,24,0.05)]">
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-medium text-foreground">{offering.name}</p>
                      <p className="mt-0.5 text-[12px] capitalize text-foreground-subtle">{offering.tier} Poojan</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2.5">
                      <span className="text-lg font-bold text-green">
                        {formatPrice(offering.price)}
                      </span>
                      <button
                        onClick={() => setBooking({
                          open: true,
                          name: offering.name,
                          id: `deity_${offering.id}`,
                          price: offering.price,
                          serviceType: 'chadava-deity',
                          metadata: { Deity: offering.deity, Tier: offering.tier },
                        })}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-green text-white transition-all hover:bg-green/90 active:scale-95"
                        aria-label={`Book ${offering.name}`}
                      >
                        <ShoppingBag className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        ))}
      </div>
      <ChadavaBookingModal
        open={booking.open}
        onClose={() => setBooking((b) => ({ ...b, open: false }))}
        offeringName={booking.name}
        offeringId={booking.id}
        price={booking.price}
        serviceType={booking.serviceType}
        metadata={booking.metadata}
      />
    </>
  );
}

function TithiTewarContent() {
  const [booking, setBooking] = useState<BookingState>({
    open: false, name: '', id: '', price: 0, serviceType: 'chadava-tithi',
  });

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-2 rounded-lg bg-[#7A9B68]/8 px-4 py-3">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-[#7A9B68]">
          Panchopchar includes:
        </span>
        {panchopcharItems.map((item) => (
          <span
            key={item}
            className="rounded-full bg-white px-2.5 py-0.5 text-[12px] font-medium text-foreground-muted"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {tithiPoojan.map((tithi, i) => (
          <AnimatedSection key={tithi.id} delay={i * 0.05}>
            <div className="flex items-center gap-4 rounded-xl border border-[#E8E2D4] bg-white px-5 py-4 transition-all hover:border-[#7A9B68]/25 hover:shadow-[0_4px_16px_rgba(33,29,24,0.05)]">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7A9B68]/10">
                <Calendar className="h-4 w-4 text-[#7A9B68]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-foreground">{tithi.name}</p>
                {tithi.deity && (
                  <p className="mt-0.5 text-[12px] text-foreground-subtle">{tithi.deity}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2.5">
                <span className="text-[17px] font-bold text-[#7A9B68]">
                  {formatPrice(tithi.price)}
                </span>
                <button
                  onClick={() => setBooking({
                    open: true,
                    name: `${tithi.name} Panchopchar Poojan`,
                    id: `tithi_${tithi.id}`,
                    price: tithi.price,
                    serviceType: 'chadava-tithi',
                    metadata: tithi.deity ? { Tithi: tithi.name, Deity: tithi.deity } : { Tithi: tithi.name },
                  })}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7A9B68] text-white transition-all hover:bg-[#7A9B68]/90 active:scale-95"
                  aria-label={`Book ${tithi.name}`}
                >
                  <ShoppingBag className="h-4 w-4" />
                </button>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>

      <ChadavaBookingModal
        open={booking.open}
        onClose={() => setBooking((b) => ({ ...b, open: false }))}
        offeringName={booking.name}
        offeringId={booking.id}
        price={booking.price}
        serviceType={booking.serviceType}
        metadata={booking.metadata}
      />
    </>
  );
}

function DaanSevaContent() {
  const daanSeva = getActiveDaanSeva();

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
      {daanSeva.map((seva, i) => (
        <AnimatedSection key={seva.id} delay={i * 0.08}>
          <SevaCard seva={seva} />
        </AnimatedSection>
      ))}
    </div>
  );
}

export function ChadavaContent() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const activeConfig = categories.find((c) => c.id === activeCategory);
  const ActiveIcon = activeConfig?.icon;

  return (
    <div className="relative py-10 sm:py-12 lg:py-16">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-[5%] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(184,138,59,0.03),transparent_65%)]" />
      </div>

      <Container className="relative">
        {activeCategory === null ? (
          <div className="mx-auto max-w-3xl">
            <div className="grid gap-4 sm:grid-cols-2">
              {categories.map((cat, i) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  onSelect={() => setActiveCategory(cat.id)}
                  index={i}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <BackButton onClick={() => setActiveCategory(null)} />

            <div className="mb-8 flex items-center gap-3">
              {ActiveIcon && (
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${activeConfig.color}`}>
                  <ActiveIcon className="h-5 w-5" />
                </div>
              )}
              <div>
                <h2 className="font-heading text-[clamp(1.25rem,2.5vw,1.75rem)] font-semibold text-foreground">
                  {activeConfig?.title}
                </h2>
                <p className="mt-0.5 text-[13px] text-foreground-muted">
                  {activeConfig?.description}
                </p>
              </div>
            </div>

            {activeCategory === 'deity-anushthan' && <DeityAnushthanContent />}
            {activeCategory === 'navagraha' && (
              <div className="-mx-4 rounded-2xl bg-gradient-to-b from-[#F6F3EB] to-[#FAF7EF] px-4 py-6 sm:-mx-6 sm:px-6 sm:py-8">
                <NavagrahaSelector />
              </div>
            )}
            {activeCategory === 'tithi-tewar' && <TithiTewarContent />}
            {activeCategory === 'daan-seva' && <DaanSevaContent />}
          </>
        )}
      </Container>
    </div>
  );
}
