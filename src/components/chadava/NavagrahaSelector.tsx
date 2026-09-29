'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navagrahaDays, navagrahaShanti, panchopcharItems } from '@/data/chadava';
import { formatPrice } from '@/lib/utils';
import { Sun, Moon, Flame, Sparkles, Star, Zap, Eye } from 'lucide-react';

const dayIcons: Record<string, React.ElementType> = {
  Monday: Moon,
  Tuesday: Flame,
  Wednesday: Sparkles,
  Thursday: Star,
  Friday: Sparkles,
  Saturday: Zap,
  Sunday: Sun,
};

const dayColors: Record<string, string> = {
  Monday: '#E8E8E8',
  Tuesday: '#F4D0D0',
  Wednesday: '#D0E8D0',
  Thursday: '#F4E8C0',
  Friday: '#E8E0F0',
  Saturday: '#D4D4E8',
  Sunday: '#F4E0D0',
};

export function NavagrahaSelector() {
  const [selectedDay, setSelectedDay] = useState(navagrahaDays[0].id);
  const activeDay = navagrahaDays.find((d) => d.id === selectedDay)!;

  return (
    <div>
      {/* Navagraha Shanti combined offering */}
      <div className="mb-8 rounded-lg border border-gold/20 bg-gradient-to-br from-[#FFFDF8] to-[#F8F3E8] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="font-heading text-lg font-semibold text-foreground">
              {navagrahaShanti.name}
            </h4>
            <p className="mt-1 text-[13px] text-foreground-muted">
              {navagrahaShanti.description}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
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
        <p className="mt-3 rounded-md bg-cream-dark/60 px-3 py-2 text-[11px] leading-relaxed text-foreground-subtle italic">
          {navagrahaShanti.note}
        </p>
      </div>

      {/* Day selector tabs */}
      <div className="mb-6">
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.15em] text-foreground-subtle">
          Select Day for Individual Graha Chadava
        </p>
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
          {navagrahaDays.map((day) => {
            const isActive = day.id === selectedDay;
            return (
              <button
                key={day.id}
                onClick={() => setSelectedDay(day.id)}
                className={`flex shrink-0 flex-col items-center rounded-lg border px-3 py-2.5 transition-all duration-200 sm:px-4 sm:py-3 ${
                  isActive
                    ? 'border-gold bg-gold/8 text-gold-dark shadow-sm'
                    : 'border-border/60 bg-white text-foreground-muted hover:border-gold/30'
                }`}
              >
                <span className="text-[12px] font-semibold sm:text-[13px]">{day.dayEnglish.slice(0, 3)}</span>
                <span className="mt-0.5 text-[10px] text-foreground-subtle">{day.dayHindi}</span>
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

          {activeDay.grahas.map((graha) => (
            <div key={graha.name} className="mt-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/10">
                  <Eye className="h-3.5 w-3.5 text-gold-dark" />
                </div>
                <h5 className="text-[14px] font-semibold text-foreground">{graha.name}</h5>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {graha.offerings.map((offering) => (
                  <div
                    key={offering.id}
                    className="flex items-center justify-between rounded-md border border-border/60 bg-white px-4 py-3 transition-all hover:border-gold/25 hover:shadow-sm"
                  >
                    <div>
                      <p className="text-[13px] font-medium text-foreground">{offering.name}</p>
                      <p className="text-[11px] text-foreground-subtle">{offering.nameHindi}</p>
                    </div>
                    <span className="ml-3 shrink-0 text-[14px] font-semibold text-green">
                      {formatPrice(offering.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Panchopchar note */}
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-md bg-cream-dark/50 px-4 py-2.5">
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
