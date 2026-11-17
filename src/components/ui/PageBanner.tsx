import { getBanners } from '@/lib/server/site-content';
import type { BannerPlacement } from '@/lib/content/types';
import { VideoHero } from './VideoHero';

/** Renders the first active banner for a page placement using the existing VideoHero design. */
export async function PageBanner({ placement }: { placement: BannerPlacement }) {
  const [banner] = await getBanners(placement);
  if (!banner) return null;
  const isVideo = banner.mediaType === 'video' && banner.desktopSrc;
  const image = isVideo ? banner.posterSrc ?? '' : banner.desktopSrc ?? '';
  if (!isVideo && !image) return null;
  return <VideoHero videoSrc={isVideo ? banner.desktopSrc! : ''} fallbackImageSrc={image} alt={banner.alt} />;
}
