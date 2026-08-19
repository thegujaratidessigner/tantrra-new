import { ConsultationService } from '@/lib/types';

export const consultations: ConsultationService[] = [
  {
    id: 'consult_001',
    slug: 'tarot',
    name: 'Tarot Consultation',
    shortDescription: 'Seek clarity and insight through the ancient art of Tarot reading by Tripuransh.',
    longDescription: 'Tarot is a powerful tool for understanding the energies surrounding your questions and life situations. Through intuitive reading, Tripuransh guides you to clarity on matters of the heart, career, relationships, and spiritual path.',
    packages: [
      { id: 'tarot_3q', name: '3 Major Questions', description: 'Focused reading on three important life questions', price: 501, duration: '20-30 min' },
      { id: 'tarot_5q', name: '5 Questions', description: 'Extended reading covering five areas of your life', price: 699, duration: '30-40 min' },
      { id: 'tarot_60', name: '60-Minute Consultation', description: 'Deep comprehensive reading and guidance session', price: 1500, duration: '60 min' },
    ],
    featured: true,
    isActive: true,
    turnaroundDays: '3-4 working days after payment',
  },
  {
    id: 'consult_002',
    slug: 'akashik-reading',
    name: 'Akashik Reading',
    shortDescription: 'Access the Akashic Records to understand your soul\'s journey and karmic patterns.',
    longDescription: 'The Akashic Records contain the energetic imprint of every soul\'s journey. Through deep meditation and spiritual attunement, Tripuransh accesses these records to help you understand the deeper patterns influencing your life.',
    packages: [
      { id: 'akashik_issue', name: 'Per Issue Reading', description: 'Focused Akashik reading on a specific life issue', price: 1999, duration: '45-60 min' },
      { id: 'akashik_deep', name: 'Deep Reading', description: 'Comprehensive Akashic exploration across multiple life areas', price: 3499, duration: '90 min' },
    ],
    featured: true,
    isActive: true,
    turnaroundDays: '3-4 working days after payment',
  },
  {
    id: 'consult_003',
    slug: 'past-life-karma-healing',
    name: 'Past Life Karma Pattern Healing',
    shortDescription: 'Identify and heal karmic patterns carried from past lives affecting your present.',
    longDescription: 'Past life karmic patterns can create recurring challenges in your current life. This healing modality works to identify these patterns and initiate the process of release and transformation.',
    packages: [],
    featured: false,
    isActive: true,
  },
  {
    id: 'consult_004',
    slug: 'seven-chakra-healing',
    name: 'Seven Chakra Healing',
    shortDescription: 'Balance, cleanse, and align your seven primary energy centres.',
    longDescription: 'The seven chakras are vital energy centres that govern different aspects of physical, emotional, and spiritual well-being. This healing session identifies blockages and works to restore balanced energy flow.',
    packages: [
      { id: 'chakra_session', name: 'Chakra Healing Session', description: 'Complete seven chakra assessment, cleansing, and alignment', price: 501 },
    ],
    featured: true,
    isActive: true,
  },
  {
    id: 'consult_005',
    slug: 'meditation-guidance',
    name: 'Meditation Guidance',
    shortDescription: 'Personalised meditation techniques suited to your spiritual needs.',
    longDescription: 'Receive personalised guidance on meditation practices that align with your spiritual goals and current state of development.',
    packages: [
      { id: 'med_session', name: 'Guidance Session', description: 'Personalised meditation assessment and guidance', price: 501 },
    ],
    featured: false,
    isActive: true,
  },
  {
    id: 'consult_006',
    slug: 'chakra-checking-cleansing',
    name: 'Chakra Checking & Cleansing',
    shortDescription: 'Diagnostic assessment and cleansing of your energy centres.',
    longDescription: 'A focused session to check the state of your chakras, identify imbalances, and perform cleansing to restore energetic health.',
    packages: [],
    featured: false,
    isActive: true,
  },
  {
    id: 'consult_007',
    slug: 'astrology',
    name: 'Astrology',
    shortDescription: 'Vedic astrological guidance for life decisions and understanding your cosmic blueprint.',
    longDescription: 'Vedic astrology provides insights into your karmic patterns, planetary influences, and life trajectory based on your birth chart.',
    packages: [],
    featured: true,
    isActive: true,
  },
  {
    id: 'consult_008',
    slug: 'numerology',
    name: 'Numerology',
    shortDescription: 'Discover the spiritual significance of numbers in your life.',
    longDescription: 'Numerology reveals the vibrational patterns encoded in your name and birth date, offering guidance on timing, compatibility, and life purpose.',
    packages: [],
    featured: false,
    isActive: true,
  },
  {
    id: 'consult_009',
    slug: 'spelling-correction',
    name: 'Spelling Correction',
    shortDescription: 'Numerological name correction for harmonious vibrations.',
    longDescription: 'Based on numerological analysis, subtle corrections to the spelling of your name can shift the vibrational energy to better support your life goals.',
    packages: [],
    featured: false,
    isActive: true,
  },
];

export function getActiveConsultations(): ConsultationService[] {
  return consultations.filter(c => c.isActive);
}

export function getFeaturedConsultations(): ConsultationService[] {
  return consultations.filter(c => c.isActive && c.featured);
}

export function getConsultationBySlug(slug: string): ConsultationService | undefined {
  return consultations.find(c => c.slug === slug);
}
