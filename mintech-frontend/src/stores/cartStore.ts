import { create } from 'zustand';
import { CartItem, Product, ProductVariant } from '../types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  updateQuantity: (productVariantId: string, delta: number) => void;
  removeItem: (productVariantId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const LOCAL_STORAGE_KEY = 'mintech_cart_items';

const getInitialItems = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  items: getInitialItems(),
  isOpen: false,

  setIsOpen: (open) => set({ isOpen: open }),

  addItem: (product, variant, quantity = 1) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (i) => i.productVariantId === variant.id
      );

      let newItems: CartItem[];
      if (existingIndex > -1) {
        newItems = [...state.items];
        const current = newItems[existingIndex];
        const newQty = current.quantity + quantity;
        newItems[existingIndex] = {
          ...current,
          quantity: newQty,
          subtotal: newQty * current.price,
        };
      } else {
        const newItem: CartItem = {
          cartItemId: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
          productVariantId: variant.id,
          productName: product.name,
          color: variant.color,
          sku: variant.sku,
          price: variant.price,
          quantity: quantity,
          subtotal: variant.price * quantity,
          thumbnailUrl: product.thumbnailUrl,
        };
        newItems = [...state.items, newItem];
      }

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newItems));
      return { items: newItems, isOpen: true };
    });
  },

  updateQuantity: (productVariantId, delta) => {
    set((state) => {
      const newItems = state.items
        .map((item) => {
          if (item.productVariantId === productVariantId) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return {
              ...item,
              quantity: nextQty,
              subtotal: nextQty * item.price,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  removeItem: (productVariantId) => {
    set((state) => {
      const newItems = state.items.filter((i) => i.productVariantId !== productVariantId);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newItems));
      return { items: newItems };
    });
  },

  clearCart: () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    set({ items: [] });
  },

  getTotalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce((sum, item) => sum + item.subtotal, 0);
  },
}));

