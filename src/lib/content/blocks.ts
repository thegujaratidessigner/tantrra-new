import type { FieldDef } from './schema';
import { DEFAULT_LAYOUT_CONTENT } from './layout-defaults';

export interface BlockDef {
  key: string;
  title: string;
  group: 'Site-wide' | 'Homepage' | 'About' | 'Pages';
  description?: string;
  fields: FieldDef[];
  defaults: Record<string, unknown>;
}

const heading = (label: string, title: string, description: string): Record<string, string> => ({ label, title, description });
const headingFields: FieldDef[] = [
  { kind: 'text', key: 'label', label: 'Small label above heading', max: 80 },
  { kind: 'text', key: 'title', label: 'Heading', max: 160, required: true },
  { kind: 'textarea', key: 'description', label: 'Description', max: 600, rows: 3 },
];

export const BLOCKS: BlockDef[] = [
  {
    key: 'layout.announcement',
    title: 'Announcement bar',
    group: 'Site-wide',
    description: 'Dark green bar at the very top. Use {threshold} to insert the free-shipping amount from Settings.',
    fields: [
      { kind: 'strings', key: 'desktopLeft', label: 'Desktop — left items', max: 5, itemMax: 60 },
      { kind: 'text', key: 'desktopCenter', label: 'Desktop — centre text', max: 80 },
      { kind: 'text', key: 'desktopRight', label: 'Desktop — right text', max: 120 },
      { kind: 'strings', key: 'tablet', label: 'Tablet items', max: 4, itemMax: 60 },
      { kind: 'strings', key: 'mobile', label: 'Mobile items', max: 3, itemMax: 50 },
    ],
    defaults: DEFAULT_LAYOUT_CONTENT.announcement,
  },
  {
    key: 'layout.ticker',
    title: 'Trust ticker',
    group: 'Site-wide',
    description: 'Scrolling strip under the header.',
    fields: [
      {
        kind: 'list', key: 'items', label: 'Messages', itemLabel: 'Message', max: 10,
        fields: [
          { kind: 'text', key: 'text', label: 'Main text', max: 60, required: true },
          { kind: 'text', key: 'sub', label: 'Secondary text', max: 60 },
        ],
      },
    ],
    defaults: { items: DEFAULT_LAYOUT_CONTENT.ticker },
  },
  {
    key: 'layout.footer',
    title: 'Footer',
    group: 'Site-wide',
    description: 'Contact details and social links are edited under Settings.',
    fields: [
      { kind: 'textarea', key: 'blurb', label: 'Brand description (desktop/tablet)', max: 300, rows: 3 },
      { kind: 'textarea', key: 'blurbShort', label: 'Brand description (mobile)', max: 200, rows: 2 },
      {
        kind: 'list', key: 'sections', label: 'Link columns', itemLabel: 'Column', max: 5,
        fields: [
          { kind: 'text', key: 'title', label: 'Column title', max: 40, required: true },
          {
            kind: 'list', key: 'links', label: 'Links', itemLabel: 'Link', max: 10,
            fields: [
              { kind: 'text', key: 'label', label: 'Label', max: 50, required: true },
              { kind: 'link', key: 'href', label: 'Link', required: true },
            ],
          },
        ],
      },
    ],
    defaults: DEFAULT_LAYOUT_CONTENT.footer as unknown as Record<string, unknown>,
  },
];

BLOCKS.push(
  {
    key: 'about.founder',
    title: 'Founder biography',
    group: 'About',
    fields: [
      { kind: 'media', key: 'image', label: 'Founder photo', accept: 'image' },
      { kind: 'text', key: 'imageAlt', label: 'Photo description', max: 160 },
      { kind: 'text', key: 'label', label: 'Small label', max: 40 },
      { kind: 'text', key: 'name', label: 'Name', max: 80, required: true },
      { kind: 'strings', key: 'paragraphs', label: 'Biography paragraphs', max: 10, itemMax: 2000 },
      { kind: 'text', key: 'tagline', label: 'Closing tagline', max: 200 },
    ],
    defaults: {
      image: '/images/founder-photo.webp',
      imageAlt: 'Tripuransh — Founder of TANTRRA',
      label: 'Founder',
      name: 'Tripuransh',
      paragraphs: [
        'JJainam Gada, spiritually known as Tripuransh, is the founder and principal Sadhak of TANTRRA, established in 2026 with the vision of making sacred spiritual offerings accessible to devotees across the world. Born in Mumbai in 2008 and raised in a Jain family, he developed a deep connection with Devi Maa during childhood and has been following his Sadhana journey since 2022, with a special devotion to Maa Kamakhya.',
        'His spiritual path is rooted in the Brahma Vidya Sampradaya and the Tantric Kaula Shakta tradition, with a connection to Kamakhya Diksha. He also honours the lineage associated with Shri Shri 1008 Tantric Baba Bhutnath of Lucknow and the philosophical heritage of Adi Guru Shankaracharya. His approach emphasises Satvic Tantra, devotion, discipline, and Ahimsa, while encouraging a respectful understanding of sacred spiritual traditions.',
        "Through TANTRRA, Tripuransh and his team help devotees in India and internationally arrange Pujas, Chadhava, Daan, and other devotional offerings dedicated to Maa Kamakhya and Lord Shiva. Where applicable, rituals are arranged in devotees' names and gotras, helping them participate in sacred offerings even when distance or personal circumstances prevent their physical presence.",
        'Alongside his spiritual pursuits, Tripuransh offers Tarot and Akashic Records consultations, having pursued learning in these fields through the Institute of Holistic Science in Andheri, Mumbai. Through TANTRRA, his mission is to honour Sanatan Dharma and sacred cosmic traditions while making spiritual offerings more accessible with sincerity, reverence, and devotion.',
      ],
      tagline: 'TANTRRA — A Path of Sadhana, Devotion, and Sacred Connection.',
    },
  },
  {
    key: 'about.pillars',
    title: '“What Guides Us” pillars',
    group: 'About',
    fields: [
      { kind: 'text', key: 'label', label: 'Small label', max: 60 },
      { kind: 'text', key: 'title', label: 'Heading', max: 120 },
      {
        kind: 'list', key: 'items', label: 'Pillars', itemLabel: 'Pillar', max: 8,
        fields: [
          { kind: 'text', key: 'title', label: 'Title', max: 80, required: true },
          { kind: 'textarea', key: 'description', label: 'Description', max: 400, rows: 2 },
        ],
      },
    ],
    defaults: {
      label: 'Our Foundation',
      title: 'What Guides Us',
      items: [
        { title: 'Authentic Preparation', description: 'Each Kavach and sacred item is prepared through traditional Panch Upchar Pujan, accompanied by specific mantra recitations and consecration rituals.' },
        { title: 'Spiritual Integrity', description: 'We do not mass-produce. Every offering is prepared with the care, devotion, and attention that the tradition demands.' },
        { title: 'Responsible Guidance', description: 'Consultations focus on genuine insight rather than sensationalism — offering clarity and direction without unverifiable claims.' },
        { title: 'Living Practice', description: 'Beyond products, our sacred offerings and Puja services help seekers deepen their practice through devoted rituals and spiritual learning.' },
      ],
    },
  },
  {
    key: 'about.cta',
    title: 'About page call to action',
    group: 'About',
    fields: [
      { kind: 'text', key: 'title', label: 'Heading', max: 120 },
      { kind: 'textarea', key: 'description', label: 'Description', max: 400, rows: 2 },
      { kind: 'text', key: 'primaryLabel', label: 'Green button label', max: 40 },
      { kind: 'link', key: 'primaryHref', label: 'Green button link' },
      { kind: 'text', key: 'secondaryLabel', label: 'Maroon button label', max: 40 },
      { kind: 'link', key: 'secondaryHref', label: 'Maroon button link' },
    ],
    defaults: {
      title: 'Begin Your Sacred Journey',
      description: 'Explore our offerings and find what resonates with your spiritual path — from consecrated products to personalised guidance.',
      primaryLabel: 'Explore Sacred Products',
      primaryHref: '/products',
      secondaryLabel: 'Book a Consultation',
      secondaryHref: '/consultations',
    },
  },
);

const sectionHeading = (label: string, title: string, description: string) => ({ label, title, description });

BLOCKS.push(
  {
    key: 'home.journey',
    title: 'Journey cards (below hero)',
    group: 'Homepage',
    description: 'The four image cards under the hero. Icons follow card position.',
    fields: [
      {
        kind: 'list', key: 'items', label: 'Cards', itemLabel: 'Card', max: 8,
        fields: [
          { kind: 'text', key: 'title', label: 'Title', max: 60, required: true },
          { kind: 'textarea', key: 'description', label: 'Description', max: 200, rows: 2 },
          { kind: 'link', key: 'href', label: 'Link', required: true },
          { kind: 'media', key: 'image', label: 'Image (4:3)', accept: 'image' },
          { kind: 'text', key: 'imageAlt', label: 'Image description', max: 160 },
          { kind: 'text', key: 'iconBg', label: 'Icon colour (hex)', max: 9, help: 'e.g. #1B3D2F' },
        ],
      },
    ],
    defaults: {
      items: [
        { title: 'Sacred Products', description: 'Protection, prosperity and spiritual support through consecrated items.', href: '/products', image: '/images/home/ecosystem-products.webp', imageAlt: 'Sacred spiritual products — Kavach, Yantra, and ritual items', iconBg: '#1B3D2F' },
        { title: 'Chadava', description: 'Sacred offerings — Deity Anushthan, Navagraha Poojan, Tithi Poojan and Daan Seva.', href: '/chadava', image: '/images/home/ecosystem-chadawa.webp', imageAlt: 'Sacred Chadava offerings and devotional ceremony', iconBg: '#7A2E3B' },
        { title: 'Consult', description: 'Tarot, Akashic Reading, Chakra Healing and personalised spiritual guidance.', href: '/consultations', image: '/images/home/ecosystem-tarot.webp', imageAlt: 'Spiritual consultation and guidance session', iconBg: '#2D5A3D' },
        { title: 'Puja', description: 'Specialized Puja performed individually with your Name, Sankalp and Gotra.', href: '/puja', image: '/images/home/ecosystem-puja.webp', imageAlt: 'Sacred puja and fire ritual ceremony', iconBg: '#B88A3B' },
      ],
    },
  },
  {
    key: 'home.intents',
    title: '“What Are You Seeking Guidance For?”',
    group: 'Homepage',
    fields: [
      ...headingFields,
      {
        kind: 'list', key: 'items', label: 'Intents', itemLabel: 'Intent', max: 16,
        fields: [
          { kind: 'text', key: 'label', label: 'Label', max: 40, required: true },
          { kind: 'text', key: 'slug', label: 'Filter keyword', max: 40, required: true, help: 'Links to /products?intent=<keyword>' },
        ],
      },
    ],
    defaults: {
      ...sectionHeading('Guided Discovery', 'What Are You Seeking Guidance For?', 'Select your area of focus and discover the sacred products, services, and practices that may support your journey.'),
      items: [
        { label: 'Protection', slug: 'protection' }, { label: 'Success & Growth', slug: 'success-growth' },
        { label: 'Wealth & Prosperity', slug: 'wealth-prosperity' }, { label: 'Relationships', slug: 'relationships' },
        { label: 'Spiritual Growth', slug: 'spiritual-growth' }, { label: 'Chakra Balance', slug: 'chakra-balance' },
        { label: 'Financial Difficulties', slug: 'financial-difficulties' }, { label: 'Negative Energy', slug: 'negative-energy' },
        { label: 'Business Growth', slug: 'business-growth' }, { label: 'Personal Guidance', slug: 'personal-guidance' },
      ],
    },
  },
  {
    key: 'home.puja_seva',
    title: '“Participate in Sacred Rituals” cards',
    group: 'Homepage',
    fields: [
      ...headingFields,
      {
        kind: 'list', key: 'items', label: 'Cards', itemLabel: 'Card', max: 6,
        fields: [
          { kind: 'text', key: 'title', label: 'Title', max: 60, required: true },
          { kind: 'textarea', key: 'description', label: 'Description', max: 300, rows: 2 },
          { kind: 'link', key: 'href', label: 'Link', required: true },
          { kind: 'text', key: 'cta', label: 'Button label', max: 40 },
        ],
      },
    ],
    defaults: {
      ...sectionHeading('Sacred Rituals', 'Participate in Sacred Rituals', 'Join in powerful Pujas, sacred Chadava offerings, and meaningful Daan Seva to support your spiritual path.'),
      items: [
        { title: 'Chadava', description: 'Deity Anushthan, Navagraha Poojan, Tithi & Tewar Panchopchar Poojan, and Daan Seva — sacred offerings performed with devotion.', href: '/chadava', cta: 'Explore Chadava' },
        { title: 'Specialized Puja', description: 'Maa Kamakhya Puja, Sadashiv Puja, and Dash Mahavidya Puja — performed individually with your Name, Sankalp and Gotra.', href: '/puja', cta: 'Explore Puja' },
        { title: 'Daan Seva', description: 'Brahmin Seva, Gau Seva, Kanya Pujan, Vriddha Seva, and Needy People Seva — contribute to meaningful sacred causes.', href: '/chadava#daan-seva', cta: 'View Seva Options' },
      ],
    },
  },
  {
    key: 'home.consultations',
    title: 'Consultations section heading',
    group: 'Homepage',
    fields: headingFields,
    defaults: sectionHeading('Tarot & Consultation', 'Guidance for the Questions That Matter', 'Personal consultations with Tripuransh — Tarot, Akashik Reading, Chakra Healing, and more.'),
  },
  {
    key: 'home.youtube',
    title: 'Spiritual Insights (YouTube) heading',
    group: 'Homepage',
    description: 'Videos are managed under Videos; the playlist link under Settings → Social.',
    fields: headingFields,
    defaults: sectionHeading('Sacred Wisdom', 'Spiritual Insights & Guidance', 'Explore sacred teachings, spiritual insights and guided wisdom from Tripuransh.'),
  },
  {
    key: 'home.social',
    title: '“Connect with TANTRRA” social profiles',
    group: 'Homepage',
    fields: [
      ...headingFields,
      {
        kind: 'list', key: 'profiles', label: 'Profiles', itemLabel: 'Profile', max: 10,
        fields: [
          { kind: 'select', key: 'platform', label: 'Platform', options: [{ value: 'instagram', label: 'Instagram' }, { value: 'youtube', label: 'YouTube' }] },
          { kind: 'text', key: 'name', label: 'Name', max: 60, required: true },
          { kind: 'text', key: 'handle', label: 'Handle', max: 60 },
          { kind: 'link', key: 'href', label: 'Profile URL', required: true },
        ],
      },
    ],
    defaults: {
      ...sectionHeading('Stay Connected', 'Connect with TANTRRA', 'Follow us for sacred wisdom, spiritual insights, tarot readings and updates on our spiritual journey.'),
      profiles: [
        { platform: 'instagram', name: 'TANTRRA', handle: '@tantrra.in', href: 'https://www.instagram.com/tantrra.in' },
        { platform: 'instagram', name: 'Tripuransh', handle: '@tripuransh_', href: 'https://www.instagram.com/tripuransh_' },
        { platform: 'instagram', name: 'Shakttarot', handle: '@shakttarot', href: 'https://www.instagram.com/shakttarot' },
        { platform: 'youtube', name: 'Tripuransh', handle: '@tripuransh', href: 'https://youtube.com/@tripuransh' },
        { platform: 'youtube', name: 'Shakttarot', handle: '@shakttarot', href: 'https://youtube.com/@shakttarot' },
      ],
    },
  },
  {
    key: 'home.trust',
    title: '“Your Journey with TANTRRA” steps',
    group: 'Homepage',
    fields: [
      { kind: 'text', key: 'label', label: 'Small label', max: 60 },
      { kind: 'text', key: 'title', label: 'Heading', max: 120 },
      { kind: 'textarea', key: 'description', label: 'Subtitle', max: 300, rows: 2 },
      {
        kind: 'list', key: 'steps', label: 'Steps', itemLabel: 'Step', max: 6,
        fields: [
          { kind: 'text', key: 'title', label: 'Title', max: 80, required: true },
          { kind: 'textarea', key: 'description', label: 'Description', max: 300, rows: 2 },
        ],
      },
    ],
    defaults: {
      label: 'The Experience',
      title: 'Your Journey with TANTRRA',
      description: 'A thoughtful, sacred process from discovery to continued spiritual practice.',
      steps: [
        { title: 'Get Your Sacred Products', description: 'Explore our consecrated Kavach, Potli, and Yantra — each prepared with devotion for your spiritual journey.' },
        { title: 'Receive Guidance', description: 'Connect with Tripuransh for personalised advice or let our descriptions guide your selection.' },
        { title: 'Sacred Preparation', description: 'Your chosen Kavach or ritual is prepared through traditional practices with devotion and intention.' },
        { title: 'Embrace Your Practice', description: 'Receive your sacred item with guidance, and deepen your spiritual practice with continued support.' },
      ],
    },
  },
);

export const headingBlock = (key: string, title: string, defaults: Record<string, string>, extra: FieldDef[] = []): BlockDef => ({
  key,
  title,
  group: 'Homepage',
  fields: [...headingFields, ...extra],
  defaults,
});

export { heading, headingFields };

export const getBlockDef = (key: string) => BLOCKS.find((b) => b.key === key);
