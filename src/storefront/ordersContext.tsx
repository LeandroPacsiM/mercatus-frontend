import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Order, OrderItem } from '../types/store';
import { initialOrders } from '../data/orders';
import { initialOrderItems } from '../data/orderItems';

interface OrdersCtx {
  orders: Order[];
  orderItems: OrderItem[];
  addOrder: (o: Order, items: OrderItem[]) => void;
  updateOrder: (o: Order) => void;
}

const Ctx = createContext<OrdersCtx | null>(null);
const STORAGE_KEY = 'mercatus_orders';
const ITEMS_KEY = 'mercatus_order_items';

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Order[];
  } catch {
    /* ignore */
  }
  return initialOrders;
}

function loadItems(): OrderItem[] {
  try {
    const raw = localStorage.getItem(ITEMS_KEY);
    if (raw) return JSON.parse(raw) as OrderItem[];
  } catch {
    /* ignore */
  }
  return initialOrderItems;
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(loadOrders);
  const [orderItems, setOrderItems] = useState<OrderItem[]>(loadItems);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(ITEMS_KEY, JSON.stringify(orderItems));
  }, [orderItems]);

  function addOrder(o: Order, items: OrderItem[]) {
    setOrders((prev) => [o, ...prev]);
    setOrderItems((prev) => [...items, ...prev]);
  }

  function updateOrder(updated: Order) {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  }

  return <Ctx.Provider value={{ orders, orderItems, addOrder, updateOrder }}>{children}</Ctx.Provider>;
}

export function useOrders(): OrdersCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useOrders must be used within OrdersProvider');
  return c;
}
