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
  { label: 'Puja & Chadava', href: '/puja' },
  { label: 'Tarot', href: '/tarot' },
  { label: 'Consultations', href: '/consultations' },
  { label: 'Sadhana', href: '/sadhana' },
] as const;

export const mobileNavLinks = [
  { label: 'Home', href: '/', icon: 'home' },
  { label: 'Shop', href: '/products', icon: 'shop' },
  { label: 'Puja', href: '/puja', icon: 'flame' },
  { label: 'Tarot', href: '/tarot', icon: 'sparkles' },
  { label: 'Consult', href: '/consultations', icon: 'compass' },
] as const;
