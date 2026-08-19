'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Flame, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

const paths = [
  {
    title: 'Sacred Products',
    description: 'Protection, prosperity and spiritual support through consecrated items.',
    href: '/products',
    icon: ShieldCheck,
    accent: 'green' as const,
  },
  {
    title: 'Puja & Seva',
    description: 'Participate in sacred rituals, offerings and Seva contributions.',
    href: '/puja',
    icon: Flame,
    accent: 'gold' as const,
  },
  {
    title: 'Consultation',
    description: 'Personal spiritual guidance and healing sessions with Tripuransh.',
    href: '/consultations',
    icon: Sparkles,
    accent: 'maroon' as const,
  },
  {
    title: 'Sadhana',
    description: 'Learn, practice and deepen your spiritual journey with guided content.',
    href: '/sadhana',
    icon: BookOpen,
    accent: 'green' as const,
  },
];

const accentStyles = {
  green: {
    bg: 'bg-green/8',
    icon: 'text-green',
    hoverBg: 'group-hover:bg-green',
    hoverIcon: 'group-hover:text-white',
    borderHover: 'hover:border-green/20',
    line: 'bg-green',
  },
  maroon: {
    bg: 'bg-maroon/8',
    icon: 'text-maroon',
    hoverBg: 'group-hover:bg-maroon',
    hoverIcon: 'group-hover:text-white',
    borderHover: 'hover:border-maroon/20',
    line: 'bg-maroon',
  },
  gold: {
    bg: 'bg-gold/10',
    icon: 'text-gold-dark',
    hoverBg: 'group-hover:bg-gold',
    hoverIcon: 'group-hover:text-white',
    borderHover: 'hover:border-gold/20',
    line: 'bg-gold',
  },
};

export function JourneyNavigator() {
  return (
    <section className="py-10 sm:py-12 lg:py-16">
      <Container>
        <SectionHeading
          label="Your Spiritual Path"
          title="Explore the TANTRRA Ecosystem"
          description="Four interconnected paths designed to support every dimension of your spiritual journey."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
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
                  className={`group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-white p-5 transition-all duration-300 hover:shadow-md ${styles.borderHover}`}
                >
                  {/* Top accent line */}
                  <div className={`absolute top-0 left-0 right-0 h-[2px] ${styles.line} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

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
      </Container>
    </section>
  );
}
