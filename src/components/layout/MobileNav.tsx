'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Flame, Sparkles, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Shop', href: '/products', icon: ShoppingBag },
  { label: 'Puja', href: '/puja', icon: Flame },
  { label: 'Consult', href: '/consultations', icon: Sparkles },
  { label: 'Sadhana', href: '/sadhana', icon: BookOpen },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Mobile navigation" className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-cream/95 backdrop-blur-md safe-bottom md:hidden">
      <div className="flex items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors',
                isActive ? 'text-green' : 'text-foreground-subtle'
              )}
            >
              <item.icon
                className={cn('h-5 w-5', isActive && 'stroke-[2.5]')}
              />
              <span className="text-[10px] font-medium leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
