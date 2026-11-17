'use client';

import { createContext, useContext } from 'react';
import type { DeityOffering, NavagrahaDay, TithiPoojan } from '@/data/chadava';
import type { SevaCategory } from '@/lib/types';

export interface ChadavaData {
  deityAnushthan: DeityOffering[];
  navagrahaShanti: {
    id: string;
    name: string;
    price: number;
    description: string;
    includes: string[];
    panchopchar: string[];
    note: string;
  } | null;
  navagrahaDays: NavagrahaDay[];
  tithiPoojan: TithiPoojan[];
  daanSeva: SevaCategory[];
  panchopcharItems: string[];
  panchopcharImages: { pujaThali: string; panchopcharItems: string };
}

const ChadavaDataContext = createContext<ChadavaData | null>(null);

export function ChadavaDataProvider({ value, children }: { value: ChadavaData; children: React.ReactNode }) {
  return <ChadavaDataContext.Provider value={value}>{children}</ChadavaDataContext.Provider>;
}

export function useChadavaData(): ChadavaData {
  const ctx = useContext(ChadavaDataContext);
  if (!ctx) throw new Error('useChadavaData must be used inside ChadavaDataProvider');
  return ctx;
}
