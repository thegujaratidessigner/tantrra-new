export interface ProductImage {
  src: string;
  alt: string;
  type: 'hero' | 'info' | 'preparation' | 'gallery';
}

export interface ProductVariant {
  id: string;
  name: string;
  color?: string;
  price?: number;
  sku?: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  shortDescription: string;
  longDescription: string;
  purpose: string;
  price: number;
  comparePrice?: number;
  images: ProductImage[];
  videos?: string[];
  variants?: ProductVariant[];
  sku?: string;
  weight?: string;
  preparationInfo?: string;
  howToUse?: string;
  benefits?: string[];
  recommendedFor?: string[];
  careInstructions?: string;
  whatsappCustomization: boolean;
  featured: boolean;
  isActive: boolean;
  inStock: boolean;
  energizationAvailable: boolean;
  relatedProducts?: string[];
  relatedPuja?: string[];
  relatedConsultation?: string[];
  seoTitle?: string;
  seoDescription?: string;
  kitIncludes?: string[];
}

export type ProductCategory =
  | 'kavach'
  | 'bracelet'
  | 'potli'
  | 'sadhana-material'
  | 'frame'
  | 'oil'
  | 'candle'
  | 'mala';

export interface ConsultationService {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  icon?: string;
  packages: ConsultationPackage[];
  featured: boolean;
  isActive: boolean;
  turnaroundDays?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ConsultationPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: string;
}

export interface Puja {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  longDescription?: string;
  purpose?: string;
  includes?: string[];
  price?: number;
  isRequestOnly: boolean;
  featured: boolean;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface SevaCategory {
  id: string;
  slug: string;
  name: string;
  description: string;
  amounts: number[];
  allowCustom: boolean;
  isActive: boolean;
}

export interface SadhanaContent {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: SadhanaCategory;
  thumbnail?: string;
  videoUrl?: string;
  duration?: string;
  teacher: string;
  accessLevel: 'free' | 'members_only';
  isPublished: boolean;
  order: number;
}

export type SadhanaCategory =
  | 'meditation'
  | 'chakra'
  | 'mantra'
  | 'guidance'
  | 'puja-guidance'
  | 'sadhana'
  | 'live-session';

export interface Testimonial {
  id: string;
  name: string;
  photo?: string;
  content: string;
  videoUrl?: string;
  relatedProduct?: string;
  relatedService?: string;
  isPublished: boolean;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  priceSnapshot: number;
  energization: boolean;
}

export interface SiteConfig {
  whatsappNumber: string;
  email: string;
  phone: string;
  socialLinks: {
    instagram?: string;
    youtube?: string;
    facebook?: string;
    twitter?: string;
  };
  energizationPrice: number;
  dakshinaOptions: number[];
  shippingNote: string;
}
