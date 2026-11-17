import type { FieldDef } from '@/lib/content/schema';
import { BANNER_PLACEMENTS, VIDEO_PLACEMENTS } from '@/lib/content/types';

export interface CollectionDef {
  key: string;
  table: 'banners' | 'videos' | 'gallery_images' | 'testimonials' | 'faqs';
  title: string;
  single: string;
  description: string;
  /** Column that partitions ordering (e.g. placement). */
  groupColumn?: 'placement';
  groups?: Record<string, { label: string; help: string }>;
  activeColumn: 'is_active' | 'is_published';
  activeLabel: [on: string, off: string];
  labelColumns: string[];
  thumbColumn?: string;
  fields: FieldDef[];
  related?: { href: string; label: string };
}

const opts = (o: Record<string, { label: string }>) => Object.entries(o).map(([value, v]) => ({ value, label: v.label }));

const FOCAL_RAW = [
  ['center', 'Centre'], ['top', 'Top'], ['bottom', 'Bottom'], ['left', 'Left'], ['right', 'Right'],
  ['center 30%', 'Centre, slightly high'], ['center 70%', 'Centre, slightly low'],
  ['left top', 'Top left'], ['right top', 'Top right'], ['left bottom', 'Bottom left'], ['right bottom', 'Bottom right'],
].map(([value, label]) => ({ value, label }));
const FOCAL = FOCAL_RAW;

export const COLLECTIONS: Record<string, CollectionDef> = {
  banners: {
    key: 'banners',
    table: 'banners',
    title: 'Banners',
    single: 'banner',
    description: 'Each placement keeps its own layout. Add several homepage hero banners to rotate them; other placements show the first active banner.',
    groupColumn: 'placement',
    groups: BANNER_PLACEMENTS,
    activeColumn: 'is_active',
    activeLabel: ['Live', 'Hidden'],
    labelColumns: ['heading', 'alt'],
    thumbColumn: 'desktop_src',
    fields: [
      { kind: 'select', key: 'placement', label: 'Where it appears', options: opts(BANNER_PLACEMENTS) },
      { kind: 'select', key: 'media_type', label: 'Media type', options: [{ value: 'image', label: 'Image' }, { value: 'video', label: 'Video (MP4/WebM)' }] },
      { kind: 'media', key: 'desktop_src', label: 'Desktop media', accept: 'image', acceptFromField: 'media_type', help: 'For video banners choose a video here and an image as the poster.' },
      { kind: 'media', key: 'mobile_src', label: 'Mobile image (optional)', accept: 'image', help: 'Shown on phones instead of the desktop image (hero banners).' },
      { kind: 'media', key: 'poster_src', label: 'Poster / fallback image', accept: 'image', help: 'Shown while a video loads or if it cannot play.' },
      { kind: 'select', key: 'object_position', label: 'Desktop focal point', options: FOCAL },
      { kind: 'select', key: 'mobile_object_position', label: 'Mobile focal point', options: [{ value: '', label: 'Same as desktop' }, ...FOCAL_RAW] },
      { kind: 'text', key: 'alt', label: 'Image description (accessibility)', max: 200 },
      { kind: 'text', key: 'eyebrow', label: 'Small label above heading', max: 120 },
      { kind: 'text', key: 'heading', label: 'Heading', max: 160 },
      { kind: 'text', key: 'highlight', label: 'Gold highlighted line', max: 160 },
      { kind: 'textarea', key: 'description', label: 'Description', max: 600, rows: 3 },
      { kind: 'text', key: 'cta_primary_label', label: 'Primary button label', max: 60 },
      { kind: 'link', key: 'cta_primary_href', label: 'Primary button link' },
      { kind: 'text', key: 'cta_secondary_label', label: 'Secondary button label', max: 60 },
      { kind: 'link', key: 'cta_secondary_href', label: 'Secondary button link' },
    ],
  },
  videos: {
    key: 'videos',
    table: 'videos',
    title: 'Videos',
    single: 'video',
    description: 'Homepage video carousel, video banners, floating video and YouTube section. Upload MP4/WebM files up to 50 MB.',
    groupColumn: 'placement',
    groups: VIDEO_PLACEMENTS,
    activeColumn: 'is_active',
    activeLabel: ['Live', 'Hidden'],
    labelColumns: ['title'],
    thumbColumn: 'poster_src',
    fields: [
      { kind: 'select', key: 'placement', label: 'Where it appears', options: opts(VIDEO_PLACEMENTS) },
      { kind: 'text', key: 'title', label: 'Title', max: 160, required: true },
      { kind: 'textarea', key: 'description', label: 'Description', max: 400, rows: 2 },
      { kind: 'media', key: 'src', label: 'Video file', accept: 'video', help: 'Not needed for YouTube videos.' },
      { kind: 'text', key: 'youtube_id', label: 'YouTube video ID', max: 20, help: 'YouTube section only — the part after watch?v= (e.g. Mjgkh5VymME).' },
      { kind: 'media', key: 'poster_src', label: 'Thumbnail image', accept: 'image', help: 'Optional. Without it, the first frame of the video is shown.' },
    ],
  },
  gallery: {
    key: 'gallery',
    table: 'gallery_images',
    title: 'Gallery',
    single: 'image',
    description: 'Images on the /gallery page (with lightbox) and the homepage photo marquee. The first 11 homepage images form the top row.',
    activeColumn: 'is_active',
    activeLabel: ['Live', 'Hidden'],
    labelColumns: ['alt', 'caption'],
    thumbColumn: 'src',
    fields: [
      { kind: 'media', key: 'src', label: 'Image', accept: 'image', required: true },
      { kind: 'text', key: 'alt', label: 'Image description (accessibility)', max: 200 },
      { kind: 'text', key: 'caption', label: 'Caption (shown in lightbox)', max: 200 },
      { kind: 'boolean', key: 'show_on_home', label: 'Show in homepage gallery' },
    ],
  },
  testimonials: {
    key: 'testimonials',
    table: 'testimonials',
    title: 'Testimonials',
    single: 'testimonial',
    description: 'Only genuine testimonials from real devotees, with their consent. The homepage section appears once at least one is published.',
    activeColumn: 'is_published',
    activeLabel: ['Published', 'Draft'],
    labelColumns: ['name', 'content'],
    fields: [
      { kind: 'text', key: 'name', label: 'Name', max: 80, required: true },
      { kind: 'text', key: 'location', label: 'City / location', max: 80 },
      { kind: 'textarea', key: 'content', label: 'Testimonial', max: 1200, rows: 5, required: true },
      { kind: 'select', key: 'rating', label: 'Rating', options: ['5', '4', '3', '2', '1'].map((v) => ({ value: v, label: `${v} stars` })) },
      { kind: 'text', key: 'service', label: 'Product or service', max: 120 },
    ],
    related: { href: '/admin/faqs', label: 'Manage FAQs' },
  },
  faqs: {
    key: 'faqs',
    table: 'faqs',
    title: 'FAQs',
    single: 'question',
    description: 'Questions on the /faq page, in this order.',
    activeColumn: 'is_active',
    activeLabel: ['Live', 'Hidden'],
    labelColumns: ['question'],
    fields: [
      { kind: 'text', key: 'question', label: 'Question', max: 300, required: true },
      { kind: 'textarea', key: 'answer', label: 'Answer', max: 3000, rows: 6, required: true },
    ],
    related: { href: '/admin/testimonials', label: 'Manage testimonials' },
  },
};


export const getCollection = (key: string): CollectionDef | undefined => COLLECTIONS[key];
