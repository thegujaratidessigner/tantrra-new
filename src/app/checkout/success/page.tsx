import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Check, ShoppingBag, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description:
    'Your sacred order has been placed successfully. Thank you for choosing TANTRRA.',
};

export default function OrderSuccessPage() {
  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <Container>
        <div className="mx-auto max-w-lg text-center">
          {/* Success icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#1B3D2F]/10">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1B3D2F]">
              <Check className="h-7 w-7 text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Sacred text */}
          <p
            className="mt-8 text-lg text-[#B88A3B] sm:text-xl"
            style={{ fontFamily: 'var(--font-devanagari), serif' }}
          >
            🌺 ।। श्री गुरुचरणअपनमस्तु ।। 🌺
          </p>

          {/* Ornamental lotus divider */}
          <div className="mx-auto mt-6 flex items-center justify-center gap-3">
            <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#B88A3B]/50" />
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#B88A3B]/60"
              aria-hidden="true"
            >
              <path
                d="M14 4C14 4 10.5 8 10.5 12C10.5 14.5 12 16 14 16C16 16 17.5 14.5 17.5 12C17.5 8 14 4 14 4Z"
                fill="currentColor"
                opacity="0.5"
              />
              <path
                d="M14 8C14 8 8 11 8 15C8 17.5 10.5 19 14 19C17.5 19 20 17.5 20 15C20 11 14 8 14 8Z"
                fill="currentColor"
                opacity="0.35"
              />
              <path
                d="M14 12C14 12 5 14.5 5 18.5C5 21.5 9 23.5 14 23.5C19 23.5 23 21.5 23 18.5C23 14.5 14 12 14 12Z"
                fill="currentColor"
                opacity="0.2"
              />
            </svg>
            <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#B88A3B]/50" />
          </div>

          {/* Confirmation heading */}
          <h1 className="mt-6 font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-tight text-foreground">
            Thank You for Your Sacred Order
          </h1>

          {/* Confirmation message */}
          <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
            Your order has been placed successfully. Each item will be prepared
            with care, devotion, and proper consecration before it reaches you.
          </p>

          {/* WhatsApp/email note */}
          <div className="mx-auto mt-6 max-w-sm rounded-lg border border-[#B88A3B]/15 bg-[#B88A3B]/[0.04] px-5 py-4">
            <p className="text-[13px] leading-relaxed text-foreground-muted">
              You will receive your complete order details and tracking
              information on <span className="font-medium text-foreground">WhatsApp</span> and{' '}
              <span className="font-medium text-foreground">email</span> shortly.
            </p>
          </div>

          {/* Action buttons */}
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              href="/products"
              variant="primary-green"
              size="lg"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Button>
            <Button
              href="/"
              variant="outline"
              size="lg"
            >
              <Home className="h-4 w-4" />
              Return Home
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
