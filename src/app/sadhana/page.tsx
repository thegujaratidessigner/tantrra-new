import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { PageHero } from '@/components/ui/PageHero';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Play, Lock, BookOpen, Headphones, Video, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sadhana',
  description:
    'A living ecosystem of guided meditation, spiritual learning, exclusive videos, and Sadhana practices to deepen your spiritual journey.',
};

const categories = [
  'All',
  'Meditation',
  'Chakra',
  'Mantra',
  'Guidance',
  'Puja Guidance',
  'Sadhana',
  'Live Sessions',
];

const placeholderContent = [
  {
    title: 'Introduction to Meditation',
    category: 'Meditation',
    teacher: 'Tripuransh',
    duration: '15 min',
    access: 'free' as const,
    icon: Headphones,
  },
  {
    title: 'Understanding Your Chakras',
    category: 'Chakra',
    teacher: 'Tripuransh',
    duration: '20 min',
    access: 'free' as const,
    icon: BookOpen,
  },
  {
    title: 'Daily Mantra Practice',
    category: 'Mantra',
    teacher: 'Tripuransh',
    duration: '10 min',
    access: 'free' as const,
    icon: Play,
  },
  {
    title: 'Guided Chakra Cleansing',
    category: 'Chakra',
    teacher: 'Tripuransh',
    duration: '30 min',
    access: 'members_only' as const,
    icon: Lock,
  },
  {
    title: 'Deep Meditation Practice',
    category: 'Meditation',
    teacher: 'Tripuransh',
    duration: '45 min',
    access: 'members_only' as const,
    icon: Video,
  },
  {
    title: 'Advanced Sadhana Techniques',
    category: 'Sadhana',
    teacher: 'Tripuransh',
    duration: '60 min',
    access: 'members_only' as const,
    icon: Users,
  },
];

export default function SadhanaPage() {
  return (
    <>
      <PageHero
        label="Sadhana"
        title="Go Beyond the Product. Begin the Practice."
        description="A living ecosystem of guided meditation, spiritual learning, and exclusive content to deepen your practice and support your spiritual growth."
      />

      <div className="py-10 sm:py-12 lg:py-16">
        <Container>
          {/* CTA buttons */}
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            <Button href="/membership" variant="primary-green" size="lg">
              Become a Member
            </Button>
            <Button href="#library" variant="outline" size="lg">
              Browse Free Content
            </Button>
          </div>

          {/* Category Filters */}
          <div
            id="library"
            className="flex flex-wrap justify-center gap-2 scroll-mt-24"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                className="rounded-full border border-border/80 bg-white px-4 py-2 text-[13px] font-medium text-foreground-muted transition-all hover:border-green/30 hover:bg-green-muted hover:text-green first:border-green first:bg-green-muted first:text-green"
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Content Grid */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {placeholderContent.map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.08}>
                <div className="group flex items-start gap-4 rounded-lg border border-border/60 bg-white p-5 transition-all hover:border-green/20 hover:shadow-md">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-green-muted text-green">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-heading text-[15px] font-semibold text-foreground">
                        {item.title}
                      </h3>
                      {item.access === 'members_only' && (
                        <span className="flex-shrink-0 rounded-full bg-gold-muted px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-gold-dark">
                          Members
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] text-foreground-subtle">
                      {item.teacher} &middot; {item.duration} &middot;{' '}
                      {item.category}
                    </p>
                    {item.access === 'members_only' ? (
                      <div className="mt-3 flex items-center gap-1.5 text-[12px] text-foreground-subtle">
                        <Lock className="h-3 w-3" />
                        Login to access
                      </div>
                    ) : (
                      <button className="mt-3 flex items-center gap-1.5 text-[12px] font-medium text-green">
                        <Play className="h-3 w-3" />
                        Watch Now
                      </button>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Membership CTA */}
          <div className="mt-14 rounded-lg border border-gold/15 bg-gold-muted/30 p-8 text-center sm:p-12">
            <h2 className="font-heading text-[clamp(1.5rem,3vw,2rem)] font-semibold text-foreground">
              Unlock the Full Sadhana Experience
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-foreground-muted">
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
        </Container>
      </div>
    </>
  );
}
