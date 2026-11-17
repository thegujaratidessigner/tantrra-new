'use client';

import { useEffect, useRef, useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';
import { clearCheckoutSession, getCheckoutSession } from '@/lib/razorpay-checkout';
import type { PublicOrderView } from '@/lib/checkout-types';
import { Check, Loader2, AlertTriangle, XCircle, ShoppingBag, Home, RotateCcw } from 'lucide-react';

const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 40;

type ViewState =
  | { kind: 'loading' }
  | { kind: 'not_found' }
  | { kind: 'error' }
  | { kind: 'order'; order: PublicOrderView; pollingExhausted: boolean };

export function OrderStatus({ orderNumber, token }: { orderNumber: string; token: string }) {
  const [view, setView] = useState<ViewState>({ kind: 'loading' });
  const clearCart = useCartStore((s) => s.clearCart);
  const cartCleared = useRef(false);

  useEffect(() => {
    if (!orderNumber || !token) {
      setView({ kind: 'not_found' });
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let polls = 0;

    const load = async () => {
      polls += 1;
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(orderNumber)}`, {
          headers: { 'x-order-token': token },
          cache: 'no-store',
        });
        if (cancelled) return;
        if (res.status === 404) {
          setView({ kind: 'not_found' });
          return;
        }
        if (!res.ok) throw new Error(String(res.status));
        const order = (await res.json()) as PublicOrderView;
        if (cancelled) return;

        if (order.paymentStatus === 'paid' && !cartCleared.current) {
          // Only clear the cart that produced this order, not a newer cart from a later visit.
          const session = getCheckoutSession();
          if (session.orderNumber === order.orderNumber) {
            clearCart();
            clearCheckoutSession();
          }
          cartCleared.current = true;
        }

        const keepPolling = order.paymentStatus === 'pending' && polls < MAX_POLLS;
        setView({ kind: 'order', order, pollingExhausted: order.paymentStatus === 'pending' && !keepPolling });
        if (keepPolling) timer = setTimeout(load, POLL_INTERVAL_MS);
      } catch {
        if (cancelled) return;
        if (polls < 3) timer = setTimeout(load, POLL_INTERVAL_MS);
        else setView({ kind: 'error' });
      }
    };

    load();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [orderNumber, token, clearCart]);

  return (
    <section className="py-16 sm:py-20 lg:py-28">
      <Container>
        <div className="mx-auto max-w-lg text-center">{renderView(view)}</div>
      </Container>
    </section>
  );
}

function StatusIcon({ tone }: { tone: 'success' | 'pending' | 'error' }) {
  const ring = tone === 'success' ? 'bg-green/10' : tone === 'pending' ? 'bg-gold/10' : 'bg-maroon/10';
  const dot = tone === 'success' ? 'bg-green' : tone === 'pending' ? 'bg-gold' : 'bg-maroon';
  return (
    <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${ring}`}>
      <div className={`flex h-14 w-14 items-center justify-center rounded-full ${dot}`}>
        {tone === 'success' && <Check className="h-7 w-7 text-white" strokeWidth={2.5} />}
        {tone === 'pending' && <Loader2 className="h-7 w-7 animate-spin text-white" strokeWidth={2.5} />}
        {tone === 'error' && <XCircle className="h-7 w-7 text-white" strokeWidth={2.5} />}
      </div>
    </div>
  );
}

const headingClass =
  'mt-8 font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-tight text-foreground';

function HomeButtons() {
  return (
    <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <Button href="/products" variant="primary-green" size="lg">
        <ShoppingBag className="h-4 w-4" />
        Continue Shopping
      </Button>
      <Button href="/" variant="outline" size="lg">
        <Home className="h-4 w-4" />
        Return Home
      </Button>
    </div>
  );
}

function OrderSummary({ order }: { order: PublicOrderView }) {
  return (
    <div className="mt-8 rounded-lg border border-border/60 bg-white p-5 text-left">
      <div className="flex items-baseline justify-between gap-3 border-b border-border/60 pb-3">
        <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-foreground-subtle">Order Number</span>
        <span className="font-mono text-[14px] font-semibold text-foreground">{order.orderNumber}</span>
      </div>
      <ul className="mt-3 space-y-2">
        {order.items.map((item, i) => (
          <li key={i} className="flex justify-between gap-3 text-[13px]">
            <span className="text-foreground-muted">
              {item.name}
              {item.packageName ? ` — ${item.packageName}` : ''}
              {item.quantity > 1 ? ` × ${item.quantity}` : ''}
            </span>
            <span className="shrink-0 font-medium text-foreground">{formatPrice(item.lineTotalPaise / 100)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-baseline justify-between border-t border-border/60 pt-3">
        <span className="text-[14px] font-semibold text-foreground">
          {order.paymentStatus === 'paid' ? 'Amount Paid' : 'Order Total'}
        </span>
        <span className="text-lg font-bold text-green">{formatPrice(order.totalPaise / 100)}</span>
      </div>
    </div>
  );
}

function renderView(view: ViewState) {
  if (view.kind === 'loading') {
    return (
      <>
        <StatusIcon tone="pending" />
        <h1 className={headingClass}>Checking Your Payment</h1>
        <p className="mt-4 text-[15px] text-foreground-muted">Please wait while we confirm your payment with Razorpay.</p>
      </>
    );
  }

  if (view.kind === 'not_found') {
    return (
      <>
        <StatusIcon tone="error" />
        <h1 className={headingClass}>Order Not Found</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
          We couldn&rsquo;t find this order link. If you completed a payment, please keep your Razorpay
          payment reference and contact us — we&rsquo;ll help right away.
        </p>
        <HomeButtons />
      </>
    );
  }

  if (view.kind === 'error') {
    return (
      <>
        <StatusIcon tone="error" />
        <h1 className={headingClass}>Unable to Load Order Status</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
          We couldn&rsquo;t reach our server. If money was deducted, your payment is safe and will be
          matched to your order automatically. Please refresh this page in a minute.
        </p>
        <HomeButtons />
      </>
    );
  }

  const { order, pollingExhausted } = view;

  if (order.paymentStatus === 'paid') {
    return (
      <>
        <StatusIcon tone="success" />
        <h1 className={headingClass}>Payment Successful</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
          Thank you. Your payment has been verified and your order is confirmed.
          {order.requiresShipping
            ? ' We will share shipping updates on your email and phone.'
            : ' Our team will contact you with scheduling details.'}
        </p>
        <OrderSummary order={order} />
        <HomeButtons />
      </>
    );
  }

  if (order.paymentStatus === 'pending') {
    return (
      <>
        <StatusIcon tone="pending" />
        <h1 className={headingClass}>{pollingExhausted ? 'Payment Confirmation Pending' : 'Verifying Your Payment'}</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
          {pollingExhausted
            ? 'We have not received confirmation from the bank yet. If money was deducted, your order will be confirmed automatically once the bank responds — you can safely refresh this page later.'
            : 'This usually takes a few seconds. Please do not close this page.'}
        </p>
        <OrderSummary order={order} />
        {pollingExhausted && (
          <div className="mt-6 flex items-start gap-2 rounded-lg border border-amber-300/50 bg-amber-50 p-4 text-left">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
            <p className="text-[12px] leading-relaxed text-amber-800">
              If you did not complete the payment, your cart is still saved and you can return to checkout.
            </p>
          </div>
        )}
        {pollingExhausted && (
          <div className="mt-6 flex justify-center">
            <Button href="/checkout" variant="primary-green" size="lg">
              <RotateCcw className="h-4 w-4" />
              Return to Checkout
            </Button>
          </div>
        )}
      </>
    );
  }

  if (order.paymentStatus === 'refunded' || order.paymentStatus === 'partially_refunded') {
    return (
      <>
        <StatusIcon tone="success" />
        <h1 className={headingClass}>Order Refunded</h1>
        <p className="mt-4 text-[15px] text-foreground-muted">A refund has been issued for this order.</p>
        <OrderSummary order={order} />
        <HomeButtons />
      </>
    );
  }

  return (
    <>
      <StatusIcon tone="error" />
      <h1 className={headingClass}>Payment Not Completed</h1>
      <p className="mt-4 text-[15px] leading-relaxed text-foreground-muted">
        Your payment did not go through and no order has been confirmed. Your cart is still saved —
        you can try again with the same or a different payment method.
      </p>
      <OrderSummary order={order} />
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button href="/checkout" variant="primary-green" size="lg">
          <RotateCcw className="h-4 w-4" />
          Retry Payment
        </Button>
        <Button href="/cart" variant="outline" size="lg">
          View Cart
        </Button>
      </div>
    </>
  );
}
