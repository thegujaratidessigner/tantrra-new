import { SiteConfig } from '@/lib/types';

export const siteConfig: SiteConfig = {
  whatsappNumber: '',
  email: '',
  phone: '',
  socialLinks: {
    instagram: '',
    youtube: '',
    facebook: '',
  },
  energizationPrice: 125,
  dakshinaOptions: [21, 51, 101, 501],
  shippingNote: 'Shipping details will be confirmed after order placement.',
};

export const navLinks = [
  { label: 'Shop', href: '/products' },
  { label: 'Chadava', href: '/chadava' },
  { label: 'Consult', href: '/consultations' },
  { label: 'Puja', href: '/puja' },
] as const;

export const mobileNavLinks = [
  { label: 'Home', href: '/', icon: 'home' },
  { label: 'Shop', href: '/products', icon: 'shop' },
  { label: 'Chadava', href: '/chadava', icon: 'flame' },
  { label: 'Consult', href: '/consultations', icon: 'sparkles' },
  { label: 'Puja', href: '/puja', icon: 'compass' },
] as const;
