import type { User } from '../types/store';

export const seedUsers: User[] = [
  { id: 'u-000', name: 'Admin Mercatus', email: 'admin@mercatus.app', password: 'admin1234', role: 'ADMINISTRADOR' },
  { id: 'u-001', name: 'Carlos Mendoza', email: 'carlos@mercatus.app', password: 'demo1234', role: 'PROPIETARIO' },
  { id: 'u-002', name: 'Lucía Fernández', email: 'lucia@mercatus.app', password: 'demo1234', role: 'PROPIETARIO' },
];
