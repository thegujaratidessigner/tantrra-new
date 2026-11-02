import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ExternalLink } from 'lucide-react';

interface SocialProfile {
  name: string;
  handle: string;
  href: string;
  platform: 'instagram' | 'youtube';
}

const socialProfiles: SocialProfile[] = [
  {
    name: 'TANTRRA',
    handle: '@tantrra.in',
    href: 'https://www.instagram.com/tantrra.in',
    platform: 'instagram',
  },
  {
    name: 'Tripuransh',
    handle: '@tripuransh_',
    href: 'https://www.instagram.com/tripuransh_',
    platform: 'instagram',
  },
  {
    name: 'Shakk Tarot',
    handle: '@shakttarot',
    href: 'https://www.instagram.com/shakttarot',
    platform: 'instagram',
  },
  {
    name: 'Tripuransh',
    handle: '@tripuransh',
    href: 'https://youtube.com/@tripuransh',
    platform: 'youtube',
  },
  {
    name: 'Shakk Tarot',
    handle: '@shakttarot',
    href: 'https://youtube.com/@shakttarot',
    platform: 'youtube',
  },
];

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function SocialCard({ profile }: { profile: SocialProfile }) {
  const isInstagram = profile.platform === 'instagram';

  return (
    <a
      href={profile.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 rounded-xl border border-[#E8E2D4] bg-white p-4 transition-all hover:border-gold/30 hover:shadow-md sm:p-5"
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-110 ${
          isInstagram
            ? 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white'
            : 'bg-[#FF0000] text-white'
        }`}
      >
        {isInstagram ? (
          <InstagramIcon className="h-5 w-5" />
        ) : (
          <YouTubeIcon className="h-5 w-5" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-heading text-[15px] font-semibold text-foreground sm:text-[16px]">
          {profile.name}
        </p>
        <p className="text-[13px] text-foreground-muted">
          {isInstagram ? 'Instagram' : 'YouTube'} &middot; {profile.handle}
        </p>
      </div>
      <ExternalLink className="h-4 w-4 shrink-0 text-foreground-subtle transition-colors group-hover:text-gold" />
    </a>
  );
}

export function SocialMediaSection() {
  return (
    <section className="relative overflow-hidden bg-[#F4F0E6] py-14 sm:py-16 lg:py-20">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
      </div>

      <Container className="relative">
        <SectionHeading
          label="Stay Connected"
          title="Connect with TANTRRA"
          description="Follow us for sacred wisdom, spiritual insights, tarot readings and updates on our spiritual journey."
        />

        <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2 sm:gap-4">
          {socialProfiles.map((profile) => (
            <SocialCard
              key={`${profile.platform}-${profile.handle}`}
              profile={profile}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
