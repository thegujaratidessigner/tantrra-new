export const SERVICE_KINDS = {
  consultation: { label: 'Consultations', idPrefix: 'consult_', group: 'consultation' as const, single: 'consultation package' },
  puja: { label: 'Puja', idPrefix: 'puja_', group: null, single: 'Puja' },
  'chadava-deity': { label: 'Deity Anushthan', idPrefix: 'deity_', group: null, single: 'Deity offering' },
  'chadava-navagraha': { label: 'Navagraha', idPrefix: 'navagraha_', group: 'navagraha-day' as const, single: 'Navagraha offering' },
  'chadava-tithi': { label: 'Tithi & Tewar', idPrefix: 'tithi_', group: null, single: 'Tithi Poojan' },
  'daan-seva': { label: 'Daan Seva', idPrefix: 'daan_', group: null, single: 'Daan category' },
} as const;

export type ServiceKind = keyof typeof SERVICE_KINDS;
export const isServiceKind = (v: unknown): v is ServiceKind => typeof v === 'string' && v in SERVICE_KINDS;

export const TITHI_ICONS = ['shiva', 'devi', 'bhairav', 'moon', 'diya', 'lotus', 'ganesha'] as const;
