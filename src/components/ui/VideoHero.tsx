'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoHeroProps {
  videoSrc: string;
  posterSrc?: string;
  fallbackImageSrc: string;
  alt: string;
}

export function VideoHero({ videoSrc, posterSrc, fallbackImageSrc, alt }: VideoHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoAvailable, setVideoAvailable] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const isVisibleRef = useRef(true);

  const poster = posterSrc || fallbackImageSrc;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onCanPlay = () => {
      setVideoAvailable(true);
      if (isVisibleRef.current && !userPaused) {
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    };
    const onError = () => setVideoError(true);

    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('error', onError);
    return () => {
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('error', onError);
    };
  }, [userPaused]);

  // Pause when offscreen, resume when visible
  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          if (!userPaused && video.paused && videoAvailable) {
            video.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        } else {
          if (!video.paused) {
            video.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [userPaused, videoAvailable]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => {
        setIsPlaying(true);
        setUserPaused(false);
      }).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
      setUserPaused(true);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  if (videoError) {
    return (
      <div className="bg-[#FAF7EF] px-4 pt-6 pb-2 sm:px-6 sm:pt-8 sm:pb-3 lg:px-8 lg:pt-10 lg:pb-4">
        <div className="mx-auto max-w-[1280px] overflow-hidden rounded-lg shadow-[0_2px_16px_rgba(33,29,24,0.06)] sm:rounded-xl">
          <Image
            src={fallbackImageSrc}
            alt={alt}
            width={1600}
            height={600}
            className="block w-full h-auto"
            priority
            unoptimized
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7EF] px-4 pt-6 pb-2 sm:px-6 sm:pt-8 sm:pb-3 lg:px-8 lg:pt-10 lg:pb-4">
      <div
        ref={containerRef}
        className="group relative mx-auto max-w-[1280px] overflow-hidden rounded-lg shadow-[0_2px_16px_rgba(33,29,24,0.06)] sm:rounded-xl"
      >
        <video
          ref={videoRef}
          src={videoSrc}
          poster={poster}
          muted={isMuted}
          loop
          playsInline
          autoPlay
          preload="metadata"
          className="block w-full h-auto"
        />

        {!videoAvailable && (
          <Image
            src={fallbackImageSrc}
            alt={alt}
            width={1600}
            height={600}
            className="absolute inset-0 w-full h-full object-cover"
            priority
            unoptimized
          />
        )}

        {/* Play/Pause center button — visible when paused or on hover */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
          }`}
        >
          <button
            onClick={togglePlay}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-xl transition-all duration-300 hover:scale-110 hover:bg-white sm:h-16 sm:w-16"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 text-[#1B3D2F] sm:h-7 sm:w-7" fill="currentColor" />
            ) : (
              <Play className="ml-1 h-6 w-6 text-[#1B3D2F] sm:h-7 sm:w-7" fill="currentColor" />
            )}
          </button>
        </div>

        {/* Mute button — bottom right on hover */}
        {videoAvailable && (
          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:bottom-4 sm:right-4">
            <button
              onClick={toggleMute}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
