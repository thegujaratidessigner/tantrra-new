import { formatPrice } from '@/lib/utils';
import type { ShippingQuote } from '@/lib/shipping';

export function ShippingLabel({ quote }: { quote: ShippingQuote }) {
  if (quote.kind === 'free') return <span className="text-[12px] font-semibold text-green">Free</span>;
  if (quote.kind === 'charged') return <span className="font-medium text-foreground">+{formatPrice(quote.amount)}</span>;
  return <span className="text-[12px] font-medium italic">To be confirmed</span>;
}
