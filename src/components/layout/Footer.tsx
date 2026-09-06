'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/data/site-config';
import { getWhatsAppLink } from '@/lib/utils';
import { ChevronDown, ArrowRight, Mail, Clock, Headphones } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Data ─── */
const footerSections = [
  {
    title: 'Sacred Offerings',
    links: [
      { label: 'Shop All Products', href: '/products' },
      { label: 'Puja & Havan', href: '/puja' },
      { label: 'Seva & Chadhava', href: '/puja#seva' },
      { label: 'Consultations', href: '/consultations' },
      { label: 'Sadhana', href: '/sadhana' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'About TANTRRA', href: '/about' },
      { label: 'Journal', href: '/journal' },
      { label: 'FAQs', href: '/faq' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Your Account',
    links: [
      { label: 'My Account', href: '/account' },
      { label: 'Track Your Order', href: '/account' },
      { label: 'My Bookings', href: '/account' },
      { label: 'My Orders', href: '/account' },
      { label: 'Wishlist', href: '/account' },
    ],
  },
  {
    title: 'Policies',
    links: [
      { label: 'Shipping Information', href: '/shipping' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Returns & Cancellation', href: '/returns' },
    ],
  },
];

/* ─── SVG Helpers ─── */

function TopOrnament() {
  return (
    <svg viewBox="0 0 600 50" className="mx-auto h-[40px] w-full max-w-[520px] sm:h-[46px] sm:max-w-[560px] lg:max-w-[620px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Left line */}
      <line x1="20" y1="25" x2="235" y2="25" stroke="#C9A84C" strokeWidth="0.7" opacity="0.4" />
      {/* Left leaf */}
      <g transform="translate(238,19)" opacity="0.5">
        <path d="M0 6 Q6 0 12 6 Q6 12 0 6Z" stroke="#C9A84C" strokeWidth="0.6" fill="none" />
      </g>
      {/* Left small dot */}
      <circle cx="255" cy="25" r="2" stroke="#C9A84C" strokeWidth="0.6" opacity="0.4" fill="none" />
      {/* Center lotus */}
      <g transform="translate(275,4)" opacity="0.55">
        <path d="M25 6 Q30 16 25 30 Q20 16 25 6Z" stroke="#C9A84C" strokeWidth="0.7" fill="none" />
        <path d="M25 8 Q34 14 30 28 Q25 20 25 8Z" stroke="#C9A84C" strokeWidth="0.6" fill="none" />
        <path d="M25 8 Q16 14 20 28 Q25 20 25 8Z" stroke="#C9A84C" strokeWidth="0.6" fill="none" />
        <path d="M25 10 Q38 16 33 30 Q27 22 25 10Z" stroke="#C9A84C" strokeWidth="0.5" fill="none" opacity="0.5" />
        <path d="M25 10 Q12 16 17 30 Q23 22 25 10Z" stroke="#C9A84C" strokeWidth="0.5" fill="none" opacity="0.5" />
        <ellipse cx="25" cy="34" rx="8" ry="2.5" stroke="#C9A84C" strokeWidth="0.5" fill="none" opacity="0.4" />
        <path d="M17 37 Q21 34 25 37 Q29 34 33 37" stroke="#C9A84C" strokeWidth="0.5" fill="none" opacity="0.4" />
      </g>
      {/* Right small dot */}
      <circle cx="345" cy="25" r="2" stroke="#C9A84C" strokeWidth="0.6" opacity="0.4" fill="none" />
      {/* Right leaf */}
      <g transform="translate(350,19)" opacity="0.5">
        <path d="M0 6 Q6 0 12 6 Q6 12 0 6Z" stroke="#C9A84C" strokeWidth="0.6" fill="none" />
      </g>
      {/* Right line */}
      <line x1="365" y1="25" x2="580" y2="25" stroke="#C9A84C" strokeWidth="0.7" opacity="0.4" />
    </svg>
  );
}

function HeadingOrnament() {
  return (
    <svg viewBox="0 0 90 14" className="mt-3 h-[11px] w-[70px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="7" x2="30" y2="7" stroke="#C9A84C" strokeWidth="0.6" opacity="0.45" />
      <circle cx="35" cy="7" r="2.2" stroke="#C9A84C" strokeWidth="0.5" opacity="0.45" fill="none" />
      <path d="M40 7 L45 3.5 L50 7 L45 10.5Z" stroke="#C9A84C" strokeWidth="0.45" opacity="0.4" fill="none" />
      <circle cx="55" cy="7" r="2.2" stroke="#C9A84C" strokeWidth="0.5" opacity="0.45" fill="none" />
      <line x1="60" y1="7" x2="90" y2="7" stroke="#C9A84C" strokeWidth="0.6" opacity="0.45" />
    </svg>
  );
}

function BotanicalCorner({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 240"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: flip ? 'scaleX(-1)' : undefined, pointerEvents: 'none' }}
    >
      {/* Lotus flower */}
      <g opacity="0.14">
        <path d="M100 40 Q115 80 100 130 Q85 80 100 40Z" fill="#91A86D" />
        <path d="M100 50 Q130 70 118 130 Q100 95 100 50Z" fill="#91A86D" />
        <path d="M100 50 Q70 70 82 130 Q100 95 100 50Z" fill="#91A86D" />
        <path d="M100 55 Q140 75 125 140 Q108 100 100 55Z" fill="#91A86D" opacity="0.6" />
        <path d="M100 55 Q60 75 75 140 Q92 100 100 55Z" fill="#91A86D" opacity="0.6" />
        <ellipse cx="100" cy="145" rx="22" ry="7" fill="#91A86D" opacity="0.35" />
        <path d="M75 155 Q88 145 100 155 Q112 145 125 155" stroke="#91A86D" strokeWidth="1.2" opacity="0.4" />
      </g>
      {/* Leaves */}
      <g opacity="0.1">
        <path d="M50 170 Q60 130 80 155 Q60 165 50 170Z" fill="#91A86D" />
        <path d="M150 170 Q140 130 120 155 Q140 165 150 170Z" fill="#91A86D" />
        <path d="M40 200 Q50 165 70 185 Q50 195 40 200Z" fill="#91A86D" />
        <path d="M160 200 Q150 165 130 185 Q150 195 160 200Z" fill="#91A86D" />
        <ellipse cx="100" cy="200" rx="40" ry="12" fill="#91A86D" opacity="0.3" />
      </g>
    </svg>
  );
}

function CenterLotus() {
  return (
    <svg viewBox="0 0 80 80" className="h-[60px] w-[60px] sm:h-[70px] sm:w-[70px] lg:h-[80px] lg:w-[80px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.18">
        <path d="M40 10 Q46 25 40 42 Q34 25 40 10Z" fill="#91A86D" />
        <path d="M40 13 Q52 22 48 42 Q40 32 40 13Z" fill="#91A86D" />
        <path d="M40 13 Q28 22 32 42 Q40 32 40 13Z" fill="#91A86D" />
        <path d="M40 16 Q56 24 51 46 Q43 34 40 16Z" fill="#91A86D" opacity="0.7" />
        <path d="M40 16 Q24 24 29 46 Q37 34 40 16Z" fill="#91A86D" opacity="0.7" />
        <ellipse cx="40" cy="50" rx="12" ry="4" fill="#91A86D" opacity="0.4" />
        <path d="M28 54 Q34 49 40 54 Q46 49 52 54" stroke="#91A86D" strokeWidth="1" opacity="0.5" />
        <path d="M24 58 Q32 52 40 58 Q48 52 56 58" stroke="#91A86D" strokeWidth="0.8" opacity="0.35" />
      </g>
    </svg>
  );
}

/* ─── Subcomponents ─── */

function FooterAccordion({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#D8D3C5]/50">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4"
        style={{ minHeight: '54px' }}
      >
        <span className="font-heading text-[clamp(13px,1vw,15px)] font-semibold uppercase tracking-[0.2em] text-[#3E492C]">{title}</span>
        <ChevronDown className={cn('h-5 w-5 text-[#91A86D] transition-transform duration-200', open && 'rotate-180')} />
      </button>
      <ul className={cn(
        'space-y-3 overflow-hidden transition-all duration-300',
        open ? 'max-h-80 opacity-100 pb-5' : 'max-h-0 opacity-0'
      )}>
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[clamp(15px,1.05vw,17px)] text-[#6D6B62] transition-colors duration-200 hover:text-[#B9934E]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ icon, href, label }: { icon: React.ReactNode; href?: string; label: string }) {
  const size = "flex h-[48px] w-[48px] items-center justify-center rounded-full border border-[#B8C89E] bg-[#EDF2E2] text-[#6B7F52] transition-all duration-200 hover:border-[#91A86D] hover:bg-[#E0EACF] hover:text-[#4A6B3C] hover:scale-105";

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={size} aria-label={label}>
        {icon}
      </a>
    );
  }
  return (
    <span className={cn(size, 'cursor-default opacity-50 hover:scale-100')} aria-label={label}>
      {icon}
    </span>
  );
}

/* ─── Icon SVGs (reusable) ─── */
const InstagramSvg = <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>;
const YouTubeSvg = <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>;
const FacebookSvg = <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>;
const WhatsAppSvg = <svg className="h-[18px] w-[18px]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>;

/* ═══════════════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════════════ */

export function Footer() {
  const whatsappLink = siteConfig.whatsappNumber
    ? getWhatsAppLink(siteConfig.whatsappNumber, 'Namaste, I need support regarding my order.')
    : null;

  const supportEmail = siteConfig.email || null;

  return (
    <footer className="pb-24 md:pb-0" style={{ height: 'auto', minHeight: 'auto' }}>

      {/* ════════ TOP SACRED DECORATIVE AREA ════════ */}
      <div className="relative overflow-hidden bg-[#FBF8F0]" style={{ paddingTop: 'clamp(28px, 4vw, 56px)', paddingBottom: 'clamp(8px, 1.5vw, 20px)' }}>

        {/* Ornamental botanical line + lotus */}
        <TopOrnament />

        {/* Sacred tagline */}
        <p
          className="mx-auto mt-5 text-center font-heading font-semibold uppercase text-[#B9934E]"
          style={{
            fontSize: 'clamp(13px, 1.2vw, 19px)',
            letterSpacing: '0.5em',
            opacity: 0.75,
          }}
        >
          Sacred Protection &nbsp;&middot;&nbsp; Guided with Purpose
        </p>

        {/* Sanskrit text — upper right on desktop, centered on mobile */}
        <p
          className="mt-4 text-center lg:absolute lg:right-[clamp(24px,4vw,80px)] lg:top-[clamp(20px,3vw,48px)] lg:mt-0 lg:text-right"
          style={{
            fontFamily: 'var(--font-devanagari), "Noto Serif Devanagari", serif',
            fontSize: 'clamp(22px, 2vw, 34px)',
            color: '#C9A84C',
            opacity: 0.55,
            fontWeight: 400,
            lineHeight: 1.5,
          }}
        >
          ॥ सर्वे भवन्तु सुखिनः ॥
        </p>
      </div>

      {/* ════════ MAIN FOOTER BODY ════════ */}
      <div className="relative overflow-hidden bg-[#FBF8F0]">

        {/* Botanical corner decorations */}
        <BotanicalCorner className="pointer-events-none absolute -bottom-4 -left-6 h-[180px] w-[180px] sm:h-[220px] sm:w-[220px] lg:h-[280px] lg:w-[280px]" />
        <BotanicalCorner className="pointer-events-none absolute -bottom-4 -right-6 h-[180px] w-[180px] sm:h-[220px] sm:w-[220px] lg:h-[280px] lg:w-[280px]" flip />

        {/* Upper left faint ornamental leaf */}
        <svg className="pointer-events-none absolute left-4 top-4 h-[80px] w-[80px] lg:left-8 lg:top-6 lg:h-[120px] lg:w-[120px]" viewBox="0 0 100 100" fill="none" opacity="0.06">
          <path d="M20 80 Q30 30 70 20 Q60 60 20 80Z" fill="#91A86D" />
          <path d="M30 85 Q35 45 65 35 Q55 65 30 85Z" fill="#91A86D" opacity="0.7" />
        </svg>
        {/* Upper right faint ornamental leaf */}
        <svg className="pointer-events-none absolute right-4 top-4 h-[80px] w-[80px] lg:right-8 lg:top-6 lg:h-[120px] lg:w-[120px]" viewBox="0 0 100 100" fill="none" opacity="0.06" style={{ transform: 'scaleX(-1)' }}>
          <path d="M20 80 Q30 30 70 20 Q60 60 20 80Z" fill="#91A86D" />
          <path d="M30 85 Q35 45 65 35 Q55 65 30 85Z" fill="#91A86D" opacity="0.7" />
        </svg>

        <div
          className="relative mx-auto w-full"
          style={{
            maxWidth: '1880px',
            padding: 'clamp(32px, 4vw, 60px) clamp(28px, 5vw, 90px)',
          }}
        >

          {/* ──── DESKTOP LAYOUT (>= 1100px) ──── */}
          <div
            className="hidden min-[1100px]:grid"
            style={{
              gridTemplateColumns: '1.5fr 0.85fr 0.72fr 0.85fr 0.9fr 1.3fr',
              gap: 'clamp(20px, 2vw, 48px)',
            }}
          >

            {/* ── Brand Column ── */}
            <div>
              <Link href="/" className="inline-block">
                <Image
                  src="/logo.png"
                  alt="TANTRRA"
                  width={200}
                  height={250}
                  className="w-auto"
                  style={{ height: 'clamp(140px, 12vw, 200px)' }}
                  unoptimized
                />
              </Link>
              <p
                className="mt-6 max-w-[310px] text-[#6D6B62]"
                style={{
                  fontSize: 'clamp(15px, 1vw, 18px)',
                  lineHeight: 1.75,
                }}
              >
                Sacred protection and spiritual guidance,
                prepared with devotion and purpose.
                Every offering is rooted in authentic tradition.
              </p>

              {/* Social Icons */}
              <div className="mt-7 flex gap-3.5">
                <SocialIcon label="Instagram" href={siteConfig.socialLinks.instagram || undefined} icon={InstagramSvg} />
                <SocialIcon label="YouTube" href={siteConfig.socialLinks.youtube || undefined} icon={YouTubeSvg} />
                <SocialIcon label="Facebook" href={siteConfig.socialLinks.facebook || undefined} icon={FacebookSvg} />
                <SocialIcon label="WhatsApp" href={whatsappLink || undefined} icon={WhatsAppSvg} />
              </div>

              {/* Tradition tagline */}
              <p
                className="mt-8 font-heading italic"
                style={{
                  fontSize: 'clamp(18px, 1.4vw, 27px)',
                  color: '#C9A84C',
                  opacity: 0.7,
                  letterSpacing: '0.01em',
                }}
              >
                Tradition &nbsp;&bull;&nbsp; Devotion &nbsp;&bull;&nbsp; Transformation
              </p>
            </div>

            {/* ── Navigation Columns ── */}
            {footerSections.map((section) => (
              <div
                key={section.title}
                className="border-l pl-[clamp(20px,2vw,36px)]"
                style={{ borderColor: 'rgba(200, 190, 165, 0.25)' }}
              >
                <h3
                  className="font-heading font-semibold uppercase text-[#3E492C]"
                  style={{
                    fontSize: 'clamp(13px, 1vw, 16px)',
                    letterSpacing: '0.22em',
                  }}
                >
                  {section.title}
                </h3>
                <HeadingOrnament />
                <ul className="mt-6 space-y-3.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[#6D6B62] transition-colors duration-200 hover:text-[#B9934E]"
                        style={{ fontSize: 'clamp(15px, 1.05vw, 18px)', lineHeight: 1.8 }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* ── Support Card ── */}
            <div>
              <div
                className="rounded-[24px] border border-[#B8C89E]/50 bg-[#F0F5E5] p-[clamp(20px,1.8vw,32px)]"
              >
                <div className="mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#E2EBD3] text-[#6B7F52]">
                  <Headphones className="h-7 w-7" />
                </div>
                <h4
                  className="font-heading font-semibold text-[#3E492C]"
                  style={{ fontSize: 'clamp(18px, 1.3vw, 24px)' }}
                >
                  Need Support?
                </h4>
                <p className="mt-2 text-[clamp(14px,0.95vw,16px)] leading-relaxed text-[#6D6B62]">
                  We&apos;re here to help on
                  <br />WhatsApp or Email.
                </p>

                {/* WhatsApp CTA */}
                {whatsappLink ? (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#6B7F52] py-[14px] px-5 font-semibold text-white whitespace-nowrap transition-all duration-200 hover:bg-[#5A6E44] hover:shadow-md"
                    style={{ fontSize: 'clamp(14px, 1vw, 16px)', minHeight: '54px' }}
                  >
                    <svg className="h-[18px] w-[18px] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    Chat on WhatsApp
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </a>
                ) : (
                  <div
                    className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#6B7F52]/40 py-[14px] px-5 font-semibold text-white whitespace-nowrap"
                    style={{ fontSize: 'clamp(14px, 1vw, 16px)', minHeight: '54px' }}
                  >
                    <svg className="h-[18px] w-[18px] shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    Chat on WhatsApp
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </div>
                )}

                {/* Email row */}
                {supportEmail ? (
                  <div className="mt-4 flex items-center gap-2.5 text-[clamp(13px,0.9vw,15px)] text-[#6D6B62]">
                    <Mail className="h-4 w-4 shrink-0 text-[#91A86D]" />
                    <a href={`mailto:${supportEmail}`} className="transition-colors hover:text-[#B9934E]">
                      {supportEmail}
                    </a>
                  </div>
                ) : (
                  <div className="mt-4 flex items-center gap-2.5 text-[clamp(13px,0.9vw,15px)] text-[#6D6B62]/50">
                    <Mail className="h-4 w-4 shrink-0 text-[#91A86D]/50" />
                    <span>Email support coming soon</span>
                  </div>
                )}

                {/* Hours row */}
                <div className="mt-2.5 flex items-center gap-2.5 text-[clamp(13px,0.9vw,15px)] text-[#6D6B62]/70">
                  <Clock className="h-4 w-4 shrink-0 text-[#91A86D]/60" />
                  <span>Mon – Sat &nbsp;|&nbsp; 10 AM – 7 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* ──── TABLET LAYOUT (768px – 1099px) ──── */}
          <div className="hidden min-[768px]:block min-[1100px]:hidden">
            {/* Brand area full width */}
            <div className="flex flex-col items-center text-center">
              <Link href="/" className="inline-block">
                <Image
                  src="/logo.png"
                  alt="TANTRRA"
                  width={180}
                  height={225}
                  className="h-[150px] w-auto"
                  unoptimized
                />
              </Link>
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-[#6D6B62]">
                Sacred protection and spiritual guidance,
                prepared with devotion and purpose.
                Every offering is rooted in authentic tradition.
              </p>
              <div className="mt-5 flex gap-3.5">
                <SocialIcon label="Instagram" href={siteConfig.socialLinks.instagram || undefined} icon={InstagramSvg} />
                <SocialIcon label="YouTube" href={siteConfig.socialLinks.youtube || undefined} icon={YouTubeSvg} />
                <SocialIcon label="Facebook" href={siteConfig.socialLinks.facebook || undefined} icon={FacebookSvg} />
                <SocialIcon label="WhatsApp" href={whatsappLink || undefined} icon={WhatsAppSvg} />
              </div>
              <p className="mt-6 font-heading text-[20px] italic text-[#C9A84C]" style={{ opacity: 0.65 }}>
                Tradition &nbsp;&bull;&nbsp; Devotion &nbsp;&bull;&nbsp; Transformation
              </p>
            </div>

            {/* Divider */}
            <div className="mx-auto my-8 h-px w-full max-w-lg bg-gradient-to-r from-transparent via-[#D8D3C5]/50 to-transparent" />

            {/* 4-column nav grid */}
            <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-4">
              {footerSections.map((section) => (
                <div key={section.title}>
                  <h3 className="font-heading text-[14px] font-semibold uppercase tracking-[0.2em] text-[#3E492C]">
                    {section.title}
                  </h3>
                  <HeadingOrnament />
                  <ul className="mt-5 space-y-3">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href} className="text-[15px] text-[#6D6B62] transition-colors hover:text-[#B9934E]">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="mx-auto my-8 h-px w-full max-w-lg bg-gradient-to-r from-transparent via-[#D8D3C5]/50 to-transparent" />

            {/* Support card — centered */}
            <div className="mx-auto max-w-sm">
              <div className="rounded-[24px] border border-[#B8C89E]/50 bg-[#F0F5E5] p-6 text-center">
                <div className="mx-auto mb-3 flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#E2EBD3] text-[#6B7F52]">
                  <Headphones className="h-6 w-6" />
                </div>
                <h4 className="font-heading text-[18px] font-semibold text-[#3E492C]">Need Support?</h4>
                <p className="mt-1.5 text-[14px] text-[#6D6B62]">We&apos;re here to help on WhatsApp or Email.</p>
                {whatsappLink ? (
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6B7F52] py-3.5 text-[15px] font-semibold text-white whitespace-nowrap transition-all hover:bg-[#5A6E44]" style={{ minHeight: '54px' }}>
                    Chat on WhatsApp <ArrowRight className="h-4 w-4" />
                  </a>
                ) : (
                  <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6B7F52]/40 py-3.5 text-[15px] font-semibold text-white whitespace-nowrap" style={{ minHeight: '54px' }}>
                    Chat on WhatsApp <ArrowRight className="h-4 w-4" />
                  </div>
                )}
                {supportEmail ? (
                  <p className="mt-3 flex items-center justify-center gap-2 text-[13px] text-[#6D6B62]">
                    <Mail className="h-4 w-4 text-[#91A86D]" /> {supportEmail}
                  </p>
                ) : (
                  <p className="mt-3 flex items-center justify-center gap-2 text-[13px] text-[#6D6B62]/50">
                    <Mail className="h-4 w-4 text-[#91A86D]/50" /> Email support coming soon
                  </p>
                )}
                <p className="mt-2 flex items-center justify-center gap-2 text-[13px] text-[#6D6B62]/70">
                  <Clock className="h-4 w-4 text-[#91A86D]/60" /> Mon – Sat | 10 AM – 7 PM
                </p>
              </div>
            </div>
          </div>

          {/* ──── MOBILE LAYOUT (< 768px) ──── */}
          <div className="min-[768px]:hidden">
            {/* Centered brand */}
            <div className="flex flex-col items-center text-center">
              <Link href="/" className="inline-block">
                <Image
                  src="/logo.png"
                  alt="TANTRRA"
                  width={160}
                  height={200}
                  className="h-[120px] w-auto sm:h-[140px]"
                  unoptimized
                />
              </Link>
              <p className="mt-4 max-w-[280px] text-[14px] leading-relaxed text-[#6D6B62]">
                Sacred protection and spiritual guidance,
                prepared with devotion and purpose.
              </p>

              <div className="mt-5 flex gap-3">
                <SocialIcon label="Instagram" href={siteConfig.socialLinks.instagram || undefined} icon={InstagramSvg} />
                <SocialIcon label="YouTube" href={siteConfig.socialLinks.youtube || undefined} icon={YouTubeSvg} />
                <SocialIcon label="Facebook" href={siteConfig.socialLinks.facebook || undefined} icon={FacebookSvg} />
                <SocialIcon label="WhatsApp" href={whatsappLink || undefined} icon={WhatsAppSvg} />
              </div>

              <p className="mt-5 font-heading italic text-[#C9A84C]" style={{ fontSize: 'clamp(18px, 5vw, 21px)', opacity: 0.65 }}>
                Tradition &nbsp;&bull;&nbsp; Devotion &nbsp;&bull;&nbsp; Transformation
              </p>
            </div>

            {/* Divider */}
            <div className="mx-auto my-6 h-px w-full max-w-xs bg-gradient-to-r from-transparent via-[#D8D3C5]/50 to-transparent" />

            {/* Accordion nav */}
            <div className="mx-auto max-w-md">
              {footerSections.map((section) => (
                <FooterAccordion key={section.title} title={section.title} links={section.links} />
              ))}
            </div>

            {/* Divider */}
            <div className="mx-auto my-6 h-px w-full max-w-xs bg-gradient-to-r from-transparent via-[#D8D3C5]/50 to-transparent" />

            {/* Support Card — mobile */}
            <div className="mx-auto max-w-sm">
              <div className="rounded-[20px] border border-[#B8C89E]/50 bg-[#F0F5E5] p-5 text-center">
                <div className="mx-auto mb-3 flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#E2EBD3] text-[#6B7F52]">
                  <Headphones className="h-5 w-5" />
                </div>
                <h4 className="font-heading text-[17px] font-semibold text-[#3E492C]">Need Support?</h4>
                <p className="mt-1 text-[13.5px] text-[#6D6B62]">We&apos;re here to help on WhatsApp or Email.</p>
                {whatsappLink ? (
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6B7F52] py-3.5 text-[14px] font-semibold text-white whitespace-nowrap transition-all hover:bg-[#5A6E44]" style={{ minHeight: '54px' }}>
                    Chat on WhatsApp <ArrowRight className="h-4 w-4" />
                  </a>
                ) : (
                  <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#6B7F52]/40 py-3.5 text-[14px] font-semibold text-white whitespace-nowrap" style={{ minHeight: '54px' }}>
                    Chat on WhatsApp <ArrowRight className="h-4 w-4" />
                  </div>
                )}
                {supportEmail ? (
                  <p className="mt-3 flex items-center justify-center gap-2 text-[13px] text-[#6D6B62]">
                    <Mail className="h-3.5 w-3.5 text-[#91A86D]" /> {supportEmail}
                  </p>
                ) : (
                  <p className="mt-3 flex items-center justify-center gap-2 text-[13px] text-[#6D6B62]/50">
                    <Mail className="h-3.5 w-3.5 text-[#91A86D]/50" /> Email support coming soon
                  </p>
                )}
                <p className="mt-2 flex items-center justify-center gap-2 text-[13px] text-[#6D6B62]/70">
                  <Clock className="h-3.5 w-3.5 text-[#91A86D]/60" /> Mon – Sat | 10 AM – 7 PM
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ════════ BOTTOM BAR ════════ */}
      <div className="relative overflow-hidden bg-[#EBF0DE]">
        {/* Center lotus above strip */}
        <div className="absolute left-1/2 -top-[30px] -translate-x-1/2 sm:-top-[35px] lg:-top-[40px]">
          <CenterLotus />
        </div>

        <div
          className="mx-auto flex w-full flex-col items-center gap-4 lg:flex-row lg:justify-between"
          style={{
            maxWidth: '1880px',
            padding: 'clamp(20px, 2.5vw, 36px) clamp(28px, 5vw, 90px)',
            minHeight: 'clamp(70px, 6vw, 95px)',
          }}
        >
          {/* Left: Copyright */}
          <p className="text-[clamp(12px,0.85vw,14px)] text-[#6D6B62]/80">
            &copy; {new Date().getFullYear()} TANTRRA. All rights reserved.
          </p>

          {/* Center: Tagline with gold lines */}
          <div className="flex items-center gap-4">
            <div className="hidden h-px w-16 bg-gradient-to-r from-transparent to-[#C9A84C]/35 sm:block" />
            <p
              className="font-heading italic text-[#B9934E]"
              style={{ fontSize: 'clamp(13px, 1vw, 16px)', opacity: 0.65, letterSpacing: '0.02em' }}
            >
              Sacred protection &middot; Guided with purpose
            </p>
            <div className="hidden h-px w-16 bg-gradient-to-l from-transparent to-[#C9A84C]/35 sm:block" />
          </div>

          {/* Right: Payment badges + security */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <span className="rounded-md border border-[#B8C89E]/50 bg-white/90 px-2.5 py-1.5 text-[11px] font-bold tracking-wide text-[#1A1F71]">VISA</span>
              <span className="rounded-md border border-[#B8C89E]/50 bg-white/90 px-2 py-1.5">
                <svg viewBox="0 0 32 20" className="h-4 w-7">
                  <circle cx="11" cy="10" r="7" fill="#EB001B" opacity="0.9" />
                  <circle cx="21" cy="10" r="7" fill="#F79E1B" opacity="0.9" />
                  <path d="M16 4.6a7 7 0 010 10.8 7 7 0 000-10.8z" fill="#FF5F00" opacity="0.9" />
                </svg>
              </span>
              <span className="rounded-md border border-[#B8C89E]/50 bg-white/90 px-2.5 py-1.5 text-[10px] font-bold tracking-wide text-[#097A44]">RuPay</span>
              <span className="rounded-md border border-[#B8C89E]/50 bg-white/90 px-2.5 py-1.5 text-[10px] font-bold tracking-wider text-[#3D3D3D]">UPI</span>
            </div>
            <div className="flex items-center gap-2 pl-2">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#6B7F52]" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="text-[11px] leading-tight text-[#6D6B62]/80">
                <span className="font-semibold">100% Secure</span>
                <br />Payments
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
