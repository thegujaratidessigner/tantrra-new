'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navagrahaDays, navagrahaShanti, panchopcharItems } from '@/data/chadava';
import { formatPrice } from '@/lib/utils';
import { Sun, Moon, Flame, Sparkles, Star, Zap, X, MessageCircle } from 'lucide-react';

const dayIcons: Record<string, React.ElementType> = {
  Monday: Moon,
  Tuesday: Flame,
  Wednesday: Sparkles,
  Thursday: Star,
  Friday: Sparkles,
  Saturday: Zap,
  Sunday: Sun,
};

interface BookingSelection {
  offeringName: string;
  price: number;
  day?: string;
  graha?: string;
}

function BookingForm({
  selection,
  onClose,
}: {
  selection: BookingSelection;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [gotra, setGotra] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitted(true);
    },
    []
  );

  const whatsappMessage = encodeURIComponent(
    `Namaste, I would like to book:\n\n` +
      `Service: ${selection.offeringName}\n` +
      (selection.day ? `Day: ${selection.day}\n` : '') +
      (selection.graha ? `Graha: ${selection.graha}\n` : '') +
      `Amount: ${formatPrice(selection.price)}\n\n` +
      `Name: ${name}\n` +
      `Gotra: ${gotra || 'Not specified'}\n` +
      `Mobile: ${mobile}\n` +
      `Email: ${email}`
  );

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <h3 className="font-heading text-[18px] font-semibold text-foreground">
          Book Offering
        </h3>

        <div className="mt-3 rounded-lg bg-[#F8F5ED] px-4 py-3">
          <p className="text-[14px] font-medium text-foreground">
            {selection.offeringName}
          </p>
          {selection.day && (
            <p className="mt-0.5 text-[12px] text-foreground-muted">
              {selection.day} — {selection.graha}
            </p>
          )}
          <p className="mt-1 text-[17px] font-bold text-green">
            {formatPrice(selection.price)}
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="mb-1 block text-[13px] font-medium text-foreground">
                Full Name <span className="text-[#B5342E]">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-[#E8E2D4] bg-white px-4 py-2.5 text-[14px] text-foreground outline-none transition-colors focus:border-[#B88A3B]/40 focus:ring-1 focus:ring-[#B88A3B]/20"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-medium text-foreground">
                Gotra
              </label>
              <input
                type="text"
                value={gotra}
                onChange={(e) => setGotra(e.target.value)}
                className="w-full rounded-lg border border-[#E8E2D4] bg-white px-4 py-2.5 text-[14px] text-foreground outline-none transition-colors focus:border-[#B88A3B]/40 focus:ring-1 focus:ring-[#B88A3B]/20"
                placeholder="Enter your Gotra (optional if unknown)"
              />
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-medium text-foreground">
                Mobile Number <span className="text-[#B5342E]">*</span>
              </label>
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full rounded-lg border border-[#E8E2D4] bg-white px-4 py-2.5 text-[14px] text-foreground outline-none transition-colors focus:border-[#B88A3B]/40 focus:ring-1 focus:ring-[#B88A3B]/20"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-medium text-foreground">
                Email Address <span className="text-[#B5342E]">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[#E8E2D4] bg-white px-4 py-2.5 text-[14px] text-foreground outline-none transition-colors focus:border-[#B88A3B]/40 focus:ring-1 focus:ring-[#B88A3B]/20"
                placeholder="your.email@example.com"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-[#1B3D2F] py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#1B3D2F]/90"
            >
              Proceed to Book
            </button>
          </form>
        ) : (
          <div className="mt-5">
            <div className="rounded-xl border border-[#B88A3B]/20 bg-[#FFFDF8] p-5 text-center">
              <p className="font-heading text-[16px] font-semibold text-foreground">
                Online Payment Coming Soon
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-foreground-muted">
                Our online booking and payment system is currently being set up.
                To complete your booking, please reach out to us on WhatsApp with your details.
              </p>
              <a
                href={`https://wa.me/?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#20BD5B]"
              >
                <MessageCircle className="h-4 w-4" />
                Book via WhatsApp
              </a>
              <p className="mt-3 text-[11px] text-foreground-subtle">
                We will confirm your booking and share payment details directly.
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export function NavagrahaSelector() {
  const [selectedDay, setSelectedDay] = useState(navagrahaDays[0].id);
  const [booking, setBooking] = useState<BookingSelection | null>(null);
  const activeDay = navagrahaDays.find((d) => d.id === selectedDay)!;

  const openBooking = useCallback((sel: BookingSelection) => {
    setBooking(sel);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeBooking = useCallback(() => {
    setBooking(null);
    document.body.style.overflow = '';
  }, []);

  return (
    <div>
      {/* Navagraha Shanti combined offering */}
      <div className="mb-8 overflow-hidden rounded-xl border border-gold/20 bg-gradient-to-br from-[#FFFDF8] to-[#F8F3E8]">
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="font-heading text-lg font-semibold text-foreground">
                {navagrahaShanti.name}
              </h4>
              <p className="mt-1 text-[13px] text-foreground-muted">
                {navagrahaShanti.description}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {navagrahaShanti.panchopchar.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-gold/8 px-2.5 py-0.5 text-[11px] font-medium text-gold-dark"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 sm:flex-col sm:items-end">
              <p className="text-2xl font-bold text-green">{formatPrice(navagrahaShanti.price)}</p>
              <button
                onClick={() =>
                  openBooking({
                    offeringName: navagrahaShanti.name,
                    price: navagrahaShanti.price,
                  })
                }
                className="shrink-0 rounded-lg bg-[#1B3D2F] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#1B3D2F]/90"
              >
                Book Now
              </button>
            </div>
          </div>
          <p className="mt-3 rounded-lg bg-cream-dark/60 px-3 py-2 text-[11px] leading-relaxed text-foreground-subtle italic">
            {navagrahaShanti.note}
          </p>
        </div>
      </div>

      {/* Day selector */}
      <div className="mb-6">
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.15em] text-foreground-subtle">
          Select Day for Individual Graha Chadava
        </p>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {navagrahaDays.map((day) => {
            const isActive = day.id === selectedDay;
            const DayIcon = dayIcons[day.dayEnglish] || Sun;
            return (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`flex shrink-0 flex-col items-center gap-1 rounded-xl border px-4 py-3 transition-all duration-200 sm:px-5 sm:py-3.5 ${
                  isActive
                    ? 'border-gold bg-gradient-to-b from-gold/10 to-gold/5 text-gold-dark shadow-[0_2px_8px_rgba(184,138,59,0.12)]'
                    : 'border-[#E8E2D4] bg-white text-foreground-muted hover:border-gold/30 hover:bg-gold/[0.03]'
                }`}
              >
                <DayIcon className={`h-4 w-4 ${isActive ? 'text-gold' : 'text-foreground-subtle'}`} strokeWidth={1.6} />
                <span className="text-[12px] font-semibold sm:text-[13px]">{day.dayEnglish.slice(0, 3)}</span>
                <span className={`text-[10px] ${isActive ? 'text-gold-dark/70' : 'text-foreground-subtle'}`}>{day.dayHindi}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day offerings */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDay.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <h4 className="mb-1 font-heading text-lg font-semibold text-foreground">
            {activeDay.dayEnglish} — {activeDay.dayHindi}
          </h4>

          {activeDay.grahas.map((graha) => {
            const GrahaIcon = dayIcons[activeDay.dayEnglish] || Sun;
            return (
              <div key={graha.name} className="mt-5">
                <div className="mb-3 flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/10">
                    <GrahaIcon className="h-4 w-4 text-gold-dark" strokeWidth={1.6} />
                  </div>
                  <h5 className="text-[14px] font-semibold text-foreground">{graha.name}</h5>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {graha.offerings.map((offering) => (
                    <button
                      key={offering.id}
                      onClick={() =>
                        openBooking({
                          offeringName: offering.name,
                          price: offering.price,
                          day: activeDay.dayEnglish,
                          graha: graha.name,
                        })
                      }
                      className="flex items-center justify-between rounded-xl border border-[#E8E2D4] bg-white px-4 py-3.5 text-left transition-all hover:border-gold/25 hover:shadow-[0_4px_16px_rgba(33,29,24,0.05)]"
                    >
                      <div>
                        <p className="text-[13px] font-medium text-foreground">{offering.name}</p>
                        <p className="text-[11px] text-foreground-subtle">{offering.nameHindi}</p>
                      </div>
                      <span className="ml-3 shrink-0 text-[15px] font-bold text-green">
                        {formatPrice(offering.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Panchopchar note */}
          <div className="mt-5 flex flex-wrap items-center gap-2 rounded-xl bg-cream-dark/50 px-4 py-3">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-foreground-subtle">
              Panchopchar:
            </span>
            {panchopcharItems.map((item) => (
              <span
                key={item}
                className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-medium text-gold-dark"
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Booking modal */}
      <AnimatePresence>
        {booking && <BookingForm selection={booking} onClose={closeBooking} />}
      </AnimatePresence>
    </div>
  );
}
