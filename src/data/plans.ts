import type { Plan } from '../types/store';

export const initialPlans: Plan[] = [
  {
    id: 'plan-gratis',
    name: 'Gratis',
    priceMonthly: 0,
    productLimit: 5,
    features: [
      'Hasta 5 productos',
      '1 tienda incluida',
      'Inventario básico',
      'Soporte por comunidad',
    ],
  },
  {
    id: 'plan-basico',
    name: 'Básico',
    priceMonthly: 29,
    productLimit: 10,
    features: [
      'Hasta 10 productos',
      'Tiendas ilimitadas',
      'Inventario avanzado',
      'Reportes de pedidos',
      'Soporte por email',
    ],
  },
  {
    id: 'plan-pro',
    name: 'Pro',
    priceMonthly: 99,
    productLimit: 9999,
    features: [
      'Productos ilimitados',
      'Tiendas ilimitadas',
      'Dashboard con analytics',
      'Gestión de roles',
      'Soporte prioritario',
    ],
  },
];
