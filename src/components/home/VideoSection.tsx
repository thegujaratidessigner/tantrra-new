'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Play, ExternalLink } from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  youtubeId: string;
  description?: string;
}

const featuredVideo: VideoItem = {
  id: 'main',
  title: 'Akashic Records by Tripuransh — Insights, Process & Explanation',
  youtubeId: 'Mjgkh5VymME',
  description: 'Deep insights into Akashic Records — process, information and spiritual explanation by Tripuransh.',
};

const additionalVideos: VideoItem[] = [
  {
    id: 'podcast',
    title: 'Maa Kamakhya Secrets, Akashic Reading & Tarot — Podcast',
    youtubeId: 'CijkeMSQW4k',
    description: 'Tripuransh discusses Maa Kamakhya, Akashic Reading and Tarot on the JJainam Gada Podcast.',
  },
];

const PLAYLIST_URL = 'https://youtube.com/playlist?list=PLLNEa6I_FvJc';

function VideoCard({ video, featured = false }: { video: VideoItem; featured?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;

  if (isPlaying) {
    return (
      <div className={`relative overflow-hidden rounded-xl ${featured ? 'aspect-video' : 'aspect-video'}`}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsPlaying(true)}
      className="group relative block w-full overflow-hidden rounded-xl"
      aria-label={`Play: ${video.title}`}
    >
      <div className={`relative ${featured ? 'aspect-video' : 'aspect-video'} overflow-hidden`}>
        {/* Thumbnail with privacy-respecting URL */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40" />

        {/* Play button */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-xl transition-transform duration-300 group-hover:scale-110 sm:h-16 sm:w-16">
            <Play className="ml-1 h-6 w-6 text-[#1B3D2F] sm:h-7 sm:w-7" fill="currentColor" />
          </div>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-5">
          <h3 className={`font-heading font-semibold text-white ${featured ? 'text-[16px] sm:text-[20px]' : 'text-[14px] sm:text-[16px]'}`}>
            {video.title}
          </h3>
          {video.description && (
            <p className={`mt-1 text-white/60 ${featured ? 'text-[13px] sm:text-[14px]' : 'text-[12px] sm:text-[13px]'}`}>
              {video.description}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

export function VideoSection() {
  return (
    <section className="relative overflow-hidden bg-cream py-14 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
      </div>

      <Container className="relative">
        <SectionHeading
          label="Sacred Wisdom"
          title="Spiritual Insights & Guidance"
          description="Explore sacred teachings, spiritual insights and guided wisdom from Tripuransh."
        />

        <div className="mt-10">
          {/* Featured video — full width */}
          <VideoCard video={featuredVideo} featured />

          {/* Additional videos */}
          {additionalVideos.length > 0 && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {additionalVideos.map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}

              {/* Playlist CTA card */}
              <a
                href={PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center rounded-xl border border-[#E8E2D4] bg-white p-6 text-center transition-all hover:border-gold/30 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1B3D2F] transition-transform group-hover:scale-110">
                  <Play className="ml-0.5 h-5 w-5 text-white" fill="currentColor" />
                </div>
                <h3 className="mt-3 font-heading text-[16px] font-semibold text-foreground">
                  Spiritual Life Tips
                </h3>
                <p className="mt-1 text-[13px] text-foreground-muted">
                  Watch the full playlist on YouTube
                </p>
                <span className="mt-3 flex items-center gap-1 text-[12px] font-semibold text-gold">
                  View Playlist
                  <ExternalLink className="h-3 w-3" />
                </span>
              </a>
            </div>
          )}

        </div>
      </Container>
    </section>
  );
}
