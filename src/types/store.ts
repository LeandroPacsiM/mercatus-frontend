export type Role = 'PROPIETARIO' | 'ADMINISTRADOR';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface Customer {
  id: string;
  store_id: string;
  name: string;
  email: string;
  password: string;
}

export interface StoreTheme {
  presetId?: string;
  templateId?: 'standard' | 'indice' | 'orbe' | 'ficha';
  primary: string;
  accent: string;
  surface?: string;
  sections?: {
    hero: boolean;
    featuredProducts: boolean;
    categories: boolean;
    footer: boolean;
  };
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  active: boolean;
  owner: string;
  ownerId: string;
  planId: string;
  lat: number;
  lng: number;
  theme?: StoreTheme;
}

export interface StoreMetrics {
  products: number;
  orders: number;
  revenue: number;
}

export interface StoreWithMetrics extends Store {
  metrics: StoreMetrics;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export type FulfillmentType = 'SHIPPING' | 'DIGITAL' | 'PICKUP';

export type PaymentMethodType = 'TARJETA' | 'TRANSFERENCIA' | 'CONTRA_ENTREGA' | 'BILLETERA';

export interface Category {
  id: string;
  store_id: string;
  name: string;
  active: boolean;
}

export interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
  category_id: string;
  fulfillmentType: FulfillmentType;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  store_id: string;
  user_id: string;
  code: string;
  customerName: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  fulfillmentType?: FulfillmentType;
  paymentMethod?: PaymentMethodType;
  trackingNumber?: string;
  carrier?: string;
  deliveryLat?: number;
  deliveryLng?: number;
  courierName?: string;
  currentLat?: number;
  currentLng?: number;
  dispatchedAt?: string;
  etaMinutes?: number;
}

export interface Plan {
  id: string;
  name: string;
  priceMonthly: number;
  productLimit: number;
  features: string[];
}
