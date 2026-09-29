import { SevaCategory } from '@/lib/types';

// ─── A. DEITY ANUSHTHAN ────────────────────────────

export interface DeityOffering {
  id: string;
  deity: string;
  tier: string;
  name: string;
  price: number;
}

export const deityAnushthan: DeityOffering[] = [
  { id: 'deity_001', deity: 'Maa Kamakhya', tier: 'panchopchar', name: 'Maa Kamakhya Offering — Panchopchar Poojan', price: 251 },
  { id: 'deity_002', deity: 'Maa Kamakhya', tier: 'maha', name: 'Maa Kamakhya Offering — Maha Poojan', price: 521 },
  { id: 'deity_003', deity: 'Sadashiv', tier: 'panchopchar', name: 'Sadashiv Offering — Panchopchar Poojan', price: 251 },
  { id: 'deity_004', deity: 'Sadashiv', tier: 'maha', name: 'Sadashiv Offering — Maha Poojan', price: 521 },
  { id: 'deity_005', deity: 'Dash Mahavidya', tier: 'panchopchar', name: 'Dash Mahavidya Poojan — Panchopchar Poojan', price: 1051 },
  { id: 'deity_006', deity: 'Dash Mahavidya', tier: 'maha', name: 'Dash Mahavidya Poojan — Maha Poojan', price: 1511 },
];

// ─── B. NAVAGRAHA POOJAN & CHADAVA ────────────────────────────

export interface NavagrahaOffering {
  id: string;
  name: string;
  nameHindi: string;
  price: number;
}

export interface NavagrahaDay {
  id: string;
  dayEnglish: string;
  dayHindi: string;
  grahas: {
    name: string;
    offerings: NavagrahaOffering[];
  }[];
}

export const navagrahaShanti = {
  id: 'nav_shanti',
  name: 'Navagraha Shanti Chadava',
  price: 251,
  description: 'A combined traditional Navagraha offering.',
  includes: [
    'Gehu / Wheat',
    'Chawal / Rice',
    'Lal Masoor',
    'Moong',
    'Chana Dal',
    'Safed Til',
    'Kaale Urad',
    'Durva Ghas',
    'Horse Grain / Kunthi',
  ],
  panchopchar: ['Dhoop', 'Deepam', 'Pushpa', 'Gandham', 'Naivedya'],
  note: 'Edible and usable Chadava offerings are respectfully distributed to needy people and animals after the seva, so that the offerings are put to meaningful use and not wasted.',
};

export const navagrahaDays: NavagrahaDay[] = [
  {
    id: 'day_mon',
    dayEnglish: 'Monday',
    dayHindi: 'Somvar',
    grahas: [{
      name: 'Chandra',
      offerings: [
        { id: 'mon_01', name: 'Doodh / Milk', nameHindi: 'दूध', price: 25 },
        { id: 'mon_02', name: 'Akshad / Chawal / Rice', nameHindi: 'अक्षत / चावल', price: 51 },
        { id: 'mon_03', name: 'Safed Pushp / White Flower', nameHindi: 'सफ़ेद पुष्प', price: 25 },
        { id: 'mon_04', name: 'Safed Kapda / White Cloth', nameHindi: 'सफ़ेद कपड़ा', price: 151 },
      ],
    }],
  },
  {
    id: 'day_tue',
    dayEnglish: 'Tuesday',
    dayHindi: 'Mangalvar',
    grahas: [
      {
        name: 'Mangal',
        offerings: [
          { id: 'tue_m01', name: 'Lal Pushp / Red Flower', nameHindi: 'लाल पुष्प', price: 25 },
          { id: 'tue_m02', name: 'Sindoor / Kumkum', nameHindi: 'सिन्दूर / कुमकुम', price: 25 },
          { id: 'tue_m03', name: 'Lal Kapda / Red Cloth', nameHindi: 'लाल कपड़ा', price: 151 },
          { id: 'tue_m04', name: 'Nariyal / Coconut', nameHindi: 'नारियल', price: 51 },
          { id: 'tue_m05', name: 'Solah Shringaar', nameHindi: 'सोलह श्रृंगार', price: 251 },
        ],
      },
      {
        name: 'Ketu',
        offerings: [
          { id: 'tue_k01', name: 'Kunthi / Horse Grain', nameHindi: 'कुन्थी', price: 51 },
          { id: 'tue_k02', name: 'Mix Fresh Flower', nameHindi: 'मिक्स फ्रेश फ्लावर', price: 25 },
          { id: 'tue_k03', name: 'Safed Til / White Sesame', nameHindi: 'सफ़ेद तिल', price: 25 },
          { id: 'tue_k04', name: 'Kambal / Blanket', nameHindi: 'कम्बल', price: 251 },
        ],
      },
    ],
  },
  {
    id: 'day_wed',
    dayEnglish: 'Wednesday',
    dayHindi: 'Budhvar',
    grahas: [{
      name: 'Budh',
      offerings: [
        { id: 'wed_01', name: 'Durva Grass', nameHindi: 'दूर्वा', price: 51 },
        { id: 'wed_02', name: 'Hara Moong Dal / Green Moong', nameHindi: 'हरा मूंग दाल', price: 51 },
        { id: 'wed_03', name: 'Hara Kapda / Green Cloth', nameHindi: 'हरा कपड़ा', price: 151 },
        { id: 'wed_04', name: 'Mehendi', nameHindi: 'मेहंदी', price: 51 },
        { id: 'wed_05', name: 'Green Shringaar', nameHindi: 'हरा श्रृंगार', price: 151 },
      ],
    }],
  },
  {
    id: 'day_thu',
    dayEnglish: 'Thursday',
    dayHindi: 'Guruvar',
    grahas: [{
      name: 'Brihaspati',
      offerings: [
        { id: 'thu_01', name: 'Kela / Banana', nameHindi: 'केला', price: 51 },
        { id: 'thu_02', name: 'Pili Mithai / Yellow Sweet', nameHindi: 'पीली मिठाई', price: 151 },
        { id: 'thu_03', name: 'Pile Pushp / Yellow Flower', nameHindi: 'पीले पुष्प', price: 25 },
        { id: 'thu_04', name: 'Haldi / Turmeric', nameHindi: 'हल्दी', price: 55 },
        { id: 'thu_05', name: 'Dharmic Pustak / Spiritual Book', nameHindi: 'धार्मिक पुस्तक', price: 251 },
        { id: 'thu_06', name: 'Pili Dal / Yellow Dal', nameHindi: 'पीली दाल', price: 51 },
        { id: 'thu_07', name: 'Pile Kapde / Yellow Cloth', nameHindi: 'पीले कपड़े', price: 151 },
        { id: 'thu_08', name: 'Pila Naivedhya', nameHindi: 'पीला नैवेद्य', price: 151 },
      ],
    }],
  },
  {
    id: 'day_fri',
    dayEnglish: 'Friday',
    dayHindi: 'Shukravar',
    grahas: [{
      name: 'Shukra',
      offerings: [
        { id: 'fri_01', name: 'Safed Pushp / White Flower', nameHindi: 'सफ़ेद पुष्प', price: 51 },
        { id: 'fri_02', name: 'Gulab / Rose', nameHindi: 'गुलाब', price: 51 },
        { id: 'fri_03', name: 'Safed Kapde / White Cloth', nameHindi: 'सफ़ेद कपड़े', price: 151 },
        { id: 'fri_04', name: 'Chawal / Rice', nameHindi: 'चावल', price: 51 },
        { id: 'fri_05', name: 'Itra / Perfume', nameHindi: 'इत्र', price: 151 },
        { id: 'fri_06', name: 'Panchamrit Abhishek', nameHindi: 'पंचामृत अभिषेक', price: 151 },
      ],
    }],
  },
  {
    id: 'day_sat',
    dayEnglish: 'Saturday',
    dayHindi: 'Shanivar',
    grahas: [
      {
        name: 'Shani',
        offerings: [
          { id: 'sat_s01', name: 'Sarso Tel / Mustard Oil', nameHindi: 'सरसों तेल', price: 151 },
          { id: 'sat_s02', name: 'Kaale Til / Black Sesame', nameHindi: 'काले तिल', price: 51 },
          { id: 'sat_s03', name: 'Chappal', nameHindi: 'चप्पल', price: 151 },
          { id: 'sat_s04', name: 'Khadau / Traditional Indian Footwear', nameHindi: 'खड़ाऊँ', price: 251 },
          { id: 'sat_s05', name: 'Kaale Kapde / Black Cloth', nameHindi: 'काले कपड़े', price: 151 },
          { id: 'sat_s06', name: 'Kaale Urad Dal / Black Urad', nameHindi: 'काले उड़द दाल', price: 51 },
        ],
      },
      {
        name: 'Rahu',
        offerings: [
          { id: 'sat_r01', name: 'Durva Ghas', nameHindi: 'दूर्वा घास', price: 25 },
          { id: 'sat_r02', name: 'Neela Phool / Blue Flower', nameHindi: 'नीला फूल', price: 25 },
          { id: 'sat_r03', name: 'Kaale Urad', nameHindi: 'काले उड़द', price: 51 },
          { id: 'sat_r04', name: 'Neele Vastra / Blue Cloth', nameHindi: 'नीले वस्त्र', price: 151 },
          { id: 'sat_r05', name: 'Kaale Til / Black Sesame', nameHindi: 'काले तिल', price: 51 },
        ],
      },
    ],
  },
  {
    id: 'day_sun',
    dayEnglish: 'Sunday',
    dayHindi: 'Ravivar',
    grahas: [{
      name: 'Surya',
      offerings: [
        { id: 'sun_01', name: 'Lal Pushp / Red Flower', nameHindi: 'लाल पुष्प', price: 25 },
        { id: 'sun_02', name: 'Gud / Jaggery', nameHindi: 'गुड़', price: 51 },
        { id: 'sun_03', name: 'Gehu / Wheat', nameHindi: 'गेहूँ', price: 51 },
        { id: 'sun_04', name: 'Jal Mishrit Kumkum', nameHindi: 'जल मिश्रित कुमकुम', price: 25 },
        { id: 'sun_05', name: 'Tambe ke Lote mein Jal', nameHindi: 'ताम्बे के लोटे में जल', price: 51 },
      ],
    }],
  },
];

// ─── C. TITHI & TEWAR PANCHOPCHAR POOJAN ────────────────────────────

export interface TithiPoojan {
  id: string;
  name: string;
  deity: string;
  price: number;
}

export const tithiPoojan: TithiPoojan[] = [
  { id: 'tithi_001', name: 'Maasik Shivratri', deity: 'Shivji', price: 151 },
  { id: 'tithi_002', name: 'Maasik Durga Ashtami', deity: 'Navdurga / Devi', price: 151 },
  { id: 'tithi_003', name: 'Maasik Kaal Ashtami', deity: 'Bhairav', price: 151 },
  { id: 'tithi_004', name: 'Purnima', deity: '', price: 151 },
  { id: 'tithi_005', name: 'Amavasya', deity: 'Pitr / Ancestral Observance', price: 151 },
  { id: 'tithi_006', name: 'Pradosh', deity: 'Shivji', price: 151 },
  { id: 'tithi_007', name: 'Ekadashi', deity: 'Shri Krishna / Narayan', price: 151 },
  { id: 'tithi_008', name: 'Sankashti Chaturthi', deity: '', price: 151 },
  { id: 'tithi_009', name: 'Vinayak Chaturthi', deity: '', price: 151 },
];

export const panchopcharItems = ['Dhoop', 'Deepam', 'Pushpa', 'Gandham', 'Naivedya'] as const;

// ─── D. DAAN SEVA ────────────────────────────
// Re-exported from pujas.ts sevaCategories — moved here conceptually

export const daanSevaCategories: SevaCategory[] = [
  { id: 'seva_001', slug: 'brahmin-seva', name: 'Brahmin Seva', description: 'Support Brahmin families and their spiritual service to the community.', amounts: [101, 501, 1100], allowCustom: true, isActive: true, image: '/images/tantrra/puja-chadava/brahman-bhojan-desktop.jpg' },
  { id: 'seva_002', slug: 'needy-people-seva', name: 'Needy People Seva', description: 'Contribute to the welfare and support of those in need.', amounts: [101, 501, 1100], allowCustom: true, isActive: true, image: '/images/tantrra/puja-chadava/garib-seva-desktop.jpg' },
  { id: 'seva_003', slug: 'gau-seva', name: 'Gau Seva', description: 'Contribute to the care and protection of cows.', amounts: [101, 251, 501], allowCustom: true, isActive: true, image: '/images/tantrra/puja-chadava/gau-seva-desktop.jpg' },
  { id: 'seva_004', slug: 'kanya-pujan', name: 'Kanya Pujan', description: 'Support sacred Kanya Pujan rituals honouring young girls as forms of the Divine Mother.', amounts: [101, 501, 1100], allowCustom: true, isActive: true, image: '/images/tantrra/puja-chadava/kanya-puja-desktop.jpg' },
  { id: 'seva_005', slug: 'vriddha-seva', name: 'Vriddha Seva', description: 'Contribute to the care and support of elderly individuals.', amounts: [101, 501, 1100], allowCustom: true, isActive: true, image: '/images/tantrra/puja-chadava/vriddh-seva-desktop.jpg' },
];

export function getActiveDaanSeva(): SevaCategory[] {
  return daanSevaCategories.filter(s => s.isActive);
}
