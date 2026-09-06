'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Search, ShoppingBag, User, Menu, X, ChevronDown,
  Heart, ArrowRight, CalendarCheck, Phone,
  Shield, Package, Gem, BookOpen, Flame, HandHeart,
  Star, Eye, Sparkles, Hash, Compass,
  Leaf, Truck, ShieldCheck,
} from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { siteConfig } from '@/data/site-config';

/* ================================================================
   NAVIGATION DATA
   ================================================================ */

interface DropdownItem {
  label: string;
  href: string;
  description?: string;
  icon?: React.ElementType;
}

const shopCategories: DropdownItem[] = [
  { label: 'Kavach', href: '/products?category=kavach', description: 'Sacred protection products', icon: Shield },
  { label: 'Potli', href: '/products?category=potli', description: 'Prosperity & intention offerings', icon: Package },
  { label: 'Bracelets', href: '/products?category=bracelet', description: 'Sacred energy bracelets', icon: Gem },
  { label: 'Sadhana Materials', href: '/products?category=mala', description: 'Mala, tools & essentials', icon: BookOpen },
  { label: 'All Products', href: '/products', description: 'Browse our full collection', icon: Compass },
];

const pujaLinks: DropdownItem[] = [
  { label: 'Sacred Puja', href: '/puja', description: 'Traditional rituals & Havan', icon: Flame },
  { label: 'Seva & Chadava', href: '/puja#seva', description: 'Contribute to sacred causes', icon: Heart },
  { label: 'Sacred Offerings', href: '/puja', description: 'Deepdaan & special offerings', icon: HandHeart },
];

const consultLinks: DropdownItem[] = [
  { label: 'Tarot', href: '/consultations/tarot', description: 'Card-based spiritual guidance', icon: Star },
  { label: 'Akashik Reading', href: '/consultations/akashik-reading', description: 'Soul record insights', icon: Eye },
  { label: 'Chakra Healing', href: '/consultations/seven-chakra-healing', description: 'Energy centre alignment', icon: Sparkles },
  { label: 'Astrology', href: '/consultations/astrology', description: 'Vedic birth chart analysis', icon: Hash },
  { label: 'All Services', href: '/consultations', description: 'View all consultation types', icon: Compass },
];

const navItems = [
  { label: 'Shop', href: '/products', dropdown: shopCategories },
  { label: 'Puja & Seva', href: '/puja', dropdown: pujaLinks },
  { label: 'Consultations', href: '/consultations', dropdown: consultLinks },
  { label: 'Sadhana', href: '/sadhana' },
  { label: 'Journal', href: '/journal' },
  { label: 'About', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

const mobileNavSections = [
  { title: 'Shop', links: shopCategories },
  { title: 'Puja & Seva', links: pujaLinks },
  { title: 'Consultations', links: consultLinks },
  {
    title: 'More',
    links: [
      { label: 'Sadhana', href: '/sadhana' },
      { label: 'Journal', href: '/journal' },
      { label: 'About TANTRRA', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
];

const trustItems = [
  { Icon: Leaf, title: '100% Authentic Products', subtitle: 'Sourced with Care' },
  { Icon: Truck, title: 'Secure & Fast Delivery', subtitle: 'Across India' },
  { Icon: ShieldCheck, title: 'Trusted Spiritual Community', subtitle: 'Growing with Devotion' },
  { Icon: HandHeart, title: 'Personalized Guidance', subtitle: 'By Experienced Practitioners' },
];

/* ================================================================
   SVG DECORATIVE COMPONENTS
   ================================================================ */

function GoldDiamond({ className }: { className?: string }) {
  return (
    <svg width="6" height="6" viewBox="0 0 6 6" className={className} aria-hidden="true">
      <path d="M3 0L5.6 3L3 6L0.4 3Z" fill="currentColor" />
    </svg>
  );
}

function HangingOrnament({ className }: { className?: string }) {
  return (
    <svg width="14" height="26" viewBox="0 0 14 26" className={className} fill="none" aria-hidden="true">
      <line x1="7" y1="0" x2="7" y2="8" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
      <path d="M7 8Q11 10.5 11 15Q11 19 7 21Q3 19 3 15Q3 10.5 7 8Z" fill="currentColor" opacity="0.6" />
      <circle cx="7" cy="23" r="1.3" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

function BotanicalCorner({ side }: { side: 'left' | 'right' }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute top-0 bottom-0 w-[100px] overflow-hidden opacity-[0.13]',
        side === 'left' ? 'left-0' : 'right-0',
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 160"
        className="h-full w-auto"
        fill="none"
        style={{ transform: side === 'right' ? 'scaleX(-1)' : undefined }}
      >
        <path d="M-5 12C18 18 38 38 34 75C30 108 8 130 -12 142" stroke="#3A5B2C" strokeWidth="1.5" fill="#3A5B2C" fillOpacity="0.55" />
        <path d="M12 2C32 12 52 42 47 82C42 118 18 140 -8 150" stroke="#4A6B3C" strokeWidth="1" fill="#4A6B3C" fillOpacity="0.4" />
        <path d="M-12 38C6 42 28 60 24 98C20 130 0 148 -22 156" stroke="#5E8050" strokeWidth="1" fill="#5E8050" fillOpacity="0.3" />
      </svg>
    </div>
  );
}

function HangingBell({ className }: { className?: string }) {
  return (
    <svg width="16" height="34" viewBox="0 0 16 34" className={className} fill="none" aria-hidden="true">
      <line x1="8" y1="0" x2="8" y2="7" stroke="currentColor" strokeWidth="0.6" opacity="0.5" />
      <circle cx="8" cy="7.5" r="1" fill="currentColor" opacity="0.4" />
      <path d="M8 8.5Q13 12 13 17L13 22Q13 24 11 25L5 25Q3 24 3 22L3 17Q3 12 8 8.5Z" fill="currentColor" opacity="0.5" />
      <ellipse cx="8" cy="25.5" rx="5" ry="0.8" fill="currentColor" opacity="0.4" />
      <line x1="8" y1="26.5" x2="8" y2="30" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
      <circle cx="8" cy="31.5" r="1.6" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

function TaglineOrnament() {
  return (
    <svg width="56" height="10" viewBox="0 0 56 10" className="text-gold/50" aria-hidden="true">
      <path d="M0 5Q8 2 16 5" stroke="currentColor" strokeWidth="0.7" fill="none" />
      <circle cx="21" cy="5" r="1.3" fill="currentColor" opacity="0.55" />
      <path d="M28 2.5L30 5L28 7.5L26 5Z" fill="currentColor" opacity="0.65" />
      <circle cx="35" cy="5" r="1.3" fill="currentColor" opacity="0.55" />
      <path d="M40 5Q48 8 56 5" stroke="currentColor" strokeWidth="0.7" fill="none" />
    </svg>
  );
}

/* ================================================================
   MAIN HEADER COMPONENT
   ================================================================ */

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const rawItemCount = useCartStore((s) => s.getItemCount());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const itemCount = mounted ? rawItemCount : 0;
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeDropdown) setActiveDropdown(null);
        else if (searchOpen) setSearchOpen(false);
        else if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [activeDropdown, searchOpen, mobileMenuOpen]);

  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(label);
  };
  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const hasPhone = siteConfig.phone?.trim() !== '';

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">

        {/* ==========================================
            LAYER 1 — SACRED TOP BAR
            ========================================== */}
        <div className={cn(
          'overflow-hidden transition-all duration-500 ease-in-out',
          scrolled ? 'max-h-0 opacity-0' : 'max-h-[52px] opacity-100',
        )}>
          <div className="relative bg-[#1B3D2F]">

            {/* Desktop */}
            <div className="hidden min-[1200px]:flex items-center justify-between mx-auto max-w-[1800px] px-[clamp(24px,4vw,72px)] h-[40px]">
              <div className="flex items-center gap-2.5 text-[11.5px] tracking-[0.06em] text-[#F5F1E8]/80 font-[family-name:var(--font-inter)]">
                <span>Authentic Rituals</span>
                <GoldDiamond className="text-[#B88A3B]/50" />
                <span>Spiritual Guidance</span>
                <GoldDiamond className="text-[#B88A3B]/50" />
                <span>Positive Transformation</span>
              </div>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3">
                <HangingOrnament className="text-[#B88A3B]/70" />
                <span
                  className="text-[14.5px] text-[#D4B06A] tracking-wide leading-none"
                  style={{ fontFamily: 'var(--font-devanagari), serif' }}
                >
                  ॥ सर्वे भवन्तु सुखिनः ॥
                </span>
                <HangingOrnament className="text-[#B88A3B]/70" />
              </div>

              <div className="flex items-center gap-3 text-[11.5px] tracking-[0.04em] text-[#F5F1E8]/80">
                <span>Free shipping on orders above ₹999</span>
                <span className="text-[#B88A3B]/40">|</span>
                {hasPhone ? (
                  <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-1.5 hover:text-[#D4B06A] transition-colors">
                    <Phone className="h-3 w-3" />
                    Need Help? {siteConfig.phone}
                  </a>
                ) : (
                  <Link href="/contact" className="flex items-center gap-1.5 hover:text-[#D4B06A] transition-colors">
                    <Phone className="h-3 w-3" />
                    <span>Need Help? Contact Us</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Tablet */}
            <div className="hidden min-[768px]:flex min-[1200px]:hidden items-center justify-center h-[36px] gap-2 text-[11px] tracking-[0.06em] text-[#F5F1E8]/80">
              <span>Sacred Protection</span>
              <GoldDiamond className="text-[#B88A3B]/50" />
              <span>Guided by Tradition</span>
              <GoldDiamond className="text-[#B88A3B]/50" />
              <span>Free Shipping Above ₹999</span>
            </div>

            {/* Mobile */}
            <div className="flex min-[768px]:hidden items-center justify-center h-[32px] px-4 text-[10.5px] tracking-[0.08em] text-[#F5F1E8]/75">
              <span>Sacred Protection</span>
              <GoldDiamond className="mx-2 text-[#B88A3B]/50" />
              <span>Free Shipping Above ₹999</span>
            </div>
          </div>
        </div>

        {/* Gold accent line */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#B88A3B]/35 to-transparent" />

        {/* ==========================================
            LAYER 2 — MAIN NAVIGATION
            ========================================== */}
        <div className={cn(
          'relative transition-all duration-300',
          scrolled
            ? 'bg-cream/[0.97] backdrop-blur-xl shadow-[0_2px_16px_rgba(33,29,24,0.07)]'
            : 'bg-cream shadow-[0_1px_4px_rgba(33,29,24,0.03)]',
        )}>
          {/* Botanical decorations — desktop */}
          <div className="hidden min-[1200px]:block">
            <BotanicalCorner side="left" />
            <BotanicalCorner side="right" />
            <div className="pointer-events-none absolute right-[clamp(6px,1.5vw,36px)] top-1">
              <HangingBell className="text-[#B88A3B]/35" />
            </div>
          </div>

          <div className="mx-auto max-w-[1800px] px-[clamp(16px,4vw,72px)]">

            {/* ===== DESKTOP (≥ 1200px) ===== */}
            <div className={cn(
              'hidden min-[1200px]:flex items-center transition-all duration-300',
              scrolled
                ? 'h-[78px] gap-[clamp(10px,1.2vw,22px)]'
                : 'h-[110px] gap-[clamp(12px,1.5vw,28px)]',
            )}>
              {/* Logo */}
              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="TANTRRA"
                  width={130}
                  height={162}
                  className={cn(
                    'object-contain transition-all duration-300',
                    scrolled ? 'h-[68px] w-auto' : 'h-[90px] w-auto',
                  )}
                  priority
                  unoptimized
                />
              </Link>

              {/* Divider + tagline — very wide viewports only */}
              <div className={cn('hidden min-[1700px]:flex items-center gap-3 flex-shrink-0', scrolled && 'min-[1700px]:hidden')}>
                <div className="h-[48px] w-px bg-gradient-to-b from-transparent via-border to-transparent" />
                <div className="max-w-[148px]">
                  <p className="text-[12.5px] leading-[1.4] text-foreground-muted font-heading italic">
                    Rooted in Tradition<br />Guided for a Better You
                  </p>
                  <div className="mt-1">
                    <TaglineOrnament />
                  </div>
                </div>
              </div>

              {/* Nav links */}
              <nav className="flex-1 flex items-center justify-center" aria-label="Main navigation">
                <div className="flex items-center">
                  {navItems.map((item) => (
                    <div
                      key={item.label}
                      className="relative"
                      onMouseEnter={() => item.dropdown && handleDropdownEnter(item.label)}
                      onMouseLeave={() => item.dropdown && handleDropdownLeave()}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          'relative flex items-center gap-1 whitespace-nowrap transition-colors',
                          'px-[clamp(6px,0.5vw,16px)] py-2.5',
                          'text-[clamp(13px,0.88vw,15.5px)] font-medium tracking-[0.01em]',
                          isActive(item.href) ? 'text-foreground' : 'text-foreground-muted hover:text-gold-dark',
                          activeDropdown === item.label && 'text-foreground',
                        )}
                      >
                        {item.label}
                        {item.dropdown && (
                          <ChevronDown className={cn(
                            'h-3 w-3 opacity-40 transition-transform duration-200',
                            activeDropdown === item.label && 'rotate-180 opacity-70',
                          )} />
                        )}
                        {isActive(item.href) && (
                          <motion.span
                            layoutId="header-active"
                            className="absolute bottom-0.5 left-3 right-3 h-[1.5px] rounded-full bg-gold"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                      </Link>

                      {/* Dropdown panel */}
                      <AnimatePresence>
                        {item.dropdown && activeDropdown === item.label && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.97 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="absolute left-1/2 top-full -translate-x-1/2 pt-2 z-50"
                          >
                            <div className="min-w-[280px] overflow-hidden rounded-xl border border-border/50 bg-cream shadow-xl shadow-foreground/8">
                              <div className="h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
                              <div className="py-2">
                                {item.dropdown.map((link) => {
                                  const Icon = link.icon;
                                  return (
                                    <Link
                                      key={link.href}
                                      href={link.href}
                                      className="group/dd flex items-start gap-3 px-4 py-2.5 transition-colors hover:bg-gold/5"
                                    >
                                      {Icon && (
                                        <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gold/8 text-gold-dark transition-all group-hover/dd:bg-gold group-hover/dd:text-white">
                                          <Icon className="h-3.5 w-3.5" />
                                        </span>
                                      )}
                                      <div>
                                        <p className="text-[13px] font-medium text-foreground">{link.label}</p>
                                        {link.description && (
                                          <p className="mt-0.5 text-[11px] leading-snug text-foreground-subtle">{link.description}</p>
                                        )}
                                      </div>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </nav>

              {/* Search pill */}
              <div className="relative flex-shrink-0">
                <div className="flex items-center gap-2.5 rounded-full border border-border/60 bg-[#F5F1E8]/50 px-4 h-[42px] w-[clamp(140px,14vw,320px)] transition-colors focus-within:border-gold/40 focus-within:bg-white/60">
                  <Search className="h-4 w-4 text-foreground-subtle flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search products, rituals, etc..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-[13.5px] text-foreground placeholder:text-foreground-subtle/60 focus:outline-none"
                    aria-label="Search"
                  />
                </div>
              </div>

              {/* Action icons */}
              <div className="flex items-center gap-0 flex-shrink-0">
                <Link
                  href="/account"
                  className="flex h-9 w-9 min-[1440px]:h-10 min-[1440px]:w-10 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-cream-dark hover:text-foreground"
                  aria-label="My Account"
                >
                  <User className="h-[18px] w-[18px] min-[1440px]:h-5 min-[1440px]:w-5" strokeWidth={1.5} />
                </Link>
                <Link
                  href="/account"
                  className="flex h-9 w-9 min-[1440px]:h-10 min-[1440px]:w-10 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-cream-dark hover:text-foreground"
                  aria-label="Wishlist"
                >
                  <Heart className="h-[18px] w-[18px] min-[1440px]:h-5 min-[1440px]:w-5" strokeWidth={1.5} />
                </Link>
                <Link
                  href="/cart"
                  className="relative flex h-9 w-9 min-[1440px]:h-10 min-[1440px]:w-10 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-cream-dark hover:text-foreground"
                  aria-label="Shopping cart"
                >
                  <ShoppingBag className="h-[18px] w-[18px] min-[1440px]:h-5 min-[1440px]:w-5" strokeWidth={1.5} />
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 flex h-[19px] w-[19px] items-center justify-center rounded-full bg-gold text-[9px] font-bold text-white ring-2 ring-cream"
                    >
                      {itemCount > 9 ? '9+' : itemCount}
                    </motion.span>
                  )}
                </Link>
              </div>

              {/* Book Consultation CTA */}
              <Link
                href="/consultations"
                className="flex items-center gap-1.5 min-[1440px]:gap-2 flex-shrink-0 rounded-[12px] min-[1440px]:rounded-[14px] bg-gradient-to-r from-[#B07D2F] to-[#C4923E] px-3 min-[1440px]:px-5 h-[46px] min-[1440px]:h-[52px] text-[13px] min-[1440px]:text-[14px] font-semibold text-white/95 shadow-[0_2px_10px_rgba(184,138,59,0.25)] transition-all duration-200 hover:shadow-[0_4px_18px_rgba(184,138,59,0.35)] hover:brightness-[1.04]"
              >
                <CalendarCheck className="h-[16px] w-[16px] min-[1440px]:h-[18px] min-[1440px]:w-[18px] flex-shrink-0" strokeWidth={1.8} />
                <span className="whitespace-nowrap hidden min-[1440px]:inline">Book Consultation</span>
                <span className="whitespace-nowrap min-[1440px]:hidden">Consult</span>
                <ArrowRight className="h-3.5 w-3.5 min-[1440px]:h-4 min-[1440px]:w-4 flex-shrink-0" strokeWidth={2} />
              </Link>
            </div>

            {/* ===== TABLET (768–1199px) ===== */}
            <div className="hidden min-[768px]:flex min-[1200px]:hidden items-center justify-between h-[68px]">
              <button
                className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-cream-dark"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                <Image
                  src="/logo.png"
                  alt="TANTRRA"
                  width={88}
                  height={110}
                  className="h-[56px] w-auto object-contain"
                  priority
                  unoptimized
                />
              </Link>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-cream-dark"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
                <Link
                  href="/account"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-cream-dark"
                  aria-label="Account"
                >
                  <User className="h-5 w-5" />
                </Link>
                <Link
                  href="/cart"
                  className="relative flex h-10 w-10 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-cream-dark"
                  aria-label="Cart"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-gold text-[9px] font-bold text-white ring-2 ring-cream">
                      {itemCount > 9 ? '9+' : itemCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>

            {/* ===== MOBILE (< 768px) ===== */}
            <div className="flex min-[768px]:hidden items-center justify-between h-[60px]">
              <button
                className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-cream-dark"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>

              <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                <Image
                  src="/logo.png"
                  alt="TANTRRA"
                  width={80}
                  height={100}
                  className="h-[48px] w-auto object-contain"
                  priority
                  unoptimized
                />
              </Link>

              <div className="flex items-center gap-0.5">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-cream-dark"
                  aria-label="Search"
                >
                  <Search className="h-[18px] w-[18px]" />
                </button>
                <Link
                  href="/cart"
                  className="relative flex h-9 w-9 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:bg-cream-dark"
                  aria-label="Cart"
                >
                  <ShoppingBag className="h-[18px] w-[18px]" />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-gold text-[8px] font-bold text-white ring-2 ring-cream">
                      {itemCount > 9 ? '9+' : itemCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom border */}
          <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        </div>

        {/* ==========================================
            LAYER 3 — TRUST / BENEFIT STRIP
            ========================================== */}
        <div className={cn(
          'hidden min-[1200px]:block overflow-hidden transition-all duration-500 ease-in-out',
          scrolled ? 'max-h-0 opacity-0' : 'max-h-[110px] opacity-100',
        )}>
          <div className="bg-cream/95 backdrop-blur-sm border-b border-border/30">
            <div className="mx-auto max-w-[1800px] px-[clamp(24px,4vw,72px)]">
              <div className="flex items-center justify-center py-[16px]">
                {trustItems.map((item, i) => (
                  <div key={item.title} className="flex items-center">
                    {i > 0 && (
                      <div className="mx-[clamp(10px,1.8vw,32px)]">
                        <GoldDiamond className="text-gold/30" />
                      </div>
                    )}
                    <div className="flex items-center gap-2.5 min-[1400px]:gap-3">
                      <div className="flex h-[42px] w-[42px] min-[1400px]:h-[46px] min-[1400px]:w-[46px] items-center justify-center rounded-full bg-parchment/70 text-green">
                        <item.Icon className="h-[20px] w-[20px] min-[1400px]:h-[22px] min-[1400px]:w-[22px]" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-[clamp(12px,0.85vw,14px)] font-semibold text-foreground leading-tight">{item.title}</p>
                        <p className="text-[clamp(10.5px,0.72vw,12px)] text-foreground-subtle mt-0.5">{item.subtitle}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ==========================================
            SEARCH OVERLAY — tablet & mobile
            ========================================== */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="min-[1200px]:hidden border-t border-border/40 bg-cream"
            >
              <div className="mx-auto max-w-[1800px] px-4 sm:px-6">
                <div className="flex items-center gap-3 py-4">
                  <Search className="h-5 w-5 flex-shrink-0 text-foreground-subtle" />
                  <input
                    type="text"
                    placeholder="Search products, rituals, etc..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-[15px] text-foreground placeholder:text-foreground-subtle focus:outline-none"
                    autoFocus
                    aria-label="Search"
                  />
                  <button
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="flex-shrink-0 rounded-lg p-2 text-foreground-subtle transition-colors hover:bg-cream-dark"
                    aria-label="Close search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ==========================================
          MOBILE / TABLET NAVIGATION DRAWER
          ========================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-foreground/30 backdrop-blur-sm min-[1200px]:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 240 }}
              className="absolute left-0 top-0 h-full w-[85vw] max-w-[380px] bg-cream shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              aria-label="Navigation menu"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <Image
                    src="/logo.png"
                    alt="TANTRRA"
                    width={88}
                    height={110}
                    className="h-[68px] w-auto object-contain"
                    unoptimized
                  />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground-subtle transition-colors hover:bg-cream-dark"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-4 py-3">
                {/* Book Consultation CTA */}
                <Link
                  href="/consultations"
                  className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B07D2F] to-[#C4923E] px-5 py-3.5 text-[14px] font-semibold text-white shadow-md transition-all hover:brightness-[1.04]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <CalendarCheck className="h-[18px] w-[18px]" />
                  Book Consultation
                  <ArrowRight className="h-4 w-4" />
                </Link>

                {/* Home */}
                <Link
                  href="/"
                  className={cn(
                    'flex items-center rounded-xl px-3 text-[15px] font-medium transition-colors',
                    pathname === '/' ? 'bg-gold/8 text-foreground' : 'text-foreground-muted hover:bg-cream-dark hover:text-foreground',
                  )}
                  style={{ minHeight: 54 }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>

                {/* Expandable sections */}
                {mobileNavSections.map((section) => (
                  <div key={section.title} className="border-b border-border/25 last:border-none">
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === section.title ? null : section.title)}
                      className="flex w-full items-center justify-between px-3"
                      style={{ minHeight: 54 }}
                    >
                      <span className="text-[15px] font-medium text-foreground">{section.title}</span>
                      <ChevronDown className={cn(
                        'h-4 w-4 text-foreground-subtle transition-transform duration-200',
                        mobileExpanded === section.title && 'rotate-180',
                      )} />
                    </button>
                    <AnimatePresence>
                      {mobileExpanded === section.title && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="pb-2 pl-3 space-y-0.5">
                            {section.links.map((link) => {
                              const Icon = 'icon' in link ? (link as DropdownItem).icon : undefined;
                              return (
                                <Link
                                  key={link.href}
                                  href={link.href}
                                  className={cn(
                                    'flex items-center gap-3 rounded-xl px-3 text-[14px] transition-colors',
                                    isActive(link.href) ? 'bg-gold/8 font-medium text-foreground' : 'text-foreground-muted hover:bg-cream-dark hover:text-foreground',
                                  )}
                                  style={{ minHeight: 48 }}
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {Icon && (
                                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold/8 text-gold-dark">
                                      <Icon className="h-3.5 w-3.5" />
                                    </span>
                                  )}
                                  <span>{link.label}</span>
                                </Link>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {/* Account links */}
                <div className="mt-3 border-t border-border/25 pt-3">
                  <Link
                    href="/account"
                    className="flex items-center gap-3 rounded-xl px-3 text-[15px] text-foreground-muted transition-colors hover:bg-cream-dark hover:text-foreground"
                    style={{ minHeight: 52 }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-[18px] w-[18px]" />
                    My Account
                  </Link>
                  <Link
                    href="/account"
                    className="flex items-center gap-3 rounded-xl px-3 text-[15px] text-foreground-muted transition-colors hover:bg-cream-dark hover:text-foreground"
                    style={{ minHeight: 52 }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Heart className="h-[18px] w-[18px]" />
                    Wishlist
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center gap-3 rounded-xl px-3 text-[15px] text-foreground-muted transition-colors hover:bg-cream-dark hover:text-foreground"
                    style={{ minHeight: 52 }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Phone className="h-[18px] w-[18px]" />
                    Contact Us
                  </Link>
                </div>

                {/* Sacred footer */}
                <div className="mt-6 mb-4 text-center">
                  <div className="h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent mb-4" />
                  <p
                    className="text-[14px] text-gold/60 leading-relaxed"
                    style={{ fontFamily: 'var(--font-devanagari), serif' }}
                  >
                    ॥ सर्वे भवन्तु सुखिनः ॥
                  </p>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div
        className={cn(
          'h-[93px]',
          'min-[768px]:h-[105px]',
          'min-[1200px]:h-[232px]',
        )}
      />
    </>
  );
}
