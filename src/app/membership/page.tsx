import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import {
  Crown, BookOpen, Video, Users, Sparkles, Lock,
  Star, Flame, Shield, ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Membership',
  description:
    'Unlock exclusive guided practices, advanced Sadhana techniques, live sessions, and a complete library of premium spiritual content with TANTRRA Membership.',
};

const membershipBenefits = [
  {
    icon: Video,
    title: 'Exclusive Video Library',
    description:
      'Access a growing collection of guided Sadhana practices, mantra recitations, and meditation techniques — available only to members.',
  },
  {
    icon: BookOpen,
    title: 'Advanced Sadhana Modules',
    description:
      'Step-by-step sacred practices designed for deeper spiritual progress, curated and guided personally by Tripuransh.',
  },
  {
    icon: Users,
    title: 'Live Sessions & Satsang',
    description:
      'Join live interactive sessions, group Sadhana, and spiritual discussions for community-driven growth.',
  },
  {
    icon: Sparkles,
    title: 'Personal Guidance',
    description:
      'Priority access to personalised spiritual direction, practice recommendations, and progress check-ins.',
  },
  {
    icon: Flame,
    title: 'Sacred Ritual Guidance',
    description:
      'Learn the correct methods for daily puja, havan preparation, mantra japa, and traditional ritual practice.',
  },
  {
    icon: Shield,
    title: 'Early Access & Member Offers',
    description:
      'Be the first to access new sacred products, special member pricing, and exclusive spiritual content before anyone else.',
  },
];

const journeySteps = [
  {
    step: '01',
    title: 'Create Your Account',
    description: 'Sign up with your email to begin your membership journey.',
  },
  {
    step: '02',
    title: 'Choose Your Path',
    description: 'Select the practices and modules that resonate with your spiritual goals.',
  },
  {
    step: '03',
    title: 'Begin Your Sadhana',
    description: 'Access your library, join live sessions, and deepen your practice with guidance.',
  },
];

export default function MembershipPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground py-16 sm:py-20 lg:py-28">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(185,144,69,0.12),transparent_55%)]" />
          <svg className="absolute inset-0 h-full w-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="membership-pattern" width="200" height="200" patternUnits="userSpaceOnUse">
                <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(185,144,69,1)" strokeWidth="0.4" />
                <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(185,144,69,1)" strokeWidth="0.4" />
                <circle cx="100" cy="100" r="30" fill="none" stroke="rgba(185,144,69,1)" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#membership-pattern)" />
          </svg>
        </div>

        <Container className="relative text-center">
          <AnimatedSection>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 ring-1 ring-gold/20">
              <Crown className="h-7 w-7 text-gold" />
            </div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-light sm:text-xs">
              TANTRRA Membership
            </p>
            <h1 className="font-heading text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-tight text-white">
              Your Sacred Practice,{' '}
              <span className="text-gold-light">Elevated</span>
            </h1>
            <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-white/55">
              Unlock exclusive guided practices, advanced Sadhana techniques,
              live sessions, and a complete library of premium spiritual content
              — all under the guidance of Tripuransh.
            </p>
            <div className="mx-auto mt-5 h-[1px] w-16 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
          </AnimatedSection>
        </Container>
      </section>

      {/* Benefits Grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <Container>
          <AnimatedSection>
            <div className="mb-10 text-center">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold sm:text-xs">
                What You Unlock
              </p>
              <h2 className="font-heading text-[clamp(1.5rem,3vw,2.25rem)] font-semibold text-foreground">
                Everything Inside Your Membership
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {membershipBenefits.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <AnimatedSection key={benefit.title} delay={i * 0.08}>
                  <div className="group flex h-full gap-4 rounded-lg border border-border/60 bg-white p-5 transition-all duration-300 hover:border-gold/25 hover:shadow-md sm:p-6">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/8 transition-all duration-300 group-hover:bg-gold group-hover:text-white">
                      <Icon className="h-5 w-5 text-gold-dark group-hover:text-white" />
                    </div>
                    <div>
                      <h3 className="font-heading text-[15px] font-semibold text-foreground sm:text-base">
                        {benefit.title}
                      </h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-foreground-muted">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </Container>
      </section>

      {/* How It Works */}
      <section className="bg-cream py-12 sm:py-16 lg:py-20">
        <Container>
          <AnimatedSection>
            <div className="mb-10 text-center">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold sm:text-xs">
                Your Journey
              </p>
              <h2 className="font-heading text-[clamp(1.5rem,3vw,2.25rem)] font-semibold text-foreground">
                How Membership Works
              </h2>
            </div>
          </AnimatedSection>

          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
            {journeySteps.map((item, i) => (
              <AnimatedSection key={item.step} delay={i * 0.15}>
                <div className="text-center">
                  <span className="text-3xl font-bold text-gold/25 sm:text-4xl">
                    {item.step}
                  </span>
                  <h3 className="mt-2 font-heading text-base font-semibold text-foreground sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-foreground-muted">
                    {item.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Coming Soon CTA */}
      <section className="py-12 sm:py-16 lg:py-20">
        <Container>
          <AnimatedSection>
            <div className="mx-auto max-w-2xl rounded-xl border border-gold/15 bg-white p-8 text-center shadow-sm sm:p-10">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-foreground">
                <Lock className="h-5 w-5 text-gold" />
              </div>
              <h2 className="font-heading text-[clamp(1.25rem,2.5vw,1.75rem)] font-semibold text-foreground">
                Membership Opening Soon
              </h2>
              <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-foreground-muted">
                We are preparing an extraordinary spiritual experience for our
                members. Sign-up will be available shortly — stay connected for
                the announcement.
              </p>
              <div className="mx-auto mt-6 flex items-center justify-center gap-2">
                <Star className="h-4 w-4 text-gold/50" />
                <span className="text-[13px] font-medium text-gold-dark">
                  Exclusive access awaits
                </span>
                <Star className="h-4 w-4 text-gold/50" />
              </div>
              <div className="mx-auto mt-4 h-[1px] w-20 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
              <p
                className="mt-4 text-[15px] text-[#B88A3B]/70"
                style={{ fontFamily: 'var(--font-devanagari), serif' }}
              >
                🌺 ।। जय माँ ।। 🌺
              </p>
            </div>
          </AnimatedSection>
        </Container>
      </section>
    </>
  );
}
