'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/data/site-config';
import { getWhatsAppLink } from '@/lib/utils';
import { ChevronDown, ArrowRight, Mail, Clock, Headphones } from 'lucide-react';
import { cn } from '@/lib/utils';

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

function HeadingOrnament() {
  return (
    <svg viewBox="0 0 80 12" className="mt-2.5 h-[10px] w-[60px]" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 6h28" stroke="#C9A84C" strokeWidth="0.5" opacity="0.5" />
      <circle cx="32" cy="6" r="2" stroke="#C9A84C" strokeWidth="0.5" opacity="0.5" />
      <path d="M36 6 L40 3 L44 6 L40 9Z" stroke="#C9A84C" strokeWidth="0.4" opacity="0.4" />
      <circle cx="48" cy="6" r="2" stroke="#C9A84C" strokeWidth="0.5" opacity="0.5" />
      <path d="M52 6h28" stroke="#C9A84C" strokeWidth="0.5" opacity="0.5" />
    </svg>
  );
}

function FooterAccordion({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#D8D3C5]/60 lg:border-none">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-3.5 lg:hidden"
      >
        <span className="font-heading text-[12px] font-semibold uppercase tracking-[0.2em] text-[#3E492C]">{title}</span>
        <ChevronDown className={cn('h-4 w-4 text-[#91A86D] transition-transform duration-200', open && 'rotate-180')} />
      </button>
      <div className="hidden lg:block">
        <h3 className="font-heading text-[12px] font-semibold uppercase tracking-[0.22em] text-[#3E492C]">
          {title}
        </h3>
        <HeadingOrnament />
      </div>
      <ul className={cn(
        'space-y-2.5 overflow-hidden transition-all duration-300 lg:!max-h-none lg:!opacity-100 lg:!pb-0 lg:mt-5',
        open ? 'max-h-60 opacity-100 pb-4' : 'max-h-0 opacity-0'
      )}>
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[13.5px] text-[#6D6B62] transition-colors duration-200 hover:text-[#B9934E]"
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
  const classes = "flex h-10 w-10 items-center justify-center rounded-full border border-[#C5CEAE] bg-[#F0F4E6] text-[#6B7F52] transition-all duration-200 hover:border-[#91A86D] hover:bg-[#E4ECDA] hover:text-[#4A6B3C] hover:scale-105";

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} aria-label={label}>
        {icon}
      </a>
    );
  }
  return (
    <span className={cn(classes, 'cursor-default opacity-60 hover:scale-100')} aria-label={label}>
      {icon}
    </span>
  );
}

function LotusDecoration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" opacity="0.08">
      <path d="M60 20 Q70 40 60 65 Q50 40 60 20Z" fill="#91A86D" />
      <path d="M60 25 Q80 35 70 65 Q60 45 60 25Z" fill="#91A86D" />
      <path d="M60 25 Q40 35 50 65 Q60 45 60 25Z" fill="#91A86D" />
      <path d="M60 30 Q90 40 75 70 Q65 50 60 30Z" fill="#91A86D" opacity="0.6" />
      <path d="M60 30 Q30 40 45 70 Q55 50 60 30Z" fill="#91A86D" opacity="0.6" />
      <ellipse cx="60" cy="75" rx="15" ry="5" fill="#91A86D" opacity="0.3" />
      <path d="M40 80 Q50 70 60 80 Q70 70 80 80" stroke="#91A86D" strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
}

export function Footer() {
  const whatsappLink = siteConfig.whatsappNumber
    ? getWhatsAppLink(siteConfig.whatsappNumber, 'Namaste, I need support regarding my order.')
    : null;

  return (
    <footer className="pb-24 md:pb-0">
      {/* ── Top Sacred Divider ── */}
      <div className="relative overflow-hidden bg-[#FBF8F0] pt-10 pb-2">
        {/* Ornamental line with lotus */}
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4">
          <div className="flex flex-1 items-center gap-1.5">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-[#C9A84C]/40" />
            <svg viewBox="0 0 20 8" className="h-2 w-5 text-[#C9A84C]/40" fill="currentColor">
              <path d="M4 4 Q6 0 10 0 Q14 0 16 4 Q14 8 10 8 Q6 8 4 4Z" opacity="0.6" />
              <path d="M0 4h4M16 4h4" stroke="currentColor" strokeWidth="0.5" fill="none" />
            </svg>
          </div>
          <svg viewBox="0 0 40 40" className="h-7 w-7 text-[#C9A84C]/50" fill="none" stroke="currentColor" strokeWidth="0.6">
            <path d="M20 8 Q24 15 20 22 Q16 15 20 8Z" />
            <path d="M20 10 Q28 14 24 24 Q20 18 20 10Z" />
            <path d="M20 10 Q12 14 16 24 Q20 18 20 10Z" />
            <path d="M20 12 Q30 16 26 26 Q22 20 20 12Z" opacity="0.5" />
            <path d="M20 12 Q10 16 14 26 Q18 20 20 12Z" opacity="0.5" />
            <ellipse cx="20" cy="28" rx="6" ry="2" opacity="0.4" />
            <path d="M14 30 Q17 27 20 30 Q23 27 26 30" opacity="0.5" />
          </svg>
          <div className="flex flex-1 items-center gap-1.5">
            <svg viewBox="0 0 20 8" className="h-2 w-5 text-[#C9A84C]/40" fill="currentColor">
              <path d="M4 4 Q6 0 10 0 Q14 0 16 4 Q14 8 10 8 Q6 8 4 4Z" opacity="0.6" />
              <path d="M0 4h4M16 4h4" stroke="currentColor" strokeWidth="0.5" fill="none" />
            </svg>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#C9A84C]/30 to-[#C9A84C]/40" />
          </div>
        </div>

        {/* Sacred tagline */}
        <p className="mt-4 text-center text-[10px] font-semibold uppercase tracking-[0.45em] text-[#B9934E]/70 sm:text-[11px] sm:tracking-[0.5em]">
          Sacred Protection &nbsp;&middot;&nbsp; Guided with Purpose
        </p>

        {/* Sanskrit text — upper right (desktop only) */}
        <p className="absolute right-6 top-6 hidden font-heading text-[22px] font-normal leading-none text-[#C9A84C]/20 xl:block 2xl:right-12 2xl:text-[26px]">
          ॥ सर्वे भवन्तु सुखिनः ॥
        </p>
      </div>

      {/* ── Main Footer Body ── */}
      <div className="relative overflow-hidden bg-[#FBF8F0]">
        {/* Botanical decorations */}
        <LotusDecoration className="absolute -bottom-2 -left-4 h-[120px] w-[120px] sm:h-[160px] sm:w-[160px] rotate-12" />
        <LotusDecoration className="absolute -bottom-2 -right-4 h-[120px] w-[120px] sm:h-[160px] sm:w-[160px] -rotate-12 scale-x-[-1]" />

        <div className="relative mx-auto max-w-[1600px] px-5 py-10 sm:px-8 lg:px-10 lg:py-14 xl:px-14">

          {/* ── Desktop Layout ── */}
          <div className="hidden lg:grid lg:gap-6 xl:gap-8" style={{ gridTemplateColumns: '26% 14% 12% 13% 14% 1fr' }}>

            {/* Brand Column */}
            <div className="pr-6 xl:pr-8">
              <Link href="/" className="inline-block">
                <Image
                  src="/logo.png"
                  alt="TANTRRA"
                  width={180}
                  height={225}
                  className="h-[160px] w-auto xl:h-[180px]"
                  unoptimized
                />
              </Link>
              <p className="mt-5 max-w-[280px] text-[13.5px] leading-[1.7] text-[#6D6B62]">
                Sacred protection and spiritual guidance,
                prepared with devotion and purpose.
                Every offering is rooted in authentic tradition.
              </p>

              {/* Social Icons */}
              <div className="mt-6 flex gap-3">
                <SocialIcon
                  label="Instagram"
                  href={siteConfig.socialLinks.instagram || undefined}
                  icon={<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>}
                />
                <SocialIcon
                  label="YouTube"
                  href={siteConfig.socialLinks.youtube || undefined}
                  icon={<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>}
                />
                <SocialIcon
                  label="Facebook"
                  href={siteConfig.socialLinks.facebook || undefined}
                  icon={<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>}
                />
                <SocialIcon
                  label="WhatsApp"
                  href={whatsappLink || undefined}
                  icon={<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>}
                />
              </div>

              {/* Tradition tagline */}
              <p className="mt-7 font-heading text-[16px] italic text-[#C9A84C]/60">
                Tradition &nbsp;&bull;&nbsp; Devotion &nbsp;&bull;&nbsp; Transformation
              </p>
            </div>

            {/* Navigation Columns */}
            {footerSections.map((section) => (
              <div key={section.title} className="border-l border-[#D8D3C5]/40 pl-6 xl:pl-8">
                <h3 className="font-heading text-[12px] font-semibold uppercase tracking-[0.22em] text-[#3E492C]">
                  {section.title}
                </h3>
                <HeadingOrnament />
                <ul className="mt-5 space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[13.5px] text-[#6D6B62] transition-colors duration-200 hover:text-[#B9934E]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Support Card */}
            <div className="pl-6 xl:pl-8">
              <div className="rounded-2xl border border-[#C5CEAE]/60 bg-[#F2F6E8] p-6 xl:p-7">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E4ECDA] text-[#6B7F52]">
                  <Headphones className="h-6 w-6" />
                </div>
                <h4 className="font-heading text-[17px] font-semibold text-[#3E492C]">
                  Need Support?
                </h4>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#6D6B62]">
                  We&apos;re here to help on<br />WhatsApp or Email.
                </p>

                {/* WhatsApp CTA */}
                {whatsappLink ? (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6B7F52] px-5 py-3 text-[13.5px] font-semibold text-white transition-all duration-200 hover:bg-[#5A6E44] hover:shadow-md"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    Chat on WhatsApp
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <div className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6B7F52]/40 px-5 py-3 text-[13.5px] font-semibold text-white">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    Chat on WhatsApp
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                )}

                {/* Contact details — only shown if data exists */}
                {siteConfig.email && (
                  <div className="mt-4 flex items-center gap-2.5 text-[12.5px] text-[#6D6B62]">
                    <Mail className="h-3.5 w-3.5 text-[#91A86D]" />
                    <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-[#B9934E]">
                      {siteConfig.email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Mobile / Tablet Layout ── */}
          <div className="lg:hidden">
            {/* Centered logo */}
            <div className="flex flex-col items-center text-center">
              <Link href="/" className="inline-block">
                <Image
                  src="/logo.png"
                  alt="TANTRRA"
                  width={160}
                  height={200}
                  className="h-[130px] w-auto sm:h-[150px]"
                  unoptimized
                />
              </Link>
              <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-[#6D6B62]">
                Sacred protection and spiritual guidance,
                prepared with devotion and purpose.
                Every offering is rooted in authentic tradition.
              </p>

              {/* Social Icons */}
              <div className="mt-5 flex gap-3">
                <SocialIcon
                  label="Instagram"
                  href={siteConfig.socialLinks.instagram || undefined}
                  icon={<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>}
                />
                <SocialIcon
                  label="YouTube"
                  href={siteConfig.socialLinks.youtube || undefined}
                  icon={<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>}
                />
                <SocialIcon
                  label="Facebook"
                  href={siteConfig.socialLinks.facebook || undefined}
                  icon={<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>}
                />
                <SocialIcon
                  label="WhatsApp"
                  href={whatsappLink || undefined}
                  icon={<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>}
                />
              </div>

              <p className="mt-5 font-heading text-[15px] italic text-[#C9A84C]/60">
                Tradition &nbsp;&bull;&nbsp; Devotion &nbsp;&bull;&nbsp; Transformation
              </p>
            </div>

            {/* Divider */}
            <div className="mx-auto my-6 h-px w-full max-w-sm bg-gradient-to-r from-transparent via-[#D8D3C5]/60 to-transparent" />

            {/* Accordion nav sections */}
            <div className="mx-auto max-w-md">
              {footerSections.map((section) => (
                <FooterAccordion key={section.title} title={section.title} links={section.links} />
              ))}
            </div>

            {/* Divider */}
            <div className="mx-auto my-6 h-px w-full max-w-sm bg-gradient-to-r from-transparent via-[#D8D3C5]/60 to-transparent" />

            {/* Support Card — mobile */}
            <div className="mx-auto max-w-sm">
              <div className="rounded-2xl border border-[#C5CEAE]/60 bg-[#F2F6E8] p-5 text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#E4ECDA] text-[#6B7F52]">
                  <Headphones className="h-5 w-5" />
                </div>
                <h4 className="font-heading text-[16px] font-semibold text-[#3E492C]">
                  Need Support?
                </h4>
                <p className="mt-1 text-[13px] text-[#6D6B62]">
                  We&apos;re here to help on WhatsApp or Email.
                </p>
                {whatsappLink ? (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6B7F52] px-5 py-3 text-[13px] font-semibold text-white transition-all duration-200 hover:bg-[#5A6E44]"
                  >
                    Chat on WhatsApp
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#6B7F52]/40 px-5 py-3 text-[13px] font-semibold text-white">
                    Chat on WhatsApp
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                )}
                {siteConfig.email && (
                  <p className="mt-3 flex items-center justify-center gap-2 text-[12px] text-[#6D6B62]">
                    <Mail className="h-3.5 w-3.5 text-[#91A86D]" />
                    {siteConfig.email}
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="relative overflow-hidden bg-[#EBF0DE]">
        {/* Centered lotus icon above the bar */}
        <div className="absolute left-1/2 -top-5 -translate-x-1/2">
          <svg viewBox="0 0 40 40" className="h-10 w-10 text-[#91A86D]/15" fill="currentColor">
            <path d="M20 5 Q24 14 20 24 Q16 14 20 5Z" />
            <path d="M20 7 Q28 12 24 24 Q20 16 20 7Z" />
            <path d="M20 7 Q12 12 16 24 Q20 16 20 7Z" />
            <path d="M20 9 Q30 14 26 26 Q22 18 20 9Z" opacity="0.6" />
            <path d="M20 9 Q10 14 14 26 Q18 18 20 9Z" opacity="0.6" />
            <ellipse cx="20" cy="28" rx="7" ry="2.5" opacity="0.4" />
          </svg>
        </div>

        <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-4 px-5 py-5 sm:px-8 lg:flex-row lg:justify-between lg:px-10 xl:px-14">
          {/* Left: Copyright */}
          <p className="text-[12px] text-[#6D6B62]/70">
            &copy; {new Date().getFullYear()} TANTRRA. All rights reserved.
          </p>

          {/* Center: Tagline with gold lines */}
          <div className="flex items-center gap-3">
            <div className="hidden h-px w-12 bg-gradient-to-r from-transparent to-[#C9A84C]/30 sm:block" />
            <p className="font-heading text-[12px] italic tracking-wide text-[#B9934E]/60 sm:text-[13px]">
              Sacred protection &middot; Guided with purpose
            </p>
            <div className="hidden h-px w-12 bg-gradient-to-l from-transparent to-[#C9A84C]/30 sm:block" />
          </div>

          {/* Right: Payment badges + security */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="rounded border border-[#C5CEAE]/60 bg-white/80 px-2 py-1 text-[10px] font-bold tracking-wide text-[#1A1F71]">VISA</span>
              <span className="rounded border border-[#C5CEAE]/60 bg-white/80 px-1.5 py-1">
                <svg viewBox="0 0 32 20" className="h-3.5 w-6">
                  <circle cx="11" cy="10" r="7" fill="#EB001B" opacity="0.85" />
                  <circle cx="21" cy="10" r="7" fill="#F79E1B" opacity="0.85" />
                  <path d="M16 4.6a7 7 0 010 10.8 7 7 0 000-10.8z" fill="#FF5F00" opacity="0.85" />
                </svg>
              </span>
              <span className="rounded border border-[#C5CEAE]/60 bg-white/80 px-2 py-1 text-[9px] font-bold tracking-wide text-[#097A44]">RuPay</span>
              <span className="rounded border border-[#C5CEAE]/60 bg-white/80 px-2 py-1 text-[9px] font-bold tracking-wider text-[#3D3D3D]">UPI</span>
            </div>
            <div className="flex items-center gap-1.5 pl-2">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#6B7F52]" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="text-[10px] leading-tight text-[#6D6B62]/70">
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
