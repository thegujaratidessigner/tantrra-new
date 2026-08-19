'use client';

import { useState } from 'react';
import { ConsultationService } from '@/lib/types';
import { formatPrice, getWhatsAppLink } from '@/lib/utils';
import { siteConfig } from '@/data/site-config';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Check, MessageCircle, Clock } from 'lucide-react';

export function ConsultationDetail({ service }: { service: ConsultationService }) {
  const [selectedPackage, setSelectedPackage] = useState(
    service.packages[0]?.id
  );

  const selected = service.packages.find((p) => p.id === selectedPackage);

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-maroon">
            Consultation
          </p>
          <h1 className="font-heading text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            {service.name}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-foreground-muted">
            {service.longDescription || service.shortDescription}
          </p>

          {service.turnaroundDays && (
            <div className="mt-4 flex items-center gap-2 text-sm text-foreground-subtle">
              <Clock className="h-4 w-4" />
              Approximate scheduling: {service.turnaroundDays}
            </div>
          )}

          {/* Packages */}
          {service.packages.length > 0 ? (
            <div className="mt-10">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Choose Your Package
              </h2>
              <div className="mt-4 space-y-3">
                {service.packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`flex w-full items-start gap-4 rounded-sm border p-5 text-left transition-colors ${
                      selectedPackage === pkg.id
                        ? 'border-maroon bg-maroon-muted'
                        : 'border-border hover:border-maroon/20'
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                        selectedPackage === pkg.id
                          ? 'border-maroon bg-maroon text-white'
                          : 'border-foreground-subtle'
                      }`}
                    >
                      {selectedPackage === pkg.id && (
                        <Check className="h-3 w-3" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">
                          {pkg.name}
                        </span>
                        <span className="font-heading text-lg font-bold text-maroon">
                          {formatPrice(pkg.price)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-foreground-muted">
                        {pkg.description}
                      </p>
                      {pkg.duration && (
                        <span className="mt-1 inline-block text-xs text-foreground-subtle">
                          Duration: {pkg.duration}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button variant="primary-maroon" size="lg" className="flex-1">
                  Book Now {selected && `— ${formatPrice(selected.price)}`}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-10 rounded-sm border border-border bg-white p-6 text-center">
              <p className="text-foreground-muted">
                Pricing and packages for this service are available upon request.
              </p>
              {siteConfig.whatsappNumber ? (
                <a
                  href={getWhatsAppLink(
                    siteConfig.whatsappNumber,
                    `Namaste, I would like to enquire about ${service.name}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="primary-maroon" size="lg" className="mt-4">
                    <MessageCircle className="h-5 w-5" />
                    Enquire on WhatsApp
                  </Button>
                </a>
              ) : (
                <Button variant="primary-maroon" size="lg" className="mt-4">
                  Request Consultation
                </Button>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
