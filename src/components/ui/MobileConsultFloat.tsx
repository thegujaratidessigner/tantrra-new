'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Shield, ArrowRight } from 'lucide-react';

export function MobileConsultFloat() {
  const pathname = usePathname();
  const hideOn = ['/products/kamakhya-siddha-kavach', '/checkout', '/cart', '/admin'];
  if (hideOn.some((p) => pathname.startsWith(p))) return null;

  return (
    <div className="fixed bottom-[76px] right-4 z-40 safe-bottom sm:hidden">
      <Link
        href="/products/kamakhya-siddha-kavach"
        className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#1B3D2F] via-[#1F4635] to-[#1B3D2F] px-4 py-2.5 shadow-[0_4px_20px_rgba(27,61,47,0.35),0_0_0_1px_rgba(184,138,59,0.15)] transition-all duration-200 active:scale-[0.97]"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#B88A3B] to-[#9A7230] shadow-[0_2px_6px_rgba(184,138,59,0.3)]">
          <Shield className="h-3.5 w-3.5 text-white" strokeWidth={2} />
        </div>
        <span className="text-[13px] font-semibold leading-tight text-white">
          Kamakhya Kavach
        </span>
        <ArrowRight className="h-3.5 w-3.5 text-[#B88A3B]" strokeWidth={2.2} />
      </Link>
    </div>
  );
}
