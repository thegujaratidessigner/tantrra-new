'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { getActiveJournalPosts } from '@/data/journal';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';

const categoryColors: Record<string, string> = {
  spirituality: 'bg-gold/10 text-gold-dark',
  rituals: 'bg-green-deep/8 text-green-deep',
  wellness: 'bg-green-muted text-green-dark',
  guidance: 'bg-gold-muted text-gold-dark',
};

export function JournalPreview() {
  const posts = getActiveJournalPosts().slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="py-10 sm:py-12 lg:py-16">
      <Container>
        <SectionHeading
          label="Journal"
          title="Insights from the Sacred Path"
          description="Explore articles on spiritual practices, sacred rituals, and guidance for your journey."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <Link
                href={`/journal/${post.slug}`}
                className="group flex h-full flex-col rounded-lg border border-border bg-white p-5 transition-all duration-300 hover:shadow-md hover:border-gold/20 hover:-translate-y-0.5"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${categoryColors[post.category] || 'bg-cream-dark text-foreground-muted'}`}>
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-foreground-subtle">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </span>
                </div>

                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/8 text-gold-dark">
                  <BookOpen className="h-5 w-5" />
                </div>

                <h3 className="font-heading text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-gold-dark">
                  {post.title}
                </h3>

                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-foreground-muted">
                  {post.excerpt}
                </p>

                <div className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-gold-dark transition-colors group-hover:text-gold">
                  Read Article
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button href="/journal" variant="outline" size="md" withArrow>
            View All Articles
          </Button>
        </div>
      </Container>
    </section>
  );
}
