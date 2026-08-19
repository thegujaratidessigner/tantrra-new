'use client';

import { useState } from 'react';
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
    <div className="flex h-full flex-col rounded-lg border border-border/60 bg-white transition-all duration-300 hover:border-maroon/15 hover:shadow-md">
      {/* Top accent */}
      <div className="h-[2px] rounded-t-lg bg-gradient-to-r from-maroon/40 via-maroon/20 to-transparent" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-heading text-lg font-semibold text-foreground">
          {seva.name}
        </h3>
        <p className="mt-2 flex-1 text-[13px] leading-relaxed text-foreground-muted">
          {seva.description}
        </p>

        {/* Amount selector */}
        <div className="mt-5">
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground-subtle">
            Select Amount
          </p>
          <div className="flex flex-wrap gap-2">
            {seva.amounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountSelect(amount)}
                className={cn(
                  'rounded-md border px-4 py-2.5 text-[13px] font-semibold transition-all duration-200',
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
                  'rounded-md border border-dashed px-4 py-2.5 text-[13px] font-medium transition-all duration-200',
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
        <button className="mt-5 w-full rounded-sm bg-maroon px-6 py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-maroon-dark active:scale-[0.98]">
          Contribute
        </button>
      </div>
    </div>
  );
}
