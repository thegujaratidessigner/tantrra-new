'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navagrahaDays, navagrahaShanti, panchopcharItems } from '@/data/chadava';
import { formatPrice } from '@/lib/utils';
import { Sun, Moon, Flame, Sparkles, Star, Zap } from 'lucide-react';

const dayIcons: Record<string, React.ElementType> = {
  Monday: Moon,
  Tuesday: Flame,
  Wednesday: Sparkles,
  Thursday: Star,
  Friday: Sparkles,
  Saturday: Zap,
  Sunday: Sun,
};

export function NavagrahaSelector() {
  const [selectedDay, setSelectedDay] = useState(navagrahaDays[0].id);
  const activeDay = navagrahaDays.find((d) => d.id === selectedDay)!;

  return (
    <div>
      {/* Navagraha Shanti combined offering */}
      <div className="mb-8 overflow-hidden rounded-xl border border-gold/20 bg-gradient-to-br from-[#FFFDF8] to-[#F8F3E8]">
        {/* Gold top accent */}
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
            <div className="text-left sm:text-right">
              <p className="text-2xl font-bold text-green">{formatPrice(navagrahaShanti.price)}</p>
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
                    <div
                      key={offering.id}
                      className="flex items-center justify-between rounded-xl border border-[#E8E2D4] bg-white px-4 py-3.5 transition-all hover:border-gold/25 hover:shadow-[0_4px_16px_rgba(33,29,24,0.05)]"
                    >
                      <div>
                        <p className="text-[13px] font-medium text-foreground">{offering.name}</p>
                        <p className="text-[11px] text-foreground-subtle">{offering.nameHindi}</p>
                      </div>
                      <span className="ml-3 shrink-0 text-[15px] font-bold text-green">
                        {formatPrice(offering.price)}
                      </span>
                    </div>
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
    </div>
  );
}
