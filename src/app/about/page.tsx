import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { PageHero } from '@/components/ui/PageHero';
import { getBlock } from '@/lib/server/content';
import { getBanners } from '@/lib/server/site-content';
import { ShieldCheck, Sparkles, HeartHandshake, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About TANTRRA',
  description:
    'TANTRRA is a sacred spiritual ecosystem offering consecrated products, Puja, Chadava offerings, and personalised spiritual consultations.',
};

const PILLAR_ICONS = [ShieldCheck, Sparkles, HeartHandshake, BookOpen];

interface Founder { image: string; imageAlt: string; label: string; name: string; paragraphs: string[]; tagline: string }
interface Pillars { label: string; title: string; items: { title: string; description: string }[] }
interface Cta { title: string; description: string; primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string }

export default async function AboutPage() {
  const [[hero], founder, pillarBlock, cta] = await Promise.all([
    getBanners('page_hero_about'),
    getBlock<Founder>('about.founder'),
    getBlock<Pillars>('about.pillars'),
    getBlock<Cta>('about.cta'),
  ]);
  const pillars = pillarBlock.items.map((item, i) => ({ ...item, icon: PILLAR_ICONS[i % PILLAR_ICONS.length] }));

  return (
    <>
      {hero && (
        <PageHero
          label={hero.eyebrow ?? undefined}
          title={hero.heading ?? 'TANTRRA'}
          description={hero.description ?? undefined}
          bgImageDesktop={hero.desktopSrc ?? undefined}
          bgImageMobile={hero.mobileSrc ?? hero.desktopSrc ?? undefined}
          bgImageAlt={hero.alt}
        />
      )}

      <div className="py-10 sm:py-12 lg:py-16">
        <Container>
          {/* Founder + narrative section */}
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              {founder.image && (
              <div className="relative h-[180px] w-[180px] shrink-0 overflow-hidden rounded-xl border border-gold/15 shadow-sm sm:h-[200px] sm:w-[200px]">
                <Image
                  src={founder.image}
                  alt={founder.imageAlt}
                  fill
                  sizes="200px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              )}
              <div className="text-center sm:text-left">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">{founder.label}</p>
                <h2 className="mt-1 font-heading text-xl font-semibold text-foreground">{founder.name}</h2>
              </div>
            </div>
            <div className="space-y-5 text-[15px] leading-relaxed text-foreground-muted">
              {founder.paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              {founder.tagline && (
                <p className="font-heading text-[16px] font-semibold italic text-foreground">{founder.tagline}</p>
              )}
            </div>
          </div>

          {/* Pillars grid */}
          <div className="mx-auto mt-14 max-w-5xl">
            <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-gold sm:text-xs">
              {pillarBlock.label}
            </p>
            <h2 className="text-center font-heading text-[clamp(1.5rem,3vw,2.25rem)] font-semibold text-foreground">
              {pillarBlock.title}
            </h2>
            <div className="mx-auto mt-3 h-[1px] w-16 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-lg border border-border/60 bg-white p-6 transition-all hover:border-gold/20 hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cream-dark">
                    <pillar.icon className="h-5 w-5 text-green" />
                  </div>
                  <h3 className="mt-4 font-heading text-base font-semibold text-foreground sm:text-lg">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-foreground-muted">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA section */}
          <div className="mt-14 rounded-lg border border-gold/15 bg-gold-muted/30 p-8 text-center sm:p-12">
            <h2 className="font-heading text-[clamp(1.5rem,3vw,2rem)] font-semibold text-foreground">
              {cta.title}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-foreground-muted">
              {cta.description}
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              {cta.primaryLabel && (
                <Button href={cta.primaryHref || '/products'} variant="primary-green" size="lg" withArrow>
                  {cta.primaryLabel}
                </Button>
              )}
              {cta.secondaryLabel && (
                <Button href={cta.secondaryHref || '/consultations'} variant="primary-maroon" size="lg" withArrow>
                  {cta.secondaryLabel}
                </Button>
              )}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
