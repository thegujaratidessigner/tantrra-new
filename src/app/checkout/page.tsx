'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/lib/cart-store';
import { useSiteData } from '@/components/providers/SiteDataProvider';
import { useCartTotals } from '@/lib/use-cart-totals';
import { formatPrice } from '@/lib/utils';
import type { CartItem, ServiceCartItem, ServiceType } from '@/lib/types';
import type { CheckoutErrorResponse, CreateOrderRequest, CreateOrderResponse } from '@/lib/checkout-types';
import {
  getCheckoutSession,
  loadRazorpayCheckout,
  openRazorpayCheckout,
  saveCheckoutSession,
} from '@/lib/razorpay-checkout';
import { ShippingLabel } from '@/components/checkout/ShippingLabel';
import { ShieldCheck, Lock, Zap, Truck, ChevronLeft, CreditCard, Flame, Loader2, AlertCircle } from 'lucide-react';

const DEVOTEE_REQUIRED: ServiceType[] = ['puja', 'chadava-deity', 'chadava-navagraha', 'chadava-tithi'];

const needsDevoteeForm = (item: CartItem): item is ServiceCartItem =>
  item.type === 'service' && DEVOTEE_REQUIRED.includes(item.serviceType) && !item.devoteeDetails?.fullName;

type Stage = 'idle' | 'creating' | 'awaiting_payment' | 'verifying';

interface Notice {
  tone: 'error' | 'warning' | 'unavailable';
  title: string;
  text: string;
  showCartLink?: boolean;
}

interface DevoteeInput {
  fullName: string;
  gotra: string;
  sankalp: string;
}

const inputClasses =
  'mt-1.5 w-full rounded-md border border-border/80 bg-white px-4 py-2.5 text-[14px] text-foreground transition-colors placeholder:text-foreground-subtle/40 focus:border-green focus:outline-none focus:ring-1 focus:ring-green/30';

const labelClasses = 'block text-[13px] font-medium text-foreground';

export default function CheckoutPage() {
  const { items } =
    useCartStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto h-8 w-48 animate-pulse rounded bg-cream-dark" />
            <div className="mx-auto mt-4 h-6 w-32 animate-pulse rounded bg-cream-dark" />
          </div>
        </Container>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="py-16 sm:py-20 lg:py-28">
        <Container>
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cream-dark">
              <ShieldCheck className="h-9 w-9 text-foreground-subtle/50" />
            </div>
            <h1 className="mt-6 font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-semibold text-foreground">
              Nothing to Check Out
            </h1>
            <p className="mt-3 text-[15px] text-foreground-muted">
              Your cart is empty. Add items before proceeding to checkout.
            </p>
            <Button
              href="/products"
              variant="primary-green"
              size="lg"
              className="mt-8"
              withArrow
            >
              Browse Products
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  return <CheckoutForm />;
}

function CheckoutForm() {
  const { items, dakshinaAmount, hasProducts, hasServices, applyPriceUpdates } =
    useCartStore();
  const router = useRouter();
  const totals = useCartTotals();
  const { settings, productIndex } = useSiteData();

  const [contact, setContact] = useState({ name: '', email: '', phone: '' });
  const [address, setAddress] = useState({ line1: '', line2: '', city: '', state: '', pincode: '' });
  const [notes, setNotes] = useState('');
  const [devotees, setDevotees] = useState<Record<string, DevoteeInput>>({});
  const [stage, setStage] = useState<Stage>('idle');
  const [notice, setNotice] = useState<Notice | null>(null);
  const [hasAttempted, setHasAttempted] = useState(false);
  const stageRef = useRef<Stage>('idle');
  const lastFailureRef = useRef<string | null>(null);

  const showShipping = hasProducts();
  const onlyServices = hasServices() && !hasProducts();
  const devoteeItems = items.filter(needsDevoteeForm);
  const busy = stage !== 'idle';

  const updateStage = (next: Stage) => {
    stageRef.current = next;
    setStage(next);
  };

  const showNotice = (n: Notice) => {
    setNotice(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setDevoteeField = (serviceId: string, field: keyof DevoteeInput, value: string) =>
    setDevotees((prev) => ({
      ...prev,
      [serviceId]: { ...(prev[serviceId] ?? { fullName: '', gotra: '', sankalp: '' }), [field]: value },
    }));

  const buildPayload = (checkoutKey: string): CreateOrderRequest => ({
    checkoutKey,
    customer: contact,
    shipping: showShipping ? address : undefined,
    notes: notes.trim() || undefined,
    dakshinaAmount,
    items: items.map((item) => {
      if (!needsDevoteeForm(item)) return item;
      const d = devotees[item.serviceId];
      return {
        ...item,
        devoteeDetails: {
          ...item.devoteeDetails,
          fullName: d?.fullName.trim() ?? '',
          gotra: d?.gotra.trim() || undefined,
          sankalp: d?.sankalp.trim() || undefined,
        },
      };
    }),
  });

  const handleCreateError = (status: number, data: CheckoutErrorResponse | null) => {
    if (status === 503 || data?.error === 'payments_unavailable') {
      showNotice({
        tone: 'unavailable',
        title: 'Online Payment Temporarily Unavailable',
        text: 'Your cart has been preserved. Please try again shortly or contact us to complete your order.',
      });
      return;
    }
    if (data?.error === 'price_changed' && data.priceUpdates) {
      applyPriceUpdates(data.priceUpdates);
      showNotice({ tone: 'warning', title: 'Prices Updated', text: `${data.message} Your order summary now shows the current total.` });
      return;
    }
    if (data?.error === 'invalid_items') {
      showNotice({ tone: 'error', title: 'Please Review Your Cart', text: data.message, showCartLink: true });
      return;
    }
    showNotice({
      tone: 'error',
      title: 'Could Not Start Payment',
      text: data?.message ?? 'Something went wrong. Your cart is safe — please try again.',
    });
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stageRef.current !== 'idle') return;

    setNotice(null);
    lastFailureRef.current = null;
    updateStage('creating');

    const session = getCheckoutSession();
    let order: CreateOrderResponse;
    try {
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload(session.checkoutKey)),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        updateStage('idle');
        handleCreateError(res.status, data as CheckoutErrorResponse | null);
        return;
      }
      order = data as CreateOrderResponse;
    } catch {
      updateStage('idle');
      showNotice({ tone: 'error', title: 'Connection Problem', text: 'We could not reach our server. Please check your connection and try again.' });
      return;
    }

    saveCheckoutSession({ checkoutKey: session.checkoutKey, orderNumber: order.orderNumber, accessToken: order.accessToken });
    const statusUrl = `/checkout/success?order=${encodeURIComponent(order.orderNumber)}&t=${encodeURIComponent(order.accessToken)}`;

    if (order.paymentStatus === 'paid') {
      router.push(statusUrl);
      return;
    }

    try {
      await loadRazorpayCheckout();
    } catch {
      updateStage('idle');
      showNotice({ tone: 'error', title: 'Payment Window Unavailable', text: 'The secure payment window could not load. Please check your connection and try again.' });
      return;
    }

    updateStage('awaiting_payment');
    setHasAttempted(true);
    openRazorpayCheckout(
      {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'TANTRRA',
        description: order.description,
        order_id: order.razorpayOrderId,
        prefill: order.prefill,
        notes: { order_number: order.orderNumber },
        theme: { color: '#1B3D2F' },
        handler: async (response) => {
          updateStage('verifying');
          try {
            await fetch('/api/checkout/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
          } catch {
            // The status page reconciles with Razorpay directly, so a dropped verify call is recoverable.
          }
          router.push(statusUrl);
        },
        modal: {
          confirm_close: true,
          ondismiss: () => {
            if (stageRef.current === 'verifying') return;
            updateStage('idle');
            showNotice({
              tone: lastFailureRef.current ? 'error' : 'warning',
              title: lastFailureRef.current ? 'Payment Failed' : 'Payment Not Completed',
              text: lastFailureRef.current
                ? `${lastFailureRef.current} No money has been taken for this attempt. Your cart is safe — you can retry below.`
                : 'The payment window was closed before payment was completed. Your cart is safe — you can retry below.',
            });
          },
        },
      },
      (failure) => {
        lastFailureRef.current = failure.error?.description || 'Your payment could not be completed.';
      }
    );
  };

  const payLabel =
    stage === 'creating'
      ? 'Preparing Secure Payment…'
      : stage === 'awaiting_payment'
        ? 'Complete Payment in Window…'
        : stage === 'verifying'
          ? 'Verifying Payment…'
          : `${hasAttempted ? 'Retry Payment' : 'Pay Securely'} — ${formatPrice(totals.total)}`;

  return (
    <section className="py-6 pb-8 sm:py-10 lg:py-14">
      <Container>
        <div className="mb-8 lg:mb-10">
          <Link
            href="/cart"
            className="mb-4 inline-flex items-center gap-1 text-[13px] font-medium text-foreground-subtle transition-colors hover:text-green"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Back to Cart
          </Link>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold sm:text-xs">
            Secure Checkout
          </p>
          <h1 className="font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-tight text-foreground">
            Complete Your Order
          </h1>
          <div className="mt-2 h-[1px] w-16 bg-gradient-to-r from-gold/60 to-transparent" />
        </div>

        {notice && (
          <div
            role="alert"
            className={`mb-6 rounded-lg border p-5 ${
              notice.tone === 'error' ? 'border-maroon/25 bg-maroon/[0.04]' : 'border-amber-300/60 bg-amber-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  notice.tone === 'error' ? 'bg-maroon/10' : 'bg-amber-100'
                }`}
              >
                {notice.tone === 'error' ? (
                  <AlertCircle className="h-4 w-4 text-maroon" />
                ) : (
                  <CreditCard className="h-4 w-4 text-amber-700" />
                )}
              </div>
              <div>
                <p className={`text-[14px] font-semibold ${notice.tone === 'error' ? 'text-maroon' : 'text-amber-900'}`}>
                  {notice.title}
                </p>
                <p className={`mt-1.5 text-[13px] leading-relaxed ${notice.tone === 'error' ? 'text-foreground-muted' : 'text-amber-800/80'}`}>
                  {notice.text}
                </p>
                {notice.showCartLink && (
                  <Link href="/cart" className="mt-3 inline-flex text-[13px] font-semibold text-green underline underline-offset-2">
                    Go to Cart
                  </Link>
                )}
                {notice.tone === 'unavailable' && settings.contact.whatsappNumber && (
                  <a
                    href={`https://wa.me/${settings.contact.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hi, I would like to place an order from the TANTRRA website.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#20BA5C]"
                  >
                    Complete Order via WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_400px]">
          <form id="checkout-form" onSubmit={handlePay} className="space-y-6">
            <div className="rounded-lg border border-border/60 bg-white p-5 sm:p-6">
              <h2 className="font-heading text-base font-semibold text-foreground sm:text-lg">
                Contact Information
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClasses}>
                    Full Name <span className="text-maroon">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={100}
                    autoComplete="name"
                    value={contact.name}
                    onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                    placeholder="Enter full name"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>
                    Email <span className="text-maroon">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    maxLength={254}
                    autoComplete="email"
                    value={contact.email}
                    onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                    placeholder="your@email.com"
                    className={inputClasses}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClasses}>
                    Phone / WhatsApp <span className="text-maroon">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    autoComplete="tel"
                    pattern="\+?[0-9\s\-\(\)]{10,20}"
                    title="Enter a valid phone number, e.g. +91 98765 43210"
                    value={contact.phone}
                    onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                    placeholder="+91 XXXXX XXXXX"
                    className={inputClasses}
                  />
                  <p className="mt-1 text-[11px] text-foreground-subtle">
                    Used for order updates and coordination
                  </p>
                </div>
              </div>
            </div>

            {showShipping && (
              <div className="rounded-lg border border-border/60 bg-white p-5 sm:p-6">
                <h2 className="font-heading text-base font-semibold text-foreground sm:text-lg">
                  Shipping Address
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={labelClasses}>
                      Address Line 1 <span className="text-maroon">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={200}
                      autoComplete="address-line1"
                      value={address.line1}
                      onChange={(e) => setAddress((a) => ({ ...a, line1: e.target.value }))}
                      placeholder="House/Flat No., Building, Street"
                      className={inputClasses}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClasses}>Address Line 2</label>
                    <input
                      type="text"
                      maxLength={200}
                      autoComplete="address-line2"
                      value={address.line2}
                      onChange={(e) => setAddress((a) => ({ ...a, line2: e.target.value }))}
                      placeholder="Landmark, Area (optional)"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      City <span className="text-maroon">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={80}
                      autoComplete="address-level2"
                      value={address.city}
                      onChange={(e) => setAddress((a) => ({ ...a, city: e.target.value }))}
                      placeholder="City"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      State <span className="text-maroon">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={80}
                      autoComplete="address-level1"
                      value={address.state}
                      onChange={(e) => setAddress((a) => ({ ...a, state: e.target.value }))}
                      placeholder="State"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      PIN Code <span className="text-maroon">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      inputMode="numeric"
                      pattern="[1-9][0-9]{5}"
                      title="Enter a valid 6-digit PIN code"
                      autoComplete="postal-code"
                      value={address.pincode}
                      onChange={(e) => setAddress((a) => ({ ...a, pincode: e.target.value.trim() }))}
                      placeholder="6-digit PIN"
                      className={inputClasses}
                    />
                  </div>
                </div>
              </div>
            )}

            {onlyServices && (
              <div className="rounded-lg border border-green/20 bg-green/[0.03] p-5">
                <p className="text-[13px] leading-relaxed text-foreground-muted">
                  <span className="font-semibold text-green">No shipping required.</span>{' '}
                  Service bookings are performed remotely. Our team will contact you with scheduling details after your payment is confirmed.
                </p>
              </div>
            )}

            {devoteeItems.length > 0 && (
              <div className="rounded-lg border border-border/60 bg-white p-5 sm:p-6">
                <h2 className="font-heading text-base font-semibold text-foreground sm:text-lg">
                  Devotee Details
                </h2>
                <p className="mt-1 text-[12px] text-foreground-subtle">
                  Each Puja is performed individually with the devotee&rsquo;s Name, Sankalp and Gotra.
                </p>
                <div className="mt-4 space-y-5">
                  {devoteeItems.map((item) => {
                    const d = devotees[item.serviceId];
                    return (
                      <div key={item.serviceId} className="rounded-md border border-border/50 bg-cream-dark/30 p-4">
                        <p className="flex items-center gap-2 text-[13px] font-semibold text-foreground">
                          <Flame className="h-3.5 w-3.5 text-gold-dark" />
                          {item.serviceName}
                        </p>
                        <div className="mt-3 grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className={labelClasses}>
                              Devotee Name <span className="text-maroon">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              maxLength={100}
                              value={d?.fullName ?? ''}
                              onChange={(e) => setDevoteeField(item.serviceId, 'fullName', e.target.value)}
                              placeholder="Devotee's full name"
                              className={inputClasses}
                            />
                          </div>
                          <div>
                            <label className={labelClasses}>
                              Gotra <span className="text-[11px] font-normal text-foreground-subtle">(Optional)</span>
                            </label>
                            <input
                              type="text"
                              maxLength={60}
                              value={d?.gotra ?? ''}
                              onChange={(e) => setDevoteeField(item.serviceId, 'gotra', e.target.value)}
                              placeholder="Family Gotra"
                              className={inputClasses}
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className={labelClasses}>
                              Sankalp <span className="text-[11px] font-normal text-foreground-subtle">(Optional)</span>
                            </label>
                            <input
                              type="text"
                              maxLength={300}
                              value={d?.sankalp ?? ''}
                              onChange={(e) => setDevoteeField(item.serviceId, 'sankalp', e.target.value)}
                              placeholder="Your intention for this Puja"
                              className={inputClasses}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="rounded-lg border border-border/60 bg-white p-5 sm:p-6">
              <div className="flex items-center gap-2.5">
                <Lock className="h-4 w-4 text-green" />
                <h2 className="font-heading text-base font-semibold text-foreground sm:text-lg">
                  Payment Method
                </h2>
              </div>

              <div className="mt-4 rounded-lg border border-green/20 bg-green/[0.03] p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-green" />
                  <div>
                    <p className="text-[13px] font-semibold text-foreground sm:text-[14px]">
                      Secure Payment by Razorpay
                    </p>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-foreground-muted sm:text-[13px]">
                      Pay with UPI, cards, net banking or wallets in Razorpay&rsquo;s secure window.
                      Your card details are entered only with Razorpay and never reach our website.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border/60 bg-white p-5 sm:p-6">
              <h2 className="font-heading text-base font-semibold text-foreground sm:text-lg">
                Order Notes
                <span className="ml-1.5 text-[12px] font-normal text-foreground-subtle">(Optional)</span>
              </h2>
              <textarea
                rows={3}
                maxLength={1000}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific instructions for your order..."
                className="mt-3 w-full rounded-md border border-border/80 bg-white px-4 py-2.5 text-[14px] text-foreground transition-colors placeholder:text-foreground-subtle/40 focus:border-green focus:outline-none focus:ring-1 focus:ring-green/30"
              />
            </div>
          </form>

          <div>
            <div className="sticky top-24 space-y-4">
              <div className="rounded-lg border border-border/60 bg-white p-5 sm:p-6">
                <h2 className="font-heading text-base font-semibold text-foreground sm:text-lg">
                  Order Summary
                </h2>

                <div className="mt-4 space-y-3">
                  {items.map((item) => {
                    if (item.type === 'service') {
                      return (
                        <div
                          key={`svc-${item.serviceId}`}
                          className="flex items-center gap-3"
                        >
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-gold/8">
                            <Flame className="h-5 w-5 text-gold-dark" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-medium text-foreground">
                              {item.serviceName}
                            </p>
                            {item.packageName && (
                              <p className="text-[11px] text-foreground-subtle">{item.packageName}</p>
                            )}
                          </div>
                          <p className="flex-shrink-0 text-[13px] font-semibold text-foreground">
                            {formatPrice(item.priceSnapshot * item.quantity)}
                          </p>
                        </div>
                      );
                    }

                    const product = productIndex[item.productId];
                    if (!product) return null;
                    const heroImg = product.image ? { src: product.image } : null;

                    return (
                      <div
                        key={`prod-${item.productId}-${item.variantId}`}
                        className="flex items-center gap-3"
                      >
                        {heroImg && (
                          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-cream-dark">
                            <Image
                              src={heroImg.src}
                              alt={product.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-white">
                              {item.quantity}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium text-foreground">
                            {product.name}
                          </p>
                          {item.energization && (
                            <p className="flex items-center gap-1 text-[11px] text-gold-dark">
                              <Zap className="h-2.5 w-2.5" />
                              Energised
                            </p>
                          )}
                        </div>
                        <p className="flex-shrink-0 text-[13px] font-semibold text-foreground">
                          {formatPrice(item.priceSnapshot * item.quantity)}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 space-y-2.5 border-t border-border/60 pt-4 text-[13px]">
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Subtotal</span>
                    <span className="font-medium text-foreground">{formatPrice(totals.subtotal)}</span>
                  </div>
                  {totals.energization > 0 && (
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1 text-gold-dark">
                        <Zap className="h-3 w-3" />
                        Energization
                      </span>
                      <span className="font-medium text-gold-dark">
                        +{formatPrice(totals.energization)}
                      </span>
                    </div>
                  )}
                  {dakshinaAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gold-dark">Brahmin Dakshina</span>
                      <span className="font-medium text-gold-dark">
                        +{formatPrice(dakshinaAmount)}
                      </span>
                    </div>
                  )}
                  {showShipping && (
                    <div className="flex justify-between text-foreground-muted">
                      <span className="flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        Shipping
                      </span>
                      <ShippingLabel quote={totals.shipping} />
                    </div>
                  )}

                  <div className="border-t border-border/60 pt-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-semibold text-foreground">Total</span>
                      <span className="text-xl font-bold text-green">{formatPrice(totals.total)}</span>
                    </div>
                    <p className="mt-1 text-right text-[11px] text-foreground-subtle">
                      Inclusive of all applicable taxes
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={busy}
                aria-busy={busy}
                className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-gradient-to-r from-[#1B5E3B] to-[#2A7A4E] px-6 py-4 text-[15px] font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-[1.04] active:scale-[0.98] disabled:cursor-wait disabled:opacity-80 disabled:active:scale-100"
              >
                {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Lock className="h-5 w-5" />}
                {payLabel}
              </button>

              <div className="flex items-start gap-2 rounded-lg border border-border/40 bg-cream-dark/50 p-3.5">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-green/60" />
                <p className="text-[11px] leading-relaxed text-foreground-subtle">
                  Your personal information is encrypted and will only be used to
                  process and deliver your sacred order. We never share your data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
