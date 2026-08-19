'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { ShieldCheck, Sparkles, Lock, Headphones, MessageCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { siteConfig } from '@/data/site-config';
import { getWhatsAppLink } from '@/lib/utils';

const trustPoints = [
  { icon: ShieldCheck, title: 'Traditional Preparation', description: 'Each item is prepared through authentic sacred rituals' },
  { icon: Sparkles, title: 'Personal Guidance', description: 'Connect directly with Tripuransh for tailored spiritual advice' },
  { icon: Lock, title: 'Secure Payments', description: 'Your transactions are protected and confidential' },
  { icon: Headphones, title: 'Private Consultation', description: 'Consultations are kept fully private and confidential' },
  { icon: Clock, title: 'Clear Booking Process', description: 'Transparent timelines for every service and product' },
  { icon: MessageCircle, title: 'Support via WhatsApp', description: 'Reach us easily for questions and customisation' },
];

export function SadhakExperiences() {
  return (
    <section className="bg-cream-dark py-10 sm:py-12 lg:py-16">
      <Container>
        <div className="text-center">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-gold sm:text-xs">
            Why TANTRRA
          </p>
          <h2 className="font-heading text-[clamp(1.75rem,3vw,2.75rem)] font-semibold leading-tight text-foreground">
            Built on Trust, Guided by Devotion
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-foreground-muted">
            Every aspect of TANTRRA is designed with sincerity, transparency, and respect for
            sacred traditions.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trustPoints.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="flex items-start gap-3.5 rounded-lg bg-white p-4 transition-shadow hover:shadow-sm"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gold/8 text-gold-dark">
                <point.icon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">{point.title}</h3>
                <p className="mt-0.5 text-[12px] leading-relaxed text-foreground-muted">{point.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* WhatsApp CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10 text-center"
        >
          <p className="mb-4 text-[14px] text-foreground-muted">
            Have questions about a product or service?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {siteConfig.whatsappNumber && (
              <Button
                href={getWhatsAppLink(siteConfig.whatsappNumber, 'Namaste, I would like to know more about TANTRRA.')}
                variant="primary-green"
                size="md"
              >
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </Button>
            )}
            <Button href="/contact" variant="outline" size="md">
              Contact Us
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
