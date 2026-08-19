import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { PageHero } from '@/components/ui/PageHero';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { getActivePujas, getActiveSevaCategories } from '@/data/pujas';
import { formatPrice } from '@/lib/utils';
import { Flame, Heart } from 'lucide-react';
import Link from 'next/link';
import { SevaCard } from '@/components/puja/SevaCard';

export const metadata: Metadata = {
  title: 'Puja & Seva',
  description:
    'Participate in sacred Pujas, Havans, and Seva contributions — Navagraha Shanti, Mahakali Havan, Brahmin Seva, Gau Seva, and more.',
};

export default function PujaPage() {
  const pujas = getActivePujas();
  const sevaCategories = getActiveSevaCategories();
  const featuredPujas = pujas.filter((p) => p.featured);
  const otherPujas = pujas.filter((p) => !p.featured);

  return (
    <>
      <PageHero
        label="Puja & Seva"
        title="Participate in Sacred Rituals"
        description="Join in powerful Pujas, sacred Havans, and meaningful Seva to support your spiritual path and serve the community."
      />

      <div className="py-10 sm:py-12 lg:py-16">
        <Container>
          {/* Sacred Pujas */}
          <section>
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10">
                <Flame className="h-4.5 w-4.5 text-gold-dark" />
              </div>
              <div>
                <h2 className="font-heading text-[clamp(1.25rem,2.5vw,1.75rem)] font-semibold text-foreground">
                  Sacred Pujas
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {featuredPujas.map((puja, i) => (
                <AnimatedSection key={puja.id} delay={i * 0.08}>
                  <div className="group flex h-full flex-col rounded-lg border border-border/60 bg-white p-3.5 transition-all duration-300 hover:border-gold/25 hover:shadow-lg hover:-translate-y-0.5 sm:p-5">
                    <h3 className="font-heading text-[15px] font-semibold text-foreground sm:text-lg">
                      {puja.name}
                    </h3>
                    <p className="mt-1.5 flex-1 text-[11px] leading-snug text-foreground-muted sm:mt-2 sm:text-[13px] sm:leading-relaxed">
                      {puja.shortDescription}
                    </p>
                    <div className="mt-4 border-t border-border/40 pt-3">
                      {puja.price ? (
                        <p className="text-lg font-bold text-green">
                          {formatPrice(puja.price)}
                        </p>
                      ) : (
                        <p className="text-[13px] font-semibold text-gold-dark">
                          Request for Details
                        </p>
                      )}
                    </div>
                    <Button
                      href={`/puja/${puja.slug}`}
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      withArrow
                    >
                      {puja.isRequestOnly ? 'Request Puja' : 'View Details'}
                    </Button>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {otherPujas.length > 0 && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {otherPujas.map((puja) => (
                  <Link
                    key={puja.id}
                    href={`/puja/${puja.slug}`}
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-white px-4 py-3.5 transition-all duration-200 hover:border-gold/25 hover:shadow-sm"
                  >
                    <span className="text-[13px] font-medium text-foreground">
                      {puja.name}
                    </span>
                    <span className="text-[12px] font-semibold text-foreground-subtle">
                      {puja.price ? formatPrice(puja.price) : 'Request'}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Seva & Chadava */}
          <section id="seva" className="mt-16 scroll-mt-24 lg:mt-20">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-maroon/8">
                <Heart className="h-4.5 w-4.5 text-maroon" />
              </div>
              <div>
                <h2 className="font-heading text-[clamp(1.25rem,2.5vw,1.75rem)] font-semibold text-foreground">
                  Seva & Chadava
                </h2>
              </div>
            </div>
            <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-foreground-muted">
              Contribute to sacred causes and meaningful service. Every
              contribution supports the welfare of those in need.
            </p>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {sevaCategories.map((seva, i) => (
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
