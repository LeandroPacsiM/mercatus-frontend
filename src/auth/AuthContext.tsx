import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Role } from '../types/store';
import { seedUsers } from '../data/users';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: Role;
}

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface AuthContextValue {
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => AuthResult;
  register: (data: RegisterInput) => AuthResult;
  logout: () => void;
  updateProfile: (data: { name: string; email: string }) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = 'mercatus.session';
const USERS_KEY = 'mercatus.users';

function loadUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw) as User[];
  } catch {
    /* ignore */
  }
  return seedUsers;
}

function loadSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw) as User;
  } catch {
    /* ignore */
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(loadUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(loadSession);

  useEffect(() => {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch {
      /* ignore */
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
      else localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }, [currentUser]);

  function login(email: string, password: string): AuthResult {
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) return { ok: false, error: 'No existe una cuenta con ese correo.' };
    if (user.password !== password) return { ok: false, error: 'Contraseña incorrecta.' };
    setCurrentUser(user);
    return { ok: true };
  }

  function register(data: RegisterInput): AuthResult {
    const email = data.email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === email)) {
      return { ok: false, error: 'Ese correo ya está registrado.' };
    }
    const newUser: User = {
      id: `u-${crypto.randomUUID().slice(0, 8)}`,
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password,
      role: data.role,
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { ok: true };
  }

  function logout() {
    setCurrentUser(null);
  }

  function updateProfile(data: { name: string; email: string }) {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, name: data.name, email: data.email };
    setUsers((prev) => prev.map((user) => user.id === currentUser.id ? updatedUser : user));
    setCurrentUser(updatedUser);
  }

  return (
    <AuthContext.Provider value={{ currentUser, users, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
