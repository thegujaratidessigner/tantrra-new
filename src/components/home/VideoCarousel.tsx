'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Container } from '@/components/ui/Container';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { carouselVideos, type CarouselVideo } from '@/data/carousel-videos';

const CAROUSEL_ACTIVE = carouselVideos.length > 0;

// ────────────────────────────────────────────────────────
// VideoCard — individual video in the carousel
// ────────────────────────────────────────────────────────

interface VideoCardProps {
  video: CarouselVideo;
  isActive: boolean;
  globalMuted: boolean;
  onUnmute: () => void;
}

function VideoCard({ video, isActive, globalMuted, onUnmute }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [showVolume, setShowVolume] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const animRef = useRef<number>(0);

  // Sync mute state with global
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (globalMuted) {
      v.muted = true;
      setMuted(true);
    }
  }, [globalMuted]);

  // Play/pause based on active state
  useEffect(() => {
    const v = videoRef.current;
    if (!v || videoError) return;

    if (isActive && videoReady) {
      v.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setPlaying(false);
      v.muted = true;
      setMuted(true);
    }
  }, [isActive, videoReady, videoError]);

  // Progress animation
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const update = () => {
      if (v.duration) {
        setProgress((v.currentTime / v.duration) * 100);
      }
      animRef.current = requestAnimationFrame(update);
    };

    if (playing) {
      animRef.current = requestAnimationFrame(update);
    }

    return () => cancelAnimationFrame(animRef.current);
  }, [playing]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.muted) {
      v.muted = false;
      v.volume = volume;
      setMuted(false);
      onUnmute();
    } else {
      v.muted = true;
      setMuted(true);
    }
  }, [volume, onUnmute]);

  const handleVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const v = videoRef.current;
    if (!v) return;
    setVolume(val);
    v.volume = val;
    if (val === 0) {
      v.muted = true;
      setMuted(true);
    } else if (v.muted) {
      v.muted = false;
      setMuted(false);
      onUnmute();
    }
  }, [onUnmute]);

  const handleFullscreen = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.requestFullscreen) {
      v.requestFullscreen();
    } else if ((v as HTMLVideoElement & { webkitEnterFullscreen?: () => void }).webkitEnterFullscreen) {
      (v as HTMLVideoElement & { webkitEnterFullscreen: () => void }).webkitEnterFullscreen();
    }
  }, []);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    const bar = progressRef.current;
    if (!v || !bar || !v.duration) return;
    const rect = bar.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    v.currentTime = pct * v.duration;
  }, []);

  if (videoError) return null;

  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-[#1B3D2F] shadow-[0_4px_24px_rgba(33,29,24,0.12)]">
      <video
        ref={videoRef}
        src={video.src}
        muted={muted}
        loop
        playsInline
        preload={isActive ? 'metadata' : 'none'}
        className="absolute inset-0 h-full w-full object-cover"
        onCanPlay={() => setVideoReady(true)}
        onError={() => setVideoError(true)}
      />

      {/* Gradient overlay — bottom */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Title */}
      <div className="absolute bottom-14 left-3 right-3 sm:bottom-16 sm:left-4 sm:right-4">
        <p className="font-heading text-[14px] font-semibold text-white sm:text-[16px]">
          {video.title}
        </p>
        {video.description && (
          <p className="mt-0.5 text-[11px] text-white/60 sm:text-[12px]">
            {video.description}
          </p>
        )}
      </div>

      {/* Controls bar */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-1.5 px-2.5 pb-2.5 pt-1 sm:gap-2 sm:px-3">
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            <Pause className="h-3.5 w-3.5" fill="currentColor" />
          ) : (
            <Play className="ml-0.5 h-3.5 w-3.5" fill="currentColor" />
          )}
        </button>

        {/* Progress bar */}
        <div
          ref={progressRef}
          className="flex-1 cursor-pointer py-1.5"
          onClick={handleProgressClick}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Video progress"
        >
          <div className="h-1 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-gold transition-[width] duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Volume group */}
        <div
          className="relative flex items-center"
          onMouseEnter={() => setShowVolume(true)}
          onMouseLeave={() => setShowVolume(false)}
        >
          <button
            onClick={toggleMute}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? (
              <VolumeX className="h-3.5 w-3.5" />
            ) : (
              <Volume2 className="h-3.5 w-3.5" />
            )}
          </button>

          {/* Volume slider — desktop hover */}
          <div
            className={`absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded-lg bg-black/80 px-2 py-3 backdrop-blur-sm transition-opacity sm:block ${
              showVolume ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={muted ? 0 : volume}
              onChange={handleVolume}
              className="h-20 w-1 cursor-pointer appearance-none rounded-full bg-white/30 [writing-mode:vertical-lr] [direction:rtl] accent-gold"
              aria-label="Volume"
            />
          </div>
        </div>

        {/* Fullscreen */}
        <button
          onClick={handleFullscreen}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/25"
          aria-label="Fullscreen"
        >
          <Maximize className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// VideoCarousel — the full section
// ────────────────────────────────────────────────────────

export function VideoCarousel() {
  if (!CAROUSEL_ACTIVE) return null;

  return <VideoCarouselInner />;
}

function VideoCarouselInner() {
  const sectionRef = useRef<HTMLElement>(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [globalMuted, setGlobalMuted] = useState(true);

  const autoplayPlugin = useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 1,
      containScroll: 'trimSnaps',
    },
    [autoplayPlugin.current]
  );

  // Track selected slide
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setGlobalMuted(true);
    };
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi]);

  // Pause carousel when a video is unmuted
  const handleUnmute = useCallback(() => {
    setGlobalMuted(false);
    autoplayPlugin.current.stop();
  }, []);

  // Section visibility — pause everything when offscreen
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setSectionVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Pause autoplay when section is offscreen
  useEffect(() => {
    if (!emblaApi) return;
    if (!sectionVisible) {
      autoplayPlugin.current.stop();
    } else if (globalMuted) {
      autoplayPlugin.current.play();
    }
  }, [sectionVisible, globalMuted, emblaApi]);

  // Respect reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      autoplayPlugin.current.stop();
    }
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#FAF7EF] py-14 sm:py-16 lg:py-20"
    >
      {/* Top decorative line */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" aria-hidden="true" />

      <Container className="relative">
        {/* Heading */}
        <div className="mx-auto max-w-xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold/30" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
              Sacred Moments
            </span>
            <span className="h-px w-8 bg-gold/30" />
          </div>
          <h2 className="font-heading text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-tight text-foreground">
            Spiritual Moments with TANTRRA
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-foreground-muted">
            Explore sacred rituals, spiritual insights, and meaningful moments from our journey.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative mt-10">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {carouselVideos.map((video, i) => (
                <div
                  key={video.id}
                  className="flex-[0_0_72%] px-2 sm:flex-[0_0_38%] md:flex-[0_0_30%] lg:flex-[0_0_22%] xl:flex-[0_0_19%]"
                >
                  <VideoCard
                    video={video}
                    isActive={sectionVisible && i === selectedIndex}
                    globalMuted={globalMuted}
                    onUnmute={handleUnmute}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-gold/15 bg-white p-2.5 text-foreground-subtle shadow-md transition-all hover:border-gold/30 hover:text-gold hover:shadow-lg sm:flex lg:-left-5"
            aria-label="Previous video"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-gold/15 bg-white p-2.5 text-foreground-subtle shadow-md transition-all hover:border-gold/30 hover:text-gold hover:shadow-lg sm:flex lg:-right-5"
            aria-label="Next video"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="mt-6 flex justify-center gap-2">
          {carouselVideos.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === selectedIndex
                  ? 'h-2 w-7 bg-gold'
                  : 'h-2 w-2 bg-foreground/10 hover:bg-foreground/20'
              }`}
              aria-label={`Go to video ${i + 1}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
