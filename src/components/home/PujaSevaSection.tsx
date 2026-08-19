'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Flame, Heart, HandHeart, Flower2, Baby, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const mainOfferings = [
  {
    title: 'Sacred Puja',
    description: 'Navagraha Shanti, Navachandi, Mahakali Havan, and more — performed with devotion and traditional precision.',
    icon: Flame,
    href: '/puja',
    cta: 'Explore Puja',
    accent: 'gold',
  },
  {
    title: 'Seva & Chadava',
    description: 'Contribute to sacred causes — Brahmin Seva, Gau Seva, Kanya Pujan, Vriddha Seva, and support for those in need.',
    icon: Heart,
    href: '/puja#seva',
    cta: 'Contribute to Seva',
    accent: 'maroon',
  },
  {
    title: 'Sacred Offerings',
    description: 'Deepdaan, Chadava, and special offerings to support your spiritual intentions with dedicated rituals.',
    icon: HandHeart,
    href: '/puja',
    cta: 'View Offerings',
    accent: 'green',
  },
];

const sevaTypes = [
  { label: 'Brahmin Seva', icon: Users },
  { label: 'Gau Seva', icon: Heart },
  { label: 'Kanya Pujan', icon: Baby },
  { label: 'Vriddha Seva', icon: HandHeart },
  { label: 'Deepdaan', icon: Flame },
  { label: 'Pushp Chadava', icon: Flower2 },
];

export function PujaSevaSection() {
  return (
    <section className="py-10 sm:py-12 lg:py-16">
      <Container>
        <SectionHeading
          label="Puja & Seva"
          title="Participate in Sacred Rituals"
          description="Join in powerful Pujas, sacred offerings, and meaningful Seva to support your spiritual path and serve the community."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {mainOfferings.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-lg border border-border bg-white p-6 text-center transition-all duration-300 hover:shadow-md hover:border-gold/20"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/8 text-gold-dark transition-all duration-300 group-hover:bg-gold group-hover:text-white">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-foreground-muted">
                  {item.description}
                </p>
                <div className="mt-4 inline-flex items-center justify-center gap-1.5 text-[13px] font-medium text-gold-dark transition-colors group-hover:text-gold">
                  {item.cta}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Seva type chips */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8 flex flex-wrap justify-center gap-2.5"
        >
          {sevaTypes.map((seva) => (
            <div
              key={seva.label}
              className="flex items-center gap-2 rounded-full border border-border bg-cream-dark px-4 py-2 text-[13px] font-medium text-foreground-muted"
            >
              <seva.icon className="h-3.5 w-3.5 text-gold-dark" />
              {seva.label}
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
