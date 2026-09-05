import type { Order } from '../types/store';

const TECH_STORE = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
const GAMING_ZONE = 'c69d34e5-7b0f-4a23-9d42-2e3f4a5b6c7d';

export const initialOrders: Order[] = [
  // Tech Store
  { id: 'ord-ts-47', code: 'TS-2047', store_id: TECH_STORE, user_id: 'u-101', customerName: 'Ana Torres', status: 'PENDING', total: 3598.9, created_at: '2026-08-23T10:15:00' },
  { id: 'ord-ts-46', code: 'TS-2046', store_id: TECH_STORE, user_id: 'u-102', customerName: 'Luis Ramírez', status: 'DELIVERED', total: 1899.0, created_at: '2026-08-22T14:30:00' },
  { id: 'ord-ts-45', code: 'TS-2045', store_id: TECH_STORE, user_id: 'u-103', customerName: 'María Quispe', status: 'SHIPPED', total: 428.8, created_at: '2026-08-21T09:45:00' },
  { id: 'ord-ts-44', code: 'TS-2044', store_id: TECH_STORE, user_id: 'u-104', customerName: 'Diego Solís', status: 'CONFIRMED', total: 249.9, created_at: '2026-08-20T16:20:00' },
  { id: 'ord-ts-43', code: 'TS-2043', store_id: TECH_STORE, user_id: 'u-105', customerName: 'Sofía Castillo', status: 'CANCELLED', total: 899.0, created_at: '2026-08-19T11:05:00' },

  // Gaming Zone
  { id: 'ord-gz-112', code: 'GZ-1112', store_id: GAMING_ZONE, user_id: 'u-201', customerName: 'Kevin Rojas', status: 'PENDING', total: 728.9, created_at: '2026-08-23T08:40:00' },
  { id: 'ord-gz-111', code: 'GZ-1111', store_id: GAMING_ZONE, user_id: 'u-202', customerName: 'Bruno Díaz', status: 'DELIVERED', total: 2499.0, created_at: '2026-08-22T19:10:00' },
  { id: 'ord-gz-110', code: 'GZ-1110', store_id: GAMING_ZONE, user_id: 'u-203', customerName: 'Valeria Núñez', status: 'SHIPPED', total: 549.0, created_at: '2026-08-21T13:25:00' },
  { id: 'ord-gz-109', code: 'GZ-1109', store_id: GAMING_ZONE, user_id: 'u-204', customerName: 'Oscar Mendoza', status: 'CONFIRMED', total: 219.8, created_at: '2026-08-20T17:55:00' },
  { id: 'ord-gz-108', code: 'GZ-1108', store_id: GAMING_ZONE, user_id: 'u-205', customerName: 'Camila Vargas', status: 'PENDING', total: 179.9, created_at: '2026-08-19T12:30:00' },
];
