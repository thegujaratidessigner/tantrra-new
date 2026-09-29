'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export function MobileConsultFloat() {
  const pathname = usePathname();
  const hideOn = ['/consultations', '/checkout', '/cart', '/admin'];
  if (hideOn.some((p) => pathname.startsWith(p))) return null;

  return (
    <div className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 sm:hidden">
      <Link
        href="/consultations"
        className="flex items-center gap-2 rounded-full bg-[#1B3D2F] px-5 py-2.5 shadow-lg shadow-black/20 transition-transform active:scale-95"
      >
        <MessageCircle className="h-4 w-4 text-gold-light" />
        <span className="text-[13px] font-semibold tracking-wide text-white">
          Book Consultation
        </span>
      </Link>
    </div>
  );
}
