'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, MessageCircle, ChevronDown, Check, ShieldCheck, Sparkles, Lock, Truck, ArrowRight, Star, Eye, BookOpen, Flame } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice, getWhatsAppLink } from '@/lib/utils';
import { useCartStore } from '@/lib/cart-store';
import { siteConfig } from '@/data/site-config';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { getActiveProducts } from '@/data/products';

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/60">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left font-heading text-[17px] font-semibold text-foreground"
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 text-foreground-subtle transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-[13px] leading-relaxed text-foreground-muted">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProductDetail({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant] = useState(
    product.variants?.[0]?.id
  );
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    addItem({
      type: 'product',
      productId: product.id,
      variantId: selectedVariant,
      quantity: 1,
      priceSnapshot: product.price,
      energization: false,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const allProducts = getActiveProducts();
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.isActive)
    .slice(0, 4);

  return (
    <>
      <section className="py-8 sm:py-10 lg:py-14">
        <Container>
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-[12px] text-foreground-subtle">
            <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/products" className="transition-colors hover:text-foreground">Products</Link>
            <span>/</span>
            <span className="text-foreground-muted">{product.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[55%_1fr] lg:gap-12">
            {/* Image Gallery */}
            <div>
              <div className="relative aspect-square overflow-hidden rounded-lg bg-cream-dark">
                {product.images[selectedImage] && (
                  <Image
                    src={product.images[selectedImage].src}
                    alt={product.images[selectedImage].alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover"
                    priority
                  />
                )}
                {/* Image counter */}
                {product.images.length > 1 && (
                  <div className="absolute bottom-3 right-3 rounded-full bg-foreground/60 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                    {selectedImage + 1} / {product.images.length}
                  </div>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all sm:h-[72px] sm:w-[72px] ${
                        selectedImage === i
                          ? 'border-green shadow-sm'
                          : 'border-transparent opacity-70 hover:border-border hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="72px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                {product.category.replace('-', ' ')}
              </p>
              <h1 className="mt-2 font-heading text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-tight text-foreground">
                {product.name}
              </h1>
              <p className="mt-1.5 text-[15px] leading-relaxed text-foreground-muted">
                {product.purpose}
              </p>

              {/* Price */}
              <div className="mt-5">
                <div className="flex items-baseline gap-3">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-foreground-subtle">
                    Energy Exchange
                  </span>
                  <span className="text-3xl font-bold text-green">
                    {formatPrice(product.price)}
                  </span>
                  {product.comparePrice && (
                    <span className="text-base text-foreground-subtle line-through">
                      {formatPrice(product.comparePrice)}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-foreground-subtle">
                  Price includes applicable taxes
                </p>
              </div>

              {/* CTAs */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="primary-green"
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  {addedToCart ? (
                    <><Check className="h-5 w-5" /> Added to Cart</>
                  ) : (
                    <><ShoppingBag className="h-5 w-5" /> Add to Cart</>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  Buy Now
                </Button>
              </div>

              {product.whatsappCustomization && siteConfig.whatsappNumber && (
                <a
                  href={getWhatsAppLink(
                    siteConfig.whatsappNumber,
                    `Namaste, I would like guidance/customisation for ${product.name}.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 text-[13px] text-foreground-muted transition-colors hover:text-foreground"
                >
                  <MessageCircle className="h-4 w-4" />
                  Need Guidance? WhatsApp Us
                </a>
              )}

              {/* Trust indicators */}
              <div className="mt-6 grid grid-cols-2 gap-3 rounded-lg border border-border/50 bg-cream-dark/50 p-3.5">
                {[
                  { icon: ShieldCheck, label: 'Spiritually Prepared' },
                  { icon: Sparkles, label: 'Energised & Activated' },
                  { icon: Lock, label: 'Secure Checkout' },
                  { icon: Truck, label: 'Careful Packaging' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-[11px] font-medium text-foreground-muted">
                    <Icon className="h-3.5 w-3.5 flex-shrink-0 text-gold" />
                    {label}
                  </div>
                ))}
              </div>

              {/* Accordions */}
              <div className="mt-8">
                {product.longDescription && (
                  <Accordion title="Sacred Purpose" defaultOpen>
                    <p>{product.longDescription}</p>
                  </Accordion>
                )}

                {product.benefits && product.benefits.length > 0 && (
                  <Accordion title="Benefits">
                    <ul className="space-y-2">
                      {product.benefits.map((b, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </Accordion>
                )}

                {product.recommendedFor && product.recommendedFor.length > 0 && (
                  <Accordion title="Who Is It Recommended For?">
                    <ul className="space-y-2">
                      {product.recommendedFor.map((r, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </Accordion>
                )}

                {product.kitIncludes && product.kitIncludes.length > 0 && (
                  <Accordion title="What You Receive" defaultOpen>
                    <ul className="grid grid-cols-2 gap-2.5">
                      {product.kitIncludes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 rounded-md bg-cream-dark/60 p-2.5">
                          <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green" />
                          <span className="text-[12px]">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Accordion>
                )}

                {product.preparationInfo && (
                  <Accordion title="How It Is Prepared">
                    <p>{product.preparationInfo}</p>
                  </Accordion>
                )}

                {product.howToUse && (
                  <Accordion title="How to Use">
                    <p>{product.howToUse}</p>
                  </Accordion>
                )}

                {product.careInstructions && (
                  <Accordion title="Care Instructions">
                    <p>{product.careInstructions}</p>
                  </Accordion>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-border/50 bg-cream-dark py-10 sm:py-12 lg:py-14">
          <Container>
            <div className="flex items-end justify-between">
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold sm:text-[11px]">
                  You May Also Like
                </p>
                <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
                  Related Sacred Products
                </h2>
              </div>
              <Link
                href="/products"
                className="hidden items-center gap-1 text-[13px] font-medium text-foreground-muted transition-colors hover:text-gold-dark sm:flex"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
              {relatedProducts.map((rp) => {
                const heroImg = rp.images.find((img) => img.type === 'hero') || rp.images[0];
                return (
                  <Link key={rp.id} href={`/products/${rp.slug}`} className="group">
                    <div className="overflow-hidden rounded-lg border border-border/50 bg-white transition-all duration-300 hover:border-gold/25 hover:shadow-md">
                      <div className="relative aspect-[3/4] overflow-hidden bg-cream-dark">
                        {heroImg && (
                          <Image
                            src={heroImg.src}
                            alt={heroImg.alt}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-gold-dark">
                          {rp.category.replace('-', ' ')}
                        </p>
                        <h3 className="mt-0.5 font-heading text-[14px] font-semibold leading-snug text-foreground transition-colors group-hover:text-green sm:text-[15px]">
                          {rp.name}
                        </h3>
                        <p className="mt-1 text-[14px] font-bold text-green">
                          {formatPrice(rp.price)}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* Explore Our Sacred Services */}
      <section className="border-t border-border/50 bg-[#FAF7EF] py-10 sm:py-12 lg:py-14">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold sm:text-[11px]">
              Beyond Sacred Products
            </p>
            <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              Explore Our Sacred Services
            </h2>
            <p className="mt-3 text-[14px] leading-relaxed text-foreground-muted">
              Deepen your spiritual journey with personalised consultations, sacred rituals, and devotional offerings.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Tarot & Consultation', description: 'Personal guidance with Tripuransh — Tarot, Akashic Reading, and Chakra Healing.', href: '/consultations', icon: Star },
              { title: 'Specialized Puja', description: 'Sacred puja performed individually with your Name, Sankalp and Gotra.', href: '/puja', icon: Flame },
              { title: 'Sacred Chadava', description: 'Deity offerings, Navagraha Poojan, and meaningful Daan Seva.', href: '/chadava', icon: Eye },
              { title: 'Meditation Guidance', description: 'Personalised meditation practices for inner peace and spiritual growth.', href: '/consultations/meditation-guidance', icon: BookOpen },
            ].map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.href}
                  href={service.href}
                  className="group flex flex-col rounded-xl border border-[#E8E2D4] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:shadow-lg"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gold/8 text-gold-dark transition-colors group-hover:bg-gold group-hover:text-white">
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.6} />
                  </div>
                  <h3 className="font-heading text-[15px] font-semibold text-foreground">
                    {service.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-foreground-muted">
                    {service.description}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-gold-dark transition-colors group-hover:text-gold">
                    Explore <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-[57px] left-0 right-0 z-40 border-t border-border bg-white/95 px-4 py-3 backdrop-blur-sm sm:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="truncate text-[11px] text-foreground-muted">{product.name}</p>
            <p className="text-lg font-bold text-green">
              {formatPrice(product.price)}
            </p>
          </div>
          <Button
            variant="primary-green"
            size="md"
            onClick={handleAddToCart}
            className="flex-shrink-0"
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </>
  );
}
