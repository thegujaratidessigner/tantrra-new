'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface BannerVideo {
  id: string;
  src: string;
  title: string;
  description: string;
}

const bannerVideos: BannerVideo[] = [
  {
    id: 'product-hero',
    src: '/videos/product-hero.mp4',
    title: 'Sacred Products',
    description: 'Consecrated protection crafted with devotion',
  },
  {
    id: 'consultation-hero',
    src: '/videos/consultation-hero.mp4',
    title: 'Tarot & Consultation',
    description: 'Personalised spiritual guidance and insight',
  },
  {
    id: 'puja-hero',
    src: '/videos/puja-hero.mp4',
    title: 'Sacred Puja',
    description: 'Traditional rituals performed with purpose',
  },
];

function VideoCard({ video, isActive, onPlay }: {
  video: BannerVideo;
  isActive: boolean;
  onPlay: (id: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (!isActive && playing) {
      videoRef.current?.pause();
      setPlaying(false);
    }
  }, [isActive, playing]);

  const togglePlay = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (playing) {
      vid.pause();
      setPlaying(false);
    } else {
      onPlay(video.id);
      vid.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [playing, onPlay, video.id]);

  const toggleMute = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setMuted(vid.muted);
  }, []);

  return (
    <div className="group relative flex-[0_0_85%] overflow-hidden rounded-xl sm:flex-[0_0_48%] lg:flex-[0_0_32%]">
      <div className="relative aspect-video overflow-hidden bg-[#1B3D2F]">
        <video
          ref={videoRef}
          src={video.src}
          muted={muted}
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
          onClick={togglePlay}
        />

        {/* Gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Play/Pause button */}
        <button
          onClick={togglePlay}
          className="absolute left-3 bottom-12 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#1B3D2F] shadow-lg transition-transform hover:scale-110 sm:bottom-14"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            <Pause className="h-4 w-4" fill="currentColor" />
          ) : (
            <Play className="ml-0.5 h-4 w-4" fill="currentColor" />
          )}
        </button>

        {/* Mute button */}
        <button
          onClick={toggleMute}
          className="absolute right-3 bottom-12 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30 sm:bottom-14"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </button>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
          <h3 className="font-heading text-[15px] font-semibold text-white sm:text-[16px]">
            {video.title}
          </h3>
          <p className="mt-0.5 text-[12px] text-white/60 sm:text-[13px]">
            {video.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function BannerVideosSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const handlePlay = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-cream py-14 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
      </div>

      <Container className="relative">
        <SectionHeading
          label="Sacred Experiences"
          title="Explore Our Sacred Journey"
          description="Discover the spiritual essence of TANTRRA through our sacred services and offerings."
        />
      </Container>

      <div
        ref={scrollRef}
        className="mt-10 flex gap-4 overflow-x-auto px-4 pb-4 sm:px-6 lg:justify-center lg:px-8"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {bannerVideos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            isActive={activeId === video.id}
            onPlay={handlePlay}
          />
        ))}
      </div>
    </section>
  );
}
