import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { getConsultationBySlug } from '@/data/consultations';
import { siteConfig } from '@/data/site-config';
import { formatPrice, getWhatsAppLink } from '@/lib/utils';
import { Sparkles, Star, Clock, MessageCircle, Eye, Heart, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tarot Consultation',
  description:
    'Seek clarity and insight through the ancient art of Tarot reading by Tripuransh. Choose from focused 3-question, 5-question, or 60-minute deep reading sessions.',
  openGraph: {
    title: 'Tarot Consultation | TANTRRA',
    description:
      'Seek clarity and insight through the ancient art of Tarot reading by Tripuransh.',
  },
};

const WHATSAPP_NUMBER = siteConfig.whatsappNumber || '91XXXXXXXXXX';

const tarotBenefits = [
  {
    icon: Eye,
    title: 'Clarity on Life Situations',
    description: 'Understand the energies influencing your current circumstances and see your path forward with greater awareness.',
  },
  {
    icon: Heart,
    title: 'Relationships & Matters of the Heart',
    description: 'Gain insight into emotional bonds, unresolved patterns, and the deeper dynamics at play in your relationships.',
  },
  {
    icon: Star,
    title: 'Career & Life Decisions',
    description: 'Receive guidance on professional crossroads, timing of important decisions, and aligning your actions with your purpose.',
  },
  {
    icon: Shield,
    title: 'Spiritual Growth & Direction',
    description: 'Connect with your spiritual path, understand karmic influences, and receive guidance for inner transformation.',
  },
];

export default function TarotPage() {
  const tarotService = getConsultationBySlug('tarot');

  if (!tarotService) {
    return (
      <>
        {/* Full-width hero banner — no text overlay, no crop */}
        <div className="w-full">
          <Image
            src="/images/tantrra/tarot/tarot-hero-mobile.jpg"
            alt="Tarot — Guidance, Clarity, Self-Discovery"
            width={1448}
            height={1086}
            className="block w-full h-auto sm:hidden"
            priority
            unoptimized
          />
          <Image
            src="/images/tantrra/tarot/tarot-hero-desktop.jpg"
            alt="Tarot — Guidance, Clarity, Self-Discovery"
            width={1600}
            height={666}
            className="hidden w-full h-auto sm:block"
            priority
            unoptimized
          />
        </div>
        <Container className="py-20 text-center">
          <p className="text-foreground-muted">
            Tarot consultation details are currently being updated. Please check back soon.
          </p>
        </Container>
      </>
    );
  }

  return (
    <>
      {/* Full-width hero banner — no text overlay, no crop */}
      <div className="w-full">
        {/* Mobile */}
        <Image
          src="/images/tantrra/tarot/tarot-hero-mobile.jpg"
          alt="Tarot — Guidance, Clarity, Self-Discovery"
          width={1448}
          height={1086}
          className="block w-full h-auto sm:hidden"
          priority
          unoptimized
        />
        {/* Desktop */}
        <Image
          src="/images/tantrra/tarot/tarot-hero-desktop.jpg"
          alt="Tarot — Guidance, Clarity, Self-Discovery"
          width={1600}
          height={666}
          className="hidden w-full h-auto sm:block"
          priority
          unoptimized
        />
      </div>

      {/* --- Intro / What is Tarot --- */}
      <section className="bg-cream py-12 sm:py-16 lg:py-20">
        <Container>
          <AnimatedSection>
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
                <Sparkles className="h-6 w-6 text-gold" />
              </div>
              <h2 className="font-heading text-[clamp(1.5rem,3vw,2.25rem)] font-semibold text-foreground">
                The Ancient Art of Tarot Reading
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-foreground-muted sm:text-base">
                {tarotService.longDescription}
              </p>
              <div className="mx-auto mt-6 h-[1px] w-20 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
            </div>
          </AnimatedSection>
        </Container>
      </section>

      {/* --- What Tarot Can Help With --- */}
      <section className="py-12 sm:py-16 lg:py-20">
        <Container>
          <AnimatedSection>
            <div className="mb-10 text-center">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold sm:text-xs">
                Areas of Guidance
              </p>
              <h2 className="font-heading text-[clamp(1.5rem,3vw,2.25rem)] font-semibold text-foreground">
                What Tarot Reading Can Illuminate
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid gap-5 sm:grid-cols-2">
            {tarotBenefits.map((benefit, i) => (
              <AnimatedSection key={benefit.title} delay={i * 0.1}>
                <div className="group flex h-full gap-4 rounded-lg border border-border/60 bg-white p-5 transition-all duration-300 hover:border-gold/25 hover:shadow-md sm:p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/8">
                    <benefit.icon className="h-5 w-5 text-gold-dark" />
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
            ))}
          </div>
        </Container>
      </section>

      {/* --- Packages --- */}
      <section className="bg-foreground py-12 sm:py-16 lg:py-20">
        <Container>
          <AnimatedSection>
            <div className="mb-10 text-center">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-light sm:text-xs">
                Choose Your Reading
              </p>
              <h2 className="font-heading text-[clamp(1.5rem,3vw,2.25rem)] font-semibold text-white">
                Tarot Consultation Packages
              </h2>
              <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-white/50">
                Select the session that aligns with your needs. Each reading is conducted personally by Tripuransh.
              </p>
            </div>
          </AnimatedSection>

          <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-3">
            {tarotService.packages.map((pkg, i) => {
              const isHighlighted = i === 1;
              const whatsappMsg = `Hello, I am interested in booking the ${pkg.name} Tarot Consultation (${formatPrice(pkg.price)}). Please share the details.`;
              const whatsappLink = getWhatsAppLink(WHATSAPP_NUMBER, whatsappMsg);

              return (
                <AnimatedSection key={pkg.id} delay={i * 0.12}>
                  <div
                    className={`relative flex h-full flex-col rounded-lg border p-5 transition-all duration-300 sm:p-6 ${
                      isHighlighted
                        ? 'border-gold/40 bg-white/[0.07] shadow-[0_0_40px_rgba(184,138,59,0.08)]'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                    }`}
                  >
                    {isHighlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                        Popular
                      </div>
                    )}

                    <h3 className="font-heading text-lg font-semibold text-white sm:text-xl">
                      {pkg.name}
                    </h3>
                    <p className="mt-2 flex-1 text-[13px] leading-relaxed text-white/50">
                      {pkg.description}
                    </p>

                    {pkg.duration && (
                      <div className="mt-3 flex items-center gap-1.5 text-white/40">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="text-[12px]">{pkg.duration}</span>
                      </div>
                    )}

                    <div className="mt-4 border-t border-white/10 pt-4">
                      <p className="text-2xl font-bold text-gold-light sm:text-3xl">
                        {formatPrice(pkg.price)}
                      </p>
                    </div>

                    <Button
                      href={whatsappLink}
                      variant={isHighlighted ? 'gold' : 'outline'}
                      size="md"
                      className={`mt-4 w-full ${!isHighlighted ? 'border-white/20 text-white hover:bg-white/10' : ''}`}
                    >
                      <MessageCircle className="h-4 w-4" />
                      Book via WhatsApp
                    </Button>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>

          {tarotService.turnaroundDays && (
            <AnimatedSection delay={0.4}>
              <p className="mt-8 text-center text-[12px] text-white/35">
                Approximate scheduling: {tarotService.turnaroundDays}
              </p>
            </AnimatedSection>
          )}
        </Container>
      </section>

      {/* --- How It Works --- */}
      <section className="bg-cream py-12 sm:py-16 lg:py-20">
        <Container>
          <AnimatedSection>
            <div className="mb-10 text-center">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold sm:text-xs">
                Your Journey
              </p>
              <h2 className="font-heading text-[clamp(1.5rem,3vw,2.25rem)] font-semibold text-foreground">
                How a Tarot Session Works
              </h2>
            </div>
          </AnimatedSection>

          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Reach Out',
                description: 'Connect via WhatsApp, share your questions, and choose your preferred package.',
              },
              {
                step: '02',
                title: 'Your Reading',
                description: 'Tripuransh conducts your personalised Tarot reading, channelling intuitive guidance for each question.',
              },
              {
                step: '03',
                title: 'Receive Clarity',
                description: 'Receive a detailed interpretation of the cards drawn, along with guidance and insights for your path ahead.',
              },
            ].map((item, i) => (
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

      {/* --- Final CTA --- */}
      <section className="py-12 sm:py-16 lg:py-20">
        <Container>
          <AnimatedSection>
            <div className="mx-auto max-w-2xl rounded-xl border border-border/60 bg-white p-8 text-center shadow-sm sm:p-10">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
                <Sparkles className="h-5 w-5 text-gold" />
              </div>
              <h2 className="font-heading text-[clamp(1.25rem,2.5vw,1.75rem)] font-semibold text-foreground">
                Ready to Seek Clarity?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-foreground-muted">
                Reach out on WhatsApp to book your Tarot consultation with Tripuransh. Share your questions, and let the cards guide you.
              </p>
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button
                  href={getWhatsAppLink(
                    WHATSAPP_NUMBER,
                    'Hello, I would like to book a Tarot Consultation. Please share the details.'
                  )}
                  variant="gold"
                  size="lg"
                >
                  <MessageCircle className="h-4 w-4" />
                  Book on WhatsApp
                </Button>
                <Button href="/consultations" variant="outline" size="lg" withArrow>
                  All Consultations
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </Container>
      </section>
    </>
  );
}
