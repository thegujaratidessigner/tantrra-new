import { Puja, SevaCategory } from '@/lib/types';

export const pujas: Puja[] = [
  { id: 'puja_001', slug: 'navagraha-shanti', name: 'Navagraha Shanti Puja', shortDescription: 'Pacify the influence of all nine planets for harmony and balance.', purpose: 'Planetary peace and balance', isRequestOnly: true, featured: true, isActive: true },
  { id: 'puja_002', slug: 'navachandi', name: 'Navachandi Puja', shortDescription: 'Powerful nine-day invocation of Goddess Chandi for protection and blessings.', purpose: 'Protection and divine blessings', isRequestOnly: true, featured: true, isActive: true },
  { id: 'puja_003', slug: 'durga-saptashati', name: 'Durga Saptashati Puja', shortDescription: 'Recitation and ritual of the 700 verses dedicated to Goddess Durga.', purpose: 'Divine protection and empowerment', isRequestOnly: true, featured: false, isActive: true },
  { id: 'puja_004', slug: 'tridevi', name: 'Tridevi Puja', shortDescription: 'Invoke the blessings of Lakshmi, Saraswati, and Parvati together.', purpose: 'Wealth, wisdom, and power', isRequestOnly: true, featured: false, isActive: true },
  { id: 'puja_005', slug: 'mahakali-havan', name: 'Mahakali Havan', shortDescription: 'Sacred fire ritual dedicated to Mahakali for powerful protection.', purpose: 'Intense protection and negativity removal', isRequestOnly: true, featured: true, isActive: true },
  { id: 'puja_006', slug: 'durga-kavach-puja', name: 'Durga Kavach Puja', shortDescription: 'Sacred ritual to invoke the protective armour of Goddess Durga.', purpose: 'Divine protective shield', isRequestOnly: true, featured: false, isActive: true },
  { id: 'puja_007', slug: 'kali-kavach-puja', name: 'Kali Kavach Puja', shortDescription: 'Ritual invocation of Maa Kali\'s protective Kavach.', purpose: 'Kali\'s divine protection', isRequestOnly: true, featured: false, isActive: true },
  { id: 'puja_008', slug: 'kamakhya-kavach-puja', name: 'Kamakhya Kavach Puja', shortDescription: 'Sacred ritual in the Kamakhya tradition for protection and blessings.', purpose: 'Kamakhya protection and blessings', isRequestOnly: true, featured: false, isActive: true },
  { id: 'puja_009', slug: 'deepdaan', name: 'Deepdaan', shortDescription: 'Sacred offering of light to dispel darkness and invite divine blessings.', purpose: 'Dispelling negativity and inviting light', isRequestOnly: true, featured: false, isActive: true },
  { id: 'puja_010', slug: 'dhanvriddhi', name: 'Dhanvriddhi Puja', shortDescription: 'Sacred ritual traditionally associated with wealth and financial growth.', purpose: 'Wealth growth and prosperity', isRequestOnly: true, featured: false, isActive: true },
  { id: 'puja_011', slug: 'financial-protection', name: 'Financial Protection Pujan', shortDescription: 'Ritual for protection against financial difficulties and losses.', purpose: 'Financial stability and protection', isRequestOnly: true, featured: false, isActive: true },
  { id: 'puja_012', slug: 'kamakhya-shri-vidya', name: 'Maa Kamakhya — Shri Vidya', shortDescription: 'Advanced Shri Vidya practice in the Kamakhya tradition.', purpose: 'Spiritual awakening and divine knowledge', isRequestOnly: true, featured: false, isActive: true },
  { id: 'puja_kamakhya_direct', slug: 'kamakhya-direct', name: 'Maa Kamakhya — Direct', shortDescription: 'Direct invocation of Maa Kamakhya for specific spiritual needs.', purpose: 'Direct divine connection and guidance', isRequestOnly: true, featured: false, isActive: true },
  { id: 'puja_bhairav', slug: 'bhairav-puja', name: 'Bhairav Puja', shortDescription: 'Sacred ritual dedicated to Lord Bhairav for protection and fearlessness.', purpose: 'Protection and obstacle removal', isRequestOnly: true, featured: true, isActive: true },
  { id: 'puja_hanuman', slug: 'hanuman-puja', name: 'Hanuman Puja', shortDescription: 'Sacred ritual dedicated to Lord Hanuman for strength and courage.', purpose: 'Strength, courage, and protection', isRequestOnly: true, featured: false, isActive: true },
  { id: 'puja_016', slug: 'kuldevi-special', name: 'Kuldevi Special Pujan', shortDescription: 'Personalised ritual dedicated to your family\'s ancestral goddess.', purpose: 'Ancestral blessings and family harmony', isRequestOnly: true, featured: false, isActive: true },
];

export const sevaCategories: SevaCategory[] = [
  { id: 'seva_001', slug: 'brahmin-seva', name: 'Brahmin Seva', description: 'Support Brahmin families and their spiritual service to the community.', amounts: [101, 501, 1100], allowCustom: true, isActive: true },
  { id: 'seva_002', slug: 'needy-people-seva', name: 'Needy People Seva', description: 'Contribute to the welfare and support of those in need.', amounts: [101, 501, 1100], allowCustom: true, isActive: true },
  { id: 'seva_003', slug: 'gau-seva', name: 'Gau Seva', description: 'Contribute to the care and protection of cows.', amounts: [101, 251, 501], allowCustom: true, isActive: true },
  { id: 'seva_004', slug: 'kanya-pujan', name: 'Kanya Pujan', description: 'Support sacred Kanya Pujan rituals honouring young girls as forms of the Divine Mother.', amounts: [101, 501, 1100], allowCustom: true, isActive: true },
  { id: 'seva_005', slug: 'vriddha-seva', name: 'Vriddha Seva', description: 'Contribute to the care and support of elderly individuals.', amounts: [101, 501, 1100], allowCustom: true, isActive: true },
];

export function getActivePujas(): Puja[] {
  return pujas.filter(p => p.isActive);
}

export function getFeaturedPujas(): Puja[] {
  return pujas.filter(p => p.isActive && p.featured);
}

export function getPujaBySlug(slug: string): Puja | undefined {
  return pujas.find(p => p.slug === slug);
}

export function getActiveSevaCategories(): SevaCategory[] {
  return sevaCategories.filter(s => s.isActive);
}
