import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Shipping Information',
  description: 'Shipping policy and delivery details for TANTRRA sacred products.',
};

export default function ShippingPage() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Shipping
          </p>
          <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            Shipping Information
          </h1>

          <div className="mt-8 space-y-6 text-base leading-relaxed text-foreground-muted">
            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Processing Time
              </h2>
              <p className="mt-2">
                Each sacred product is prepared with care and devotion.
                Processing typically takes 3-5 working days as each item
                undergoes proper consecration before shipping.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Delivery
              </h2>
              <p className="mt-2">
                We ship across India via reputed courier partners. Standard
                delivery takes 5-7 working days after dispatch. Tracking
                details will be shared via email and WhatsApp once your order
                is shipped.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Packaging
              </h2>
              <p className="mt-2">
                All sacred items are carefully packaged to maintain their
                sanctity during transit. Products are wrapped in clean,
                respectful packaging appropriate for spiritual items.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Shipping Charges
              </h2>
              <p className="mt-2">
                Shipping charges are calculated at checkout based on your
                location and order weight. We strive to keep shipping costs
                as reasonable as possible.
              </p>
            </div>

            <div className="rounded-sm border border-gold/20 bg-gold-muted/20 p-5 text-sm">
              <p>
                For any shipping-related queries, please reach out to us via
                WhatsApp or email. We are happy to help with tracking
                updates and delivery estimates.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
