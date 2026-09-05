import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Product } from '../types/store';

export interface CartItem {
  productId: string;
  storeId: string;
  qty: number;
}

interface CartCtx {
  items: CartItem[];
  storeId: string | null;
  setStore: (id: string) => void;
  add: (p: Product, storeId: string) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  count: number;
}

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = 'mercatus_cart';

interface Persisted {
  items: CartItem[];
  storeId: string | null;
}

function load(): Persisted {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Persisted;
  } catch {
    /* ignore */
  }
  return { items: [], storeId: null };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const initial = load();
  const [items, setItems] = useState<CartItem[]>(initial.items);
  const [storeId, setStoreId] = useState<string | null>(initial.storeId);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, storeId }));
  }, [items, storeId]);

  function setStore(id: string) {
    setStoreId(id);
  }

  function add(p: Product, sid: string) {
    setStoreId(sid);
    setItems((prev) => {
      const found = prev.find((i) => i.productId === p.id);
      if (found) {
        return prev.map((i) => (i.productId === p.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { productId: p.id, storeId: sid, qty: 1 }];
    });
  }

  function remove(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function setQty(productId: string, qty: number) {
    if (qty <= 0) {
      remove(productId);
      return;
    }
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, qty } : i)));
  }

  function clear() {
    setItems([]);
  }

  const count = items.reduce((acc, i) => acc + i.qty, 0);

  return (
    <Ctx.Provider value={{ items, storeId, setStore, add, remove, setQty, clear, count }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart(): CartCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart must be used within CartProvider');
  return c;
}
