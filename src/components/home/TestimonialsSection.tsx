'use client';

import { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Container } from '@/components/ui/Container';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export interface TestimonialData {
  id: string;
  name: string;
  location?: string;
  content: string;
  rating: number;
  service?: string;
}

// ─── ILLUSTRATIVE REVIEWS — NOT YET PUBLISHED ────────────────────
// These drafts are for internal layout/design verification only.
// They remain hidden until genuine customer testimonials are added
// to the genuineTestimonials array below.
const draftReviews: TestimonialData[] = [
  {
    id: 'draft-1',
    name: 'Sadhak',
    content: 'The consultation helped me reflect on my situation with greater clarity. The explanations were thoughtful, and the overall experience felt calm and respectful.',
    rating: 5,
    service: 'Spiritual Consultation',
  },
  {
    id: 'draft-2',
    name: 'Sadhak',
    content: 'The entire puja process was explained clearly. I appreciated the attention given to the rituals and the respectful communication throughout.',
    rating: 5,
    service: 'Puja Services',
  },
  {
    id: 'draft-3',
    name: 'Sadhak',
    content: 'The product presentation was beautiful, and the information provided helped me understand its traditional significance.',
    rating: 5,
    service: 'Sacred Products',
  },
  {
    id: 'draft-4',
    name: 'Sadhak',
    content: 'The session gave me a fresh perspective on my personal concerns. I particularly appreciated the patient and detailed explanations.',
    rating: 5,
    service: 'Spiritual Guidance',
  },
  {
    id: 'draft-5',
    name: 'Sadhak',
    content: 'The Chadava booking process was straightforward. The instructions were easy to follow, and the experience felt well organized.',
    rating: 5,
    service: 'Chadava Seva',
  },
  {
    id: 'draft-6',
    name: 'Sadhak',
    content: 'I appreciated the time taken to understand my questions. The consultation was informative and helped me explore different spiritual perspectives.',
    rating: 5,
    service: 'Personal Consultation',
  },
  {
    id: 'draft-7',
    name: 'Sadhak',
    content: 'The rituals were explained with care, and the overall presentation reflected respect for traditional practices.',
    rating: 5,
    service: 'Puja Experience',
  },
  {
    id: 'draft-8',
    name: 'Sadhak',
    content: 'The website made it easy to explore the different spiritual services. The information was presented clearly and thoughtfully.',
    rating: 5,
    service: 'TANTRRA Experience',
  },
];

// ─── GENUINE TESTIMONIALS ──────────────────────────────────────────
// Add verified customer reviews here. Once this array has entries the
// section activates automatically. Each entry needs: id, name, content,
// rating (1-5), and optionally location and service.
const genuineTestimonials: TestimonialData[] = [];

const TESTIMONIALS_ACTIVE = genuineTestimonials.length > 0;

const testimonials = genuineTestimonials.length > 0 ? genuineTestimonials : draftReviews;

export function TestimonialsSection() {
  if (!TESTIMONIALS_ACTIVE) return null;

  return <TestimonialsInner />;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? 'fill-gold text-gold' : 'text-foreground-subtle/20'
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: TestimonialData }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-gold/10 bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(33,29,24,0.05)] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(184,138,59,0.10)] hover:border-gold/20">
      {/* Decorative quote mark */}
      <div className="mb-4 font-heading text-[48px] leading-none text-gold/15 select-none" aria-hidden="true">
        &ldquo;
      </div>

      <p className="flex-1 font-body text-[15px] leading-[1.75] text-foreground/80 sm:text-[16px]">
        {testimonial.content}
      </p>

      <div className="mt-6 flex items-center gap-4 border-t border-gold/8 pt-5">
        {/* Avatar circle with initial */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1B3D2F] to-[#2A5A42]">
          <span className="font-heading text-[16px] font-semibold text-white/90">
            {testimonial.name.charAt(0)}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-foreground">{testimonial.name}</p>
          {testimonial.location && (
            <p className="text-[12px] text-foreground-subtle">{testimonial.location}</p>
          )}
          {testimonial.service && (
            <p className="text-[12px] text-gold-dark/70">{testimonial.service}</p>
          )}
        </div>

        <div className="shrink-0">
          <StarRating rating={testimonial.rating} />
        </div>
      </div>
    </div>
  );
}

function TestimonialsInner() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1 },
    [Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  return (
    <section className="relative overflow-hidden bg-[#FAF7EF] py-16 sm:py-20 lg:py-24">
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(184,138,59,0.04),transparent_70%)]" />
      </div>

      <Container className="relative">
        {/* Premium heading */}
        <div className="mx-auto max-w-xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold/30" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
              Testimonials
            </span>
            <span className="h-px w-8 bg-gold/30" />
          </div>
          <h2 className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-tight text-foreground">
            What Our Devotees Say
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
            Heartfelt experiences shared by those who have walked this sacred path with us.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative mt-12">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="flex-[0_0_90%] px-2 sm:flex-[0_0_48%] lg:flex-[0_0_33.333%]"
                >
                  <TestimonialCard testimonial={t} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-gold/15 bg-white p-2.5 text-foreground-subtle shadow-md transition-all hover:border-gold/30 hover:text-gold hover:shadow-lg sm:flex lg:-left-5"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-gold/15 bg-white p-2.5 text-foreground-subtle shadow-md transition-all hover:border-gold/30 hover:text-gold hover:shadow-lg sm:flex lg:-right-5"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === selectedIndex
                  ? 'h-2 w-7 bg-gold'
                  : 'h-2 w-2 bg-foreground/10 hover:bg-foreground/20'
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
