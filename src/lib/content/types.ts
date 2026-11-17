export const BANNER_PLACEMENTS = {
  home_hero: { label: 'Homepage hero', help: 'Large banner at the top of the homepage. Several active banners rotate automatically.' },
  why_tantrra: { label: 'Homepage “Why TANTRRA” banner', help: 'Full-width image near the bottom of the homepage. The first active one is shown.' },
  page_hero_products: { label: 'Products page banner', help: 'Video (with image fallback) at the top of /products.' },
  page_hero_consultations: { label: 'Consultations page banner', help: 'Video (with image fallback) at the top of /consultations.' },
  page_hero_puja: { label: 'Puja page banner', help: 'Video (with image fallback) at the top of /puja.' },
  page_hero_about: { label: 'About page header', help: 'Heading and optional background image on /about.' },
  page_hero_contact: { label: 'Contact page header', help: 'Heading and optional background image on /contact.' },
} as const;
export type BannerPlacement = keyof typeof BANNER_PLACEMENTS;

export const VIDEO_PLACEMENTS = {
  home_carousel: { label: 'Homepage video carousel', help: 'Portrait (9:16) videos in “Spiritual Moments”. Autoscrolls every 5 seconds.' },
  home_banner_row: { label: 'Homepage video banners', help: 'Landscape (16:9) videos in a horizontal row; tap to play.' },
  home_floating: { label: 'Homepage floating video', help: 'Small landscape player that appears after scrolling. The first active one is used.' },
  youtube: { label: 'YouTube section', help: 'The first active video is featured; the rest are listed beside it.' },
} as const;
export type VideoPlacement = keyof typeof VIDEO_PLACEMENTS;

export interface Banner {
  id: string;
  placement: BannerPlacement;
  eyebrow: string | null;
  heading: string | null;
  highlight: string | null;
  description: string | null;
  ctaPrimaryLabel: string | null;
  ctaPrimaryHref: string | null;
  ctaSecondaryLabel: string | null;
  ctaSecondaryHref: string | null;
  mediaType: 'image' | 'video';
  desktopSrc: string | null;
  mobileSrc: string | null;
  posterSrc: string | null;
  objectPosition: string;
  mobileObjectPosition: string | null;
  alt: string;
  sortOrder: number;
}

export interface VideoItem {
  id: string;
  placement: VideoPlacement;
  title: string;
  description: string | null;
  src: string | null;
  youtubeId: string | null;
  posterSrc: string | null;
  linkUrl: string | null;
  linkLabel: string | null;
  sortOrder: number;
}

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption: string | null;
  showOnHome: boolean;
  sortOrder: number;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string | null;
  content: string;
  rating: number;
  service: string | null;
}
