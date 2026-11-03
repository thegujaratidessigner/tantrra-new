'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';
import { ShoppingBag, Check, ArrowRight } from 'lucide-react';

interface PujaBookButtonProps {
  pujaId: string;
  pujaName: string;
  price: number;
  className?: string;
}

export function PujaBookButton({ pujaId, pujaName, price, className = '' }: PujaBookButtonProps) {
  const [added, setAdded] = useState(false);
  const addServiceItem = useCartStore((s) => s.addServiceItem);
  const router = useRouter();

  const handleBook = () => {
    addServiceItem({
      type: 'service',
      serviceId: `puja_${pujaId}`,
      serviceName: pujaName,
      serviceType: 'puja',
      quantity: 1,
      priceSnapshot: price,
    });
    setAdded(true);
  };

  if (added) {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <button
          onClick={() => router.push('/cart')}
          className="flex items-center justify-center gap-2 rounded-lg bg-green px-5 py-3 text-[14px] font-semibold text-white transition-all hover:bg-green/90 active:scale-[0.98]"
        >
          <Check className="h-4 w-4" />
          View Cart — {formatPrice(price)}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleBook}
      className={`flex items-center justify-center gap-2 rounded-lg bg-green px-5 py-3 text-[14px] font-semibold text-white transition-all hover:bg-green/90 active:scale-[0.98] ${className}`}
    >
      <ShoppingBag className="h-4 w-4" />
      Book Now — {formatPrice(price)}
    </button>
  );
}
