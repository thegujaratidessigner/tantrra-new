import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { getActiveConsultations } from '@/data/consultations';
import { formatPrice } from '@/lib/utils';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export const metadata: Metadata = {
  title: 'Spiritual Consultations',
  description:
    'Personal spiritual guidance with Tripuransh — Tarot, Akashic Reading, 7 Chakra Healing, and Meditation Guidance.',
};

export default function ConsultationsPage() {
  const services = getActiveConsultations();

  return (
    <>
      {/* Hero banner — compact, centered, with breathing room */}
      <div className="bg-[#FAF7EF] px-4 pt-6 pb-2 sm:px-6 sm:pt-8 sm:pb-3 lg:px-8 lg:pt-10 lg:pb-4">
        <div className="mx-auto max-w-[1280px] overflow-hidden rounded-lg shadow-[0_2px_16px_rgba(33,29,24,0.06)] sm:rounded-xl">
          <Image
            src="/images/puja-consult/consultation-services-hero.png"
            alt="Spiritual consultation and guidance services"
            width={1600}
            height={600}
            className="block w-full h-auto"
            priority
            unoptimized
          />
        </div>
      </div>

      <section className="py-10 sm:py-12 lg:py-16">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
            {services.map((service, i) => (
              <AnimatedSection key={service.id} delay={i * 0.08}>
                <div className="group flex h-full flex-col rounded-xl border border-[#E8E2D4] bg-white p-5 sm:p-6 transition-all hover:border-maroon/20 hover:shadow-[0_8px_30px_rgba(33,29,24,0.08)]">
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
                          className="flex items-center justify-between rounded-lg bg-cream-dark/70 px-3 py-2"
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
