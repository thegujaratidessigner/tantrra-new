'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Flame, Sparkles, BookOpen, ArrowRight, Truck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

const paths = [
  {
    title: 'Sacred Products',
    description:
      'Protection, prosperity and spiritual support through consecrated items.',
    href: '/products',
    icon: ShieldCheck,
    accent: 'green' as const,
    motif: (
      <svg className="absolute right-3 top-3 h-16 w-16 opacity-[0.04] transition-opacity duration-500 group-hover:opacity-[0.08]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="0.4" />
        <path d="M50 5 L50 95 M5 50 L95 50" stroke="currentColor" strokeWidth="0.3" />
        <path d="M18 18 L82 82 M82 18 L18 82" stroke="currentColor" strokeWidth="0.3" />
      </svg>
    ),
  },
  {
    title: 'Puja & Seva',
    description:
      'Participate in sacred rituals, offerings and Seva contributions.',
    href: '/puja',
    icon: Flame,
    accent: 'gold' as const,
    motif: (
      <svg className="absolute right-3 top-3 h-16 w-16 opacity-[0.04] transition-opacity duration-500 group-hover:opacity-[0.08]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 10 Q65 35 50 50 Q35 35 50 10Z" stroke="currentColor" strokeWidth="0.6" />
        <path d="M50 10 Q75 30 50 60 Q25 30 50 10Z" stroke="currentColor" strokeWidth="0.5" />
        <path d="M50 15 Q80 40 50 75 Q20 40 50 15Z" stroke="currentColor" strokeWidth="0.4" />
        <circle cx="50" cy="80" r="8" stroke="currentColor" strokeWidth="0.5" />
        <line x1="50" y1="88" x2="50" y2="95" stroke="currentColor" strokeWidth="0.4" />
      </svg>
    ),
  },
  {
    title: 'Consultation',
    description:
      'Personal spiritual guidance and healing sessions with Tripuransh.',
    href: '/consultations',
    icon: Sparkles,
    accent: 'maroon' as const,
    motif: (
      <svg className="absolute right-3 top-3 h-16 w-16 opacity-[0.04] transition-opacity duration-500 group-hover:opacity-[0.08]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.6" />
        <path d="M50 10 L65 40 L95 45 L72 65 L78 95 L50 80 L22 95 L28 65 L5 45 L35 40Z" stroke="currentColor" strokeWidth="0.5" fill="none" />
        <circle cx="50" cy="50" r="12" stroke="currentColor" strokeWidth="0.4" />
      </svg>
    ),
  },
  {
    title: 'Sadhana',
    description:
      'Learn, practice and deepen your spiritual journey with guided content.',
    href: '/sadhana',
    icon: BookOpen,
    accent: 'green' as const,
    motif: (
      <svg className="absolute right-3 top-3 h-16 w-16 opacity-[0.04] transition-opacity duration-500 group-hover:opacity-[0.08]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 15 Q60 30 60 50 Q60 70 50 85 Q40 70 40 50 Q40 30 50 15Z" stroke="currentColor" strokeWidth="0.6" />
        <path d="M20 50 Q35 40 50 40 Q65 40 80 50 Q65 60 50 60 Q35 60 20 50Z" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.4" />
      </svg>
    ),
  },
];

const accentStyles = {
  green: {
    bg: 'bg-green/8',
    icon: 'text-green',
    hoverBg: 'group-hover:bg-green',
    hoverIcon: 'group-hover:text-white',
    borderHover: 'hover:border-green/25',
    line: 'bg-green',
  },
  maroon: {
    bg: 'bg-maroon/8',
    icon: 'text-maroon',
    hoverBg: 'group-hover:bg-maroon',
    hoverIcon: 'group-hover:text-white',
    borderHover: 'hover:border-maroon/25',
    line: 'bg-maroon',
  },
  gold: {
    bg: 'bg-gold/10',
    icon: 'text-gold-dark',
    hoverBg: 'group-hover:bg-gold',
    hoverIcon: 'group-hover:text-white',
    borderHover: 'hover:border-gold/25',
    line: 'bg-gold',
  },
};

const trustStrip = [
  { icon: ShieldCheck, label: 'Ritually Prepared' },
  { icon: Sparkles, label: 'Energised & Activated' },
  { icon: Flame, label: 'Guided by Tripuransh' },
  { icon: BookOpen, label: 'Secure & Confidential' },
  { icon: Truck, label: 'Fast & Safe Delivery' },
];

export function JourneyNavigator() {
  return (
    <section className="py-12 sm:py-14 lg:py-20">
      <Container>
        <SectionHeading
          label="Your Spiritual Path"
          title="Explore the TANTRRA Ecosystem"
          description="Four interconnected paths designed to support every dimension of your spiritual journey."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5 lg:gap-6">
          {paths.map((path, i) => {
            const styles = accentStyles[path.accent];
            return (
              <motion.div
                key={path.href}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
              >
                <Link
                  href={path.href}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-white p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${styles.borderHover}`}
                >
                  {/* Top accent line */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-[2px] ${styles.line} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  />

                  {/* Subtle spiritual motif */}
                  {path.motif}

                  <div
                    className={`mb-4 flex h-11 w-11 items-center justify-center rounded-lg transition-all duration-300 ${styles.bg} ${styles.icon} ${styles.hoverBg} ${styles.hoverIcon}`}
                  >
                    <path.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">
                    {path.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-foreground-muted">
                    {path.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-[13px] font-medium text-foreground-subtle transition-colors group-hover:text-foreground">
                    Explore
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Trust/Value Strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 rounded-lg border border-border/60 bg-white/60 px-6 py-4 lg:mt-14"
        >
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 lg:justify-between">
            {trustStrip.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2"
              >
                <item.icon className="h-4 w-4 text-gold-dark" />
                <span className="text-[12px] font-medium tracking-wide text-foreground-muted sm:text-[13px]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
