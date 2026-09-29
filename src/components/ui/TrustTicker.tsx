'use client';

const trustMessages = [
  { text: '100% Authentic Products', sub: 'Sourced with Care' },
  { text: 'Secure & Fast Delivery', sub: 'Across India' },
  { text: 'Trusted Spiritual Community', sub: 'Growing with Devotion' },
  { text: 'Personalized Guidance', sub: 'By Experienced Practitioners' },
];

function LotusSep() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      className="mx-5 shrink-0 text-[#B88A3B]/40 sm:mx-7"
      aria-hidden="true"
    >
      <path
        d="M5 1C5 1 3.8 3 3.8 4.8C3.8 6 4.4 6.6 5 6.6C5.6 6.6 6.2 6 6.2 4.8C6.2 3 5 1 5 1Z"
        fill="currentColor"
      />
      <path
        d="M5 3C5 3 2.5 4.5 2.5 6C2.5 7.2 3.7 8 5 8C6.3 8 7.5 7.2 7.5 6C7.5 4.5 5 3 5 3Z"
        fill="currentColor"
        opacity="0.35"
      />
    </svg>
  );
}

function TrackContent() {
  return (
    <>
      {trustMessages.map((item, i) => (
        <div key={i} className="flex shrink-0 items-center">
          <LotusSep />
          <span className="text-[11px] font-medium tracking-[0.02em] text-foreground sm:text-[12px]">
            {item.text}
          </span>
          <span className="ml-1.5 text-[10px] text-foreground-subtle sm:text-[11px]">
            — {item.sub}
          </span>
        </div>
      ))}
    </>
  );
}

export function TrustTicker() {
  return (
    <div
      className="relative overflow-hidden border-b border-[#E8E2D4]/60 bg-[#F8F4EB]"
      role="marquee"
      aria-label="Trust benefits"
    >
      <div className="trust-ticker-track flex h-[34px] items-center whitespace-nowrap sm:h-[38px]">
        <TrackContent />
        <TrackContent />
      </div>
    </div>
  );
}
