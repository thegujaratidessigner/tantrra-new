'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  X, Search, ArrowRight, ChevronDown, ChevronRight,
  BookOpen, Info, Phone as PhoneIcon, CalendarCheck,
  User, Heart, Package,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/* ================================================================
   TYPES
   ================================================================ */

interface NavCardData {
  title: string;
  subtitle: string;
  href: string;
  image: string;
  alt: string;
}

interface SubLink {
  label: string;
  href: string;
  icon?: React.ElementType;
  description?: string;
}

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  shopCategories: SubLink[];
  pujaLinks: SubLink[];
  consultLinks: SubLink[];
}

/* ================================================================
   NAV CARD DATA
   ================================================================ */

const primaryCards: NavCardData[] = [
  {
    title: 'Shop',
    subtitle: 'Sacred Products',
    href: '/products',
    image: '/products/hanuman-bajrangbali-kavach/63b76ab4-0dc8-42d6-b86d-34bede3de6da.jpg',
    alt: 'Sacred protection products',
  },
  {
    title: 'Puja & Seva',
    subtitle: 'Divine Rituals',
    href: '/puja',
    image: '/hero-banner.png',
    alt: 'Sacred puja and havan rituals',
  },
  {
    title: 'Consultations',
    subtitle: 'Personal Guidance',
    href: '/consultations',
    image: '/products/shiv-mahakal-kavach/5409d72f-90fd-4023-9d88-d52822968fdd.jpg',
    alt: 'Spiritual consultation and guidance',
  },
  {
    title: 'Sadhana',
    subtitle: 'Spiritual Practice',
    href: '/sadhana',
    image: '/products/maa-kali-kavach/feb7f903-f109-42ad-9bbb-8501b5842330.jpg',
    alt: 'Meditation and spiritual practice',
  },
];

const secondaryLinks = [
  { label: 'Journal', href: '/journal', icon: BookOpen },
  { label: 'About', href: '/about', icon: Info },
  { label: 'Contact Us', href: '/contact', icon: PhoneIcon },
];

const accountLinks = [
  { label: 'My Account', href: '/account', icon: User },
  { label: 'My Bookings', href: '/account', icon: CalendarCheck },
  { label: 'Track Order', href: '/account', icon: Package },
  { label: 'Wishlist', href: '/account', icon: Heart },
];

/* ================================================================
   DECORATIVE SVG COMPONENTS
   ================================================================ */

function LotusOrnament({ className }: { className?: string }) {
  return (
    <svg width="32" height="28" viewBox="0 0 32 28" className={className} fill="none" aria-hidden="true">
      <path d="M16 4C18 8 22 12 22 17C22 21 19 24 16 26C13 24 10 21 10 17C10 12 14 8 16 4Z" fill="currentColor" opacity="0.3" />
      <path d="M16 8C13 11 8 14 6 18C4 22 6 25 9 26C11 22 13 19 16 17C19 19 21 22 23 26C26 25 28 22 26 18C24 14 19 11 16 8Z" fill="currentColor" opacity="0.2" />
      <path d="M16 12C14 14 10 16 8 19C7 22 8 24 10 25" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <path d="M16 12C18 14 22 16 24 19C25 22 24 24 22 25" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}

function CrescentMoon({ className }: { className?: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" className={className} fill="none" aria-hidden="true">
      <path
        d="M16 4C12 5 9 9 9 13C9 17 12 20 16 21C11 22 6 18 6 12C6 6 11 2 16 4Z"
        fill="currentColor"
        opacity="0.5"
      />
      <circle cx="14" cy="6" r="0.8" fill="currentColor" opacity="0.3" />
      <circle cx="18" cy="9" r="0.5" fill="currentColor" opacity="0.2" />
    </svg>
  );
}

function BotanicalLeaves({ className, side }: { className?: string; side: 'left' | 'right' }) {
  return (
    <svg
      width="120"
      height="180"
      viewBox="0 0 120 180"
      className={className}
      fill="none"
      aria-hidden="true"
      style={{ transform: side === 'right' ? 'scaleX(-1)' : undefined }}
    >
      <path d="M0 10C20 20 45 50 40 90C35 125 15 150 -5 165" stroke="#7A9B68" strokeWidth="1.2" fill="#7A9B68" fillOpacity="0.15" />
      <path d="M-10 40C12 46 35 65 30 100C25 132 5 152 -15 162" stroke="#8AAB78" strokeWidth="0.8" fill="#8AAB78" fillOpacity="0.1" />
      <path d="M15 0C38 14 60 48 55 90C50 128 26 152 2 165" stroke="#6B8C58" strokeWidth="0.8" fill="#6B8C58" fillOpacity="0.08" />
      <circle cx="30" cy="25" r="3" fill="#B88A3B" fillOpacity="0.12" />
      <circle cx="18" cy="55" r="2" fill="#B88A3B" fillOpacity="0.08" />
    </svg>
  );
}

function ScenicBackground() {
  return (
    <div className="pointer-events-none relative h-[200px] w-full overflow-hidden opacity-40" aria-hidden="true">
      <svg viewBox="0 0 400 200" className="h-full w-full" preserveAspectRatio="xMidYMax slice">
        {/* Sky gradient */}
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FBF8EF" stopOpacity="0" />
            <stop offset="40%" stopColor="#E8EFDC" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#D4DFC8" stopOpacity="0.5" />
          </linearGradient>
          <radialGradient id="sun" cx="50%" cy="35%" r="30%">
            <stop offset="0%" stopColor="#F0E6B8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#F0E6B8" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="200" fill="url(#sky)" />
        <circle cx="200" cy="70" r="60" fill="url(#sun)" />

        {/* Distant mountains */}
        <path d="M0 130 Q50 90 100 120 Q150 85 200 110 Q250 80 300 115 Q350 90 400 125 L400 200 L0 200Z" fill="#8AAB78" fillOpacity="0.15" />
        <path d="M0 145 Q60 110 120 135 Q180 105 240 130 Q300 100 360 128 L400 140 L400 200 L0 200Z" fill="#7A9B68" fillOpacity="0.12" />

        {/* Temple silhouette */}
        <g opacity="0.18">
          <rect x="190" y="95" width="20" height="35" fill="#4A6B3C" />
          <polygon points="185,95 215,95 200,72" fill="#4A6B3C" />
          <polygon points="195,72 205,72 200,60" fill="#4A6B3C" />
          <circle cx="200" cy="58" r="3" fill="#B88A3B" fillOpacity="0.5" />
        </g>

        {/* Foreground foliage */}
        <path d="M0 160 Q30 148 60 158 Q90 145 120 155 Q150 142 180 152 Q210 140 240 150 Q270 138 300 148 Q330 135 360 145 Q390 150 400 155 L400 200 L0 200Z" fill="#6B8C58" fillOpacity="0.15" />

        {/* Central lotus */}
        <g transform="translate(200, 165)" opacity="0.35">
          <ellipse cx="0" cy="8" rx="15" ry="4" fill="#D4B06A" fillOpacity="0.3" />
          <path d="M0 0C3 -8 2 -14 0 -18C-2 -14 -3 -8 0 0Z" fill="#E8B4B8" fillOpacity="0.5" />
          <path d="M0 0C6 -6 8 -12 6 -16C2 -12 0 -6 0 0Z" fill="#E8B4B8" fillOpacity="0.4" />
          <path d="M0 0C-6 -6 -8 -12 -6 -16C-2 -12 0 -6 0 0Z" fill="#E8B4B8" fillOpacity="0.4" />
          <path d="M0 0C8 -3 12 -8 11 -13C5 -10 1 -5 0 0Z" fill="#E8B4B8" fillOpacity="0.3" />
          <path d="M0 0C-8 -3 -12 -8 -11 -13C-5 -10 -1 -5 0 0Z" fill="#E8B4B8" fillOpacity="0.3" />
        </g>
      </svg>
    </div>
  );
}

/* ================================================================
   SUB-COMPONENTS
   ================================================================ */

function DrawerIntro() {
  return (
    <div className="relative overflow-hidden px-5 pt-2 pb-5 min-[390px]:px-6 min-[390px]:pb-6">
      {/* Botanical decoration */}
      <div className="pointer-events-none absolute top-0 left-0 w-[100px] h-[160px] opacity-30">
        <BotanicalLeaves side="left" className="w-full h-full" />
      </div>
      <div className="pointer-events-none absolute top-0 right-0 w-[100px] h-[160px] opacity-30">
        <BotanicalLeaves side="right" className="w-full h-full" />
      </div>

      {/* Soft glow */}
      <div className="pointer-events-none absolute top-8 right-4 w-[120px] h-[80px] rounded-full bg-[#F0E6B8]/20 blur-3xl" />

      <div className="relative z-10">
        <p className="text-right text-[12px] italic text-[#7A9B68]/70 leading-snug tracking-wide font-[family-name:var(--font-cormorant)]">
          A calmer<br />brighter you<br />awaits
        </p>

        <h2 className="mt-2 text-[30px] min-[390px]:text-[34px] font-semibold text-[#1B3D2F] leading-[1.1] tracking-[-0.01em] font-[family-name:var(--font-cormorant)]">
          Namaste
        </h2>
        <p className="mt-2 text-[15px] min-[390px]:text-[16px] leading-[1.55] text-[#68645C]">
          Explore devotion, healing<br />and higher consciousness.
        </p>
      </div>
    </div>
  );
}

function DrawerSearch({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-5 min-[390px]:px-6 mb-5">
      <div className="relative flex items-center h-[50px] min-[390px]:h-[52px] rounded-full bg-[#F0EBDF] border border-[#E2DCD0]/60">
        <Search className="absolute left-4 h-[18px] w-[18px] text-[#918A80]" strokeWidth={1.8} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search rituals, products, consultations..."
          className="w-full h-full bg-transparent pl-11 pr-4 text-[14px] text-[#211D18] placeholder:text-[#918A80] focus:outline-none"
        />
      </div>
    </form>
  );
}

function PrimaryNavCard({ card, onClose }: { card: NavCardData; onClose: () => void }) {
  return (
    <Link
      href={card.href}
      onClick={onClose}
      className="group flex items-center gap-0 rounded-[16px] bg-gradient-to-r from-[#F5F1E8] to-[#EDE8DB] border border-[#E2DCD0]/40 overflow-hidden transition-all duration-250 hover:shadow-md active:scale-[0.98]"
      style={{ minHeight: 100 }}
    >
      <div className="relative h-full w-[34%] min-[390px]:w-[36%] flex-shrink-0 self-stretch overflow-hidden">
        <Image
          src={card.image}
          alt={card.alt}
          fill
          sizes="140px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          unoptimized
        />
      </div>
      <div className="flex flex-1 items-center justify-between px-4 min-[390px]:px-5 py-3">
        <div>
          <h3 className="text-[17px] min-[390px]:text-[18px] font-semibold text-[#1B3D2F] leading-tight font-[family-name:var(--font-cormorant)]">
            {card.title}
          </h3>
          <p className="mt-0.5 text-[12px] min-[390px]:text-[13px] text-[#68645C] tracking-wide">
            {card.subtitle}
          </p>
        </div>
        <span className="flex h-[40px] w-[40px] min-[390px]:h-[44px] min-[390px]:w-[44px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#B88A3B] to-[#C49A50] shadow-sm transition-transform duration-200 group-hover:translate-x-0.5">
          <ArrowRight className="h-[18px] w-[18px] text-white" strokeWidth={2.2} />
        </span>
      </div>
    </Link>
  );
}

function SecondaryNavLink({ item, onClose }: { item: typeof secondaryLinks[number]; onClose: () => void }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClose}
      className="flex items-center justify-between px-2 transition-colors hover:bg-[#F0EBDF]/60 rounded-xl"
      style={{ minHeight: 54 }}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#F0EBDF]">
          <Icon className="h-[16px] w-[16px] text-[#4A6B3C]" strokeWidth={1.8} />
        </span>
        <span className="text-[15px] font-medium text-[#26372C]">{item.label}</span>
      </div>
      <ChevronRight className="h-4 w-4 text-[#918A80]" strokeWidth={1.8} />
    </Link>
  );
}

function ConsultationCTA({ onClose }: { onClose: () => void }) {
  return (
    <Link
      href="/consultations"
      onClick={onClose}
      className="group flex items-center gap-3 rounded-[16px] bg-[#E8EFDC]/60 border border-[#C5D4B0]/30 px-4 min-[390px]:px-5 py-3.5 transition-all duration-200 hover:bg-[#E0E9D3]/70 active:scale-[0.98]"
    >
      <span className="flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center rounded-[12px] bg-[#4A6B3C] shadow-sm">
        <CalendarCheck className="h-[20px] w-[20px] text-white" strokeWidth={1.8} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] min-[390px]:text-[16px] font-semibold text-[#1B3D2F]">Book Your Consultation</p>
        <p className="text-[12px] text-[#68645C]">Personalized spiritual guidance</p>
      </div>
      <span className="flex h-[36px] w-[36px] flex-shrink-0 items-center justify-center rounded-full bg-[#4A6B3C] shadow-sm transition-transform duration-200 group-hover:translate-x-0.5">
        <ArrowRight className="h-[16px] w-[16px] text-white" strokeWidth={2.2} />
      </span>
    </Link>
  );
}

function AccountAccordion({ onClose }: { onClose: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-t border-[#E2DCD0]/40">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-2 transition-colors hover:bg-[#F0EBDF]/40 rounded-xl"
        style={{ minHeight: 54 }}
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#F0EBDF]">
            <User className="h-[16px] w-[16px] text-[#4A6B3C]" strokeWidth={1.8} />
          </span>
          <span className="text-[15px] font-medium text-[#26372C]">Your Account</span>
        </div>
        <ChevronDown className={cn(
          'h-4 w-4 text-[#918A80] transition-transform duration-200',
          expanded && 'rotate-180',
        )} strokeWidth={1.8} />
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-2 pl-3 space-y-0.5">
              {accountLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] text-[#68645C] transition-colors hover:bg-[#F0EBDF]/50 hover:text-[#26372C]"
                  >
                    <Icon className="h-[16px] w-[16px] flex-shrink-0" strokeWidth={1.6} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SacredFooter() {
  return (
    <div className="mt-4 px-5 min-[390px]:px-6 pb-6">
      {/* Gold divider with lotus */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#B88A3B]/30 to-transparent" />
        <LotusOrnament className="text-[#B88A3B] flex-shrink-0" />
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#B88A3B]/30 to-transparent" />
      </div>

      {/* Sanskrit blessing */}
      <div className="text-center mb-3">
        <p
          className="text-[17px] min-[390px]:text-[18px] text-[#B88A3B]/70 leading-relaxed"
          style={{ fontFamily: 'var(--font-devanagari), serif' }}
        >
          ॥ सर्वे भवन्तु सुखिनः ॥
        </p>
        <p className="mt-1 text-[12px] italic text-[#918A80] tracking-wide font-[family-name:var(--font-cormorant)]">
          &ldquo;May all beings be happy&rdquo;
        </p>
      </div>

      {/* Scenic background */}
      <ScenicBackground />

      {/* Brand line */}
      <p className="mt-3 text-center text-[12px] min-[390px]:text-[13px] tracking-[0.15em] text-[#4A6B3C]/60 font-[family-name:var(--font-cormorant)]">
        Tradition &middot; Devotion &middot; Transformation
      </p>
    </div>
  );
}

/* ================================================================
   SHOP / PUJA SUBMENU PANEL
   ================================================================ */

function SubMenuPanel({
  title,
  links,
  onClose,
  onBack,
}: {
  title: string;
  links: SubLink[];
  onClose: () => void;
  onBack: () => void;
}) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 280 }}
      className="absolute inset-0 z-10 bg-[#FBF8EF] overflow-y-auto"
    >
      <div className="flex items-center gap-3 border-b border-[#E2DCD0]/40 px-4 py-3.5">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F0EBDF] transition-colors hover:bg-[#E8E2D4]"
          aria-label="Back"
        >
          <ChevronRight className="h-4 w-4 rotate-180 text-[#4A6B3C]" strokeWidth={2} />
        </button>
        <h3 className="text-[17px] font-semibold text-[#1B3D2F] font-[family-name:var(--font-cormorant)]">{title}</h3>
      </div>
      <div className="px-4 py-3 space-y-0.5">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href + link.label}
              href={link.href}
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-[#F0EBDF]/60"
            >
              {Icon && (
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B88A3B]/10 text-[#B88A3B]">
                  <Icon className="h-4 w-4" strokeWidth={1.6} />
                </span>
              )}
              <div>
                <p className="text-[14px] font-medium text-[#26372C]">{link.label}</p>
                {link.description && (
                  <p className="text-[11px] text-[#918A80] leading-snug mt-0.5">{link.description}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ================================================================
   MAIN DRAWER COMPONENT
   ================================================================ */

export function MobileDrawer({ isOpen, onClose, shopCategories, pujaLinks, consultLinks }: MobileDrawerProps) {
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [subMenu, setSubMenu] = useState<string | null>(null);

  // Store the trigger element reference when opening
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      // Focus close button after animation
      const timer = setTimeout(() => closeButtonRef.current?.focus(), 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (subMenu) {
          setSubMenu(null);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose, subMenu]);

  // Close on pathname change
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    onCloseRef.current();
    setSubMenu(null);
  }, [pathname]);

  // Return focus on close
  const handleClose = useCallback(() => {
    onClose();
    setSubMenu(null);
    setTimeout(() => triggerRef.current?.focus(), 100);
  }, [onClose]);

  // Get submenu data for a card title
  const getSubLinks = (title: string): SubLink[] | null => {
    if (title === 'Shop') return shopCategories;
    if (title === 'Puja & Seva') return pujaLinks;
    if (title === 'Consultations') return consultLinks;
    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] min-[1200px]:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#211D18]/40 backdrop-blur-[3px]"
            onClick={handleClose}
          />

          {/* Drawer panel */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-0 h-full w-[min(88vw,430px)] bg-[#FBF8EF] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-full flex flex-col">
              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch', paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>

                {/* Top controls */}
                <div className="flex items-center justify-between px-4 min-[390px]:px-5 pt-4 min-[390px]:pt-5 pb-1">
                  <button
                    ref={closeButtonRef}
                    onClick={handleClose}
                    className="flex h-[40px] w-[40px] items-center justify-center rounded-full transition-colors hover:bg-[#F0EBDF]"
                    aria-label="Close menu"
                  >
                    <X className="h-[22px] w-[22px] text-[#26372C]" strokeWidth={1.8} />
                  </button>
                  <CrescentMoon className="text-[#68645C]" />
                </div>

                {/* Intro */}
                <DrawerIntro />

                {/* Search */}
                <DrawerSearch onClose={handleClose} />

                {/* Primary nav cards */}
                <div className="px-5 min-[390px]:px-6 space-y-3 mb-5">
                  {primaryCards.map((card) => {
                    const subLinks = getSubLinks(card.title);
                    return (
                      <div key={card.title} className="relative">
                        <PrimaryNavCard card={card} onClose={handleClose} />
                        {subLinks && subLinks.length > 0 && (
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSubMenu(card.title); }}
                            className="absolute top-1/2 right-[60px] min-[390px]:right-[66px] -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label={`Browse ${card.title} categories`}
                          >
                            <ChevronDown className="h-3 w-3 text-[#68645C]" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Secondary links */}
                <div className="px-5 min-[390px]:px-6 mb-4">
                  <div className="space-y-0.5">
                    {secondaryLinks.map((item) => (
                      <SecondaryNavLink key={item.label} item={item} onClose={handleClose} />
                    ))}
                  </div>
                </div>

                {/* Consultation CTA */}
                <div className="px-5 min-[390px]:px-6 mb-3">
                  <ConsultationCTA onClose={handleClose} />
                </div>

                {/* Account accordion */}
                <div className="px-5 min-[390px]:px-6 mb-2">
                  <AccountAccordion onClose={handleClose} />
                </div>

                {/* Sacred footer */}
                <SacredFooter />
              </div>

              {/* Submenu overlay */}
              <AnimatePresence>
                {subMenu && (
                  <SubMenuPanel
                    title={subMenu}
                    links={getSubLinks(subMenu) || []}
                    onClose={handleClose}
                    onBack={() => setSubMenu(null)}
                  />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
