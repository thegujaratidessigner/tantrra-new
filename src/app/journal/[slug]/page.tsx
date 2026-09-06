import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { getJournalPostBySlug, getActiveJournalPosts } from '@/data/journal';
import { ArrowLeft, Clock, BookOpen } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getActiveJournalPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getJournalPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — TANTRRA Journal`,
    description: post.excerpt,
  };
}

export default async function JournalArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = getJournalPostBySlug(slug);
  if (!post) notFound();

  return (
    <main id="main-content" className="py-10 sm:py-14 lg:py-20">
      <Container>
        <div className="mx-auto max-w-2xl">
          <Link
            href="/journal"
            className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground-subtle transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Journal
          </Link>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold-dark">
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-[12px] text-foreground-subtle">
              <Clock className="h-3 w-3" />
              {post.readTime}
            </span>
          </div>

          <h1 className="mt-4 font-heading text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
            {post.title}
          </h1>

          <div className="mt-8 rounded-xl border border-border bg-white p-8 sm:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gold/8 text-gold-dark">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="font-heading text-lg font-semibold text-foreground">
                  Article Coming Soon
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-foreground-muted">
                  {post.excerpt}
                </p>
                <p className="mt-4 text-[13px] text-foreground-subtle">
                  Full article content is being prepared. Check back soon for the complete read.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/journal"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gold-dark transition-colors hover:text-gold"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Browse More Articles
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
