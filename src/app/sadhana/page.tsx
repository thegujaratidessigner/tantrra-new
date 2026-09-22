import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Lightbulb, CirclePlay, Crown, ArrowRight, ExternalLink } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sadhana',
  description:
    'Begin your spiritual practice with Sadhana tips, guided YouTube content, and exclusive membership for deeper learning with Tripuransh.',
};

const sadhanaPaths = [
  {
    icon: Lightbulb,
    title: 'Saadhna Tips',
    description:
      'Practical guidance and daily spiritual tips to integrate sacred practice into everyday life. Start with simple, powerful steps shared by Tripuransh.',
    accent: 'green' as const,
    cta: 'Coming Soon',
    href: '#',
    disabled: true,
  },
  {
    icon: CirclePlay,
    title: 'YouTube Playlist',
    description:
      'Watch free guided sessions, mantra chanting, meditation practices, and spiritual teachings on the official TANTRRA YouTube channel.',
    accent: 'gold' as const,
    cta: 'Watch on YouTube',
    href: '#',
    external: true,
    disabled: false,
  },
  {
    icon: Crown,
    title: 'Membership',
    description:
      'Unlock exclusive guided practices, advanced Sadhana techniques, live sessions, and a complete library of premium spiritual content.',
    accent: 'gold' as const,
    cta: 'Explore Membership',
    href: '/membership',
    disabled: false,
  },
];

export default function SadhanaPage() {
  return (
    <>
      {/* Full-width hero banner — no text overlay, no crop */}
      <div className="w-full">
        {/* Mobile (taller ratio) */}
        <Image
          src="/images/tantrra/sadhana/sadhana-hero-desktop.jpg"
          alt="Guru and student meditating — Sadhana, The Way from Bhog to Moksh"
          width={1448}
          height={1086}
          className="block w-full h-auto sm:hidden"
          priority
          unoptimized
        />
        {/* Desktop (wider ratio) */}
        <Image
          src="/images/tantrra/sadhana/sadhana-hero-mobile.jpg"
          alt="Guru and student meditating — Sadhana, The Way from Bhog to Moksh"
          width={1600}
          height={666}
          className="hidden w-full h-auto sm:block"
          priority
          unoptimized
        />
      </div>

      {/* Three Primary Paths */}
      <section className="py-12 sm:py-16 lg:py-20">
        <Container>
          <AnimatedSection>
            <div className="mb-10 text-center">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold sm:text-xs">
                Choose Your Path
              </p>
              <h2 className="font-heading text-[clamp(1.5rem,3vw,2.25rem)] font-semibold text-foreground">
                Three Ways to Begin Your Sadhana
              </h2>
            </div>
          </AnimatedSection>

          <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-3">
            {sadhanaPaths.map((item, i) => {
              const Icon = item.icon;
              return (
                <AnimatedSection key={item.title} delay={i * 0.12}>
                  <div className="group flex h-full flex-col rounded-lg border border-border/60 bg-white p-6 text-center transition-all duration-300 hover:border-gold/20 hover:shadow-md sm:p-7">
                    <div className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full transition-all duration-300 ${
                      item.accent === 'green'
                        ? 'bg-green-deep/8 text-green-deep group-hover:bg-green-deep group-hover:text-white'
                        : 'bg-gold/8 text-gold-dark group-hover:bg-gold group-hover:text-white'
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-3 flex-1 text-[13px] leading-relaxed text-foreground-muted">
                      {item.description}
                    </p>
                    <div className="mt-6">
                      {item.disabled ? (
                        <span className="inline-flex items-center gap-1.5 rounded-sm bg-cream-dark px-5 py-2.5 text-[13px] font-medium text-foreground-subtle">
                          {item.cta}
                        </span>
                      ) : (
                        <Button
                          href={item.href}
                          variant={item.accent === 'green' ? 'primary-green' : 'gold'}
                          size="md"
                          className="w-full"
                        >
                          {item.external && <ExternalLink className="h-3.5 w-3.5" />}
                          {!item.external && <ArrowRight className="h-3.5 w-3.5" />}
                          {item.cta}
                        </Button>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Membership CTA */}
      <section className="bg-cream py-12 sm:py-16 lg:py-20">
        <Container>
          <AnimatedSection>
            <div className="mx-auto max-w-2xl rounded-xl border border-gold/15 bg-white p-8 text-center shadow-sm sm:p-10">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
                <Crown className="h-5 w-5 text-gold" />
              </div>
              <h2 className="font-heading text-[clamp(1.25rem,2.5vw,1.75rem)] font-semibold text-foreground">
                Unlock the Full Sadhana Experience
              </h2>
              <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-foreground-muted">
                Become a member to access exclusive guided practices, advanced
                meditation techniques, live sessions, and a complete library of
                spiritual content.
              </p>
              <Button
                href="/membership"
                variant="gold"
                size="lg"
                className="mt-6"
                withArrow
              >
                Explore Membership
              </Button>
            </div>
          </AnimatedSection>
        </Container>
      </section>
    </>
  );
}
