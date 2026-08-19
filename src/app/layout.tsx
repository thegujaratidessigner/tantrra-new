import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { SiteShell } from '@/components/layout/SiteShell';

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'TANTRRA — Sacred Protection. Guided with Purpose.',
    template: '%s | TANTRRA',
  },
  description:
    'Discover spiritually prepared Kavach, sacred offerings, personalised guidance and Sadhana experiences designed to support your spiritual journey.',
  metadataBase: new URL('https://tantrra.in'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'TANTRRA',
    title: 'TANTRRA — Sacred Protection. Guided with Purpose.',
    description:
      'Discover spiritually prepared Kavach, sacred offerings, personalised guidance and Sadhana experiences designed to support your spiritual journey.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TANTRRA — Sacred Protection. Guided with Purpose.',
    description:
      'Discover spiritually prepared Kavach, sacred offerings, personalised guidance and Sadhana experiences designed to support your spiritual journey.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="min-h-dvh flex flex-col antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
