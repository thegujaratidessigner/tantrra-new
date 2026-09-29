import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { NavagrahaSelector } from '@/components/chadava/NavagrahaSelector';
import { SevaCard } from '@/components/puja/SevaCard';
import { deityAnushthan, tithiPoojan, getActiveDaanSeva } from '@/data/chadava';
import { formatPrice } from '@/lib/utils';
import { Flame, Sun, Calendar, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chadava — Sacred Offerings',
  description:
    'Sacred Chadava offerings — Deity Anushthan, Navagraha Poojan, Tithi & Tewar Panchopchar Poojan, and Daan Seva.',
};

export default function ChadavaPage() {
  const daanSeva = getActiveDaanSeva();

  const kamakhyaOfferings = deityAnushthan.filter((d) => d.deity === 'Maa Kamakhya');
  const sadashivOfferings = deityAnushthan.filter((d) => d.deity === 'Sadashiv');
  const dashMahavidyaOfferings = deityAnushthan.filter((d) => d.deity === 'Dash Mahavidya');

  const deityGroups = [
    { deity: 'Maa Kamakhya', offerings: kamakhyaOfferings },
    { deity: 'Sadashiv', offerings: sadashivOfferings },
    { deity: 'Dash Mahavidya', offerings: dashMahavidyaOfferings },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="bg-[#1B3D2F] py-10 sm:py-14 lg:py-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-light sm:text-xs">
              Sacred Offerings
            </p>
            <h1 className="font-heading text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-tight text-white">
              Chadava
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-white/60">
              Deity Anushthan, Navagraha Poojan, Tithi &amp; Tewar Panchopchar Poojan, and Daan Seva — sacred offerings performed with devotion and tradition.
            </p>
          </div>
        </Container>
      </div>

      <div className="py-10 sm:py-12 lg:py-16">
        <Container>
          {/* ── A. DEITY ANUSHTHAN ───────────────────────── */}
          <section id="deity-anushthan" className="scroll-mt-24">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
                <Flame className="h-4.5 w-4.5 text-gold-dark" />
              </div>
              <h2 className="font-heading text-[clamp(1.25rem,2.5vw,1.75rem)] font-semibold text-foreground">
                Deity Anushthan
              </h2>
            </div>
            <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-foreground-muted">
              Sacred offerings performed for specific deities with Panchopchar and Maha Poojan options.
            </p>

            <div className="space-y-6">
              {deityGroups.map((group) => (
                <div key={group.deity}>
                  <h3 className="mb-3 text-[14px] font-semibold uppercase tracking-[0.1em] text-foreground-subtle">
                    {group.deity}
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {group.offerings.map((offering, i) => (
                      <AnimatedSection key={offering.id} delay={i * 0.06}>
                        <div className="flex items-center justify-between rounded-lg border border-border/60 bg-white px-5 py-4 transition-all hover:border-gold/25 hover:shadow-sm">
                          <div>
                            <p className="text-[14px] font-medium text-foreground">{offering.name}</p>
                            <p className="mt-0.5 text-[12px] text-foreground-subtle capitalize">{offering.tier} Poojan</p>
                          </div>
                          <span className="ml-3 text-lg font-bold text-green">
                            {formatPrice(offering.price)}
                          </span>
                        </div>
                      </AnimatedSection>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="my-12 flex items-center gap-3 lg:my-16">
            <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-border" />
            <Flame className="h-4 w-4 text-gold/40" />
            <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-border" />
          </div>

          {/* ── B. NAVAGRAHA POOJAN ───────────────────────── */}
          <section id="navagraha" className="scroll-mt-24">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
                <Sun className="h-4.5 w-4.5 text-gold-dark" />
              </div>
              <h2 className="font-heading text-[clamp(1.25rem,2.5vw,1.75rem)] font-semibold text-foreground">
                Navagraha Poojan &amp; Chadava
              </h2>
            </div>
            <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-foreground-muted">
              Day-wise sacred offerings for the nine celestial bodies. Select a day to view available Graha offerings with Panchopchar Poojan.
            </p>

            <NavagrahaSelector />
          </section>

          {/* Divider */}
          <div className="my-12 flex items-center gap-3 lg:my-16">
            <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-border" />
            <Calendar className="h-4 w-4 text-gold/40" />
            <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-border" />
          </div>

          {/* ── C. TITHI & TEWAR PANCHOPCHAR POOJAN ───────────────────────── */}
          <section id="tithi-tewar" className="scroll-mt-24">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
                <Calendar className="h-4.5 w-4.5 text-gold-dark" />
              </div>
              <h2 className="font-heading text-[clamp(1.25rem,2.5vw,1.75rem)] font-semibold text-foreground">
                Tithi &amp; Tewar Panchopchar Poojan
              </h2>
            </div>
            <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-foreground-muted">
              Sacred Panchopchar Poojan performed on auspicious Tithis. Each includes Dhoop, Deepam, Pushpa, Gandham, and Naivedya.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tithiPoojan.map((tithi, i) => (
                <AnimatedSection key={tithi.id} delay={i * 0.05}>
                  <div className="flex items-center justify-between rounded-lg border border-border/60 bg-white px-5 py-4 transition-all hover:border-gold/25 hover:shadow-sm">
                    <div>
                      <p className="text-[14px] font-medium text-foreground">{tithi.name}</p>
                      {tithi.deity && (
                        <p className="mt-0.5 text-[12px] text-foreground-subtle">{tithi.deity}</p>
                      )}
                    </div>
                    <span className="ml-3 text-lg font-bold text-green">
                      {formatPrice(tithi.price)}
                    </span>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </section>

          {/* Divider */}
          <div className="my-12 flex items-center gap-3 lg:my-16">
            <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-border" />
            <Heart className="h-4 w-4 text-gold/40" />
            <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-border" />
          </div>

          {/* ── D. DAAN SEVA ───────────────────────── */}
          <section id="daan-seva" className="scroll-mt-24">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-maroon/8">
                <Heart className="h-4.5 w-4.5 text-maroon" />
              </div>
              <h2 className="font-heading text-[clamp(1.25rem,2.5vw,1.75rem)] font-semibold text-foreground">
                Daan Seva
              </h2>
            </div>
            <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-foreground-muted">
              Contribute to sacred causes and meaningful service. Every contribution supports the welfare of those in need.
            </p>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {daanSeva.map((seva, i) => (
                <AnimatedSection key={seva.id} delay={i * 0.08}>
                  <SevaCard seva={seva} />
                </AnimatedSection>
              ))}
            </div>
          </section>
        </Container>
      </div>
    </>
  );
}
