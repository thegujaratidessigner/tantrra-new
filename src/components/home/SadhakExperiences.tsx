import type { Banner } from '@/lib/content/types';

export function SadhakExperiences({ banner }: { banner?: Banner }) {
  if (!banner?.desktopSrc) return null;
  return (
    <section>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={banner.desktopSrc}
        alt={banner.alt}
        width={1969}
        height={799}
        loading="lazy"
        decoding="async"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </section>
  );
}
