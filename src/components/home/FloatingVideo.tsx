'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { X, Play, Pause, Volume2, VolumeX } from 'lucide-react';

const VIDEO_SRC = '/videos/homepage-floating.mp4';
// No separate poster needed — the browser shows the first video frame
const SCROLL_THRESHOLD = 600;
const DISMISS_KEY = 'tantrra-floating-video-dismissed';

export function FloatingVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY)) {
        setDismissed(true);
      }
    } catch {}
  }, []);

  const handleScroll = useCallback(() => {
    if (dismissed || videoError) return;
    setVisible(window.scrollY > SCROLL_THRESHOLD);
  }, [dismissed, videoError]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
    const video = videoRef.current;
    if (video) video.pause();
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch {}
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  if (dismissed || videoError) return null;

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) return null;

  return (
    <div
      className={`fixed z-40 transition-all duration-500 ease-out ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      } bottom-[140px] right-4 sm:bottom-8 sm:right-6 lg:right-8`}
      role="complementary"
      aria-label="TANTRRA video"
    >
      <div className="relative w-[180px] overflow-hidden rounded-xl shadow-2xl shadow-black/30 ring-1 ring-white/10 sm:w-[220px]">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute right-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/80 hover:text-white"
          aria-label="Close video"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        {/* Video */}
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          muted={isMuted}
          loop
          playsInline
          preload="metadata"
          className="block aspect-[9/16] w-full object-cover"
          onError={() => setVideoError(true)}
        />

        {/* Controls overlay */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-2.5 pb-2 pt-6">
          <button
            onClick={togglePlay}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="h-3 w-3" fill="currentColor" />
            ) : (
              <Play className="ml-0.5 h-3 w-3" fill="currentColor" />
            )}
          </button>

          <button
            onClick={toggleMute}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="h-3 w-3" />
            ) : (
              <Volume2 className="h-3 w-3" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
