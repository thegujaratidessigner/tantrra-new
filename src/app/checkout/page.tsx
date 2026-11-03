'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/lib/cart-store';
import { products } from '@/data/products';
import { siteConfig } from '@/data/site-config';
import { formatPrice } from '@/lib/utils';
import { ShieldCheck, Lock, Zap, Truck, ChevronLeft, CreditCard, Flame } from 'lucide-react';

const inputClasses =
  'mt-1.5 w-full rounded-md border border-border/80 bg-white px-4 py-2.5 text-[14px] text-foreground transition-colors placeholder:text-foreground-subtle/40 focus:border-green focus:outline-none focus:ring-1 focus:ring-green/30';

const labelClasses = 'block text-[13px] font-medium text-foreground';

export default function CheckoutPage() {
  const { items, dakshinaAmount, getSubtotal, getEnergizationTotal, getTotal, hasProducts, hasServices } =
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
  const { items, dakshinaAmount, getSubtotal, getEnergizationTotal, getTotal, hasProducts, hasServices } =
    useCartStore();
  const [showPaymentNotice, setShowPaymentNotice] = useState(false);

  const showShipping = hasProducts();
  const onlyServices = hasServices() && !hasProducts();

  const handlePlaceOrder = () => {
    setShowPaymentNotice(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

        {showPaymentNotice && (
          <div className="mb-6 rounded-lg border border-amber-300/60 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
                <CreditCard className="h-4 w-4 text-amber-700" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-amber-900">
                  Order Not Yet Confirmed
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-amber-800/80">
                  Online payment is not yet available. Your cart has been preserved.
                  {siteConfig.whatsappNumber
                    ? ' To complete your order, please contact us on WhatsApp and our team will assist you with payment and confirmation.'
                    : ' Our team will reach out to assist you with payment and confirmation once online ordering is available.'}
                </p>
                {siteConfig.whatsappNumber && (
                  <a
                    href={`https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent('Hi, I would like to place an order from the TANTRRA website.')}`}
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
          <div className="space-y-6">
            <div className="rounded-lg border border-border/60 bg-white p-5 sm:p-6">
              <h2 className="font-heading text-base font-semibold text-foreground sm:text-lg">
                Contact Information
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClasses}>
                    Full Name <span className="text-maroon">*</span>
                  </label>
                  <input type="text" required placeholder="Enter full name" className={inputClasses} />
                </div>
                <div>
                  <label className={labelClasses}>
                    Email <span className="text-maroon">*</span>
                  </label>
                  <input type="email" required placeholder="your@email.com" className={inputClasses} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelClasses}>
                    Phone / WhatsApp <span className="text-maroon">*</span>
                  </label>
                  <input type="tel" required placeholder="+91 XXXXX XXXXX" className={inputClasses} />
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
                    <input type="text" required placeholder="House/Flat No., Building, Street" className={inputClasses} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClasses}>Address Line 2</label>
                    <input type="text" placeholder="Landmark, Area (optional)" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      City <span className="text-maroon">*</span>
                    </label>
                    <input type="text" required placeholder="City" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      State <span className="text-maroon">*</span>
                    </label>
                    <input type="text" required placeholder="State" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>
                      PIN Code <span className="text-maroon">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      pattern="[0-9]{6}"
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
                  Service bookings are performed remotely. You will be contacted for scheduling details after your order is confirmed.
                </p>
              </div>
            )}

            <div className="rounded-lg border border-border/60 bg-white p-5 sm:p-6">
              <div className="flex items-center gap-2.5">
                <Lock className="h-4 w-4 text-green" />
                <h2 className="font-heading text-base font-semibold text-foreground sm:text-lg">
                  Payment Method
                </h2>
              </div>

              <div className="mt-4 rounded-lg border border-amber-200/80 bg-amber-50/60 p-4">
                <div className="flex items-start gap-3">
                  <CreditCard className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                  <div>
                    <p className="text-[13px] font-semibold text-amber-900 sm:text-[14px]">
                      Online Payment Coming Soon
                    </p>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-amber-800/80 sm:text-[13px]">
                      Our secure payment gateway is currently being integrated.
                      Your order cannot be placed online yet. Click &ldquo;Place Order&rdquo;
                      below to see how to complete your purchase.
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
                placeholder="Any specific instructions for your order..."
                className="mt-3 w-full rounded-md border border-border/80 bg-white px-4 py-2.5 text-[14px] text-foreground transition-colors placeholder:text-foreground-subtle/40 focus:border-green focus:outline-none focus:ring-1 focus:ring-green/30"
              />
            </div>
          </div>

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

                    const product = products.find((p) => p.id === item.productId);
                    if (!product) return null;
                    const heroImg = product.images.find((i) => i.type === 'hero') || product.images[0];

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
                    <span className="font-medium text-foreground">{formatPrice(getSubtotal())}</span>
                  </div>
                  {getEnergizationTotal() > 0 && (
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1 text-gold-dark">
                        <Zap className="h-3 w-3" />
                        Energization
                      </span>
                      <span className="font-medium text-gold-dark">
                        +{formatPrice(getEnergizationTotal())}
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
                      <span className="text-[12px] font-medium italic">At Actuals</span>
                    </div>
                  )}

                  <div className="border-t border-border/60 pt-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-semibold text-foreground">Total</span>
                      <span className="text-xl font-bold text-green">{formatPrice(getTotal())}</span>
                    </div>
                    <p className="mt-1 text-right text-[11px] text-foreground-subtle">
                      Inclusive of all applicable taxes
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-gradient-to-r from-[#1B5E3B] to-[#2A7A4E] px-6 py-4 text-[15px] font-semibold text-white shadow-md transition-all duration-200 hover:shadow-lg hover:brightness-[1.04] active:scale-[0.98]"
              >
                <CreditCard className="h-5 w-5" />
                Place Order
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
