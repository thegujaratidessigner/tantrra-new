'use client';

import { useCartStore } from './cart-store';
import { getShippingQuote } from './shipping';
import { useSiteSettings } from '@/components/providers/SiteDataProvider';
import type { ProductCartItem } from './types';

/** Display totals; the server recomputes everything from the database at checkout. */
export function useCartTotals() {
  const items = useCartStore((s) => s.items);
  const dakshinaAmount = useCartStore((s) => s.dakshinaAmount);
  const settings = useSiteSettings();

  const energizationPrice = settings.checkout.energizationPrice;
  const products = items.filter((i): i is ProductCartItem => i.type === 'product');
  const subtotal = items.reduce((sum, i) => sum + i.priceSnapshot * i.quantity, 0);
  const energization = products.reduce((sum, i) => sum + (i.energization ? energizationPrice * i.quantity : 0), 0);
  const productSubtotal = products.reduce(
    (sum, i) => sum + (i.priceSnapshot + (i.energization ? energizationPrice : 0)) * i.quantity,
    0
  );
  const shipping = getShippingQuote(productSubtotal, products.length > 0, settings.shipping);

  return {
    subtotal,
    energization,
    energizationPrice,
    dakshina: dakshinaAmount,
    shipping,
    total: subtotal + energization + dakshinaAmount + shipping.amount,
  };
}
