import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { PageHero } from '@/components/ui/PageHero';
import { getActiveConsultations } from '@/data/consultations';
import { formatPrice } from '@/lib/utils';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export const metadata: Metadata = {
  title: 'Spiritual Consultations',
  description:
    'Personal spiritual guidance with Tripuransh — Tarot, Akashik Reading, Chakra Healing, Astrology, Numerology, and more.',
};

export default function ConsultationsPage() {
  const services = getActiveConsultations();

  return (
    <>
      <PageHero
        label="Spiritual Consultations"
        title="Guidance for the Questions That Matter"
        description="Personal consultations with Tripuransh offering insight, clarity, and guidance through Tarot, Akashik Reading, Chakra Healing, Astrology, and more."
      />

      <section className="py-10 sm:py-12 lg:py-16">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <AnimatedSection key={service.id} delay={i * 0.08}>
                <div className="group flex h-full flex-col rounded-lg border border-border/60 bg-white p-5 sm:p-6 transition-all hover:border-maroon/20 hover:shadow-md">
                  <h3 className="font-heading text-lg font-semibold text-foreground group-hover:text-maroon">
                    {service.name}
                  </h3>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-foreground-muted">
                    {service.shortDescription}
                  </p>

                  {service.packages.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {service.packages.map((pkg) => (
                        <div
                          key={pkg.id}
                          className="flex items-center justify-between rounded-md bg-cream-dark/70 px-3 py-2"
                        >
                          <div>
                            <span className="text-[13px] font-medium text-foreground">
                              {pkg.name}
                            </span>
                            {pkg.duration && (
                              <span className="ml-2 text-[11px] text-foreground-subtle">
                                {pkg.duration}
                              </span>
                            )}
                          </div>
                          <span className="text-[13px] font-semibold text-maroon">
                            {formatPrice(pkg.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {service.turnaroundDays && (
                    <p className="mt-3 text-[11px] text-foreground-subtle">
                      Approximate scheduling: {service.turnaroundDays}
                    </p>
                  )}

                  <div className="mt-4">
                    {service.packages.length > 0 ? (
                      <Button
                        href={`/consultations/${service.slug}`}
                        variant="primary-maroon"
                        size="sm"
                        className="w-full"
                      >
                        Book Consultation
                      </Button>
                    ) : (
                      <Button
                        href={`/consultations/${service.slug}`}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        Enquire
                      </Button>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
