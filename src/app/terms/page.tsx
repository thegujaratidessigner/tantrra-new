import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for using TANTRRA services and products.',
};

export default function TermsPage() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Legal
          </p>
          <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            Terms & Conditions
          </h1>

          <div className="mt-8 space-y-6 text-base leading-relaxed text-foreground-muted">
            <p>
              By using the TANTRRA website and services, you agree to the
              following terms and conditions. Please read them carefully.
            </p>

            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Products & Services
              </h2>
              <p className="mt-2">
                All products and services offered on TANTRRA are rooted in
                traditional spiritual practices. While we prepare each item
                with genuine devotion and traditional methods, TANTRRA does
                not make medical, legal, or financial claims about any
                product or service.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Pricing & Payment
              </h2>
              <p className="mt-2">
                All prices are listed in Indian Rupees (INR). We reserve
                the right to update pricing at any time. Final pricing is
                confirmed at checkout. Payment is processed through secure
                payment gateways.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Consultations
              </h2>
              <p className="mt-2">
                Spiritual consultations offered through TANTRRA are for
                guidance and insight purposes. They are not a substitute for
                professional medical, legal, or financial advice. Users are
                encouraged to exercise their own judgement.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Intellectual Property
              </h2>
              <p className="mt-2">
                All content on TANTRRA — including text, images, videos,
                and branding — is the property of TANTRRA and may not be
                reproduced without written permission.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Limitation of Liability
              </h2>
              <p className="mt-2">
                TANTRRA provides spiritual products and services in good
                faith. We are not liable for any outcomes arising from the
                use of our products or services beyond their material value.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Changes to Terms
              </h2>
              <p className="mt-2">
                We may update these terms from time to time. Continued use
                of the website after changes constitutes acceptance of the
                updated terms.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
