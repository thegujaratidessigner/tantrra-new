import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { PageHero } from '@/components/ui/PageHero';
import { ContactForm } from '@/components/contact/ContactForm';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/data/site-config';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with TANTRRA for orders, consultations, Puja requests, or any questions.',
};

export default function ContactPage() {
  const hasContactInfo = siteConfig.email || siteConfig.phone || siteConfig.whatsappNumber;

  return (
    <>
      <PageHero
        label="Get in Touch"
        title="Contact Us"
        description="We are here to help with your orders, consultations, Puja requests, or any questions about your spiritual journey."
      />

      <section className="py-10 sm:py-12 lg:py-16">
        <Container>
          <div className="mx-auto max-w-4xl">
            {/* Contact cards */}
            {hasContactInfo && (
              <div className="mb-10 grid gap-4 sm:grid-cols-3">
                {siteConfig.email && (
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="flex flex-col items-center gap-3 rounded-lg border border-border/60 bg-white p-5 text-center transition-all hover:border-green/20 hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-muted text-green">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-[13px] font-semibold text-foreground">Email</h3>
                      <p className="mt-0.5 text-[12px] text-foreground-muted">{siteConfig.email}</p>
                    </div>
                  </a>
                )}

                {siteConfig.phone && (
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="flex flex-col items-center gap-3 rounded-lg border border-border/60 bg-white p-5 text-center transition-all hover:border-green/20 hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-muted text-green">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-[13px] font-semibold text-foreground">Phone</h3>
                      <p className="mt-0.5 text-[12px] text-foreground-muted">{siteConfig.phone}</p>
                    </div>
                  </a>
                )}

                {siteConfig.whatsappNumber && (
                  <a
                    href={`https://wa.me/${siteConfig.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-3 rounded-lg border border-border/60 bg-white p-5 text-center transition-all hover:border-green/20 hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-muted text-green">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-[13px] font-semibold text-foreground">WhatsApp</h3>
                      <p className="mt-0.5 text-[12px] text-foreground-muted">Message us directly</p>
                    </div>
                  </a>
                )}
              </div>
            )}

            {!hasContactInfo && (
              <div className="mb-10 rounded-lg border border-gold/15 bg-gold-muted/20 p-5 text-center text-[13px] text-foreground-muted">
                Contact details will be displayed once configured in site settings.
              </div>
            )}

            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  );
}
