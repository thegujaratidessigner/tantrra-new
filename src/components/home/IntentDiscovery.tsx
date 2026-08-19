'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Shield, TrendingUp, Gem, Heart, Sun, Activity, DollarSign, Zap, Building2, Compass } from 'lucide-react';

const intents = [
  { label: 'Protection', slug: 'protection', icon: Shield },
  { label: 'Success & Growth', slug: 'success-growth', icon: TrendingUp },
  { label: 'Wealth & Prosperity', slug: 'wealth-prosperity', icon: Gem },
  { label: 'Relationships', slug: 'relationships', icon: Heart },
  { label: 'Spiritual Growth', slug: 'spiritual-growth', icon: Sun },
  { label: 'Chakra Balance', slug: 'chakra-balance', icon: Activity },
  { label: 'Financial Difficulties', slug: 'financial-difficulties', icon: DollarSign },
  { label: 'Negative Energy', slug: 'negative-energy', icon: Zap },
  { label: 'Business Growth', slug: 'business-growth', icon: Building2 },
  { label: 'Personal Guidance', slug: 'personal-guidance', icon: Compass },
];

export function IntentDiscovery() {
  return (
    <section className="bg-warm-sand py-10 sm:py-12 lg:py-16">
      <Container>
        <SectionHeading
          label="Guided Discovery"
          title="What Are You Seeking Guidance For?"
          description="Select your area of focus and discover the sacred products, services, and practices that may support your journey."
        />

        {/* Desktop: wrapped chips */}
        <div className="mt-8 hidden flex-wrap justify-center gap-3 sm:flex">
          {intents.map((intent, i) => (
            <motion.div
              key={intent.slug}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
            >
              <Link
                href={`/products?intent=${intent.slug}`}
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-medium text-foreground-muted transition-all duration-200 hover:border-green/25 hover:bg-green/5 hover:text-green hover:shadow-sm active:scale-95"
              >
                <intent.icon className="h-4 w-4 text-foreground-subtle transition-colors group-hover:text-green" />
                {intent.label}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="mt-8 -mx-4 px-4 sm:hidden">
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-2">
            {intents.map((intent, i) => (
              <motion.div
                key={intent.slug}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="flex-shrink-0"
              >
                <Link
                  href={`/products?intent=${intent.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-[13px] font-medium text-foreground-muted transition-all active:scale-95"
                >
                  <intent.icon className="h-3.5 w-3.5 text-foreground-subtle" />
                  {intent.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
