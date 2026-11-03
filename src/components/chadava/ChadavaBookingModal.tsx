'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';
import type { ServiceType } from '@/lib/types';

interface ChadavaBookingModalProps {
  open: boolean;
  onClose: () => void;
  offeringName: string;
  offeringId: string;
  price: number;
  serviceType: ServiceType;
  metadata?: Record<string, string>;
}

export function ChadavaBookingModal({
  open,
  onClose,
  offeringName,
  offeringId,
  price,
  serviceType,
  metadata,
}: ChadavaBookingModalProps) {
  const [fullName, setFullName] = useState('');
  const [gotra, setGotra] = useState('');
  const [mobile, setMobile] = useState('');
  const [added, setAdded] = useState(false);
  const addServiceItem = useCartStore((s) => s.addServiceItem);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    addServiceItem({
      type: 'service',
      serviceId: offeringId,
      serviceName: offeringName,
      serviceType,
      quantity: 1,
      priceSnapshot: price,
      devoteeDetails: {
        fullName: fullName.trim(),
        gotra: gotra.trim() || undefined,
        mobile: mobile.trim() || undefined,
      },
      serviceMetadata: metadata,
    });

    setAdded(true);
  };

  const handleViewCart = () => {
    onClose();
    setAdded(false);
    setFullName('');
    setGotra('');
    setMobile('');
    router.push('/cart');
  };

  const handleClose = () => {
    onClose();
    if (added) {
      setAdded(false);
      setFullName('');
      setGotra('');
      setMobile('');
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="fixed inset-x-4 top-[50%] z-50 mx-auto max-w-md -translate-y-1/2 rounded-2xl border border-border/60 bg-white p-6 shadow-2xl sm:inset-x-auto sm:w-full"
          >
            {added ? (
              /* Success state */
              <div className="text-center py-2">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green/10">
                  <Check className="h-7 w-7 text-green" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                  Added to Cart
                </h3>
                <p className="mt-1.5 text-[13px] text-foreground-muted">
                  {offeringName}
                </p>
                <p className="mt-1 text-xl font-bold text-green">
                  {formatPrice(price)}
                </p>

                <div className="mt-6 flex flex-col gap-2.5">
                  <button
                    onClick={handleViewCart}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-green px-5 py-3 text-[14px] font-semibold text-white transition-all hover:bg-green/90 active:scale-[0.98]"
                  >
                    View Cart
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex w-full items-center justify-center rounded-lg border border-border px-5 py-2.5 text-[13px] font-medium text-foreground-muted transition-colors hover:bg-cream-dark"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            ) : (
              /* Booking form */
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gold">
                      Book Offering
                    </p>
                    <h3 className="mt-1 font-heading text-lg font-semibold text-foreground">
                      {offeringName}
                    </h3>
                  </div>
                  <button
                    onClick={handleClose}
                    className="rounded-lg p-1.5 text-foreground-subtle transition-colors hover:bg-cream-dark hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-green">{formatPrice(price)}</span>
                </div>

                {metadata && Object.keys(metadata).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {Object.entries(metadata).map(([key, value]) => (
                      <span
                        key={key}
                        className="rounded-full bg-gold/8 px-2.5 py-0.5 text-[11px] font-medium text-gold-dark"
                      >
                        {key}: {value}
                      </span>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                  <div>
                    <label className="block text-[13px] font-medium text-foreground">
                      Full Name <span className="text-maroon">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Devotee's full name"
                      className="mt-1 w-full rounded-md border border-border/80 bg-white px-3.5 py-2.5 text-[14px] text-foreground placeholder:text-foreground-subtle/40 focus:border-green focus:outline-none focus:ring-1 focus:ring-green/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-foreground">
                      Gotra <span className="text-[11px] font-normal text-foreground-subtle">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={gotra}
                      onChange={(e) => setGotra(e.target.value)}
                      placeholder="Family Gotra"
                      className="mt-1 w-full rounded-md border border-border/80 bg-white px-3.5 py-2.5 text-[14px] text-foreground placeholder:text-foreground-subtle/40 focus:border-green focus:outline-none focus:ring-1 focus:ring-green/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-foreground">
                      Mobile <span className="text-[11px] font-normal text-foreground-subtle">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="mt-1 w-full rounded-md border border-border/80 bg-white px-3.5 py-2.5 text-[14px] text-foreground placeholder:text-foreground-subtle/40 focus:border-green focus:outline-none focus:ring-1 focus:ring-green/30"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!fullName.trim()}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-green px-5 py-3 text-[14px] font-semibold text-white transition-all hover:bg-green/90 active:scale-[0.98] disabled:opacity-50"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Add to Cart — {formatPrice(price)}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
