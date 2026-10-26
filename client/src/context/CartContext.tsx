import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api, errMessage } from '../lib/api';
import type { Cart } from '../lib/types';
import { useToast } from './ToastContext';

const EMPTY: Cart = {
  items: [],
  count: 0,
  subtotal: 0,
  shippingCost: 0,
  freeShippingThreshold: 0,
  total: 0,
  hasBlockingIssue: false,
  currency: 'تومان',
};

type CartApi = {
  cart: Cart;
  loading: boolean;
  refresh: () => Promise<void>;
  addItem: (productId: string, colorId: string | null, quantity: number) => Promise<boolean>;
  updateItem: (itemId: string, quantity: number) => Promise<boolean>;
  removeItem: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
};

const CartContext = createContext<CartApi | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(EMPTY);
  const [loading, setLoading] = useState(true);
  const { push } = useToast();

  const refresh = useCallback(async () => {
    try {
      const data = await api<{ cart: Cart }>('/cart');
      setCart(data.cart);
    } catch {
      setCart(EMPTY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addItem = useCallback(
    async (productId: string, colorId: string | null, quantity: number) => {
      try {
        const data = await api<{ cart: Cart }>('/cart/items', {
          method: 'POST',
          body: { productId, colorId, quantity },
        });
        setCart(data.cart);
        push('محصول به سبد خرید اضافه شد.');
        return true;
      } catch (error) {
        push(errMessage(error), 'error');
        return false;
      }
    },
    [push]
  );

  const updateItem = useCallback(
    async (itemId: string, quantity: number) => {
      try {
        const data = await api<{ cart: Cart }>(`/cart/items/${itemId}`, { method: 'PATCH', body: { quantity } });
        setCart(data.cart);
        return true;
      } catch (error) {
        push(errMessage(error), 'error');
        return false;
      }
    },
    [push]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      try {
        const data = await api<{ cart: Cart }>(`/cart/items/${itemId}`, { method: 'DELETE' });
        setCart(data.cart);
        push('محصول از سبد خرید حذف شد.', 'info');
      } catch (error) {
        push(errMessage(error), 'error');
      }
    },
    [push]
  );

  const clear = useCallback(async () => {
    try {
      const data = await api<{ cart: Cart }>('/cart', { method: 'DELETE' });
      setCart(data.cart);
    } catch (error) {
      push(errMessage(error), 'error');
    }
  }, [push]);

  const value = useMemo(
    () => ({ cart, loading, refresh, addItem, updateItem, removeItem, clear }),
    [cart, loading, refresh, addItem, updateItem, removeItem, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
