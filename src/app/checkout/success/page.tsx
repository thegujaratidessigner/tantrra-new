import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, Home, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Payment Gateway Coming Soon',
  description:
    'Online payment is currently being set up. Please contact us to place your order.',
};

export default function OrderSuccessPage() {
  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <Container>
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500">
              <AlertTriangle className="h-7 w-7 text-white" strokeWidth={2.5} />
            </div>
          </div>

          <h1 className="mt-8 font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-tight text-foreground">
            Online Payment Coming Soon
          </h1>

          <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
            Our secure payment gateway is currently being set up. No order has been placed yet.
            Please contact us directly to complete your purchase.
          </p>

          <div className="mx-auto mt-6 max-w-sm rounded-lg border border-amber-300/40 bg-amber-50 px-5 py-4">
            <p className="text-[13px] leading-relaxed text-amber-800">
              We are working on enabling secure online payments. In the meantime,
              our team is happy to assist you with your order via WhatsApp or email.
            </p>
          </div>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              href="/products"
              variant="primary-green"
              size="lg"
            >
              <ShoppingBag className="h-4 w-4" />
              Browse Products
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
