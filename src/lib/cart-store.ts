'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './types';

interface CartStore {
  items: CartItem[];
  dakshinaAmount: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  toggleEnergization: (productId: string, variantId?: string) => void;
  setDakshina: (amount: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getEnergizationTotal: () => number;
  getTotal: () => number;
}

const ENERGIZATION_PRICE = 125;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      dakshinaAmount: 0,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.variantId === item.variantId
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
            (i) => !(i.productId === productId && i.variantId === variantId)
          ),
        })),

      updateQuantity: (productId, quantity, variantId) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (i) => !(i.productId === productId && i.variantId === variantId)
                )
              : state.items.map((i) =>
                  i.productId === productId && i.variantId === variantId
                    ? { ...i, quantity }
                    : i
                ),
        })),

      toggleEnergization: (productId, variantId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.variantId === variantId
              ? { ...i, energization: !i.energization }
              : i
          ),
        })),

      setDakshina: (amount) => set({ dakshinaAmount: amount }),

      clearCart: () => set({ items: [], dakshinaAmount: 0 }),

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.priceSnapshot * i.quantity, 0),

      getEnergizationTotal: () =>
        get().items.reduce(
          (sum, i) => sum + (i.energization ? ENERGIZATION_PRICE * i.quantity : 0),
          0
        ),

      getTotal: () => {
        const state = get();
        return (
          state.getSubtotal() +
          state.getEnergizationTotal() +
          state.dakshinaAmount
        );
      },
    }),
    { name: 'tantrra-cart' }
  )
);
