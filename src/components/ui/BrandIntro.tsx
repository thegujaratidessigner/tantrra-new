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
    }, 2200);

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
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: 'linear-gradient(145deg, #1A1815 0%, #0F0E0C 50%, #1A1815 100%)' }}
        >
          {/* Sacred ambient glow */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 0.2, scale: 1.2 }}
              transition={{ duration: 2, ease: 'easeOut' }}
              className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(185,144,69,0.3) 0%, transparent 70%)' }}
            />
            {/* Subtle diya-like particles */}
            {[
              { left: '42%', top: '52%' },
              { left: '55%', top: '48%' },
              { left: '46%', top: '55%' },
              { left: '51%', top: '50%' },
              { left: '48%', top: '53%' },
              { left: '53%', top: '47%' },
            ].map((pos, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: [0, 0.4, 0.4, 0], y: [-10, -50] }}
                transition={{ duration: 2.2, delay: 0.3 + i * 0.15, ease: 'easeOut' }}
                className="absolute h-1 w-1 rounded-full bg-gold-light"
                style={pos}
              />
            ))}
          </div>

          {/* Logo reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative"
          >
            <Image
              src="/logo.png"
              alt="TANTRRA"
              width={160}
              height={200}
              className="h-24 w-auto sm:h-32"
              priority
              unoptimized
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
