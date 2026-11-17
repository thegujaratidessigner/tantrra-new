// Initial rows for the admin-managed content tables, mirroring what the website
// displayed before content moved to the database. Used only by `npm run db:seed`.

export const seedBanners = [
  {
    key: 'home-hero-1',
    placement: 'home_hero',
    eyebrow: 'Sacred Protection · Guided by Tradition',
    heading: 'Sacred Protection,',
    highlight: 'Prepared for You',
    description:
      'Authentic Kavach, sacred offerings and personalised spiritual guidance — prepared with devotion, empowered by rituals, and guided by ancient wisdom.',
    cta_primary_label: 'Explore Sacred Products',
    cta_primary_href: '/products',
    cta_secondary_label: 'Get Your Kamakhya Kavach',
    cta_secondary_href: '/products/kamakhya-siddha-kavach',
    media_type: 'image',
    desktop_src: '/images/home/home-page.webp',
    mobile_src: null,
    object_position: 'center',
    mobile_object_position: 'center 30%',
    alt: 'Sacred Sri Yantra, Das Mahavidya and Kamakhya murti with diyas and rudraksha',
  },
  {
    key: 'why-tantrra-1',
    placement: 'why_tantrra',
    media_type: 'image',
    desktop_src: '/why-tantrra-banner.webp',
    alt: 'Why TANTRRA — Built on Trust, Guided by Devotion',
  },
  {
    key: 'page-hero-products-1',
    placement: 'page_hero_products',
    media_type: 'video',
    desktop_src: '/videos/product-hero.mp4',
    poster_src: '/images/tantrra/products/products-hero-desktop.jpg',
    alt: 'Sacred Product — Secretly crafted through Indian tradition',
  },
  {
    key: 'page-hero-consultations-1',
    placement: 'page_hero_consultations',
    media_type: 'video',
    desktop_src: '/videos/consultation-hero.mp4',
    poster_src: '/images/puja-consult/consultation-services-hero.png',
    alt: 'Spiritual consultation and guidance services',
  },
  {
    key: 'page-hero-puja-1',
    placement: 'page_hero_puja',
    media_type: 'video',
    desktop_src: '/videos/puja-hero.mp4',
    poster_src: '/images/puja-consult/puja-specialized-hero.png',
    alt: 'Specialized Puja — Sacred fire ritual ceremony',
  },
  {
    key: 'page-hero-about-1',
    placement: 'page_hero_about',
    eyebrow: 'About',
    heading: 'TANTRRA',
    description: 'A sacred spiritual ecosystem built on the belief that authentic spiritual practice deserves authentic tools, guidance, and community.',
    media_type: 'image',
    alt: '',
  },
  {
    key: 'page-hero-contact-1',
    placement: 'page_hero_contact',
    eyebrow: 'Get in Touch',
    heading: 'Contact Us',
    description: 'We are here to help with your orders, consultations, Puja requests, or any questions about your spiritual journey.',
    media_type: 'image',
    alt: '',
  },
] as const;

export const seedVideos = [
  { key: 'banner-row-products', placement: 'home_banner_row', src: '/videos/product-hero.mp4', title: 'Sacred Products', description: 'Consecrated protection crafted with devotion' },
  { key: 'banner-row-consultation', placement: 'home_banner_row', src: '/videos/consultation-hero.mp4', title: 'Tarot & Consultation', description: 'Personalised spiritual guidance and insight' },
  { key: 'banner-row-puja', placement: 'home_banner_row', src: '/videos/puja-hero.mp4', title: 'Sacred Puja', description: 'Traditional rituals performed with purpose' },
  { key: 'floating', placement: 'home_floating', src: '/videos/homepage-floating.mp4', title: 'TANTRRA video', description: null },
  {
    key: 'youtube-featured', placement: 'youtube', youtube_id: 'Mjgkh5VymME',
    title: 'Akashic Records by Tripuransh — Insights, Process & Explanation',
    description: 'Deep insights into Akashic Records — process, information and spiritual explanation by Tripuransh.',
  },
  {
    key: 'youtube-podcast', placement: 'youtube', youtube_id: 'CijkeMSQW4k',
    title: 'Maa Kamakhya Secrets, Akashic Reading & Tarot — Podcast',
    description: 'Tripuransh discusses Maa Kamakhya, Akashic Reading and Tarot on the JJainam Gada Podcast.',
  },
] as const;

export const seedFaqs = [
  ['What is a Kavach?', 'A Kavach is a sacred protective amulet or talisman prepared through traditional Vedic rituals, mantra recitation, and consecration. Each Kavach is specifically attuned to a deity and purpose, and is meant to be worn or kept close for spiritual protection and blessings.'],
  ['How are the products prepared?', 'Each product undergoes traditional Panch Upchar Pujan with specific mantra recitations and consecration rituals appropriate to the deity and purpose. The preparation process is carried out with genuine devotion and follows traditional methods.'],
  ['What is the Energization add-on?', 'The Energization add-on is an additional consecration process that enhances the spiritual potency of your product through extended mantra recitation and ritual procedures. It is optional and available for select products.'],
  ['What is Brahmin Dakshina?', 'Brahmin Dakshina is an optional, voluntary offering made as a gesture of respect and gratitude to the Brahmin who performs the rituals and consecration for your product. It is entirely voluntary and does not affect your product or service.'],
  ['How long does delivery take?', 'Products are prepared over 3-5 working days (as each item requires proper consecration), followed by 5-7 working days for delivery. You will receive tracking details via email and WhatsApp once shipped.'],
  ['How do consultations work?', 'After booking a consultation, you will receive a confirmation with scheduling details. Consultations are conducted by Tripuransh and may take 3-4 working days for delivery of written reports. Specific timelines vary by service type.'],
  ['Can I request a custom Puja?', 'Yes, all our Pujas are available upon request. You can reach out via WhatsApp or the website to discuss your specific needs, and we will arrange the appropriate Puja with scheduling and contribution details.'],
  ['What is Seva / Chadava?', 'Seva is selfless service, and Chadava is a sacred offering. Through TANTRRA, you can contribute to various Seva initiatives including Brahmin Seva, Gau Seva, Kanya Pujan, and Vriddha Seva. Your contributions go directly toward supporting these causes.'],
  ['Is my payment information secure?', 'Yes. All payments are processed through secure, PCI-compliant payment gateways. We do not store your payment card details on our servers.'],
  ['Can I return a consecrated product?', 'Due to the sacred and consecrated nature of our products, they cannot be returned or exchanged once prepared. If you receive a damaged or incorrect item, please contact us within 48 hours with photographs and we will arrange a replacement.'],
] as const;
