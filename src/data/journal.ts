export interface JournalPost {
  slug: string;
  title: string;
  excerpt: string;
  category: 'spirituality' | 'rituals' | 'wellness' | 'guidance';
  readTime: string;
  publishedAt: string;
  coverImage?: string;
  isActive: boolean;
}

const journalPosts: JournalPost[] = [
  {
    slug: 'understanding-kavach-sacred-protection',
    title: 'Understanding Kavach: The Sacred Science of Spiritual Protection',
    excerpt:
      'Kavach are more than amulets — they are consecrated shields prepared through ancient rituals, mantra recitation, and devotional intention. Learn how each Kavach is created and why the preparation process matters.',
    category: 'spirituality',
    readTime: '5 min read',
    publishedAt: '2025-08-15',
    isActive: true,
  },
  {
    slug: 'navagraha-shanti-puja-significance',
    title: 'Navagraha Shanti Puja: Aligning the Nine Planetary Energies',
    excerpt:
      'The nine celestial bodies influence every aspect of life according to Vedic tradition. Discover how Navagraha Shanti Puja works to harmonise planetary energies and bring balance to your path.',
    category: 'rituals',
    readTime: '7 min read',
    publishedAt: '2025-07-28',
    isActive: true,
  },
  {
    slug: 'beginning-your-meditation-practice',
    title: 'Beginning Your Meditation Practice: A Guided Approach',
    excerpt:
      'Meditation is the foundation of spiritual growth. This guide offers practical steps to start a consistent meditation practice, from choosing a space to building a daily rhythm.',
    category: 'wellness',
    readTime: '4 min read',
    publishedAt: '2025-07-10',
    isActive: true,
  },
  {
    slug: 'chakra-healing-seven-energy-centres',
    title: 'The Seven Chakras: Understanding Your Energy Centres',
    excerpt:
      'Each of the seven primary chakras governs specific aspects of physical, emotional, and spiritual wellbeing. Learn how blockages form and how chakra healing can restore balance.',
    category: 'wellness',
    readTime: '6 min read',
    publishedAt: '2025-06-20',
    isActive: true,
  },
];

export function getActiveJournalPosts(): JournalPost[] {
  return journalPosts.filter((p) => p.isActive);
}

export function getJournalPostBySlug(slug: string): JournalPost | undefined {
  return journalPosts.find((p) => p.slug === slug && p.isActive);
}

export function getJournalCategories() {
  return [
    { slug: 'spirituality', label: 'Spirituality' },
    { slug: 'rituals', label: 'Rituals & Puja' },
    { slug: 'wellness', label: 'Wellness' },
    { slug: 'guidance', label: 'Guidance' },
  ] as const;
}
