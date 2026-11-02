'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { galleryImages } from '@/data/gallery-images';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

function Lightbox({
  index,
  onClose,
  onPrev,
  onNext,
}: {
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const img = galleryImages[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6 sm:h-12 sm:w-12"
        aria-label="Previous"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6 sm:h-12 sm:w-12"
        aria-label="Next"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      <div
        className="relative mx-auto max-h-[85vh] max-w-[90vw] sm:max-w-[80vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={img.src}
          alt={img.alt}
          width={1200}
          height={900}
          className="max-h-[85vh] w-auto rounded-lg object-contain"
          unoptimized
          priority
        />
        {img.caption && (
          <p className="mt-3 text-center text-[14px] font-medium text-white/80">
            {img.caption}
          </p>
        )}
        <p className="mt-1 text-center text-[12px] text-white/40">
          {index + 1} / {galleryImages.length}
        </p>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % galleryImages.length : null
    );
  }, []);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null
        ? (prev - 1 + galleryImages.length) % galleryImages.length
        : null
    );
  }, []);

  return (
    <>
      <section className="py-10 sm:py-12 lg:py-16">
        <Container>
          <SectionHeading
            label="Our Sacred Journey"
            title="Gallery"
            description="Authentic moments from TANTRRA's sacred ceremonies, rituals and spiritual services at Maa Kamakhya Temple and beyond."
          />

          <div className="mt-10 columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
            {galleryImages.map((img, i) => (
              <button
                key={img.src}
                onClick={() => openLightbox(i)}
                className="group mb-3 block w-full overflow-hidden rounded-lg sm:mb-4"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={600}
                  height={450}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  unoptimized
                />
              </button>
            ))}
          </div>
        </Container>
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </>
  );
}
