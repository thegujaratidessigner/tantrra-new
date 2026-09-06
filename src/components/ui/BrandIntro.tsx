'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export function BrandIntro() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const seen = sessionStorage.getItem('tantrra-intro-seen');
    if (seen) return;

    setShow(true);
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = '';
      sessionStorage.setItem('tantrra-intro-seen', '1');
    }, 2400);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(145deg, #FAF7EF 0%, #F5F1E8 50%, #FAF7EF 100%)' }}
        >
          {/* Sacred golden radial illumination */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.3 }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
            className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(184,138,59,0.12) 0%, rgba(184,138,59,0.04) 40%, transparent 70%)' }}
          />

          {/* Sacred geometry line drawing */}
          <motion.svg
            viewBox="0 0 200 200"
            className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 sm:h-[360px] sm:w-[360px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <motion.circle
              cx="100" cy="100" r="90"
              fill="none"
              stroke="rgba(184,138,59,0.15)"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.2, ease: 'easeInOut' }}
            />
            <motion.circle
              cx="100" cy="100" r="70"
              fill="none"
              stroke="rgba(184,138,59,0.1)"
              strokeWidth="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, delay: 0.4, ease: 'easeInOut' }}
            />
          </motion.svg>

          {/* Soft floating particles */}
          {[
            { left: '44%', top: '46%' },
            { left: '54%', top: '42%' },
            { left: '48%', top: '56%' },
            { left: '52%', top: '50%' },
          ].map((pos, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0, 0.5, 0.5, 0], y: [-5, -40] }}
              transition={{ duration: 2, delay: 0.5 + i * 0.2, ease: 'easeOut' }}
              className="absolute h-1 w-1 rounded-full bg-gold/40"
              style={pos}
            />
          ))}

          {/* Logo reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative z-10"
          >
            <Image
              src="/logo.png"
              alt="TANTRRA"
              width={160}
              height={200}
              className="h-28 w-auto sm:h-36"
              priority
              unoptimized
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: 'easeOut' }}
            className="relative z-10 mt-5 text-[10px] font-medium uppercase tracking-[0.35em] text-gold-dark/60 sm:text-xs"
          >
            Sacred Protection &middot; Guided by Tradition
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
