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
  const [settings, featuredProducts, consultations] = await Promise.all([
    getSiteSettings(),
    getFeaturedProducts(),
    getActiveConsultations(),
  ]);
  const jsonLd = organizationJsonLd(settings.social);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero products={featuredProducts} />
      <JourneyNavigator />
      <IntentDiscovery />
      <div className="section-divider" />
      <FeaturedProducts products={featuredProducts} />
      <ConsultationSection consultations={consultations} />
      <PujaSevaSection />
      <PhotoGallery />
      <VideoCarousel />
      <BannerVideosSection />
      <VideoSection />
      <SocialMediaSection />
      <TrustProcess />
      <TestimonialsSection />
      <JournalPreview />
      <SadhakExperiences />
      <FloatingVideo />
    </>
  );
}
