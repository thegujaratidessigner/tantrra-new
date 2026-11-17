import 'server-only';
import { unstable_cache } from 'next/cache';
import { carouselVideos } from '@/data/carousel-videos';
import { galleryImages } from '@/data/gallery-images';
import { seedBanners, seedFaqs, seedVideos } from '@/lib/content/seed-content';
import type { Banner, BannerPlacement, Faq, GalleryItem, Testimonial, VideoItem, VideoPlacement } from '@/lib/content/types';
import { CACHE_SECONDS, CACHE_TAGS, cacheKey, getDbOrNull } from './data';

interface ContentSnapshot {
  banners: Banner[];
  videos: VideoItem[];
  gallery: GalleryItem[];
  faqs: Faq[];
  testimonials: Testimonial[];
}

function staticSnapshot(): ContentSnapshot {
  return {
    banners: seedBanners.map((b, i) => ({
      id: b.key, placement: b.placement as BannerPlacement, eyebrow: ('eyebrow' in b && b.eyebrow) || null,
      heading: ('heading' in b && b.heading) || null, highlight: ('highlight' in b && b.highlight) || null,
      description: ('description' in b && b.description) || null,
      ctaPrimaryLabel: ('cta_primary_label' in b && b.cta_primary_label) || null, ctaPrimaryHref: ('cta_primary_href' in b && b.cta_primary_href) || null,
      ctaSecondaryLabel: ('cta_secondary_label' in b && b.cta_secondary_label) || null, ctaSecondaryHref: ('cta_secondary_href' in b && b.cta_secondary_href) || null,
      mediaType: b.media_type, desktopSrc: ('desktop_src' in b && b.desktop_src) || null, mobileSrc: ('mobile_src' in b && b.mobile_src) || null,
      posterSrc: ('poster_src' in b && b.poster_src) || null, objectPosition: ('object_position' in b && b.object_position) || 'center',
      mobileObjectPosition: ('mobile_object_position' in b && b.mobile_object_position) || null, alt: b.alt ?? '', sortOrder: i,
    })),
    videos: [
      ...carouselVideos.map((v, i) => ({ id: v.id, placement: 'home_carousel' as const, title: v.title, description: v.description ?? null, src: v.src, youtubeId: null, posterSrc: null, linkUrl: null, linkLabel: null, sortOrder: i })),
      ...seedVideos.map((v, i) => ({
        id: v.key, placement: v.placement as VideoPlacement, title: v.title, description: v.description ?? null,
        src: ('src' in v && v.src) || null, youtubeId: ('youtube_id' in v && v.youtube_id) || null, posterSrc: null, linkUrl: null, linkLabel: null, sortOrder: 100 + i,
      })),
    ],
    gallery: galleryImages.map((g, i) => ({ id: g.src, src: g.src, alt: g.alt, caption: g.caption ?? null, showOnHome: true, sortOrder: i })),
    faqs: seedFaqs.map(([question, answer], i) => ({ id: String(i), question, answer })),
    testimonials: [],
  };
}

async function loadContent(): Promise<ContentSnapshot> {
  const sql = getDbOrNull();
  if (!sql) return staticSnapshot();
  const [banners, videos, gallery, faqs, testimonials] = await Promise.all([
    sql`SELECT * FROM banners WHERE is_active ORDER BY placement, sort_order, created_at`,
    sql`SELECT * FROM videos WHERE is_active ORDER BY placement, sort_order, created_at`,
    sql`SELECT * FROM gallery_images WHERE is_active ORDER BY sort_order, created_at`,
    sql`SELECT id, question, answer FROM faqs WHERE is_active ORDER BY sort_order, created_at`,
    sql`SELECT id, name, location, content, rating, service FROM testimonials WHERE is_published ORDER BY sort_order, created_at`,
  ]);
  return {
    banners: banners.map((b) => ({
      id: b.id, placement: b.placement, eyebrow: b.eyebrow, heading: b.heading, highlight: b.highlight, description: b.description,
      ctaPrimaryLabel: b.cta_primary_label, ctaPrimaryHref: b.cta_primary_href, ctaSecondaryLabel: b.cta_secondary_label,
      ctaSecondaryHref: b.cta_secondary_href, mediaType: b.media_type, desktopSrc: b.desktop_src, mobileSrc: b.mobile_src,
      posterSrc: b.poster_src, objectPosition: b.object_position, mobileObjectPosition: b.mobile_object_position, alt: b.alt, sortOrder: b.sort_order,
    })),
    videos: videos.map((v) => ({
      id: v.id, placement: v.placement, title: v.title, description: v.description, src: v.src, youtubeId: v.youtube_id,
      posterSrc: v.poster_src, linkUrl: v.link_url, linkLabel: v.link_label, sortOrder: v.sort_order,
    })),
    gallery: gallery.map((g) => ({ id: g.id, src: g.src, alt: g.alt, caption: g.caption, showOnHome: g.show_on_home, sortOrder: g.sort_order })),
    faqs: faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer })),
    testimonials: testimonials.map((t) => ({ id: t.id, name: t.name, location: t.location, content: t.content, rating: t.rating, service: t.service })),
  };
}

const getContentSnapshot = unstable_cache(loadContent, cacheKey('site-content'), { tags: [CACHE_TAGS.content], revalidate: CACHE_SECONDS });

export async function getBanners(placement: BannerPlacement): Promise<Banner[]> {
  return (await getContentSnapshot()).banners.filter((b) => b.placement === placement);
}
export async function getVideos(placement: VideoPlacement): Promise<VideoItem[]> {
  return (await getContentSnapshot()).videos.filter((v) => v.placement === placement);
}
export async function getGallery(): Promise<GalleryItem[]> {
  return (await getContentSnapshot()).gallery;
}
export async function getFaqs(): Promise<Faq[]> {
  return (await getContentSnapshot()).faqs;
}
export async function getTestimonials(): Promise<Testimonial[]> {
  return (await getContentSnapshot()).testimonials;
}
