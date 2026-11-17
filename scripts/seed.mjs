// Imports the website's existing static data into Supabase.
// Idempotent: inserts use ON CONFLICT DO NOTHING, so re-running never duplicates
// rows and never overwrites values an admin has edited since.
// Usage: npm run db:seed
import postgres from 'postgres';

const { products } = await import('../src/data/products.ts');
const { consultations } = await import('../src/data/consultations.ts');
const { specializedPujas, pujas } = await import('../src/data/pujas.ts');
const chadava = await import('../src/data/chadava.ts');
const { siteConfig } = await import('../src/data/site-config.ts');
const { carouselVideos } = await import('../src/data/carousel-videos.ts');
const { galleryImages } = await import('../src/data/gallery-images.ts');
const { seedBanners, seedVideos, seedFaqs } = await import('../src/lib/content/seed-content.ts');

const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error('DATABASE_URL is empty.');
  process.exit(1);
}
const sql = postgres(url, { prepare: false, max_pipeline: 1, max: 1, ssl: 'require', onnotice: () => {} });

const CATEGORY_COPY = {
  kavach: ['Sacred Kavach', 'Sacred Kavach Collection', 'Spiritually prepared protection Kavach — each consecrated through traditional rituals and sacred recitations.'],
  'all-in-one-kavach': ['All in One Kavach', 'All in One Kavach Collection', 'Comprehensive multi-deity Kavach combining the blessings and protection of multiple sacred energies in one.'],
  'dhan-potli': ['Dhan Potli', 'Sacred Dhan Potli', 'Prosperity and wealth-attracting sacred potli — consecrated through traditional rituals for abundance.'],
  'energy-items': ['Energy Items', 'Sacred Energy Items', 'Energised spiritual items for chakra alignment, planetary balance, and spiritual well-being.'],
  potli: ['Sacred Potli', 'Sacred Potli Collection', 'Prosperity and intention offerings prepared with devoted purpose.'],
  bracelet: ['Sacred Bracelets', 'Sacred Energy Bracelets', 'Energised bracelets for chakra alignment, planetary balance, and spiritual well-being.'],
  mala: ['Spiritual Materials', 'Spiritual Materials & Tools', 'Mala, tools, and essentials for your daily spiritual practice.'],
  'sadhana-material': ['Sadhana Material', null, null],
  frame: ['Frames', null, null],
  oil: ['Oils', null, null],
  candle: ['Candles', null, null],
};

const counts = {};
const tally = (table, result) => { counts[table] = (counts[table] ?? 0) + result.count; };

await sql.begin(async (tx) => {
  // Categories: every category referenced by a product, in first-seen order, plus known extras.
  const categorySlugs = [...new Set([...products.map((p) => p.category), ...Object.keys(CATEGORY_COPY)])];
  for (const [i, slug] of categorySlugs.entries()) {
    const [name, title, description] = CATEGORY_COPY[slug] ?? [slug, null, null];
    tally('product_categories', await tx`
      INSERT INTO product_categories (slug, name, title, description, sort_order)
      VALUES (${slug}, ${name}, ${title}, ${description}, ${i}) ON CONFLICT (slug) DO NOTHING`);
  }

  for (const [i, p] of products.entries()) {
    tally('products', await tx`
      INSERT INTO products (
        id, slug, name, category_slug, short_description, long_description, purpose, price, compare_price,
        sku, weight, preparation_info, how_to_use, care_instructions, benefits, recommended_for, kit_includes,
        videos, related_products, related_puja, related_consultation, whatsapp_customization, featured,
        is_active, in_stock, energization_available, seo_title, seo_description, sort_order
      ) VALUES (
        ${p.id}, ${p.slug}, ${p.name}, ${p.category}, ${p.shortDescription ?? ''}, ${p.longDescription ?? ''}, ${p.purpose ?? ''},
        ${p.price}, ${p.comparePrice ?? null}, ${p.sku ?? null}, ${p.weight ?? null}, ${p.preparationInfo ?? null},
        ${p.howToUse ?? null}, ${p.careInstructions ?? null}, ${p.benefits ?? []}, ${p.recommendedFor ?? []}, ${p.kitIncludes ?? []},
        ${p.videos ?? []}, ${p.relatedProducts ?? []}, ${p.relatedPuja ?? []}, ${p.relatedConsultation ?? []},
        ${p.whatsappCustomization}, ${p.featured}, ${p.isActive}, ${p.inStock}, ${p.energizationAvailable},
        ${p.seoTitle ?? null}, ${p.seoDescription ?? null}, ${i}
      ) ON CONFLICT (id) DO NOTHING`);
    for (const [j, img] of p.images.entries()) {
      tally('product_images', await tx`
        INSERT INTO product_images (product_id, src, alt, kind, sort_order)
        VALUES (${p.id}, ${img.src}, ${img.alt}, ${img.type}, ${j}) ON CONFLICT (product_id, src) DO NOTHING`);
    }
    for (const [j, v] of (p.variants ?? []).entries()) {
      tally('product_variants', await tx`
        INSERT INTO product_variants (id, product_id, name, color, price, sku, in_stock, sort_order)
        VALUES (${v.id}, ${p.id}, ${v.name}, ${v.color ?? null}, ${v.price ?? null}, ${v.sku ?? null}, ${v.inStock}, ${j})
        ON CONFLICT (id) DO NOTHING`);
    }
  }

  let order = 0;
  const offering = async (o) => tally('service_offerings', await tx`
    INSERT INTO service_offerings (
      id, kind, source_id, group_id, slug, name, name_alt, short_description, long_description, includes,
      image_url, price, preset_amounts, allow_custom, duration, metadata, featured, is_active, sort_order
    ) VALUES (
      ${o.id}, ${o.kind}, ${o.sourceId}, ${o.groupId ?? null}, ${o.slug ?? null}, ${o.name}, ${o.nameAlt ?? null},
      ${o.short ?? ''}, ${o.long ?? ''}, ${o.includes ?? []}, ${o.image ?? null}, ${o.price ?? null},
      ${o.presets ?? []}, ${o.allowCustom ?? false}, ${o.duration ?? null}, ${tx.json(o.metadata ?? {})},
      ${o.featured ?? false}, ${o.isActive ?? true}, ${order++}
    ) ON CONFLICT (id) DO NOTHING`);

  for (const [i, c] of consultations.entries()) {
    tally('service_groups', await tx`
      INSERT INTO service_groups (id, kind, slug, name, short_description, long_description, icon, turnaround_days,
                                  seo_title, seo_description, featured, is_active, sort_order)
      VALUES (${c.id}, 'consultation', ${c.slug}, ${c.name}, ${c.shortDescription ?? ''}, ${c.longDescription ?? ''},
              ${c.icon ?? null}, ${c.turnaroundDays ?? null}, ${c.seoTitle ?? null}, ${c.seoDescription ?? null},
              ${c.featured}, ${c.isActive}, ${i})
      ON CONFLICT (id) DO NOTHING`);
    for (const pkg of c.packages) {
      await offering({ id: `consult_${pkg.id}`, kind: 'consultation', sourceId: pkg.id, groupId: c.id, name: pkg.name,
        short: pkg.description, price: pkg.price, duration: pkg.duration, isActive: c.isActive });
    }
  }

  for (const p of specializedPujas) {
    await offering({ id: `puja_${p.id}`, kind: 'puja', sourceId: p.id, slug: p.slug, name: p.name, short: p.shortDescription,
      includes: p.includes, image: p.image, price: p.price, featured: p.featured, isActive: p.isActive });
  }
  for (const p of pujas) {
    await offering({ id: `puja_${p.id}`, kind: 'puja', sourceId: p.id, slug: p.slug, name: p.name, short: p.shortDescription,
      long: p.longDescription, includes: p.includes, price: p.price, featured: p.featured, isActive: p.isActive,
      metadata: { legacy: true, purpose: p.purpose ?? null, requestOnly: p.isRequestOnly } });
  }

  for (const d of chadava.deityAnushthan) {
    await offering({ id: `deity_${d.id}`, kind: 'chadava-deity', sourceId: d.id, name: d.name, price: d.price,
      metadata: { deity: d.deity, tier: d.tier } });
  }

  const shanti = chadava.navagrahaShanti;
  await offering({ id: 'navagraha_shanti', kind: 'chadava-navagraha', sourceId: shanti.id, name: shanti.name,
    short: shanti.description, includes: shanti.includes, price: shanti.price,
    metadata: { combined: true, panchopchar: shanti.panchopchar, note: shanti.note } });

  for (const [i, day] of chadava.navagrahaDays.entries()) {
    tally('service_groups', await tx`
      INSERT INTO service_groups (id, kind, name, name_alt, sort_order)
      VALUES (${day.id}, 'navagraha-day', ${day.dayEnglish}, ${day.dayHindi}, ${i}) ON CONFLICT (id) DO NOTHING`);
    for (const graha of day.grahas) {
      for (const o of graha.offerings) {
        await offering({ id: `navagraha_${o.id}`, kind: 'chadava-navagraha', sourceId: o.id, groupId: day.id,
          name: o.name, nameAlt: o.nameHindi, price: o.price, metadata: { graha: graha.name } });
      }
    }
  }

  for (const t of chadava.tithiPoojan) {
    await offering({ id: `tithi_${t.id}`, kind: 'chadava-tithi', sourceId: t.id, name: t.name, price: t.price,
      metadata: { deity: t.deity, icon: t.icon ?? null } });
  }

  for (const s of chadava.daanSevaCategories) {
    await offering({ id: `daan_${s.id}`, kind: 'daan-seva', sourceId: s.id, slug: s.slug, name: s.name, short: s.description,
      image: s.image, presets: s.amounts, allowCustom: s.allowCustom, isActive: s.isActive });
  }

  const settings = {
    contact: { whatsappNumber: siteConfig.whatsappNumber, email: siteConfig.email, phone: siteConfig.phone },
    social: siteConfig.socialLinks,
    checkout: { energizationPrice: siteConfig.energizationPrice, dakshinaOptions: siteConfig.dakshinaOptions },
    shipping: {
      freeShippingThreshold: siteConfig.freeShippingThreshold,
      feeBelowThreshold: siteConfig.shippingFeeBelowThreshold,
      note: siteConfig.shippingNote,
    },
    chadava: { panchopcharItems: [...chadava.panchopcharItems], panchopcharImages: chadava.panchopcharImages },
  };
  for (const [key, value] of Object.entries(settings)) {
    tally('site_settings', await tx`
      INSERT INTO site_settings (key, value) VALUES (${key}, ${tx.json(value)}) ON CONFLICT (key) DO NOTHING`);
  }

  // Website content is seeded once; afterwards the admin panel owns it (deleted rows stay deleted).
  const [marker] = await tx`SELECT 1 FROM site_settings WHERE key = 'seed.content_v1'`;
  if (!marker) {
    for (const [i, b] of seedBanners.entries()) {
      tally('banners', await tx`
        INSERT INTO banners (placement, eyebrow, heading, highlight, description, cta_primary_label, cta_primary_href,
                             cta_secondary_label, cta_secondary_href, media_type, desktop_src, mobile_src, poster_src,
                             object_position, mobile_object_position, alt, sort_order)
        VALUES (${b.placement}, ${b.eyebrow ?? null}, ${b.heading ?? null}, ${b.highlight ?? null}, ${b.description ?? null},
                ${b.cta_primary_label ?? null}, ${b.cta_primary_href ?? null}, ${b.cta_secondary_label ?? null}, ${b.cta_secondary_href ?? null},
                ${b.media_type}, ${b.desktop_src ?? null}, ${b.mobile_src ?? null}, ${b.poster_src ?? null},
                ${b.object_position ?? 'center'}, ${b.mobile_object_position ?? null}, ${b.alt ?? ''}, ${i})`);
    }
    const allVideos = [
      ...carouselVideos.map((v) => ({ placement: 'home_carousel', src: v.src, title: v.title, description: v.description ?? null })),
      ...seedVideos,
    ];
    for (const [i, v] of allVideos.entries()) {
      tally('videos', await tx`
        INSERT INTO videos (placement, title, description, src, youtube_id, sort_order)
        VALUES (${v.placement}, ${v.title}, ${v.description ?? null}, ${v.src ?? null}, ${v.youtube_id ?? null}, ${i})`);
    }
    for (const [i, g] of galleryImages.entries()) {
      tally('gallery_images', await tx`
        INSERT INTO gallery_images (src, alt, caption, sort_order) VALUES (${g.src}, ${g.alt}, ${g.caption ?? null}, ${i})
        ON CONFLICT (src) DO NOTHING`);
    }
    for (const [i, [question, answer]] of seedFaqs.entries()) {
      tally('faqs', await tx`
        INSERT INTO faqs (question, answer, sort_order) VALUES (${question}, ${answer}, ${i}) ON CONFLICT (question) DO NOTHING`);
    }
    await tx`INSERT INTO site_settings (key, value) VALUES ('seed.content_v1', ${tx.json({ at: new Date().toISOString() })})`;
  }
});

console.log('Seed complete (rows inserted this run; 0 = already present):');
for (const [t, n] of Object.entries(counts)) console.log(`  ${t.padEnd(20)} ${n}`);
await sql.end({ timeout: 5 });
