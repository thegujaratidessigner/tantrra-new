'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, Zap, ShoppingBag, ShieldCheck, Sparkles, Lock, Truck, ChevronRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { useCartStore } from '@/lib/cart-store';
import { products } from '@/data/products';
import { siteConfig } from '@/data/site-config';
import { formatPrice } from '@/lib/utils';
import { useState, useEffect } from 'react';

const trustItems = [
  { icon: ShieldCheck, label: 'Spiritually Prepared' },
  { icon: Sparkles, label: 'Energised & Activated' },
  { icon: Lock, label: 'Secure Checkout' },
  { icon: Truck, label: 'Careful Packaging' },
];

export default function CartPage() {
  const {
    items,
    dakshinaAmount,
    removeItem,
    updateQuantity,
    toggleEnergization,
    setDakshina,
    getSubtotal,
    getEnergizationTotal,
    getTotal,
    getItemCount,
  } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [customDakshina, setCustomDakshina] = useState('');

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <section className="py-16 sm:py-20 lg:py-28">
        <Container>
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto h-20 w-20 animate-pulse rounded-full bg-cream-dark" />
            <div className="mx-auto mt-6 h-8 w-48 animate-pulse rounded bg-cream-dark" />
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
              <ShoppingBag className="h-9 w-9 text-foreground-subtle/50" />
            </div>
            <h1 className="mt-6 font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-semibold text-foreground">
              Your Cart is Empty
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
              Explore our sacred collection and find what resonates with your
              spiritual journey.
            </p>
            <Button
              href="/products"
              variant="primary-green"
              size="lg"
              className="mt-8"
              withArrow
            >
              Explore Sacred Products
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  const itemCount = getItemCount();

  return (
    <section className="py-6 pb-36 sm:py-10 sm:pb-12 lg:py-14 lg:pb-16">
      <Container>
        {/* Premium cart header */}
        <div className="mb-8 lg:mb-10">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold sm:text-xs">
            Sacred Cart
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-tight text-foreground">
              Your Offerings
            </h1>
            <p className="hidden text-[13px] text-foreground-muted sm:block">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
          </div>
          <div className="mt-2 h-[1px] w-16 bg-gradient-to-r from-gold/60 to-transparent" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_400px]">
          {/* Cart Items Column */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product) return null;
                const heroImg = product.images.find((i) => i.type === 'hero') || product.images[0];

                return (
                  <motion.div
                    key={`${item.productId}-${item.variantId}`}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                    className="overflow-hidden rounded-lg border border-border/60 bg-white"
                  >
                    {/* Main item row */}
                    <div className="flex gap-4 p-4 sm:gap-5 sm:p-5">
                      {/* Product image */}
                      {heroImg && (
                        <Link
                          href={`/products/${product.slug}`}
                          className="relative h-[88px] w-[88px] flex-shrink-0 overflow-hidden rounded-md bg-cream-dark sm:h-[100px] sm:w-[100px]"
                        >
                          <Image
                            src={heroImg.src}
                            alt={product.name}
                            fill
                            sizes="100px"
                            className="object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </Link>
                      )}

                      {/* Product details */}
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-gold-dark sm:text-[10px]">
                              {product.category?.replace(/-/g, ' ') || 'Sacred'}
                            </p>
                            <Link
                              href={`/products/${product.slug}`}
                              className="mt-0.5 block font-heading text-[15px] font-semibold leading-snug text-foreground transition-colors hover:text-green sm:text-base"
                            >
                              {product.name}
                            </Link>
                          </div>
                          <button
                            onClick={() => removeItem(item.productId, item.variantId)}
                            className="mt-0.5 flex-shrink-0 rounded-md p-1.5 text-foreground-subtle/60 transition-colors hover:bg-red-50 hover:text-red-500"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Price + Quantity row */}
                        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                          <div className="flex items-center gap-0.5">
                            <span className="text-[15px] font-bold text-green sm:text-base">
                              {formatPrice(item.priceSnapshot * item.quantity)}
                            </span>
                            {item.quantity > 1 && (
                              <span className="ml-1 text-[11px] text-foreground-subtle">
                                ({formatPrice(item.priceSnapshot)} each)
                              </span>
                            )}
                          </div>

                          {/* Quantity controls */}
                          <div className="flex items-center rounded-md border border-border/80">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                              className="flex h-8 w-8 items-center justify-center text-foreground-subtle transition-colors hover:text-foreground"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="flex h-8 min-w-[2rem] items-center justify-center border-x border-border/80 text-[13px] font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                              className="flex h-8 w-8 items-center justify-center text-foreground-subtle transition-colors hover:text-foreground"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Energization upsell strip */}
                    {product.energizationAvailable && (
                      <div className="border-t border-border/40 bg-cream/50 px-4 py-2.5 sm:px-5">
                        <button
                          onClick={() => toggleEnergization(item.productId, item.variantId)}
                          className="flex w-full items-center gap-3"
                        >
                          <div
                            className={`flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded border transition-colors ${
                              item.energization
                                ? 'border-gold bg-gold text-white'
                                : 'border-foreground-subtle/30'
                            }`}
                          >
                            {item.energization && (
                              <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex flex-1 items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Zap className="h-3.5 w-3.5 text-gold" />
                              <span className="text-[12px] font-semibold text-foreground sm:text-[13px]">
                                Energise & Pran Pratishtha
                              </span>
                            </div>
                            <span className="text-[12px] font-semibold text-gold-dark sm:text-[13px]">
                              +{formatPrice(siteConfig.energizationPrice)}
                            </span>
                          </div>
                        </button>
                        <p className="mt-0.5 pl-[30px] text-[11px] leading-relaxed text-foreground-subtle">
                          Traditional spiritual preparation before dispatch
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Continue shopping link */}
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground-subtle transition-colors hover:text-green"
              >
                <ChevronRight className="h-3.5 w-3.5 rotate-180" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Summary card */}
              <div className="rounded-lg border border-border/60 bg-white p-5 sm:p-6">
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  Order Summary
                </h2>

                <div className="mt-5 space-y-3 text-[13px] sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground-muted">Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
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

                  <div className="flex justify-between text-foreground-muted">
                    <span>Shipping</span>
                    <span className="text-[12px] font-medium italic">At Actuals</span>
                  </div>

                  {/* Total */}
                  <div className="border-t border-border pt-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-semibold text-foreground">Total</span>
                      <span className="text-xl font-bold text-green">{formatPrice(getTotal())}</span>
                    </div>
                    <p className="mt-1 text-right text-[11px] text-foreground-subtle">
                      Inclusive of all applicable taxes
                    </p>
                  </div>
                </div>

                <Button
                  href="/checkout"
                  variant="primary-green"
                  size="lg"
                  className="mt-5 w-full"
                >
                  Proceed to Checkout
                </Button>

                <p className="mt-3 text-center text-[11px] leading-relaxed text-foreground-subtle">
                  Shipping charges calculated based on weight &amp; destination
                </p>
              </div>

              {/* Brahmin Dakshina card */}
              <div className="rounded-lg border border-gold/15 bg-gold-muted/30 p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🙏</span>
                  <h3 className="text-[13px] font-semibold text-foreground sm:text-sm">
                    Brahmin Dakshina
                    <span className="ml-1.5 font-normal text-foreground-subtle">— Optional</span>
                  </h3>
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-foreground-muted">
                  A voluntary offering to support the Brahmins who perform the sacred
                  rituals and recitations for your Kavach preparation.
                </p>

                <div className="mt-3.5 flex flex-wrap gap-2">
                  {siteConfig.dakshinaOptions.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setDakshina(dakshinaAmount === amount ? 0 : amount)}
                      className={`rounded-md border px-3.5 py-2 text-[12px] font-semibold transition-all sm:text-[13px] ${
                        dakshinaAmount === amount
                          ? 'border-gold bg-gold text-white shadow-sm'
                          : 'border-gold/20 bg-white text-foreground-muted hover:border-gold/40 hover:text-gold-dark'
                      }`}
                    >
                      {formatPrice(amount)}
                    </button>
                  ))}
                </div>

                {dakshinaAmount > 0 && (
                  <p className="mt-2.5 text-[11px] font-medium text-gold-dark">
                    Thank you for your offering of {formatPrice(dakshinaAmount)}
                  </p>
                )}
              </div>

              {/* Trust strip */}
              <div className="rounded-lg border border-border/40 bg-cream-dark/50 p-4">
                <div className="grid grid-cols-2 gap-3">
                  {trustItems.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <item.icon className="h-3.5 w-3.5 flex-shrink-0 text-green/60" />
                      <span className="text-[11px] font-medium text-foreground-subtle">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Sticky mobile checkout bar */}
      <div className="fixed bottom-[52px] left-0 right-0 z-40 border-t border-border bg-white/95 px-4 py-3 backdrop-blur-sm md:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] text-foreground-subtle">Total ({itemCount} {itemCount === 1 ? 'item' : 'items'})</p>
            <p className="text-lg font-bold text-green">{formatPrice(getTotal())}</p>
          </div>
          <Button
            href="/checkout"
            variant="primary-green"
            size="md"
            className="flex-shrink-0"
          >
            Checkout
          </Button>
        </div>
      </div>
    </section>
  );
}
