import type { Metadata } from 'next';
import { GalleryView } from '@/components/gallery/GalleryView';
import { getGallery } from '@/lib/server/site-content';

export const metadata: Metadata = {
  title: 'Gallery',
  description: "Authentic moments from TANTRRA's sacred ceremonies, rituals and offerings.",
};

export default async function GalleryPage() {
  const images = await getGallery();
  return <GalleryView galleryImages={images.map((g) => ({ src: g.src, alt: g.alt, caption: g.caption ?? undefined }))} />;
}
