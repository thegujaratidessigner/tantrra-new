'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Play, Lock, BookOpen, Headphones, Video, Users } from 'lucide-react';

const features = [
  { title: 'Free Guidance', description: 'Public spiritual education and introductory content', icon: BookOpen, free: true },
  { title: 'Guided Meditation', description: 'Step-by-step meditation practices for all levels', icon: Headphones, free: true },
  { title: 'Spiritual Learning', description: 'Deeper teachings on sacred traditions and practices', icon: Play, free: false },
  { title: 'Member Sadhana', description: 'Exclusive guided practices for committed seekers', icon: Lock, free: false },
  { title: 'Exclusive Videos', description: 'In-depth video content for spiritual development', icon: Video, free: false },
  { title: 'Live Sessions', description: 'Live and recorded sessions with Tripuransh', icon: Users, free: false },
];

export function SadhanaPreview() {
  return (
    <section className="bg-warm-sand py-10 sm:py-12 lg:py-16">
      <Container>
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-12 items-start">
          {/* Left: Featured panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="relative overflow-hidden rounded-xl bg-green p-7 sm:p-8">
              {/* Background decoration */}
              <div className="absolute inset-0 opacity-5">
                <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="sadhana-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                      <circle cx="30" cy="30" r="20" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#sadhana-pattern)" />
                </svg>
              </div>

              <div className="relative">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-green-muted">
                  Sadhana
                </p>
                <h2 className="mt-3 font-heading text-2xl font-semibold leading-tight text-white sm:text-3xl">
                  Go Beyond the Product.{' '}
                  <span className="text-gold-light">Begin the Practice.</span>
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-white/65">
                  A living ecosystem of guided meditation, spiritual learning, and exclusive
                  content to deepen your practice.
                </p>
                <Button
                  href="/sadhana"
                  variant="gold"
                  size="md"
                  withArrow
                  className="mt-6"
                >
                  Enter Sadhana
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Right: Feature grid */}
          <div className="lg:col-span-3 grid gap-3 sm:grid-cols-2">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="flex items-start gap-3.5 rounded-lg bg-white p-4 transition-shadow hover:shadow-sm"
              >
                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${feature.free ? 'bg-green/8 text-green' : 'bg-gold/8 text-gold-dark'}`}>
                  <feature.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[14px] font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    {!feature.free && (
                      <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-gold-dark">
                        Members
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[12px] leading-relaxed text-foreground-muted">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
