import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPujaBySlug, getActivePujas } from '@/data/pujas';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { formatPrice, getWhatsAppLink } from '@/lib/utils';
import { siteConfig } from '@/data/site-config';
import { MessageCircle, Clock } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getActivePujas().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const puja = getPujaBySlug(slug);
  if (!puja) return {};
  return {
    title: puja.seoTitle || puja.name,
    description: puja.seoDescription || puja.shortDescription,
  };
}

export default async function PujaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const puja = getPujaBySlug(slug);
  if (!puja || !puja.isActive) notFound();

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Sacred Puja
          </p>
          <h1 className="font-heading text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            {puja.name}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-foreground-muted">
            {puja.longDescription || puja.shortDescription}
          </p>

          {puja.purpose && (
            <div className="mt-6 rounded-sm bg-cream-dark p-5">
              <h2 className="font-heading text-lg font-semibold text-foreground">
                Purpose
              </h2>
              <p className="mt-1 text-sm text-foreground-muted">{puja.purpose}</p>
            </div>
          )}

          {puja.includes && puja.includes.length > 0 && (
            <div className="mt-6">
              <h2 className="font-heading text-lg font-semibold text-foreground">
                What This Puja Includes
              </h2>
              <ul className="mt-3 space-y-2">
                {puja.includes.map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-foreground-muted">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 rounded-sm border border-border bg-white p-6">
            {puja.price ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground-muted">Puja Contribution</p>
                  <p className="mt-1 font-heading text-3xl font-bold text-green">
                    {formatPrice(puja.price)}
                  </p>
                </div>
                <Button variant="primary-green" size="lg">
                  Request This Puja
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-foreground-muted">
                  This Puja is available upon request. Please reach out for
                  scheduling and contribution details.
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button variant="primary-green" size="lg">
                    Request Puja
                  </Button>
                  {siteConfig.whatsappNumber && (
                    <a
                      href={getWhatsAppLink(
                        siteConfig.whatsappNumber,
                        `Namaste, I would like to request ${puja.name}.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="lg">
                        <MessageCircle className="h-5 w-5" />
                        WhatsApp
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
