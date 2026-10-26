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
import { VideoCarousel } from '@/components/home/VideoCarousel';
import { FloatingVideo } from '@/components/home/FloatingVideo';
import { siteConfig } from '@/data/site-config';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TANTRRA',
  url: 'https://tantrra.in',
  description:
    'Sacred spiritual ecosystem offering consecrated products, Chadava, Puja, and personalised consultations.',
  sameAs: [
    siteConfig.socialLinks.youtube,
    siteConfig.socialLinks.facebook,
  ].filter(Boolean),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <JourneyNavigator />
      <IntentDiscovery />
      <div className="section-divider" />
      <FeaturedProducts />
      <ConsultationSection />
      <PujaSevaSection />
      <VideoCarousel />
      <PhotoGallery />
      <VideoSection />
      <TrustProcess />
      <TestimonialsSection />
      <JournalPreview />
      <SadhakExperiences />
      <FloatingVideo />
    </>
  );
}
