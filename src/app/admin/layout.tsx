'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Flame,
  Sparkles,
  BookOpen,
  Users,
  MessageSquareQuote,
  Settings,
  ChevronLeft,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Consultations', href: '/admin/consultations', icon: Sparkles },
  { label: 'Puja & Seva', href: '/admin/pujas', icon: Flame },
  { label: 'Sadhana', href: '/admin/sadhana', icon: BookOpen },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-dvh bg-white">
      {/* Sidebar */}
      <aside className="hidden w-60 flex-shrink-0 border-r border-border bg-cream-dark lg:block">
        <div className="sticky top-0 flex h-dvh flex-col">
          <div className="flex h-16 items-center gap-2 border-b border-border px-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-foreground-muted hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Site
            </Link>
          </div>
          <div className="px-3 py-2">
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-foreground-subtle">
              Admin Panel
            </p>
          </div>
          <nav className="flex-1 space-y-0.5 px-3">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-green-muted text-green'
                      : 'text-foreground-muted hover:bg-cream hover:text-foreground'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b border-border bg-cream-dark px-4 lg:hidden">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-foreground-muted"
          >
            <ChevronLeft className="h-4 w-4" />
            Site
          </Link>
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle">
            Admin
          </span>
        </header>

        {/* Mobile nav */}
        <div className="overflow-x-auto border-b border-border bg-white lg:hidden">
          <nav className="flex px-2 py-1.5">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-shrink-0 items-center gap-1.5 rounded-sm px-3 py-2 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-green-muted text-green'
                      : 'text-foreground-muted'
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
