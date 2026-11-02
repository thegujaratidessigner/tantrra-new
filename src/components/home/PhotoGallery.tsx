'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { galleryImages, type GalleryImage } from '@/data/gallery-images';

const GALLERY_ACTIVE = galleryImages.length > 0;

const topRow = galleryImages.slice(0, 11);
const bottomRow = galleryImages.slice(11);

function GalleryCard({ img }: { img: GalleryImage }) {
  return (
    <div className="relative aspect-[4/3] w-[280px] shrink-0 overflow-hidden rounded-lg sm:w-[320px] lg:w-[360px]">
      <Image
        src={img.src}
        alt={img.alt}
        fill
        sizes="360px"
        className="object-cover"
        unoptimized
      />
    </div>
  );
}

function MarqueeRow({
  images,
  direction,
}: {
  images: GalleryImage[];
  direction: 'left' | 'right';
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const prefersReduced =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let raf: number;
    const speed = 0.5; // px per frame

    const step = () => {
      if (!paused && el) {
        if (direction === 'left') {
          el.scrollLeft += speed;
          if (el.scrollLeft >= el.scrollWidth / 2) {
            el.scrollLeft -= el.scrollWidth / 2;
          }
        } else {
          el.scrollLeft -= speed;
          if (el.scrollLeft <= 0) {
            el.scrollLeft += el.scrollWidth / 2;
          }
        }
      }
      raf = requestAnimationFrame(step);
    };

    // Start from appropriate position for right-scrolling row
    if (direction === 'right') {
      el.scrollLeft = el.scrollWidth / 2;
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [direction, paused]);

  // Duplicate images for seamless loop
  const doubled = [...images, ...images];

  return (
    <div
      ref={scrollRef}
      className="flex gap-3 overflow-hidden sm:gap-4"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {doubled.map((img, i) => (
        <GalleryCard key={`${img.src}-${i}`} img={img} />
      ))}
    </div>
  );
}

export function PhotoGallery() {
  if (!GALLERY_ACTIVE) return null;

  return (
    <section className="relative overflow-hidden bg-[#1B3D2F] py-14 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(184,138,59,0.06),transparent_65%)]" />
      </div>

      <Container className="relative">
        <SectionHeading
          label="Our Sacred Journey"
          title="Glimpses of Devotion"
          description="Authentic moments from TANTRRA's sacred ceremonies, rituals and spiritual services."
          className="[&_h2]:text-white [&_p]:text-white/60 [&>p:first-child]:text-gold-light"
        />
      </Container>

      <div className="relative mt-10 space-y-3 sm:space-y-4">
        <MarqueeRow images={topRow} direction="right" />
        <MarqueeRow images={bottomRow} direction="left" />
      </div>
    </section>
  );
}
