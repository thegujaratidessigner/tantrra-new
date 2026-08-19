import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getConsultationBySlug, getActiveConsultations } from '@/data/consultations';
import { ConsultationDetail } from '@/components/consultation/ConsultationDetail';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getActiveConsultations().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getConsultationBySlug(slug);
  if (!service) return {};
  return {
    title: service.seoTitle || service.name,
    description: service.seoDescription || service.shortDescription,
  };
}

export default async function ConsultationPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getConsultationBySlug(slug);
  if (!service || !service.isActive) notFound();

  return <ConsultationDetail service={service} />;
}
