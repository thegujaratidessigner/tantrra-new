import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, Noto_Serif_Devanagari } from 'next/font/google';
import './globals.css';
import { SiteShell } from '@/components/layout/SiteShell';
import { SiteDataProvider } from '@/components/providers/SiteDataProvider';
import { getSiteSettings } from '@/lib/server/data';
import { getLayoutContent } from '@/lib/server/content';
import { getAllProducts } from '@/lib/server/catalog';

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

const notoSerifDev = Noto_Serif_Devanagari({
  variable: '--font-devanagari',
  subsets: ['devanagari'],
  weight: ['400'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'TANTRRA — Sacred Protection. Guided with Purpose.',
    template: '%s | TANTRRA',
  },
  description:
    'Discover spiritually prepared Kavach, sacred Chadava offerings, specialized Puja, and personalised spiritual consultations.',
  metadataBase: new URL('https://tantrra.in'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'TANTRRA',
    title: 'TANTRRA — Sacred Protection. Guided with Purpose.',
    description:
      'Discover spiritually prepared Kavach, sacred Chadava offerings, specialized Puja, and personalised spiritual consultations.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TANTRRA — Sacred Protection. Guided with Purpose.',
    description:
      'Discover spiritually prepared Kavach, sacred Chadava offerings, specialized Puja, and personalised spiritual consultations.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, layout, products] = await Promise.all([getSiteSettings(), getLayoutContent(), getAllProducts()]);
  const productIndex = Object.fromEntries(
    products.map((p) => [
      p.id,
      {
        name: p.name,
        slug: p.slug,
        category: p.category,
        image: (p.images.find((i) => i.type === 'hero') ?? p.images[0])?.src,
        energizationAvailable: p.energizationAvailable,
      },
    ])
  );

  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} ${notoSerifDev.variable}`}>
      <body className="min-h-dvh flex flex-col antialiased">
        <SiteDataProvider value={{ settings, layout, productIndex }}>
          <SiteShell>{children}</SiteShell>
        </SiteDataProvider>
      </body>
    </html>
  );
}
