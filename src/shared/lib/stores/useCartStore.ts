// RUTA: src/shared/lib/stores/useCartStore.ts
/**
 * @file useCartStore.ts
 * @description Hook de Zustand y SSoT para el estado global del carrito de compras.
 *              v4.0.0 (Declarative Initialization): Simplificado para soportar
 *              una hidratación declarativa desde su componente consumidor principal.
 * @version 4.0.0
 *@author RaZ Podestá - MetaShark Tech
 */
import { create } from "zustand";
import type { Product } from "@/shared/lib/schemas/entities/product.schema";
import { logger } from "@/shared/lib/logging";

// El contrato de CartItem permanece igual.
export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isInitialized: boolean; // Flag para prevenir re-hidratación.
  initialize: (items: CartItem[]) => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  isInitialized: false,
  initialize: (items) => {
    // El store solo se inicializará si aún no lo ha sido.
    if (get().isInitialized) return;
    set({ items, isInitialized: true });
    logger.info(
      `[CartStore] Estado inicial hidratado con ${items.length} items.`
    );
  },
  addItem: (product, quantity = 1) => {
    const { items } = get();
    const existingItem = items.find((item) => item.id === product.id);

    if (existingItem) {
      set({
        items: items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      });
    } else {
      set({ items: [...items, { ...product, quantity }] });
    }
  },
  removeItem: (productId) => {
    set({
      items: get().items.filter((item) => item.id !== productId),
    });
  },
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set({
      items: get().items.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      ),
    });
  },
  clearCart: () => {
    set({ items: [] });
  },
}));

export const useCartTotals = () => {
  const items = useCartStore((state) => state.items);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  return { cartCount, cartTotal };
};
