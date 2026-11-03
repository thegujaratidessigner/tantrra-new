'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Shield, ArrowRight } from 'lucide-react';

export function MobileConsultFloat() {
  const pathname = usePathname();
  const hideOn = ['/products/kamakhya-siddha-kavach', '/checkout', '/cart', '/admin'];
  if (hideOn.some((p) => pathname.startsWith(p))) return null;

  return (
    <div className="fixed bottom-[76px] left-4 right-4 z-40 safe-bottom sm:hidden">
      <Link
        href="/products/kamakhya-siddha-kavach"
        className="group relative flex items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-[#1B3D2F] via-[#1F4635] to-[#1B3D2F] px-5 py-3.5 shadow-[0_4px_24px_rgba(27,61,47,0.4),0_0_0_1px_rgba(184,138,59,0.15)] transition-all duration-200 active:scale-[0.98]"
      >
        {/* Subtle gold shimmer line at top */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B88A3B]/40 to-transparent" />

        {/* Left: icon + text */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#B88A3B] to-[#9A7230] shadow-[0_2px_8px_rgba(184,138,59,0.3)]">
            <Shield className="h-4 w-4 text-white" strokeWidth={2} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#B88A3B]/80">
              Sacred Protection
            </span>
            <span className="text-[14px] font-semibold leading-tight text-white">
              Get Your Kamakhya Kavach
            </span>
          </div>
        </div>

        {/* Right: arrow */}
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-colors group-active:bg-white/20">
          <ArrowRight className="h-3.5 w-3.5 text-[#B88A3B]" strokeWidth={2.2} />
        </div>
      </Link>
    </div>
  );
}
