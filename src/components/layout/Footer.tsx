'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/data/site-config';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const footerSections = [
  {
    title: 'Sacred Offerings',
    links: [
      { label: 'Shop All Products', href: '/products' },
      { label: 'Puja & Havan', href: '/puja' },
      { label: 'Seva & Chadava', href: '/puja#seva' },
      { label: 'Consultations', href: '/consultations' },
      { label: 'Sadhana', href: '/sadhana' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'About TANTRRA', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQs', href: '/faq' },
      { label: 'Shipping Information', href: '/shipping' },
      { label: 'Track Your Order', href: '/account' },
    ],
  },
  {
    title: 'Policies',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Returns & Cancellation', href: '/returns' },
    ],
  },
];

function FooterAccordion({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10 lg:border-none">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-3.5 lg:hidden"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">{title}</span>
        <ChevronDown className={cn('h-4 w-4 text-white/30 transition-transform duration-200', open && 'rotate-180')} />
      </button>
      <h3 className="mb-5 hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70 lg:block">
        {title}
      </h3>
      <ul className={cn(
        'space-y-3 overflow-hidden transition-all lg:!max-h-none lg:!opacity-100 lg:!pb-0',
        open ? 'max-h-60 opacity-100 pb-4' : 'max-h-0 opacity-0'
      )}>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[13px] text-white/45 transition-colors duration-200 hover:text-gold"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const hasSocial = siteConfig.socialLinks.instagram || siteConfig.socialLinks.youtube;

  return (
    <footer className="pb-24 md:pb-0">
      {/* Main footer — deep green */}
      <div className="bg-green">
        <Container>
          <div className="grid gap-8 py-12 lg:grid-cols-5 lg:gap-12 lg:py-16">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block">
                <Image
                  src="/logo.png"
                  alt="TANTRRA"
                  width={144}
                  height={180}
                  className="h-[154px] w-auto brightness-0 invert sm:h-[168px] lg:h-[188px]"
                  unoptimized
                />
              </Link>
              <p className="mt-6 max-w-xs text-[13px] leading-relaxed text-white/50">
                Sacred protection and spiritual guidance, prepared with
                devotion and purpose. Every offering is rooted in authentic
                tradition.
              </p>

              {/* Social Links */}
              {hasSocial && (
                <div className="mt-7 flex gap-3">
                  {siteConfig.socialLinks.instagram && (
                    <a href={siteConfig.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white/40 transition-all duration-200 hover:border-gold/50 hover:bg-white/5 hover:text-gold" aria-label="Instagram">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    </a>
                  )}
                  {siteConfig.socialLinks.youtube && (
                    <a href={siteConfig.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 text-white/40 transition-all duration-200 hover:border-gold/50 hover:bg-white/5 hover:text-gold" aria-label="YouTube">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Link Sections */}
            {footerSections.map((section) => (
              <FooterAccordion key={section.title} title={section.title} links={section.links} />
            ))}
          </div>
        </Container>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8 bg-green-dark">
        <Container>
          <div className="flex flex-col items-center justify-between gap-2 py-4 sm:flex-row">
            <p className="text-[11px] text-white/30">
              &copy; {new Date().getFullYear()} TANTRRA. All rights reserved.
            </p>
            <p className="text-[10px] tracking-wide text-white/20">
              Sacred protection &middot; Guided with purpose
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
