import { Hero } from '@/components/home/Hero';
import { JourneyNavigator } from '@/components/home/JourneyNavigator';
import { IntentDiscovery } from '@/components/home/IntentDiscovery';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { ConsultationSection } from '@/components/home/ConsultationSection';
import { PujaSevaSection } from '@/components/home/PujaSevaSection';
import { SadhanaPreview } from '@/components/home/SadhanaPreview';
import { SadhakExperiences } from '@/components/home/SadhakExperiences';
import { TrustProcess } from '@/components/home/TrustProcess';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'TANTRRA',
  url: 'https://tantrra.in',
  description:
    'Sacred spiritual ecosystem offering consecrated products, Puja, personalised consultations, and guided Sadhana experiences.',
  sameAs: [],
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
      <SadhanaPreview />
      <TrustProcess />
      <SadhakExperiences />
    </>
  );
}
