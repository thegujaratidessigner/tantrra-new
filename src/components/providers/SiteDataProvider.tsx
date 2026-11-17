'use client';

import { createContext, useContext } from 'react';
import { DEFAULT_SETTINGS, type SiteSettings } from '@/lib/site-settings';
import { DEFAULT_LAYOUT_CONTENT, type LayoutContent } from '@/lib/content/layout-defaults';

interface SiteData {
  settings: SiteSettings;
  layout: LayoutContent;
  /** id → display info for products, so cart/checkout can render items without the catalog bundle. */
  productIndex: Record<string, { name: string; slug: string; category: string; image?: string; energizationAvailable: boolean }>;
}

const SiteDataContext = createContext<SiteData>({
  settings: DEFAULT_SETTINGS,
  layout: DEFAULT_LAYOUT_CONTENT,
  productIndex: {},
});

export function SiteDataProvider({ value, children }: { value: SiteData; children: React.ReactNode }) {
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export const useSiteData = () => useContext(SiteDataContext);
export const useSiteSettings = () => useContext(SiteDataContext).settings;
export const useLayoutContent = () => useContext(SiteDataContext).layout;
