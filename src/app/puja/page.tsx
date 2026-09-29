import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { getActiveSpecializedPujas, pujaRitualSteps, panchopcharIncludes, pujaAdditionalIncludes } from '@/data/pujas';
import { formatPrice } from '@/lib/utils';
import { Flame, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Specialized Puja',
  description:
    'Sacred specialized Pujas — Maa Kamakhya, Sadashiv, and Dash Mahavidya Poojan — performed individually with your Name, Sankalp and Gotra.',
};

export default function PujaPage() {
  const pujas = getActiveSpecializedPujas();

  return (
    <>
      {/* Hero banner — compact, centered, with breathing room */}
      <div className="bg-[#FAF7EF] px-4 pt-6 pb-2 sm:px-6 sm:pt-8 sm:pb-3 lg:px-8 lg:pt-10 lg:pb-4">
        <div className="mx-auto max-w-[1280px] overflow-hidden rounded-lg shadow-[0_2px_16px_rgba(33,29,24,0.06)] sm:rounded-xl">
          <Image
            src="/images/puja-consult/puja-specialized-hero.png"
            alt="Specialized Puja — Sacred fire ritual ceremony"
            width={1600}
            height={600}
            className="block w-full h-auto"
            priority
            unoptimized
          />
        </div>
      </div>

      <div className="py-10 sm:py-12 lg:py-16">
        <Container>
          {/* Intro */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold sm:text-xs">
              Sacred Rituals
            </p>
            <h1 className="font-heading text-[clamp(1.75rem,3vw,2.75rem)] font-semibold leading-tight text-foreground">
              Specialized Puja
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
              Each Puja is performed individually with your Name, Sankalp, and Gotra — following authentic traditional rituals with complete devotion.
            </p>
          </div>

          {/* Puja Cards */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pujas.map((puja, i) => (
              <AnimatedSection key={puja.id} delay={i * 0.1}>
                <div className="group flex h-full flex-col rounded-xl border border-[#E8E2D4] bg-white overflow-hidden transition-all duration-300 hover:border-gold/25 hover:shadow-[0_8px_30px_rgba(33,29,24,0.08)] hover:-translate-y-0.5">
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
                      <Flame className="h-5 w-5 text-gold-dark" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-foreground">
                      {puja.name}
                    </h3>
                    <p className="mt-2 flex-1 text-[13px] leading-relaxed text-foreground-muted">
                      {puja.shortDescription}
                    </p>

                    {/* Includes */}
                    <div className="mt-4">
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground-subtle">
                        Includes
                      </p>
                      <ul className="space-y-1.5">
                        {puja.includes.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-[13px] text-foreground-muted">
                            <Check className="h-3 w-3 shrink-0 text-green" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Price */}
                    <div className="mt-5 border-t border-border/40 pt-4">
                      <p className="text-2xl font-bold text-green">
                        {formatPrice(puja.price)}
                      </p>
                      <p className="mt-0.5 text-[11px] text-foreground-subtle">
                        Inclusive of all applicable taxes
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Ritual Steps */}
          <div className="mt-16 lg:mt-20">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold sm:text-xs">
                The Process
              </p>
              <h2 className="font-heading text-[clamp(1.5rem,2.5vw,2.25rem)] font-semibold leading-tight text-foreground">
                Ritual Steps
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
                Each specialized Puja follows these sacred steps performed with complete devotion and traditional precision.
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {pujaRitualSteps.map((step, i) => (
                <AnimatedSection key={step} delay={i * 0.06}>
                  <div className="flex items-center gap-3 rounded-xl border border-[#E8E2D4] bg-white px-4 py-3.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/10 text-[12px] font-bold text-gold-dark">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[13px] font-medium text-foreground">{step}</span>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          {/* Panchopchar & Additional Includes */}
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            <div className="rounded-xl border border-[#E8E2D4] bg-white p-5 sm:p-6">
              <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-foreground-subtle">
                Panchopchar Includes
              </h3>
              <div className="flex flex-wrap gap-2">
                {panchopcharIncludes.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-gold/8 px-3 py-1 text-[13px] font-medium text-gold-dark"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-[#E8E2D4] bg-white p-5 sm:p-6">
              <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.1em] text-foreground-subtle">
                Additional Includes
              </h3>
              <div className="flex flex-wrap gap-2">
                {pujaAdditionalIncludes.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-green-muted/40 px-3 py-1 text-[13px] font-medium text-green"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-[15px] text-foreground-muted">
              Explore sacred Chadava offerings, Navagraha Poojan, and Daan Seva
            </p>
            <Link
              href="/chadava"
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-[14px] font-semibold tracking-wide text-white transition-colors hover:bg-gold-dark"
            >
              Explore Chadava
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
}
