'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConsultationService } from '@/lib/types';
import { formatPrice, getWhatsAppLink } from '@/lib/utils';
import { siteConfig } from '@/data/site-config';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/lib/cart-store';
import { Check, MessageCircle, Clock, ShoppingBag, ArrowRight } from 'lucide-react';

export function ConsultationDetail({ service }: { service: ConsultationService }) {
  const [selectedPackage, setSelectedPackage] = useState(
    service.packages[0]?.id
  );
  const [addedToCart, setAddedToCart] = useState(false);
  const addServiceItem = useCartStore((s) => s.addServiceItem);
  const router = useRouter();

  const selected = service.packages.find((p) => p.id === selectedPackage);

  const handleBookNow = () => {
    if (!selected) return;
    addServiceItem({
      type: 'service',
      serviceId: `consult_${selected.id}`,
      serviceName: service.name,
      serviceType: 'consultation',
      packageName: selected.name,
      quantity: 1,
      priceSnapshot: selected.price,
    });
    setAddedToCart(true);
  };

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

          {service.packages.length > 0 ? (
            <div className="mt-10">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Choose Your Package
              </h2>
              <div className="mt-4 space-y-3">
                {service.packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => { setSelectedPackage(pkg.id); setAddedToCart(false); }}
                    className={`flex w-full items-start gap-4 rounded-lg border p-5 text-left transition-colors ${
                      selectedPackage === pkg.id
                        ? 'border-green bg-green/[0.03]'
                        : 'border-border hover:border-green/20'
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                        selectedPackage === pkg.id
                          ? 'border-green bg-green text-white'
                          : 'border-border'
                      }`}
                    >
                      {selectedPackage === pkg.id && (
                        <Check className="h-3 w-3" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-medium text-foreground">
                          {pkg.name}
                        </span>
                        <span className="font-heading text-lg font-bold text-green">
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

              {addedToCart ? (
                <div className="mt-6 rounded-lg border border-green/20 bg-green/[0.04] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green/10">
                      <Check className="h-5 w-5 text-green" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Added to Cart</p>
                      <p className="text-sm text-foreground-muted">
                        {service.name} — {selected?.name} ({selected ? formatPrice(selected.price) : ''})
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                    <button
                      onClick={() => router.push('/cart')}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green px-6 py-3 text-[14px] font-semibold text-white transition-all hover:bg-green/90 active:scale-[0.98]"
                    >
                      View Cart
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setAddedToCart(false)}
                      className="flex flex-1 items-center justify-center rounded-lg border border-border px-6 py-2.5 text-[13px] font-medium text-foreground-muted transition-colors hover:bg-cream-dark"
                    >
                      Continue Browsing
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={handleBookNow}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green px-6 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-green/90 active:scale-[0.98]"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    Book Now {selected && `— ${formatPrice(selected.price)}`}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-10 rounded-lg border border-border bg-white p-6 text-center">
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
                  <Button variant="primary-green" size="lg" className="mt-4">
                    <MessageCircle className="h-5 w-5" />
                    Enquire on WhatsApp
                  </Button>
                </a>
              ) : (
                <p className="mt-2 text-sm text-foreground-subtle">
                  Please contact us for more information.
                </p>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
