import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Customer } from '../types/store';
import { initialCustomers } from '../data/customers';

interface RegisterInput {
  store_id: string;
  name: string;
  email: string;
  password: string;
}

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface CustomerCtx {
  customers: Customer[];
  currentCustomer: Customer | null;
  authOpen: 'login' | 'register' | null;
  openAuth: (mode: 'login' | 'register') => void;
  closeAuth: () => void;
  login: (email: string, password: string, storeId: string) => AuthResult;
  register: (data: RegisterInput) => AuthResult;
  logout: () => void;
}

const Ctx = createContext<CustomerCtx | null>(null);
const CUSTOMERS_KEY = 'mercatus.customers';
const SESSION_KEY = 'mercatus.customer';

function loadCustomers(): Customer[] {
  try {
    const raw = localStorage.getItem(CUSTOMERS_KEY);
    if (raw) return JSON.parse(raw) as Customer[];
  } catch {
    /* ignore */
  }
  return initialCustomers;
}

function loadSession(): Customer | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw) as Customer;
  } catch {
    /* ignore */
  }
  return null;
}

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(loadCustomers);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(loadSession);
  const [authOpen, setAuthOpen] = useState<'login' | 'register' | null>(null);

  function openAuth(mode: 'login' | 'register') {
    setAuthOpen(mode);
  }

  function closeAuth() {
    setAuthOpen(null);
  }

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
    } catch {
      /* ignore */
    }
  }, [customers]);

  useEffect(() => {
    try {
      if (currentCustomer) localStorage.setItem(SESSION_KEY, JSON.stringify(currentCustomer));
      else localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }, [currentCustomer]);

  function login(email: string, password: string, storeId: string): AuthResult {
    const customer = customers.find(
      (c) => c.store_id === storeId && c.email.toLowerCase() === email.trim().toLowerCase(),
    );
    if (!customer) return { ok: false, error: 'No existe una cuenta con ese correo en esta tienda.' };
    if (customer.password !== password) return { ok: false, error: 'Contraseña incorrecta.' };
    setCurrentCustomer(customer);
    return { ok: true };
  }

  function register(data: RegisterInput): AuthResult {
    const email = data.email.trim().toLowerCase();
    if (customers.some((c) => c.store_id === data.store_id && c.email.toLowerCase() === email)) {
      return { ok: false, error: 'Ese correo ya está registrado en esta tienda.' };
    }
    const newCustomer: Customer = {
      id: `c-${crypto.randomUUID().slice(0, 8)}`,
      store_id: data.store_id,
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password,
    };
    setCustomers((prev) => [...prev, newCustomer]);
    setCurrentCustomer(newCustomer);
    return { ok: true };
  }

  function logout() {
    setCurrentCustomer(null);
  }

  return (
    <Ctx.Provider value={{ customers, currentCustomer, authOpen, openAuth, closeAuth, login, register, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCustomer(): CustomerCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCustomer debe usarse dentro de <CustomerProvider>');
  return ctx;
}
