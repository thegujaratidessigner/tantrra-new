import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { PageHero } from '@/components/ui/PageHero';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { getActivePujas, getActiveSevaCategories } from '@/data/pujas';
import { formatPrice } from '@/lib/utils';
import { Flame, Heart } from 'lucide-react';
import Link from 'next/link';

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
              <Flame className="h-5 w-5 text-gold" />
              <h2 className="font-heading text-[clamp(1.25rem,2.5vw,1.75rem)] font-semibold text-foreground">
                Sacred Pujas
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPujas.map((puja, i) => (
                <AnimatedSection key={puja.id} delay={i * 0.08}>
                  <div className="group flex h-full flex-col rounded-lg border border-border/60 bg-white p-5 transition-all hover:border-gold/25 hover:shadow-md">
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {puja.name}
                    </h3>
                    <p className="mt-2 flex-1 text-[13px] leading-relaxed text-foreground-muted">
                      {puja.shortDescription}
                    </p>
                    <div className="mt-4">
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
                    className="flex items-center justify-between rounded-lg border border-border/60 bg-white px-4 py-3 transition-all hover:border-gold/25 hover:shadow-sm"
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
          <section id="seva" className="mt-14 scroll-mt-24">
            <div className="mb-8 flex items-center gap-3">
              <Heart className="h-5 w-5 text-maroon" />
              <h2 className="font-heading text-[clamp(1.25rem,2.5vw,1.75rem)] font-semibold text-foreground">
                Seva & Chadava
              </h2>
            </div>
            <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-foreground-muted">
              Contribute to sacred causes and meaningful service. Every
              contribution supports the welfare of those in need.
            </p>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sevaCategories.map((seva, i) => (
                <AnimatedSection key={seva.id} delay={i * 0.08}>
                  <div className="rounded-lg border border-border/60 bg-white p-5 sm:p-6">
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {seva.name}
                    </h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-foreground-muted">
                      {seva.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {seva.amounts.map((amount) => (
                        <button
                          key={amount}
                          className="rounded-md border border-border/80 px-4 py-2 text-[13px] font-medium text-foreground transition-all hover:border-maroon/30 hover:bg-maroon-muted hover:text-maroon"
                        >
                          {formatPrice(amount)}
                        </button>
                      ))}
                      {seva.allowCustom && (
                        <button className="rounded-md border border-dashed border-foreground-subtle/40 px-4 py-2 text-[13px] text-foreground-subtle transition-colors hover:border-maroon/30 hover:text-maroon">
                          Custom
                        </button>
                      )}
                    </div>
                    <Button
                      variant="primary-maroon"
                      size="sm"
                      className="mt-4 w-full"
                    >
                      Contribute
                    </Button>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </section>
        </Container>
      </div>
    </>
  );
}
