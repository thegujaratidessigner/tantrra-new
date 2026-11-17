export interface FooterSection {
  title: string;
  links: { label: string; href: string }[];
}

export interface LayoutContent {
  announcement: {
    desktopLeft: string[];
    desktopCenter: string;
    desktopRight: string;
    tablet: string[];
    mobile: string[];
  };
  ticker: { text: string; sub: string }[];
  footer: { blurb: string; blurbShort: string; sections: FooterSection[] };
}

/** `{threshold}` in announcement text is replaced with the configured free-shipping threshold. */
export const DEFAULT_LAYOUT_CONTENT: LayoutContent = {
  announcement: {
    desktopLeft: ['Authentic Rituals', 'Spiritual Guidance', 'Positive Transformation'],
    desktopCenter: '🌺 ।। जय माँ ।। 🌺',
    desktopRight: 'Free shipping on orders above {threshold}',
    tablet: ['Sacred Protection', 'Guided by Tradition', 'Free Shipping Above {threshold}'],
    mobile: ['Sacred Protection', 'Free Shipping Above {threshold}'],
  },
  ticker: [
    { text: '100% Authentic Products', sub: 'Sourced with Care' },
    { text: 'Secure & Fast Delivery', sub: 'Across India' },
    { text: 'Trusted Spiritual Community', sub: 'Growing with Devotion' },
    { text: 'Personalized Guidance', sub: 'By Experienced Practitioners' },
  ],
  footer: {
    blurb: 'Sacred protection and spiritual guidance, prepared with devotion and purpose. Every offering is rooted in authentic tradition.',
    blurbShort: 'Sacred protection and spiritual guidance, prepared with devotion and purpose.',
    sections: [
      {
        title: 'Sacred Offerings',
        links: [
          { label: 'Shop All Products', href: '/products' },
          { label: 'Chadava', href: '/chadava' },
          { label: 'Consultations', href: '/consultations' },
          { label: 'Puja', href: '/puja' },
        ],
      },
      {
        title: 'Explore',
        links: [
          { label: 'About TANTRRA', href: '/about' },
          { label: 'Journal', href: '/journal' },
          { label: 'FAQs', href: '/faq' },
          { label: 'Contact Us', href: '/contact' },
        ],
      },
      {
        title: 'Your Account',
        links: [
          { label: 'My Account', href: '/account' },
          { label: 'Track Your Order', href: '/account' },
          { label: 'My Bookings', href: '/account' },
          { label: 'My Orders', href: '/account' },
          { label: 'Wishlist', href: '/account' },
        ],
      },
      {
        title: 'Policies',
        links: [
          { label: 'Shipping Information', href: '/shipping' },
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Terms & Conditions', href: '/terms' },
          { label: 'Returns & Cancellation', href: '/returns' },
        ],
      },
    ],
  },
};

export function fillThreshold(text: string, threshold: number): string {
  return text.replaceAll('{threshold}', `₹${threshold.toLocaleString('en-IN')}`);
}
