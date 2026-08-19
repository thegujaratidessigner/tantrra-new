'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Compass, MessageCircle, HandHeart, Sparkles } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Choose Your Path',
    description: 'Explore sacred products, Puja, consultation, or Sadhana that resonates with your needs.',
    icon: Compass,
  },
  {
    number: '02',
    title: 'Receive Guidance',
    description: 'Connect with Tripuransh for personalised advice or let our descriptions guide your selection.',
    icon: MessageCircle,
  },
  {
    number: '03',
    title: 'Sacred Preparation',
    description: 'Your chosen Kavach or ritual is prepared through traditional practices with devotion and intention.',
    icon: HandHeart,
  },
  {
    number: '04',
    title: 'Continue Your Sadhana',
    description: 'Receive your sacred item with guidance, and deepen your practice through our Sadhana ecosystem.',
    icon: Sparkles,
  },
];

export function TrustProcess() {
  return (
    <section className="py-10 sm:py-12 lg:py-16">
      <Container>
        <SectionHeading
          label="The Experience"
          title="Your Journey with TANTRRA"
          description="A thoughtful, sacred process from discovery to continued spiritual practice."
        />

        {/* Desktop: horizontal */}
        <div className="mt-10 hidden lg:grid lg:grid-cols-4 lg:gap-0">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="relative text-center px-4"
            >
              {/* Connecting line */}
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
                  className="absolute top-6 left-[calc(50%+1.5rem)] h-[1px] w-[calc(100%-3rem)] origin-left bg-gradient-to-r from-gold/40 to-gold/10"
                />
              )}

              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-gold/25 bg-white text-gold shadow-sm">
                <step.icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                {step.number}
              </span>
              <h3 className="mt-1.5 font-heading text-[17px] font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-foreground-muted">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Mobile/Tablet: vertical timeline */}
        <div className="mt-10 lg:hidden">
          <div className="relative pl-10">
            {/* Vertical line */}
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="absolute left-[18px] top-0 h-full w-[1px] origin-top bg-gradient-to-b from-gold/40 via-gold/20 to-transparent"
            />

            <div className="space-y-8">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="relative"
                >
                  {/* Node */}
                  <div className="absolute -left-10 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-gold/25 bg-white text-gold shadow-sm">
                    <step.icon className="h-4 w-4" />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">{step.number}</span>
                    <h3 className="mt-0.5 font-heading text-base font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-foreground-muted">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
