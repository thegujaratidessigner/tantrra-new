import { siteConfig } from '@/data/site-config';

export type ShippingQuote =
  | { kind: 'none'; amount: 0 }
  | { kind: 'free'; amount: 0 }
  | { kind: 'charged'; amount: number }
  | { kind: 'rate_not_set'; amount: 0 };

// Shared by checkout UI and server pricing so both always agree.
export function getShippingQuote(productSubtotalRupees: number, hasProducts: boolean): ShippingQuote {
  if (!hasProducts) return { kind: 'none', amount: 0 };
  if (productSubtotalRupees >= siteConfig.freeShippingThreshold) return { kind: 'free', amount: 0 };
  const fee = siteConfig.shippingFeeBelowThreshold;
  if (fee === null) return { kind: 'rate_not_set', amount: 0 };
  return { kind: 'charged', amount: fee };
}
