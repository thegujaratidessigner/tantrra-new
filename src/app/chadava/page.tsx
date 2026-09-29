import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { NavagrahaSelector } from '@/components/chadava/NavagrahaSelector';
import { SevaCard } from '@/components/puja/SevaCard';
import { deityAnushthan, tithiPoojan, getActiveDaanSeva } from '@/data/chadava';
import { formatPrice } from '@/lib/utils';
import { Flame, Sun, Calendar, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Chadava — Sacred Offerings',
  description:
    'Sacred Chadava offerings — Deity Anushthan, Navagraha Poojan, Tithi & Tewar Panchopchar Poojan, and Daan Seva.',
};

function OrnamentalDivider({ icon: Icon }: { icon: React.ElementType }) {
  return (
    <div className="my-12 flex items-center gap-4 lg:my-16">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#B88A3B]/20 to-[#E8E2D4]" />
      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#B88A3B]/20 bg-[#FFFDF8]">
        <Icon className="h-3.5 w-3.5 text-gold/60" />
      </div>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#B88A3B]/20 to-[#E8E2D4]" />
    </div>
  );
}

function CategoryHeader({ icon: Icon, title, id, iconBg = 'bg-gold/10', iconColor = 'text-gold-dark' }: {
  icon: React.ElementType;
  title: string;
  id: string;
  iconBg?: string;
  iconColor?: string;
}) {
  return (
    <div id={id} className="scroll-mt-24 mb-6 flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <h2 className="font-heading text-[clamp(1.25rem,2.5vw,1.75rem)] font-semibold text-foreground">
        {title}
      </h2>
    </div>
  );
}

export default function ChadavaPage() {
  const daanSeva = getActiveDaanSeva();

  const kamakhyaOfferings = deityAnushthan.filter((d) => d.deity === 'Maa Kamakhya');
  const sadashivOfferings = deityAnushthan.filter((d) => d.deity === 'Sadashiv');
  const dashMahavidyaOfferings = deityAnushthan.filter((d) => d.deity === 'Dash Mahavidya');

  const deityGroups = [
    { deity: 'Maa Kamakhya', offerings: kamakhyaOfferings },
    { deity: 'Sadashiv', offerings: sadashivOfferings },
    { deity: 'Dash Mahavidya', offerings: dashMahavidyaOfferings },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="relative overflow-hidden bg-[#1B3D2F] py-10 sm:py-14 lg:py-16">
        {/* Subtle decorative mandala */}
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

            {/* Category quick-nav */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                { href: '#deity-anushthan', label: 'Deity Anushthan', icon: '🔥' },
                { href: '#navagraha', label: 'Navagraha Poojan', icon: '☀️' },
                { href: '#tithi-tewar', label: 'Tithi & Tewar', icon: '📿' },
                { href: '#daan-seva', label: 'Daan Seva', icon: '🙏' },
              ].map((cat) => (
                <a
                  key={cat.href}
                  href={cat.href}
                  className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-medium text-white/80 backdrop-blur-sm transition-all hover:border-gold-light/30 hover:bg-white/10 hover:text-white sm:text-[12px]"
                >
                  <span className="text-[10px]">{cat.icon}</span>
                  {cat.label}
                </a>
              ))}
            </div>
          </div>
        </Container>
      </div>

      <div className="relative py-10 sm:py-12 lg:py-16">
        {/* Subtle page background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 top-[5%] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(184,138,59,0.03),transparent_65%)]" />
        </div>

        <Container className="relative">
          {/* ── A. DEITY ANUSHTHAN ───────────────────────── */}
          <section>
            <CategoryHeader icon={Flame} title="Deity Anushthan" id="deity-anushthan" />
            <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-foreground-muted">
              Sacred offerings performed for specific deities with Panchopchar and Maha Poojan options.
            </p>

            <div className="space-y-8">
              {deityGroups.map((group) => (
                <div key={group.deity}>
                  <h3 className="mb-3 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-foreground-subtle">
                    <span className="h-px w-4 bg-gold/30" />
                    {group.deity}
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {group.offerings.map((offering, i) => (
                      <AnimatedSection key={offering.id} delay={i * 0.06}>
                        <div className="flex items-center justify-between rounded-xl border border-[#E8E2D4] bg-white px-5 py-4 transition-all hover:border-gold/25 hover:shadow-[0_4px_16px_rgba(33,29,24,0.05)]">
                          <div>
                            <p className="text-[14px] font-medium text-foreground">{offering.name}</p>
                            <p className="mt-0.5 text-[12px] capitalize text-foreground-subtle">{offering.tier} Poojan</p>
                          </div>
                          <span className="ml-3 text-lg font-bold text-green">
                            {formatPrice(offering.price)}
                          </span>
                        </div>
                      </AnimatedSection>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <OrnamentalDivider icon={Sun} />

          {/* ── B. NAVAGRAHA POOJAN ───────────────────────── */}
          <section>
            <CategoryHeader icon={Sun} title="Navagraha Poojan &amp; Chadava" id="navagraha" />
            <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-foreground-muted">
              Day-wise sacred offerings for the nine celestial bodies. Select a day to view available Graha offerings with Panchopchar Poojan.
            </p>

            <NavagrahaSelector />
          </section>

          <OrnamentalDivider icon={Calendar} />

          {/* ── C. TITHI & TEWAR PANCHOPCHAR POOJAN ───────────────────────── */}
          <section>
            <CategoryHeader icon={Calendar} title="Tithi &amp; Tewar Panchopchar Poojan" id="tithi-tewar" />
            <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-foreground-muted">
              Sacred Panchopchar Poojan performed on auspicious Tithis. Each includes Dhoop, Deepam, Pushpa, Gandham, and Naivedya.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {tithiPoojan.map((tithi, i) => (
                <AnimatedSection key={tithi.id} delay={i * 0.05}>
                  <div className="flex items-center justify-between rounded-xl border border-[#E8E2D4] bg-white px-5 py-4 transition-all hover:border-gold/25 hover:shadow-[0_4px_16px_rgba(33,29,24,0.05)]">
                    <div>
                      <p className="text-[14px] font-medium text-foreground">{tithi.name}</p>
                      {tithi.deity && (
                        <p className="mt-0.5 text-[12px] text-foreground-subtle">{tithi.deity}</p>
                      )}
                    </div>
                    <span className="ml-3 text-lg font-bold text-green">
                      {formatPrice(tithi.price)}
                    </span>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </section>

          <OrnamentalDivider icon={Heart} />

          {/* ── D. DAAN SEVA ───────────────────────── */}
          <section>
            <CategoryHeader
              icon={Heart}
              title="Daan Seva"
              id="daan-seva"
              iconBg="bg-maroon/8"
              iconColor="text-maroon"
            />
            <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-foreground-muted">
              Contribute to sacred causes and meaningful service. Every contribution supports the welfare of those in need.
            </p>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
              {daanSeva.map((seva, i) => (
                <AnimatedSection key={seva.id} delay={i * 0.08}>
                  <SevaCard seva={seva} />
                </AnimatedSection>
              ))}
            </div>
          </section>
        </Container>
      </div>
    </>
  );
}
