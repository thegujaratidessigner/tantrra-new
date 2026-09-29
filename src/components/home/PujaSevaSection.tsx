'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Flame, Heart, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const offerings = [
  {
    title: 'Chadava',
    description:
      'Deity Anushthan, Navagraha Poojan, Tithi & Tewar Panchopchar Poojan, and Daan Seva — sacred offerings performed with devotion.',
    icon: Heart,
    href: '/chadava',
    cta: 'Explore Chadava',
  },
  {
    title: 'Specialized Puja',
    description:
      'Maa Kamakhya Puja, Sadashiv Puja, and Dash Mahavidya Puja — performed individually with your Name, Sankalp and Gotra.',
    icon: Flame,
    href: '/puja',
    cta: 'Explore Puja',
  },
  {
    title: 'Daan Seva',
    description:
      'Brahmin Seva, Gau Seva, Kanya Pujan, Vriddha Seva, and Needy People Seva — contribute to meaningful sacred causes.',
    icon: Sparkles,
    href: '/chadava#daan-seva',
    cta: 'View Seva Options',
  },
];

export function PujaSevaSection() {
  return (
    <section className="py-10 sm:py-12 lg:py-16">
      <Container>
        <SectionHeading
          label="Sacred Rituals"
          title="Participate in Sacred Rituals"
          description="Join in powerful Pujas, sacred Chadava offerings, and meaningful Daan Seva to support your spiritual path."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {offerings.map((item, i) => (
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
      </Container>
    </section>
  );
}
