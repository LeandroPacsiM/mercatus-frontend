import type { Category } from '../types/store';

export const initialCategories: Category[] = [
  // Tech Store
  { id: 'cat-ts-1', store_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', name: 'Electrónica', active: true },
  { id: 'cat-ts-2', store_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', name: 'Audio', active: true },
  { id: 'cat-ts-3', store_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', name: 'Accesorios', active: true },
  // Gaming Zone
  { id: 'cat-gz-1', store_id: 'c69d34e5-7b0f-4a23-9d42-2e3f4a5b6c7d', name: 'Periféricos', active: true },
  { id: 'cat-gz-2', store_id: 'c69d34e5-7b0f-4a23-9d42-2e3f4a5b6c7d', name: 'Sillas', active: true },
  { id: 'cat-gz-3', store_id: 'c69d34e5-7b0f-4a23-9d42-2e3f4a5b6c7d', name: 'Consolas', active: false },
];
