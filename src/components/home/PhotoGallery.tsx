'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

const galleryImages: GalleryImage[] = [
  { src: '/images/tantrra/gallery/gallery-01-kamakhya-temple-darshan.jpg', alt: 'Tripuransh at Maa Kamakhya Temple with temple domes', caption: 'Maa Kamakhya Temple Darshan' },
  { src: '/images/tantrra/gallery/gallery-02-kamakhya-deity-offering.jpg', alt: 'Sacred offering at Kamakhya deity shrine', caption: 'Sacred Deity Offering' },
  { src: '/images/tantrra/gallery/gallery-03-deity-shrine-darshan.jpg', alt: 'Darshan at decorated deity shrine with flower garlands', caption: 'Deity Shrine Darshan' },
  { src: '/images/tantrra/gallery/gallery-04-shrine-offering-devotion.jpg', alt: 'Devotional offering at sacred shrine with flower garland', caption: 'Shrine Devotion' },
  { src: '/images/tantrra/gallery/gallery-05-deity-shrine-prayer.jpg', alt: 'Prayer at ornate deity shrine with offerings', caption: 'Deity Shrine Prayer' },
  { src: '/images/tantrra/gallery/gallery-06-sacred-puja-ceremony.jpg', alt: 'Sacred puja ceremony with Trishul shawl at temple', caption: 'Sacred Puja Ceremony' },
  { src: '/images/tantrra/gallery/gallery-07-sacred-offering-flowers.jpg', alt: 'Sacred offering arrangement with flowers and rudraksha', caption: 'Sacred Flower Offering' },
  { src: '/images/tantrra/gallery/gallery-08-kavach-temple-view.jpg', alt: 'Kavach held up with Kamakhya Temple panoramic view', caption: 'Kavach at Kamakhya Temple' },
  { src: '/images/tantrra/gallery/gallery-09-temple-deity-prayer.jpg', alt: 'Devotional prayer at temple deity niche', caption: 'Temple Deity Prayer' },
  { src: '/images/tantrra/gallery/gallery-10-ganesha-shrine.jpg', alt: 'At ancient Ganesha shrine with sacred offerings', caption: 'Ganesha Shrine' },
  { src: '/images/tantrra/gallery/gallery-11-ancient-deity-namaste.jpg', alt: 'Namaste at ancient stone deity with offerings', caption: 'Ancient Deity Namaste' },
  { src: '/images/tantrra/gallery/gallery-12-ancient-deity-prayer.jpg', alt: 'Devotional prayer at ancient stone deity sculpture', caption: 'Ancient Deity Prayer' },
  { src: '/images/tantrra/gallery/gallery-13-devi-murti-offering.jpg', alt: 'Offering flowers at Devi Murti with garlands', caption: 'Devi Murti Offering' },
  { src: '/images/tantrra/gallery/gallery-14-puja-ritual-setup.jpg', alt: 'Complete puja ritual setup with diya, offerings and sacred items', caption: 'Puja Ritual Setup' },
  { src: '/images/tantrra/gallery/gallery-15-havan-ritual-night.jpg', alt: 'Evening havan ritual prayer with sacred fire and offerings', caption: 'Evening Havan Ritual' },
  { src: '/images/tantrra/gallery/gallery-16-temple-sacred-space.jpg', alt: 'Evening puja at temple sacred space with offerings', caption: 'Temple Evening Puja' },
  { src: '/images/tantrra/gallery/gallery-17-sacred-offering-thali.jpg', alt: 'At sacred temple entrance with namaste greeting', caption: 'Temple Entrance' },
  { src: '/images/tantrra/gallery/gallery-18-temple-evening-view.jpg', alt: 'Sacred snan ritual in holy water', caption: 'Sacred Snan Ritual' },
  { src: '/images/tantrra/gallery/gallery-19-kamakhya-temple-entrance.jpg', alt: 'Kamakhya Temple entrance pathway with sacred architecture', caption: 'Kamakhya Temple Path' },
  { src: '/images/tantrra/gallery/gallery-20-sacred-prasad.jpg', alt: 'Sacred prasad preparation with fruits and offerings', caption: 'Sacred Prasad' },
  { src: '/images/tantrra/gallery/gallery-21-temple-bell-ritual.jpg', alt: 'Temple bell ritual and sacred darshan', caption: 'Temple Bell Ritual' },
];

const GALLERY_ACTIVE = galleryImages.length > 0;

export function PhotoGallery() {
  if (!GALLERY_ACTIVE) return null;

  return <PhotoGalleryInner />;
}

function PhotoGalleryInner() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1 },
    [Autoplay({ delay: 3500, stopOnInteraction: true, stopOnMouseEnter: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    emblaApi.on('select', onSelect);
    onSelect();
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

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

        <div className="relative mt-10">
          <div ref={emblaRef} className="overflow-hidden rounded-xl">
            <div className="flex">
              {galleryImages.map((img, i) => (
                <div
                  key={i}
                  className="flex-[0_0_85%] px-2 sm:flex-[0_0_45%] lg:flex-[0_0_32%]"
                >
                  <div className="group relative aspect-[4/3] overflow-hidden rounded-lg">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 32vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    {img.caption && (
                      <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <p className="text-[13px] font-medium text-white">{img.caption}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#1B3D2F]/90 p-2 text-white/70 backdrop-blur-sm transition-all hover:border-gold/40 hover:text-gold-light disabled:opacity-30 sm:flex lg:-left-5"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#1B3D2F]/90 p-2 text-white/70 backdrop-blur-sm transition-all hover:border-gold/40 hover:text-gold-light disabled:opacity-30 sm:flex lg:-right-5"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="mt-6 flex justify-center gap-1.5">
          {galleryImages.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === selectedIndex ? 'w-6 bg-gold' : 'w-1.5 bg-white/20'
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
