import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { PageHero } from '@/components/ui/PageHero';
import { ShieldCheck, Sparkles, HeartHandshake, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About TANTRRA',
  description:
    'TANTRRA is a sacred spiritual ecosystem offering consecrated products, Puja, Chadava offerings, and personalised spiritual consultations.',
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
      'Beyond products, our sacred offerings and Puja services help seekers deepen their practice through devoted rituals and spiritual learning.',
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
          {/* Founder + narrative section */}
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div className="relative h-[180px] w-[180px] shrink-0 overflow-hidden rounded-xl border border-gold/15 shadow-sm sm:h-[200px] sm:w-[200px]">
                <Image
                  src="/images/founder-photo.webp"
                  alt="Tripuransh — Founder of TANTRRA"
                  fill
                  sizes="200px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">Founder</p>
                <h2 className="mt-1 font-heading text-xl font-semibold text-foreground">Tripuransh</h2>
              </div>
            </div>
            <div className="space-y-5 text-[15px] leading-relaxed text-foreground-muted">
              <p>
                JJainam Gada, spiritually known as Tripuransh, is the founder and principal Sadhak of TANTRRA, established in 2026 with the vision of making sacred spiritual offerings accessible to devotees across the world. Born in Mumbai in 2008 and raised in a Jain family, he developed a deep connection with Devi Maa during childhood and has been following his Sadhana journey since 2022, with a special devotion to Maa Kamakhya.
              </p>
              <p>
                His spiritual path is rooted in the Brahma Vidya Sampradaya and the Tantric Kaula Shakta tradition, with a connection to Kamakhya Diksha. He also honours the lineage associated with Shri Shri 1008 Tantric Baba Bhutnath of Lucknow and the philosophical heritage of Adi Guru Shankaracharya. His approach emphasises Satvic Tantra, devotion, discipline, and Ahimsa, while encouraging a respectful understanding of sacred spiritual traditions.
              </p>
              <p>
                Through TANTRRA, Tripuransh and his team help devotees in India and internationally arrange Pujas, Chadhava, Daan, and other devotional offerings dedicated to Maa Kamakhya and Lord Shiva. Where applicable, rituals are arranged in devotees&apos; names and gotras, helping them participate in sacred offerings even when distance or personal circumstances prevent their physical presence.
              </p>
              <p>
                Alongside his spiritual pursuits, Tripuransh offers Tarot and Akashic Records consultations, having pursued learning in these fields through the Institute of Holistic Science in Andheri, Mumbai. Through TANTRRA, his mission is to honour Sanatan Dharma and sacred cosmic traditions while making spiritual offerings more accessible with sincerity, reverence, and devotion.
              </p>
              <p className="font-heading text-[16px] font-semibold italic text-foreground">
                TANTRRA &mdash; A Path of Sadhana, Devotion, and Sacred Connection.
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
