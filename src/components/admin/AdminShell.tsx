'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ShoppingCart, Users, Package, Flame, ImageIcon, Video, Images, MessageSquareQuote,
  FileText, FolderOpen, Settings, ShieldCheck, Menu, X, LogOut, ExternalLink,
} from 'lucide-react';
import { ToastProvider } from './Toast';

const ICONS = {
  dashboard: LayoutDashboard, orders: ShoppingCart, customers: Users, products: Package, services: Flame,
  banners: ImageIcon, videos: Video, gallery: Images, reviews: MessageSquareQuote, content: FileText,
  media: FolderOpen, settings: Settings, team: ShieldCheck,
} as const;

export interface NavItem {
  href: string;
  label: string;
  icon: keyof typeof ICONS;
  section: string;
}

interface Props {
  nav: NavItem[];
  admin: { email: string; role: string; displayName: string | null };
  signOutAction: () => Promise<void>;
  children: React.ReactNode;
}

const ROLE_LABEL: Record<string, string> = { super_admin: 'Super Admin', admin: 'Admin', editor: 'Editor' };

function NavList({ nav, onNavigate }: { nav: NavItem[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  const sections = [...new Set(nav.map((n) => n.section))];
  return (
    <nav className="space-y-5">
      {sections.map((section) => (
        <div key={section}>
          <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D4B06A]/70">{section}</p>
          <ul className="space-y-0.5">
            {nav.filter((n) => n.section === section).map((item) => {
              const Icon = ICONS[item.icon];
              const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] transition-colors ${
                      active ? 'bg-white/12 font-semibold text-white' : 'text-white/70 hover:bg-white/6 hover:text-white'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? 'text-[#D4B06A]' : ''}`} strokeWidth={1.8} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function AdminShell({ nav, admin, signOutAction, children }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);

  const sidebar = (
    <div className="flex h-full flex-col bg-[#1B3D2F] px-3 py-5">
      <Link href="/admin" className="mb-6 flex items-center gap-2.5 px-3">
        <Image src="/logo-transparent.png" alt="" width={36} height={36} className="h-9 w-auto" unoptimized />
        <span className="font-heading text-lg font-semibold tracking-wide text-white">Admin</span>
      </Link>
      <div className="flex-1 overflow-y-auto pr-1">
        <NavList nav={nav} onNavigate={() => setOpen(false)} />
      </div>
      <div className="mt-4 border-t border-white/10 px-3 pt-4">
        <p className="truncate text-[12.5px] font-medium text-white">{admin.displayName || admin.email}</p>
        <p className="text-[11px] text-[#D4B06A]">{ROLE_LABEL[admin.role] ?? admin.role}</p>
        <div className="mt-3 flex items-center gap-3">
          <a href="/" target="_blank" rel="noopener" className="flex items-center gap-1 text-[12px] text-white/60 hover:text-white">
            <ExternalLink className="h-3.5 w-3.5" /> View site
          </a>
          <form action={signOutAction}>
            <button className="flex items-center gap-1 text-[12px] text-white/60 hover:text-white">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <ToastProvider>
      <div className="flex min-h-dvh">
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 lg:block">{sidebar}</aside>

        {open && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Admin navigation">
            <button className="absolute inset-0 bg-black/40" aria-label="Close menu" onClick={() => setOpen(false)} />
            <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl">{sidebar}</aside>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-[#E8E2D4] bg-[#F6F3EC]/95 px-4 py-3 backdrop-blur lg:hidden">
            <button onClick={() => setOpen(true)} className="rounded-lg p-1.5 text-[#1B3D2F] hover:bg-[#1B3D2F]/8" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <span className="font-heading text-base font-semibold text-[#1B3D2F]">TANTRRA Admin</span>
            {open && <X className="hidden" />}
          </header>
          <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
