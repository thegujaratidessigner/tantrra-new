'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, User, Menu, X, ChevronDown, Shield, Package, Gem, BookOpen, Flame, Heart, HandHeart, Star, Eye, Sparkles, Hash, Compass, Phone } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { useCartStore } from '@/lib/cart-store';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
  { label: 'About', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

const mobileNavSections = [
  { title: 'Shop', links: shopCategories },
  { title: 'Puja & Seva', links: pujaLinks },
  { title: 'Consultations', links: consultLinks },
  { title: 'More', links: [
    { label: 'Sadhana', href: '/sadhana' },
    { label: 'About TANTRRA', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/faq' },
  ]},
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const rawItemCount = useCartStore((s) => s.getItemCount());
  const [headerMounted, setHeaderMounted] = useState(false);
  useEffect(() => setHeaderMounted(true), []);
  const itemCount = headerMounted ? rawItemCount : 0;
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleDropdownEnter = (label: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(label);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 180);
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-cream/98 backdrop-blur-xl shadow-[0_1px_4px_rgba(26,24,20,0.07)] border-b border-border/40'
            : 'bg-cream/85 backdrop-blur-sm'
        )}
      >
        {/* Subtle gold accent line at top */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        <Container>
          <div className="flex h-[72px] items-center justify-between sm:h-[82px] lg:h-[92px]">
            {/* Mobile: Hamburger */}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-cream-dark hover:text-foreground lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Logo — larger */}
            <Link
              href="/"
              className="relative flex-shrink-0 lg:mr-8"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Image
                src="/logo.png"
                alt="TANTRRA"
                width={82}
                height={102}
                className="h-[60px] w-auto object-contain sm:h-[72px] lg:h-[82px]"
                priority
                unoptimized
              />
            </Link>

            {/* Desktop Navigation — centered */}
            <nav className="hidden flex-1 items-center justify-center lg:flex">
              <div className="flex items-center gap-0.5">
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
                        'relative flex items-center gap-1 px-3.5 py-2.5 text-[13px] font-medium tracking-[0.02em] transition-colors',
                        isActive(item.href)
                          ? 'text-foreground'
                          : 'text-foreground-muted hover:text-foreground',
                        activeDropdown === item.label && 'text-foreground'
                      )}
                    >
                      {item.label}
                      {item.dropdown && (
                        <ChevronDown className={cn(
                          'h-3 w-3 opacity-50 transition-transform duration-200',
                          activeDropdown === item.label && 'rotate-180 opacity-80'
                        )} />
                      )}
                      {/* Active indicator */}
                      {isActive(item.href) && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute bottom-0.5 left-3.5 right-3.5 h-[1.5px] rounded-full bg-gold"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>

                    {/* Enhanced Dropdown */}
                    <AnimatePresence>
                      {item.dropdown && activeDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          className="absolute left-1/2 top-full -translate-x-1/2 pt-1"
                        >
                          <div className="min-w-[280px] overflow-hidden rounded-lg border border-border/50 bg-cream shadow-xl shadow-foreground/8">
                            <div className="h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                            <div className="py-1.5">
                              {item.dropdown.map((link) => {
                                const Icon = link.icon;
                                return (
                                  <Link
                                    key={link.href}
                                    href={link.href}
                                    className="group/item flex items-start gap-3 px-4 py-2.5 transition-colors hover:bg-gold/5"
                                  >
                                    {Icon && (
                                      <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-gold/8 text-gold-dark transition-all duration-200 group-hover/item:bg-gold group-hover/item:text-white">
                                        <Icon className="h-3.5 w-3.5" />
                                      </span>
                                    )}
                                    <div className="min-w-0">
                                      <p className="text-[13px] font-medium text-foreground group-hover/item:text-foreground">
                                        {link.label}
                                      </p>
                                      {link.description && (
                                        <p className="mt-0.5 text-[11px] leading-snug text-foreground-subtle">
                                          {link.description}
                                        </p>
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

            {/* Right Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              {/* Search */}
              <button
                className="flex h-9 w-9 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-cream-dark hover:text-foreground"
                aria-label="Search"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search className="h-[18px] w-[18px]" />
              </button>

              <Link
                href="/account"
                className="hidden h-9 w-9 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-cream-dark hover:text-foreground sm:flex"
                aria-label="Account"
              >
                <User className="h-[18px] w-[18px]" />
              </Link>

              <Link
                href="/cart"
                className="relative flex h-9 w-9 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-cream-dark hover:text-foreground"
                aria-label="Cart"
              >
                <ShoppingBag className="h-[18px] w-[18px]" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-green text-[9px] font-bold text-white ring-2 ring-cream"
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </motion.span>
                )}
              </Link>
            </div>
          </div>
        </Container>

        {/* Search Overlay */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-border/40 bg-cream"
            >
              <Container>
                <div className="flex items-center gap-3 py-4">
                  <Search className="h-5 w-5 flex-shrink-0 text-foreground-subtle" />
                  <input
                    type="text"
                    placeholder="Search products, services, pujas..."
                    className="w-full bg-transparent text-base font-light text-foreground placeholder:text-foreground-subtle focus:outline-none"
                    autoFocus
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="flex-shrink-0 rounded-md p-1.5 text-foreground-subtle transition-colors hover:bg-cream-dark hover:text-foreground"
                    aria-label="Close search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="absolute left-0 top-0 h-full w-[82vw] max-w-[340px] bg-cream shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between border-b border-border/40 px-5 py-4">
                <Image
                  src="/logo.png"
                  alt="TANTRRA"
                  width={68}
                  height={85}
                  className="h-[60px] w-auto object-contain"
                  unoptimized
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-foreground-subtle transition-colors hover:bg-cream-dark"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer content with expandable sections */}
              <div className="px-4 py-3">
                {/* Home link */}
                <Link
                  href="/"
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] font-medium transition-colors',
                    pathname === '/' ? 'bg-gold/8 text-foreground' : 'text-foreground-muted hover:bg-cream-dark hover:text-foreground'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>

                {/* Expandable sections */}
                {mobileNavSections.map((section) => (
                  <div key={section.title} className="border-b border-border/30 last:border-none">
                    <button
                      onClick={() => setMobileExpanded(mobileExpanded === section.title ? null : section.title)}
                      className="flex w-full items-center justify-between px-3 py-3"
                    >
                      <span className="text-[15px] font-medium text-foreground">
                        {section.title}
                      </span>
                      <ChevronDown className={cn(
                        'h-4 w-4 text-foreground-subtle transition-transform duration-200',
                        mobileExpanded === section.title && 'rotate-180'
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
                                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] transition-colors',
                                    isActive(link.href)
                                      ? 'bg-gold/8 font-medium text-foreground'
                                      : 'text-foreground-muted hover:bg-cream-dark hover:text-foreground'
                                  )}
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {Icon && (
                                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gold/8 text-gold-dark">
                                      <Icon className="h-3 w-3" />
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

                {/* Account link */}
                <div className="mt-2 border-t border-border/30 pt-2">
                  <Link
                    href="/account"
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] text-foreground-muted transition-colors hover:bg-cream-dark hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    My Account
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-[15px] text-foreground-muted transition-colors hover:bg-cream-dark hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Phone className="h-4 w-4" />
                    Contact Us
                  </Link>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-[72px] sm:h-[82px] lg:h-[92px]" />
    </>
  );
}
