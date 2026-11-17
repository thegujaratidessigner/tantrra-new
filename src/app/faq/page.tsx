import type { Metadata } from 'next';
import { FaqView } from '@/components/faq/FaqView';
import { getFaqs } from '@/lib/server/site-content';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Answers to common questions about TANTRRA Kavach, Puja, Chadava, consultations, delivery and payments.',
};

export default async function FaqPage() {
  return <FaqView faqs={await getFaqs()} />;
}
