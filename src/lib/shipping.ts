import type { SiteSettings } from './site-settings';

export type ShippingQuote =
  | { kind: 'none'; amount: 0 }
  | { kind: 'free'; amount: 0 }
  | { kind: 'charged'; amount: number }
  | { kind: 'rate_not_set'; amount: 0 };

// Shared by checkout UI and server pricing so both always agree.
export function getShippingQuote(
  productSubtotalRupees: number,
  hasProducts: boolean,
  shipping: SiteSettings['shipping']
): ShippingQuote {
  if (!hasProducts) return { kind: 'none', amount: 0 };
  if (productSubtotalRupees >= shipping.freeShippingThreshold) return { kind: 'free', amount: 0 };
  if (shipping.feeBelowThreshold === null) return { kind: 'rate_not_set', amount: 0 };
  return { kind: 'charged', amount: shipping.feeBelowThreshold };
}
