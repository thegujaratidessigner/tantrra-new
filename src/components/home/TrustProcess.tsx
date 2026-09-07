'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Compass, MessageCircle, HandHeart, Sparkles } from 'lucide-react';

/* ================================================================
   DATA
   ================================================================ */

const steps = [
  {
    number: '01',
    title: 'Choose Your Path',
    description:
      'Explore sacred products, Puja, consultation, or Sadhana that resonates with your needs.',
    icon: Compass,
  },
  {
    number: '02',
    title: 'Receive Guidance',
    description:
      'Connect with Tripuransh for personalised advice or let our descriptions guide your selection.',
    icon: MessageCircle,
  },
  {
    number: '03',
    title: 'Sacred Preparation',
    description:
      'Your chosen Kavach or ritual is prepared through traditional practices with devotion and intention.',
    icon: HandHeart,
  },
  {
    number: '04',
    title: 'Continue Your Sadhana',
    description:
      'Receive your sacred item with guidance, and deepen your practice through our Sadhana ecosystem.',
    icon: Sparkles,
  },
];

/* ================================================================
   DECORATIVE SVGs
   ================================================================ */

function LotusOrnament() {
  return (
    <svg width="36" height="32" viewBox="0 0 36 32" fill="none" aria-hidden="true" className="inline-block">
      <path d="M18 6C20 10 24 15 24 20C24 24 21 27 18 28C15 27 12 24 12 20C12 15 16 10 18 6Z" fill="#B88A3B" opacity="0.35" />
      <path d="M18 10C15 13 10 16 8 20C6 24 8 26.5 11 27.5C13 23 15 20 18 18C21 20 23 23 25 27.5C28 26.5 30 24 28 20C26 16 21 13 18 10Z" fill="#B88A3B" opacity="0.25" />
      <path d="M18 2C18.8 5 20 8 20 8" stroke="#B88A3B" strokeWidth="0.6" opacity="0.4" />
      <path d="M18 14C16 16 12 18 10 21" stroke="#B88A3B" strokeWidth="0.5" opacity="0.3" />
      <path d="M18 14C20 16 24 18 26 21" stroke="#B88A3B" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

function BirdsDecoration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 80" fill="none" className={className} aria-hidden="true">
      <path d="M20 45C25 38 32 35 38 37" stroke="#7A9B68" strokeWidth="0.8" opacity="0.25" strokeLinecap="round" />
      <path d="M20 45C26 42 33 43 38 37" stroke="#7A9B68" strokeWidth="0.8" opacity="0.25" strokeLinecap="round" />
      <path d="M45 30C50 23 57 20 63 22" stroke="#7A9B68" strokeWidth="0.7" opacity="0.2" strokeLinecap="round" />
      <path d="M45 30C51 27 58 28 63 22" stroke="#7A9B68" strokeWidth="0.7" opacity="0.2" strokeLinecap="round" />
      <path d="M60 50C65 43 72 40 78 42" stroke="#7A9B68" strokeWidth="0.6" opacity="0.15" strokeLinecap="round" />
      <path d="M60 50C66 47 73 48 78 42" stroke="#7A9B68" strokeWidth="0.6" opacity="0.15" strokeLinecap="round" />
    </svg>
  );
}

function LeftBotanicals({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 500" fill="none" className={className} aria-hidden="true">
      {/* Main stem */}
      <path d="M160 0C140 60 100 120 80 200C60 280 50 360 70 500" stroke="#7A9B68" strokeWidth="1" opacity="0.15" />
      {/* Leaf 1 */}
      <path d="M140 80C110 70 80 90 70 120C100 110 130 100 140 80Z" fill="#7A9B68" opacity="0.06" />
      <path d="M140 80C110 70 80 90 70 120" stroke="#7A9B68" strokeWidth="0.7" opacity="0.12" />
      {/* Leaf 2 */}
      <path d="M100 180C70 165 40 185 35 215C65 200 90 195 100 180Z" fill="#7A9B68" opacity="0.05" />
      <path d="M100 180C70 165 40 185 35 215" stroke="#7A9B68" strokeWidth="0.6" opacity="0.1" />
      {/* Lotus outline bottom */}
      <path d="M60 380C70 350 90 340 100 350C110 340 130 350 140 380C120 370 100 365 80 370C70 372 65 375 60 380Z" stroke="#B88A3B" strokeWidth="0.6" opacity="0.12" fill="none" />
      <path d="M100 350C100 335 100 320 100 310" stroke="#7A9B68" strokeWidth="0.5" opacity="0.1" />
      {/* Small scattered leaves */}
      <circle cx="120" cy="140" r="3" fill="#7A9B68" opacity="0.05" />
      <circle cx="80" cy="250" r="2.5" fill="#7A9B68" opacity="0.04" />
      <path d="M130 300C120 290 105 295 100 308" stroke="#7A9B68" strokeWidth="0.5" opacity="0.08" />
    </svg>
  );
}

function RightBotanicals({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 500" fill="none" className={className} aria-hidden="true">
      {/* Sun disc */}
      <circle cx="60" cy="80" r="55" fill="#F0E6B8" opacity="0.12" />
      <circle cx="60" cy="80" r="40" fill="#F0E6B8" opacity="0.08" />
      {/* Branch */}
      <path d="M40 0C60 60 100 120 120 200C140 280 150 360 130 500" stroke="#7A9B68" strokeWidth="1" opacity="0.15" />
      {/* Leaf 1 */}
      <path d="M60 80C90 70 120 90 130 120C100 110 70 100 60 80Z" fill="#7A9B68" opacity="0.06" />
      <path d="M60 80C90 70 120 90 130 120" stroke="#7A9B68" strokeWidth="0.7" opacity="0.12" />
      {/* Leaf 2 */}
      <path d="M100 180C130 165 160 185 165 215C135 200 110 195 100 180Z" fill="#7A9B68" opacity="0.05" />
      <path d="M100 180C130 165 160 185 165 215" stroke="#7A9B68" strokeWidth="0.6" opacity="0.1" />
      {/* Lotus outline bottom */}
      <path d="M140 380C130 350 110 340 100 350C90 340 70 350 60 380C80 370 100 365 120 370C130 372 135 375 140 380Z" stroke="#B88A3B" strokeWidth="0.6" opacity="0.12" fill="none" />
      {/* Scattered dots */}
      <circle cx="80" cy="140" r="3" fill="#7A9B68" opacity="0.05" />
      <circle cx="120" cy="250" r="2.5" fill="#7A9B68" opacity="0.04" />
    </svg>
  );
}

/* ================================================================
   STEP ICON CIRCLE
   ================================================================ */

function StepCircle({ icon: Icon, index }: { icon: React.ElementType; index: number }) {
  return (
    <motion.div
      initial={{ scale: 0.94, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: 0.2 + index * 0.1 }}
      className="relative z-10 mx-auto flex h-[64px] w-[64px] min-[1200px]:h-[70px] min-[1200px]:w-[70px] items-center justify-center rounded-full border border-[#C9A84C]/30 bg-gradient-to-br from-[#FFFDF8] to-[#F8F3E8] shadow-[0_2px_12px_rgba(184,138,59,0.08),0_0_0_1px_rgba(184,138,59,0.06)]"
    >
      <div className="absolute inset-0 rounded-full bg-gradient-radial from-[#E4ECDB]/20 to-transparent" style={{ background: 'radial-gradient(circle, rgba(122,155,104,0.08) 0%, transparent 70%)' }} />
      <Icon className="relative h-[26px] w-[26px] min-[1200px]:h-[28px] min-[1200px]:w-[28px] text-[#B88A3B]" strokeWidth={1.6} />
    </motion.div>
  );
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export function TrustProcess() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #FBF8F0 0%, #FFFDF8 50%, #FBF8F0 100%)',
        paddingTop: 'clamp(48px, 5vw, 70px)',
        paddingBottom: 'clamp(48px, 5vw, 70px)',
      }}
    >
      {/* ---- Decorative background elements ---- */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Birds upper-left */}
        <BirdsDecoration className="absolute top-4 left-8 w-[100px] min-[768px]:left-12 min-[768px]:w-[130px] min-[1200px]:left-16 min-[1200px]:w-[160px] opacity-80" />

        {/* Left botanicals */}
        <LeftBotanicals className="absolute -left-2 top-0 h-full w-[160px] min-[768px]:w-[200px] min-[1200px]:w-[260px] opacity-80 max-[640px]:opacity-35 max-[640px]:w-[90px]" />

        {/* Right botanicals + sun */}
        <RightBotanicals className="absolute -right-2 top-0 h-full w-[160px] min-[768px]:w-[200px] min-[1200px]:w-[260px] opacity-80 max-[640px]:opacity-35 max-[640px]:w-[90px]" />
      </div>

      {/* ---- Content ---- */}
      <div className="relative z-10 mx-auto w-full max-w-[1600px] px-5 sm:px-8 min-[1200px]:px-12">

        {/* Title block */}
        <div className="mx-auto max-w-4xl text-center">
          {/* Lotus ornament with gold lines */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-4 flex items-center justify-center gap-3"
          >
            <span className="block h-[1px] w-[60px] min-[768px]:w-[80px] bg-gradient-to-r from-transparent to-[#B88A3B]/40" />
            <LotusOrnament />
            <span className="block h-[1px] w-[60px] min-[768px]:w-[80px] bg-gradient-to-l from-transparent to-[#B88A3B]/40" />
          </motion.div>

          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-5 min-[768px]:mb-6 text-[11px] min-[768px]:text-[12px] font-semibold uppercase tracking-[0.25em] text-[#B88A3B]"
            style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
          >
            The Experience
          </motion.p>

          {/* Main heading */}
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-[#17382B] leading-[1.1]"
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: 'clamp(34px, 3.4vw, 66px)',
              fontWeight: 600,
            }}
          >
            Your Journey with TANTRRA
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-3 min-[768px]:mt-4 max-w-xl text-[#918A80] leading-relaxed"
            style={{
              fontFamily: 'var(--font-inter), system-ui, sans-serif',
              fontSize: 'clamp(15px, 1.2vw, 20px)',
            }}
          >
            A thoughtful, sacred process from discovery to continued spiritual practice.
          </motion.p>
        </div>

        {/* ======== DESKTOP: 4-column horizontal timeline (min-[1200px]) ======== */}
        <div className="mt-[clamp(40px,4.5vw,70px)] hidden min-[1200px]:block">
          <div className="relative">
            {/* Connecting horizontal line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-[12.5%] right-[12.5%] top-[35px] h-[1px] origin-left"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(184,138,59,0.35) 15%, rgba(184,138,59,0.35) 85%, transparent)' }}
            />

            <div className="grid grid-cols-4 gap-0">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.3 + i * 0.1 }}
                  className="text-center px-4 min-[1400px]:px-6"
                >
                  <StepCircle icon={step.icon} index={i} />

                  <p
                    className="mt-5 text-[14px] min-[1400px]:text-[15px] font-semibold uppercase tracking-[0.18em] text-[#B88A3B]"
                    style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
                  >
                    {step.number}
                  </p>

                  <h3
                    className="mt-3 text-[#1B3D2F]"
                    style={{
                      fontFamily: 'var(--font-cormorant), Georgia, serif',
                      fontSize: 'clamp(19px, 1.4vw, 25px)',
                      fontWeight: 600,
                      lineHeight: 1.3,
                    }}
                  >
                    {step.title}
                  </h3>

                  <p
                    className="mx-auto mt-2.5 max-w-[280px] text-[#918A80] leading-[1.65]"
                    style={{
                      fontFamily: 'var(--font-inter), system-ui, sans-serif',
                      fontSize: 'clamp(14px, 0.95vw, 17px)',
                    }}
                  >
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ======== TABLET: 2×2 grid (768–1199px) ======== */}
        <div className="mt-[clamp(36px,4vw,56px)] hidden min-[768px]:block min-[1200px]:hidden">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 max-w-[700px] mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <StepCircle icon={step.icon} index={i} />

                <p
                  className="mt-4 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#B88A3B]"
                  style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
                >
                  {step.number}
                </p>

                <h3
                  className="mt-2 text-[20px] font-semibold text-[#1B3D2F]"
                  style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', lineHeight: 1.3 }}
                >
                  {step.title}
                </h3>

                <p
                  className="mx-auto mt-2 max-w-[260px] text-[15px] leading-[1.6] text-[#918A80]"
                  style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ======== MOBILE: vertical timeline (< 768px) ======== */}
        <div className="mt-10 min-[768px]:hidden">
          <div className="relative mx-auto max-w-[400px] pl-[52px]">
            {/* Vertical gold line */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="absolute left-[22px] top-[8px] bottom-[8px] w-[1px] origin-top"
              style={{ background: 'linear-gradient(180deg, transparent, rgba(184,138,59,0.3) 10%, rgba(184,138,59,0.3) 90%, transparent)' }}
            />

            <div className="space-y-8">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="relative"
                  >
                    {/* Circle on timeline */}
                    <div className="absolute -left-[52px] top-0 flex h-[44px] w-[44px] items-center justify-center rounded-full border border-[#C9A84C]/30 bg-gradient-to-br from-[#FFFDF8] to-[#F8F3E8] shadow-[0_1px_8px_rgba(184,138,59,0.08)]">
                      <Icon className="h-[20px] w-[20px] text-[#B88A3B]" strokeWidth={1.6} />
                    </div>

                    <div>
                      <p
                        className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B88A3B]"
                        style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
                      >
                        {step.number}
                      </p>
                      <h3
                        className="mt-1 text-[18px] font-semibold text-[#1B3D2F]"
                        style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', lineHeight: 1.3 }}
                      >
                        {step.title}
                      </h3>
                      <p
                        className="mt-1.5 text-[14px] leading-[1.6] text-[#918A80]"
                        style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
