import { Hero } from '@/components/home/Hero';
import { JourneyNavigator } from '@/components/home/JourneyNavigator';
import { IntentDiscovery } from '@/components/home/IntentDiscovery';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { ConsultationSection } from '@/components/home/ConsultationSection';
import { PujaSevaSection } from '@/components/home/PujaSevaSection';
import { SadhakExperiences } from '@/components/home/SadhakExperiences';
import { TrustProcess } from '@/components/home/TrustProcess';
import { JournalPreview } from '@/components/home/JournalPreview';
import { PhotoGallery } from '@/components/home/PhotoGallery';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { VideoSection } from '@/components/home/VideoSection';
import { SocialMediaSection } from '@/components/home/SocialMediaSection';
import { VideoCarousel } from '@/components/home/VideoCarousel';
import { BannerVideosSection } from '@/components/home/BannerVideosSection';
import { FloatingVideo } from '@/components/home/FloatingVideo';
import { getSiteSettings } from '@/lib/server/data';
import { getActiveConsultations, getFeaturedProducts } from '@/lib/server/catalog';
import { getBanners, getGallery, getTestimonials, getVideos } from '@/lib/server/site-content';
import { getContentBlocks } from '@/lib/server/content';

const organizationJsonLd = (social: { youtube: string; facebook: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TANTRRA',
  url: 'https://tantrra.in',
  description:
    'Sacred spiritual ecosystem offering consecrated products, Chadava, Puja, and personalised consultations.',
  sameAs: [social.youtube, social.facebook].filter(Boolean),
});

export default async function HomePage() {
  const [settings, featuredProducts, consultations, heroBanners, [whyBanner], gallery, carousel, bannerRow, [floating], youtube, testimonials] =
    await Promise.all([
      getSiteSettings(),
      getFeaturedProducts(),
      getActiveConsultations(),
      getBanners('home_hero'),
      getBanners('why_tantrra'),
      getGallery(),
      getVideos('home_carousel'),
      getVideos('home_banner_row'),
      getVideos('home_floating'),
      getVideos('youtube'),
      getTestimonials(),
    ]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blocks = (await getContentBlocks()) as Record<string, any>;
  const withSrc = <T extends { src: string | null }>(v: T): v is T & { src: string } => Boolean(v.src);
  const jsonLd = organizationJsonLd(settings.social);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero products={featuredProducts} banners={heroBanners} />
      <JourneyNavigator cards={blocks['home.journey'].items} />
      <IntentDiscovery heading={blocks['home.intents']} items={blocks['home.intents'].items} />
      <div className="section-divider" />
      <FeaturedProducts products={featuredProducts} />
      <ConsultationSection consultations={consultations} heading={blocks['home.consultations']} />
      <PujaSevaSection heading={blocks['home.puja_seva']} items={blocks['home.puja_seva'].items} />
      <PhotoGallery images={gallery.filter((g) => g.showOnHome).map((g) => ({ src: g.src, alt: g.alt, caption: g.caption ?? undefined }))} />
      <VideoCarousel videos={carousel.filter(withSrc).map((v) => ({ id: v.id, src: v.src, title: v.title, description: v.description ?? undefined, poster: v.posterSrc ?? undefined }))} />
      <BannerVideosSection videos={bannerRow.filter(withSrc).map((v) => ({ id: v.id, src: v.src, title: v.title, description: v.description ?? '' }))} />
      <VideoSection
        heading={blocks['home.youtube']}
        playlistUrl={settings.social.youtubePlaylist}
        videos={youtube.filter((v) => v.youtubeId).map((v) => ({ id: v.id, title: v.title, youtubeId: v.youtubeId!, description: v.description ?? undefined }))}
      />
      <SocialMediaSection heading={blocks['home.social']} profiles={blocks['home.social'].profiles} />
      <TrustProcess content={blocks['home.trust']} />
      <TestimonialsSection
        testimonials={testimonials.map((t) => ({ id: t.id, name: t.name, content: t.content, rating: t.rating, location: t.location ?? undefined, service: t.service ?? undefined }))}
      />
      <JournalPreview />
      <SadhakExperiences banner={whyBanner} />
      <FloatingVideo src={floating?.src} poster={floating?.posterSrc} />
    </>
  );
}
