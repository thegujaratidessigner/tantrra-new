'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Shield, ArrowRight } from 'lucide-react';
import { FLOATING_VIDEO_EVENT } from '@/components/home/FloatingVideo';

export function MobileConsultFloat() {
  const pathname = usePathname();
  const [videoVisible, setVideoVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ visible: boolean }>).detail;
      setVideoVisible(detail.visible);
    };
    window.addEventListener(FLOATING_VIDEO_EVENT, handler);
    return () => window.removeEventListener(FLOATING_VIDEO_EVENT, handler);
  }, []);

  const hideOn = ['/products/kamakhya-siddha-kavach', '/checkout', '/cart', '/admin'];
  if (hideOn.some((p) => pathname.startsWith(p))) return null;

  return (
    <div
      className={`fixed bottom-[62px] left-1/2 z-40 -translate-x-1/2 safe-bottom transition-all duration-300 sm:hidden ${
        videoVisible ? 'pointer-events-none translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <Link
        href="/products/kamakhya-siddha-kavach"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1B3D2F] via-[#1F4635] to-[#1B3D2F] px-3.5 py-2 shadow-[0_4px_16px_rgba(27,61,47,0.4),0_0_0_1px_rgba(184,138,59,0.15)] transition-all duration-200 active:scale-[0.97]"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#B88A3B] to-[#9A7230]">
          <Shield className="h-3 w-3 text-white" strokeWidth={2} />
        </div>
        <span className="whitespace-nowrap text-[12px] font-semibold leading-tight text-white">
          Kamakhya Kavach
        </span>
        <ArrowRight className="h-3 w-3 text-[#B88A3B]" strokeWidth={2.2} />
      </Link>
    </div>
  );
}
