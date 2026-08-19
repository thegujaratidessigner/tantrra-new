import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for TANTRRA — how we handle your personal information.',
};

export default function PrivacyPage() {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Legal
          </p>
          <h1 className="font-heading text-3xl font-semibold text-foreground sm:text-4xl">
            Privacy Policy
          </h1>

          <div className="mt-8 space-y-6 text-base leading-relaxed text-foreground-muted">
            <p>
              At TANTRRA, we respect your privacy and are committed to
              protecting the personal information you share with us. This
              policy outlines how we collect, use, and safeguard your data.
            </p>

            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Information We Collect
              </h2>
              <p className="mt-2">
                We collect information you voluntarily provide when placing
                orders, booking consultations, or creating an account. This
                includes your name, email, phone number, and shipping
                address.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                How We Use Your Information
              </h2>
              <ul className="mt-2 space-y-2">
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                  Processing and fulfilling your orders
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                  Scheduling consultations and Puja services
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                  Sending order updates and tracking information
                </li>
                <li className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                  Providing Sadhana content you have access to
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Data Protection
              </h2>
              <p className="mt-2">
                Your personal data is stored securely and is never sold to
                third parties. We use industry-standard security measures to
                protect your information. Payment processing is handled
                through secure, PCI-compliant payment gateways.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Your Rights
              </h2>
              <p className="mt-2">
                You may request access to, correction of, or deletion of
                your personal data at any time by contacting us. We will
                respond to such requests promptly.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Cookies
              </h2>
              <p className="mt-2">
                Our website uses essential cookies for cart functionality
                and session management. We do not use third-party tracking
                cookies without your consent.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
