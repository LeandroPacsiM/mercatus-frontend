import type { Product } from '../types/store';

const TECH_STORE = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
const GAMING_ZONE = 'c69d34e5-7b0f-4a23-9d42-2e3f4a5b6c7d';

export const initialProducts: Product[] = [
  // Tech Store
  {
    id: 'p-ts-1', store_id: TECH_STORE, name: 'Laptop UltraBook 14"', description: 'Laptop ligera con procesador i7 y 16GB RAM.', price: 3499.0, stock: 12, active: true, category_id: 'cat-ts-1', fulfillmentType: 'SHIPPING', createdAt: '2026-07-01',
  },
  {
    id: 'p-ts-2', store_id: TECH_STORE, name: 'Auriculares Bluetooth Pro', description: 'Cancelación de ruido activa, 30h batería.', price: 249.9, stock: 40, active: true, category_id: 'cat-ts-2', fulfillmentType: 'SHIPPING', createdAt: '2026-07-03',
  },
  {
    id: 'p-ts-3', store_id: TECH_STORE, name: 'Smartphone Galaxy X', description: 'Pantalla AMOLED 6.5", 256GB.', price: 1899.0, stock: 8, active: true, category_id: 'cat-ts-1', fulfillmentType: 'SHIPPING', createdAt: '2026-07-05',
  },
  {
    id: 'p-ts-4', store_id: TECH_STORE, name: 'Cargador Rápido 65W', description: 'Carga tu equipo al 80% en 35 min. Retiro en tienda disponible.', price: 79.9, stock: 3, active: true, category_id: 'cat-ts-3', fulfillmentType: 'PICKUP', createdAt: '2026-07-06',
  },
  {
    id: 'p-ts-5', store_id: TECH_STORE, name: 'Tablet Note 11', description: 'Ideal para dibujo y productividad.', price: 1299.0, stock: 15, active: true, category_id: 'cat-ts-1', fulfillmentType: 'SHIPPING', createdAt: '2026-07-08',
  },
  {
    id: 'p-ts-6', store_id: TECH_STORE, name: 'Parlante Portátil Mini', description: 'Sonido potente, resistente al agua.', price: 119.9, stock: 0, active: false, category_id: 'cat-ts-2', fulfillmentType: 'SHIPPING', createdAt: '2026-07-10',
  },
  {
    id: 'p-ts-7', store_id: TECH_STORE, name: 'Webcam 4K', description: 'Streaming en alta definición.', price: 189.0, stock: 22, active: true, category_id: 'cat-ts-3', fulfillmentType: 'SHIPPING', createdAt: '2026-07-12',
  },
  {
    id: 'p-ts-8', store_id: TECH_STORE, name: 'Monitor 27" 144Hz', description: 'Perfecto para gaming y diseño.', price: 899.0, stock: 6, active: true, category_id: 'cat-ts-1', fulfillmentType: 'SHIPPING', createdAt: '2026-07-15',
  },
  {
    id: 'p-ts-9', store_id: TECH_STORE, name: 'Licencia Antivirus Pro', description: 'Descarga digital inmediata tras el pago.', price: 159.9, stock: 999, active: true, category_id: 'cat-ts-3', fulfillmentType: 'DIGITAL', createdAt: '2026-07-18',
  },
  {
    id: 'p-ts-10', store_id: TECH_STORE, name: 'Mouse Inalámbrico Ergo', description: 'Diseño ergonómico, preciso.', price: 69.9, stock: 4, active: true, category_id: 'cat-ts-3', fulfillmentType: 'SHIPPING', createdAt: '2026-07-20',
  },

  // Gaming Zone
  {
    id: 'p-gz-1', store_id: GAMING_ZONE, name: 'Silla Gamer Pro', description: 'Soporte lumbar, reclinable 180°.', price: 549.0, stock: 9, active: true, category_id: 'cat-gz-2', fulfillmentType: 'SHIPPING', createdAt: '2026-07-02',
  },
  {
    id: 'p-gz-2', store_id: GAMING_ZONE, name: 'Teclado Mecánico RGB', description: 'Switches azules, retroiluminado. Retiro en tienda disponible.', price: 179.9, stock: 18, active: true, category_id: 'cat-gz-1', fulfillmentType: 'PICKUP', createdAt: '2026-07-04',
  },
  {
    id: 'p-gz-3', store_id: GAMING_ZONE, name: 'Mouse Pad XXL', description: 'Superficie lisa, 900x400mm.', price: 39.9, stock: 50, active: true, category_id: 'cat-gz-1', fulfillmentType: 'SHIPPING', createdAt: '2026-07-07',
  },
  {
    id: 'p-gz-4', store_id: GAMING_ZONE, name: 'Auriculares 7.1', description: 'Sonido envolvente para gaming.', price: 199.0, stock: 2, active: true, category_id: 'cat-gz-1', fulfillmentType: 'SHIPPING', createdAt: '2026-07-09',
  },
  {
    id: 'p-gz-5', store_id: GAMING_ZONE, name: 'Suscripción Cloud Save', description: 'Respaldo en la nube, activación digital al instante.', price: 2499.0, stock: 999, active: true, category_id: 'cat-gz-3', fulfillmentType: 'DIGITAL', createdAt: '2026-07-11',
  },
];
