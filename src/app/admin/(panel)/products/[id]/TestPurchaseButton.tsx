'use client';

import { useRouter } from 'next/navigation';
import { FlaskConical } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { btn } from '@/components/admin/ActionForm';

/** Adds a hidden test-only product to this admin's own cart and opens the normal checkout. */
export function TestPurchaseButton({ productId, name, price, image }: { productId: string; name: string; price: number; image?: string }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="mb-4 flex flex-col gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-[13px] text-sky-900 sm:flex-row sm:items-center sm:justify-between">
      <p>
        <strong>Hidden test-only product.</strong> It never appears in the store. Signed-in admins can buy it through the normal,
        fully verified checkout; the order is marked as an internal test and excluded from sales figures.
      </p>
      <button
        type="button"
        className={btn.primary}
        onClick={() => {
          addItem({ type: 'product', productId, quantity: 1, priceSnapshot: price, energization: false, nameSnapshot: name, imageSnapshot: image });
          router.push('/checkout');
        }}
      >
        <FlaskConical className="h-4 w-4" /> Start test purchase
      </button>
    </div>
  );
}
