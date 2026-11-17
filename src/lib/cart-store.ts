'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, ProductCartItem, ServiceCartItem } from './types';

interface CartStore {
  items: CartItem[];
  dakshinaAmount: number;
  addItem: (item: ProductCartItem) => void;
  addServiceItem: (item: ServiceCartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  removeServiceItem: (serviceId: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  toggleEnergization: (productId: string, variantId?: string) => void;
  setDakshina: (amount: number) => void;
  applyPriceUpdates: (updates: { index: number; priceSnapshot: number }[]) => void;
  clearCart: () => void;
  getItemCount: () => number;
  hasProducts: () => boolean;
  hasServices: () => boolean;
}

function migrateCartItems(items: CartItem[]): CartItem[] {
  return items.map((item) => {
    if (!('type' in item) || !item.type) {
      return { ...(item as Record<string, unknown>), type: 'product' } as ProductCartItem;
    }
    return item;
  });
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      dakshinaAmount: 0,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.type === 'product' &&
              i.productId === item.productId &&
              i.variantId === item.variantId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.type === 'product' &&
                i.productId === item.productId &&
                i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      addServiceItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.type === 'service' && i.serviceId === item.serviceId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.type === 'service' && i.serviceId === item.serviceId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),

      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(
                i.type === 'product' &&
                i.productId === productId &&
                i.variantId === variantId
              )
          ),
        })),

      removeServiceItem: (serviceId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.type === 'service' && i.serviceId === serviceId)
          ),
        })),

      updateQuantity: (productId, quantity, variantId) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (i) =>
                    !(
                      i.type === 'product' &&
                      i.productId === productId &&
                      i.variantId === variantId
                    )
                )
              : state.items.map((i) =>
                  i.type === 'product' &&
                  i.productId === productId &&
                  i.variantId === variantId
                    ? { ...i, quantity }
                    : i
                ),
        })),

      toggleEnergization: (productId, variantId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.type === 'product' &&
            i.productId === productId &&
            i.variantId === variantId
              ? { ...i, energization: !i.energization }
              : i
          ),
        })),

      setDakshina: (amount) => set({ dakshinaAmount: amount }),

      applyPriceUpdates: (updates) =>
        set((state) => ({
          items: state.items.map((item, index) => {
            const update = updates.find((u) => u.index === index);
            return update ? { ...item, priceSnapshot: update.priceSnapshot } : item;
          }),
        })),

      clearCart: () => set({ items: [], dakshinaAmount: 0 }),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      hasProducts: () => get().items.some((i) => i.type === 'product'),
      hasServices: () => get().items.some((i) => i.type === 'service'),
    }),
    {
      name: 'tantrra-cart',
      version: 1,
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as Record<string, unknown>;
        if (version === 0 || !version) {
          const items = Array.isArray(state.items) ? migrateCartItems(state.items as CartItem[]) : [];
          return { ...state, items };
        }
        return state;
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.items = migrateCartItems(state.items);
        }
      },
    }
  )
);
