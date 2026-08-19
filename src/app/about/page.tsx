import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { PageHero } from '@/components/ui/PageHero';
import { ShieldCheck, Sparkles, HeartHandshake, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About TANTRRA',
  description:
    'TANTRRA is a sacred spiritual ecosystem offering consecrated products, Puja, personalised consultations, and guided Sadhana experiences.',
};

const pillars = [
  {
    icon: ShieldCheck,
    title: 'Authentic Preparation',
    description:
      'Each Kavach and sacred item is prepared through traditional Panch Upchar Pujan, accompanied by specific mantra recitations and consecration rituals.',
  },
  {
    icon: Sparkles,
    title: 'Spiritual Integrity',
    description:
      'We do not mass-produce. Every offering is prepared with the care, devotion, and attention that the tradition demands.',
  },
  {
    icon: HeartHandshake,
    title: 'Responsible Guidance',
    description:
      'Consultations focus on genuine insight rather than sensationalism — offering clarity and direction without unverifiable claims.',
  },
  {
    icon: BookOpen,
    title: 'Living Practice',
    description:
      'Beyond products, our Sadhana ecosystem helps seekers deepen their practice through guided meditation and spiritual learning.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="About"
        title="TANTRRA"
        description="A sacred spiritual ecosystem built on the belief that authentic spiritual practice deserves authentic tools, guidance, and community."
      />

      <div className="py-10 sm:py-12 lg:py-16">
        <Container>
          {/* Narrative section */}
          <div className="mx-auto max-w-3xl">
            <div className="space-y-5 text-[15px] leading-relaxed text-foreground-muted">
              <p>
                Every Kavach, Puja, and consultation offered through TANTRRA is
                rooted in traditional practices — prepared with genuine
                devotion, sacred recitations, and spiritual intention. The
                preparation process is as important as the product itself.
              </p>
              <p>
                Through our Seva initiatives — Brahmin Seva, Gau Seva, Kanya
                Pujan, Vriddha Seva, and support for those in need — we channel
                contributions toward meaningful service. Spiritual practice and
                service to others are inseparable.
              </p>
            </div>
          </div>

          {/* Pillars grid */}
          <div className="mx-auto mt-14 max-w-5xl">
            <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-gold sm:text-xs">
              Our Foundation
            </p>
            <h2 className="text-center font-heading text-[clamp(1.5rem,3vw,2.25rem)] font-semibold text-foreground">
              What Guides Us
            </h2>
            <div className="mx-auto mt-3 h-[1px] w-16 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="rounded-lg border border-border/60 bg-white p-6 transition-all hover:border-gold/20 hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cream-dark">
                    <pillar.icon className="h-5 w-5 text-green" />
                  </div>
                  <h3 className="mt-4 font-heading text-base font-semibold text-foreground sm:text-lg">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-foreground-muted">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA section */}
          <div className="mt-14 rounded-lg border border-gold/15 bg-gold-muted/30 p-8 text-center sm:p-12">
            <h2 className="font-heading text-[clamp(1.5rem,3vw,2rem)] font-semibold text-foreground">
              Begin Your Sacred Journey
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-foreground-muted">
              Explore our offerings and find what resonates with your spiritual
              path — from consecrated products to personalised guidance.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="/products" variant="primary-green" size="lg" withArrow>
                Explore Sacred Products
              </Button>
              <Button href="/consultations" variant="primary-maroon" size="lg" withArrow>
                Book a Consultation
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}
