'use client';

import { MessageCircle } from 'lucide-react';
import { siteConfig } from '@/data/site-config';
import { getWhatsAppLink } from '@/lib/utils';

export function WhatsAppFloat() {
  if (!siteConfig.whatsappNumber) return null;

  return (
    <a
      href={getWhatsAppLink(
        siteConfig.whatsappNumber,
        'Namaste, I would like to know more about TANTRRA.'
      )}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 md:bottom-6 md:right-6 md:h-14 md:w-14"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
    </a>
  );
}
