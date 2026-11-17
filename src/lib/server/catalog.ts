import 'server-only';
import { unstable_cache } from 'next/cache';
import * as staticProducts from '@/data/products';
import * as staticConsultations from '@/data/consultations';
import * as staticPujas from '@/data/pujas';
import * as staticChadava from '@/data/chadava';
import type { SpecializedPuja } from '@/data/pujas';
import type { DeityOffering, NavagrahaDay, TithiPoojan, TithiIconType } from '@/data/chadava';
import type { ConsultationService, Product, ProductCategory, ProductImage, Puja, SevaCategory } from '@/lib/types';
import { CACHE_SECONDS, CACHE_TAGS, cacheKey, getDbOrNull } from './data';

export interface NavagrahaShanti {
  id: string;
  name: string;
  price: number;
  description: string;
  includes: string[];
  panchopchar: string[];
  note: string;
}

export interface CategoryInfo {
  slug: string;
  name: string;
  title: string | null;
  description: string | null;
}

export interface ServiceCatalog {
  consultations: ConsultationService[];
  specializedPujas: SpecializedPuja[];
  legacyPujas: Puja[];
  deityAnushthan: DeityOffering[];
  navagrahaShanti: NavagrahaShanti | null;
  navagrahaDays: NavagrahaDay[];
  tithiPoojan: TithiPoojan[];
  daanSeva: SevaCategory[];
}

// ── Products ────────────────────────────────────────────────────────────────

interface ProductRow {
  id: string; slug: string; name: string; category_slug: string; short_description: string; long_description: string;
  purpose: string; price: number; compare_price: number | null; sku: string | null; weight: string | null;
  preparation_info: string | null; how_to_use: string | null; care_instructions: string | null; benefits: string[];
  recommended_for: string[]; kit_includes: string[]; videos: string[]; related_products: string[]; related_puja: string[];
  related_consultation: string[]; badge: string | null; whatsapp_customization: boolean; featured: boolean; test_only: boolean;
  is_active: boolean; in_stock: boolean; energization_available: boolean; seo_title: string | null; seo_description: string | null;
}

async function loadProducts(): Promise<Product[]> {
  const sql = getDbOrNull();
  if (!sql) return staticProducts.products;

  const [rows, images, variants] = await Promise.all([
    sql<ProductRow[]>`SELECT * FROM products WHERE archived_at IS NULL ORDER BY sort_order, name`,
    sql<{ product_id: string; src: string; alt: string; kind: ProductImage['type'] }[]>`
      SELECT product_id, src, alt, kind FROM product_images ORDER BY product_id, sort_order, created_at`,
    sql<{ id: string; product_id: string; name: string; color: string | null; price: number | null; sku: string | null; in_stock: boolean }[]>`
      SELECT id, product_id, name, color, price, sku, in_stock FROM product_variants ORDER BY product_id, sort_order`,
  ]);

  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    category: r.category_slug as ProductCategory,
    shortDescription: r.short_description,
    longDescription: r.long_description,
    purpose: r.purpose,
    price: r.price,
    comparePrice: r.compare_price ?? undefined,
    images: images.filter((i) => i.product_id === r.id).map((i) => ({ src: i.src, alt: i.alt, type: i.kind })),
    videos: r.videos.length ? r.videos : undefined,
    variants: variants
      .filter((v) => v.product_id === r.id)
      .map((v) => ({ id: v.id, name: v.name, color: v.color ?? undefined, price: v.price ?? undefined, sku: v.sku ?? undefined, inStock: v.in_stock })),
    sku: r.sku ?? undefined,
    weight: r.weight ?? undefined,
    preparationInfo: r.preparation_info ?? undefined,
    howToUse: r.how_to_use ?? undefined,
    benefits: r.benefits,
    recommendedFor: r.recommended_for,
    careInstructions: r.care_instructions ?? undefined,
    whatsappCustomization: r.whatsapp_customization,
    featured: r.featured,
    isActive: r.is_active,
    inStock: r.in_stock,
    energizationAvailable: r.energization_available,
    relatedProducts: r.related_products,
    relatedPuja: r.related_puja,
    relatedConsultation: r.related_consultation,
    seoTitle: r.seo_title ?? undefined,
    seoDescription: r.seo_description ?? undefined,
    kitIncludes: r.kit_includes,
    badge: r.badge ?? undefined,
    testOnly: r.test_only || undefined,
  }));
}

const getAllProductsCached = unstable_cache(loadProducts, cacheKey('catalog-products'), {
  tags: [CACHE_TAGS.catalog],
  revalidate: CACHE_SECONDS,
});

export const getAllProducts = () => getAllProductsCached();
export const getActiveProducts = async () => (await getAllProducts()).filter((p) => p.isActive);
export const getFeaturedProducts = async () => (await getActiveProducts()).filter((p) => p.featured);
export const getProductBySlug = async (slug: string) => (await getAllProducts()).find((p) => p.slug === slug);
export const getProductsByCategory = async (category: string) =>
  (await getActiveProducts()).filter((p) => p.category === category);

async function loadCategories(): Promise<CategoryInfo[]> {
  const sql = getDbOrNull();
  if (!sql) return [];
  return sql<CategoryInfo[]>`SELECT slug, name, title, description FROM product_categories WHERE is_active ORDER BY sort_order`;
}

export const getProductCategories = unstable_cache(loadCategories, cacheKey('catalog-categories'), {
  tags: [CACHE_TAGS.catalog],
  revalidate: CACHE_SECONDS,
});

// ── Services ────────────────────────────────────────────────────────────────

interface OfferingRow {
  id: string; kind: string; source_id: string; group_id: string | null; slug: string | null; name: string; name_alt: string | null;
  short_description: string; long_description: string; includes: string[]; image_url: string | null; price: number | null;
  preset_amounts: number[]; allow_custom: boolean; duration: string | null; metadata: Record<string, unknown>;
  featured: boolean; is_active: boolean;
}

interface GroupRow {
  id: string; kind: string; slug: string | null; name: string; name_alt: string | null; short_description: string;
  long_description: string; icon: string | null; image_url: string | null; turnaround_days: string | null;
  seo_title: string | null; seo_description: string | null; featured: boolean; is_active: boolean;
}

function staticServiceCatalog(): ServiceCatalog {
  return {
    consultations: staticConsultations.consultations,
    specializedPujas: staticPujas.specializedPujas,
    legacyPujas: staticPujas.pujas,
    deityAnushthan: staticChadava.deityAnushthan,
    navagrahaShanti: staticChadava.navagrahaShanti,
    navagrahaDays: staticChadava.navagrahaDays,
    tithiPoojan: staticChadava.tithiPoojan,
    daanSeva: staticChadava.daanSevaCategories,
  };
}

const str = (v: unknown, fallback = '') => (typeof v === 'string' ? v : fallback);

async function loadServices(): Promise<ServiceCatalog> {
  const sql = getDbOrNull();
  if (!sql) return staticServiceCatalog();

  const [groups, offerings] = await Promise.all([
    sql<GroupRow[]>`SELECT * FROM service_groups ORDER BY sort_order, name`,
    sql<OfferingRow[]>`SELECT * FROM service_offerings ORDER BY sort_order, name`,
  ]);
  const of = (kind: string) => offerings.filter((o) => o.kind === kind);

  const consultations: ConsultationService[] = groups
    .filter((g) => g.kind === 'consultation')
    .map((g) => ({
      id: g.id,
      slug: g.slug ?? g.id,
      name: g.name,
      shortDescription: g.short_description,
      longDescription: g.long_description,
      icon: g.icon ?? undefined,
      imageUrl: g.image_url ?? undefined,
      packages: of('consultation')
        .filter((o) => o.group_id === g.id && o.is_active && o.price !== null)
        .map((o) => ({ id: o.source_id, name: o.name, description: o.short_description, price: o.price!, duration: o.duration ?? undefined })),
      featured: g.featured,
      isActive: g.is_active,
      turnaroundDays: g.turnaround_days ?? undefined,
      seoTitle: g.seo_title ?? undefined,
      seoDescription: g.seo_description ?? undefined,
    }));

  const pujaRows = of('puja');
  const specializedPujas: SpecializedPuja[] = pujaRows
    .filter((o) => !o.metadata.legacy && o.price !== null)
    .map((o) => ({
      id: o.source_id,
      slug: o.slug ?? o.source_id,
      name: o.name,
      shortDescription: o.short_description,
      price: o.price!,
      includes: o.includes,
      featured: o.featured,
      isActive: o.is_active,
      image: o.image_url ?? '',
    }));
  const legacyPujas: Puja[] = pujaRows
    .filter((o) => o.metadata.legacy)
    .map((o) => ({
      id: o.source_id,
      slug: o.slug ?? o.source_id,
      name: o.name,
      shortDescription: o.short_description,
      longDescription: o.long_description || undefined,
      purpose: str(o.metadata.purpose) || undefined,
      includes: o.includes.length ? o.includes : undefined,
      price: o.price ?? undefined,
      isRequestOnly: o.metadata.requestOnly !== false,
      featured: o.featured,
      isActive: o.is_active,
    }));

  const active = (kind: string) => of(kind).filter((o) => o.is_active && o.price !== null);

  const deityAnushthan: DeityOffering[] = active('chadava-deity').map((o) => ({
    id: o.source_id, deity: str(o.metadata.deity), tier: str(o.metadata.tier), name: o.name, price: o.price!,
  }));

  const shantiRow = active('chadava-navagraha').find((o) => o.id === 'navagraha_shanti');
  const navagrahaShanti: NavagrahaShanti | null = shantiRow
    ? {
        id: shantiRow.source_id,
        name: shantiRow.name,
        price: shantiRow.price!,
        description: shantiRow.short_description,
        includes: shantiRow.includes,
        panchopchar: Array.isArray(shantiRow.metadata.panchopchar) ? (shantiRow.metadata.panchopchar as string[]) : [],
        note: str(shantiRow.metadata.note),
      }
    : null;

  const dayOfferings = active('chadava-navagraha').filter((o) => o.id !== 'navagraha_shanti');
  const navagrahaDays: NavagrahaDay[] = groups
    .filter((g) => g.kind === 'navagraha-day' && g.is_active)
    .map((g) => {
      const items = dayOfferings.filter((o) => o.group_id === g.id);
      const grahaNames = [...new Set(items.map((o) => str(o.metadata.graha)))];
      return {
        id: g.id,
        dayEnglish: g.name,
        dayHindi: g.name_alt ?? '',
        grahas: grahaNames.map((name) => ({
          name,
          offerings: items
            .filter((o) => str(o.metadata.graha) === name)
            .map((o) => ({ id: o.source_id, name: o.name, nameHindi: o.name_alt ?? '', price: o.price! })),
        })),
      };
    })
    .filter((d) => d.grahas.length > 0);

  const tithiPoojan: TithiPoojan[] = active('chadava-tithi').map((o) => ({
    id: o.source_id,
    name: o.name,
    deity: str(o.metadata.deity),
    price: o.price!,
    icon: (str(o.metadata.icon) || undefined) as TithiIconType | undefined,
  }));

  const daanSeva: SevaCategory[] = of('daan-seva').map((o) => ({
    id: o.source_id,
    slug: o.slug ?? o.source_id,
    name: o.name,
    description: o.short_description,
    amounts: o.preset_amounts,
    allowCustom: o.allow_custom,
    isActive: o.is_active,
    image: o.image_url ?? undefined,
  }));

  return { consultations, specializedPujas, legacyPujas, deityAnushthan, navagrahaShanti, navagrahaDays, tithiPoojan, daanSeva };
}

export const getServiceCatalog = unstable_cache(loadServices, cacheKey('catalog-services'), {
  tags: [CACHE_TAGS.catalog],
  revalidate: CACHE_SECONDS,
});

export async function getActiveConsultations() {
  return (await getServiceCatalog()).consultations.filter((c) => c.isActive);
}
export async function getConsultationBySlug(slug: string) {
  return (await getServiceCatalog()).consultations.find((c) => c.slug === slug);
}
export async function getActiveSpecializedPujas() {
  return (await getServiceCatalog()).specializedPujas.filter((p) => p.isActive);
}
export async function getSpecializedPujaBySlug(slug: string) {
  return (await getServiceCatalog()).specializedPujas.find((p) => p.slug === slug);
}
export async function getPujaBySlug(slug: string) {
  return (await getServiceCatalog()).legacyPujas.find((p) => p.slug === slug);
}
export async function getActivePujas() {
  return (await getServiceCatalog()).legacyPujas.filter((p) => p.isActive);
}
