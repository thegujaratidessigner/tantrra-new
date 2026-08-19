import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Returns & Exchange',
  description: 'Returns and exchange policy for TANTRRA sacred products.',
};

export default function ReturnsPage() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Policy
          </p>
          <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            Returns & Exchange
          </h1>

          <div className="mt-8 space-y-6 text-base leading-relaxed text-foreground-muted">
            <p>
              Due to the sacred and consecrated nature of our products, we
              follow a specific return and exchange policy to respect the
              spiritual integrity of each item.
            </p>

            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Consecrated Products
              </h2>
              <p className="mt-2">
                Items that have been consecrated, energised, or prepared
                through sacred rituals cannot be returned or exchanged, as
                they have been spiritually attuned for the recipient.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Damaged or Incorrect Items
              </h2>
              <p className="mt-2">
                If you receive a damaged or incorrect item, please contact
                us within 48 hours of delivery with photographs. We will
                arrange a replacement at no additional cost.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Service Cancellations
              </h2>
              <p className="mt-2">
                Consultation bookings and Puja requests may be rescheduled
                based on availability. Cancellation policies vary by
                service type — please reach out to us for specific details.
              </p>
            </div>

            <div className="rounded-sm border border-gold/20 bg-gold-muted/20 p-5 text-sm">
              <p>
                We approach every situation with understanding. If you have
                concerns about your order, please reach out — we will do
                our best to find a respectful resolution.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
