import type { Metadata } from 'next';
import { OrderStatus } from '@/components/checkout/OrderStatus';

export const metadata: Metadata = {
  title: 'Order Status',
  description: 'Payment and order confirmation status for your TANTRRA order.',
  robots: { index: false, follow: false },
};

export default async function OrderStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; t?: string }>;
}) {
  const { order, t } = await searchParams;
  return <OrderStatus orderNumber={order ?? ''} token={t ?? ''} />;
}
