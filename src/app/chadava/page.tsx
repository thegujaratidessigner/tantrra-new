import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { ChadavaContent } from '@/components/chadava/ChadavaContent';

export const metadata: Metadata = {
  title: 'Chadava — Sacred Offerings',
  description:
    'Sacred Chadava offerings — Deity Anushthan, Navagraha Poojan, Tithi & Tewar Panchopchar Poojan, and Daan Seva.',
};

export default function ChadavaPage() {
  return (
    <>
      {/* Page Header */}
      <div className="relative overflow-hidden bg-[#1B3D2F] py-10 sm:py-14 lg:py-16">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <svg
            className="absolute right-0 top-1/2 h-[300px] w-[300px] -translate-y-1/2 translate-x-1/3 opacity-[0.04]"
            viewBox="0 0 300 300"
            fill="none"
          >
            <circle cx="150" cy="150" r="140" stroke="#D4B06A" strokeWidth="0.5" />
            <circle cx="150" cy="150" r="110" stroke="#D4B06A" strokeWidth="0.4" />
            <circle cx="150" cy="150" r="80" stroke="#D4B06A" strokeWidth="0.3" />
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <ellipse key={a} cx="150" cy="60" rx="18" ry="45" stroke="#D4B06A" strokeWidth="0.3" transform={`rotate(${a} 150 150)`} />
            ))}
          </svg>
          <svg
            className="absolute left-0 top-1/2 h-[200px] w-[200px] -translate-y-1/2 -translate-x-1/3 opacity-[0.03]"
            viewBox="0 0 200 200"
            fill="none"
          >
            <circle cx="100" cy="100" r="90" stroke="#D4B06A" strokeWidth="0.4" />
            <circle cx="100" cy="100" r="60" stroke="#D4B06A" strokeWidth="0.3" />
          </svg>
        </div>

        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-light sm:text-xs">
              Sacred Offerings
            </p>
            <h1 className="font-heading text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-tight text-white">
              Chadava
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-white/60">
              Deity Anushthan, Navagraha Poojan, Tithi &amp; Tewar Panchopchar Poojan, and Daan Seva — sacred offerings performed with devotion and tradition.
            </p>
          </div>
        </Container>
      </div>

      <ChadavaContent />
    </>
  );
}
