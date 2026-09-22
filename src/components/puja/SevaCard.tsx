'use client';

import { useState } from 'react';
import Image from 'next/image';
import { SevaCategory } from '@/lib/types';
import { formatPrice, cn } from '@/lib/utils';

export function SevaCard({ seva }: { seva: SevaCategory }) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    setCustomAmount('');
  };

  const handleCustomToggle = () => {
    setIsCustom(true);
    setSelectedAmount(null);
  };

  return (
    <div className="flex h-full flex-col rounded-lg border border-border/60 bg-white overflow-hidden transition-all duration-300 hover:border-maroon/15 hover:shadow-md">
      {seva.image ? (
        <div className="relative h-[120px] sm:h-[140px] w-full overflow-hidden">
          <Image
            src={seva.image}
            alt={seva.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      ) : (
        <div className="h-[2px] rounded-t-lg bg-gradient-to-r from-maroon/40 via-maroon/20 to-transparent" />
      )}

      <div className="flex flex-1 flex-col p-3.5 sm:p-5 sm:pt-4">
        <h3 className="font-heading text-[14px] font-semibold text-foreground sm:text-lg">
          {seva.name}
        </h3>
        <p className="mt-1 flex-1 text-[11px] leading-snug text-foreground-muted sm:mt-2 sm:text-[13px] sm:leading-relaxed">
          {seva.description}
        </p>

        {/* Amount selector */}
        <div className="mt-3 sm:mt-5">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-foreground-subtle sm:mb-2.5 sm:text-[11px]">
            Select Amount
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {seva.amounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountSelect(amount)}
                className={cn(
                  'rounded-md border px-2.5 py-1.5 text-[11px] font-semibold transition-all duration-200 sm:px-4 sm:py-2.5 sm:text-[13px]',
                  selectedAmount === amount
                    ? 'border-maroon bg-maroon text-white shadow-sm'
                    : 'border-border/80 text-foreground hover:border-maroon/30 hover:bg-maroon-muted/50 hover:text-maroon'
                )}
              >
                {formatPrice(amount)}
              </button>
            ))}
            {seva.allowCustom && (
              <button
                onClick={handleCustomToggle}
                className={cn(
                  'rounded-md border border-dashed px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200 sm:px-4 sm:py-2.5 sm:text-[13px]',
                  isCustom
                    ? 'border-maroon bg-maroon/5 text-maroon'
                    : 'border-foreground-subtle/40 text-foreground-subtle hover:border-maroon/30 hover:text-maroon'
                )}
              >
                Custom
              </button>
            )}
          </div>

          {/* Custom amount input */}
          {isCustom && (
            <div className="mt-3">
              <div className="flex items-center gap-2 rounded-md border border-border px-3 py-2 focus-within:border-maroon/40 focus-within:ring-1 focus-within:ring-maroon/20">
                <span className="text-sm font-medium text-foreground-subtle">
                  ₹
                </span>
                <input
                  type="number"
                  min="1"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-foreground-subtle/60 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Contribute button */}
        <button className="mt-3 w-full rounded-sm bg-maroon px-4 py-2.5 text-[12px] font-semibold tracking-wide text-white transition-colors hover:bg-maroon-dark active:scale-[0.98] sm:mt-5 sm:px-6 sm:py-3 sm:text-sm">
          Contribute
        </button>
      </div>
    </div>
  );
}
