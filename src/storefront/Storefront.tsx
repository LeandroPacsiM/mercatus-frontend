import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { initialStores } from '../data/stores';
import { initialProducts } from '../data/products';
import { initialCategories } from '../data/categories';
import type { Order, OrderItem, Product, StoreWithMetrics } from '../types/store';
import { useCart } from './CartContext';
import { useOrders } from './ordersContext';
import { useCustomer } from './customerContext';
import { StorefrontLayout } from './StorefrontLayout';
import { CatalogView } from './CatalogView';
import { ProductDetailView } from './ProductDetailView';
import { CartView } from './CartView';
import { CheckoutView } from './CheckoutView';
import { OrderConfirmationView } from './OrderConfirmationView';
import { CustomerOrdersView } from './CustomerOrdersView';
import { StoreInfoView } from './StoreInfoView';

function loadStorefrontData<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T : fallback;
  } catch {
    return fallback;
  }
}

function hashOffset(id: string): { dLat: number; dLng: number } {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 1000;
  const a = (h / 1000) * Math.PI * 2;
  return { dLat: Math.cos(a) * 0.015, dLng: Math.sin(a) * 0.02 };
}

export function Storefront() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { storeId, items, add, clear } = useCart();
  const { orders, addOrder } = useOrders();
  const { currentCustomer } = useCustomer();

  const path = location.pathname;
  const stores = loadStorefrontData('mercatus.stores', initialStores);
  const products = loadStorefrontData('mercatus.products', initialProducts);
  const categories = loadStorefrontData('mercatus.categories', initialCategories);
  const store: StoreWithMetrics | null = slug
    ? stores.find((s) => s.slug === slug) ?? null
    : stores.find((s) => s.id === storeId) ?? null;

  const storeProducts = store ? products.filter((p) => p.store_id === store.id) : [];

  if (slug && !store) {
    return (
      <StorefrontLayout>
        <div className="mx-auto max-w-xl rounded-md border border-border bg-card p-8 text-center">
          <h1 className="m-0 text-2xl font-extrabold text-primary">Tienda no encontrada</h1>
          <p className="mb-5 mt-2 text-sm leading-relaxed text-[var(--text-light)]">Revisa el enlace o vuelve al inicio de Mercatus para explorar otras opciones.</p>
          <a href="/" className="inline-block rounded-sm bg-accent px-4 py-2.5 text-sm font-semibold text-(--on-accent) no-underline">Ir al inicio</a>
        </div>
      </StorefrontLayout>
    );
  }

  if (store && !store.active) {
    return (
      <StorefrontLayout store={store}>
        <div className="mx-auto max-w-xl rounded-md border border-border bg-card p-8 text-center">
          <h1 className="m-0 text-2xl font-extrabold text-primary">Tienda temporalmente no disponible</h1>
          <p className="mb-5 mt-2 text-sm leading-relaxed text-[var(--text-light)]">Esta tienda no está aceptando visitas en este momento. Intenta nuevamente más tarde.</p>
          <a href="/" className="inline-block rounded-sm bg-accent px-4 py-2.5 text-sm font-semibold text-(--on-accent) no-underline">Ir al inicio</a>
        </div>
      </StorefrontLayout>
    );
  }

  function onAdd(p: Product) {
    if (store) add(p, store.id);
  }

  function placeOrder(data: { customerName: string; email: string; address: string; paymentMethod: Order['paymentMethod'] }) {
    if (!store) return;
    const cartItems = items.filter((i) => i.storeId === store.id);
    if (cartItems.length === 0) return;
    const orderItems: OrderItem[] = cartItems.map((i) => {
      const prod = products.find((p) => p.id === i.productId);
      if (!prod) throw new Error('El producto del carrito ya no está disponible.');
      return {
        id: `oi-${crypto.randomUUID().slice(0, 8)}`,
        order_id: '',
        product_id: prod.id,
        productName: prod.name,
        quantity: i.qty,
        price: prod.price,
      };
    });
    const total = orderItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
    const orderId = `ord-${crypto.randomUUID().slice(0, 8)}`;
    const firstProduct = products.find((p) => p.id === cartItems[0].productId);
    const fulfillmentType = firstProduct?.fulfillmentType ?? 'SHIPPING';

    const shipmentExtra: Partial<Order> = {};
    if (fulfillmentType === 'SHIPPING') {
      const off = hashOffset(orderId);
      shipmentExtra.deliveryLat = store.lat + off.dLat;
      shipmentExtra.deliveryLng = store.lng + off.dLng;
      shipmentExtra.courierName = 'Repartidor Mercatus';
      shipmentExtra.currentLat = store.lat;
      shipmentExtra.currentLng = store.lng;
    }

    const order: Order = {
      id: orderId,
      store_id: store.id,
      user_id: currentCustomer?.id ?? '',
      code: `MCS-${orderId.slice(4, 10).toUpperCase()}`,
      customerName: data.customerName,
      status: 'PENDING',
      total,
      created_at: new Date().toISOString(),
      fulfillmentType,
      paymentMethod: data.paymentMethod ?? 'TARJETA',
      ...shipmentExtra,
    };
    const itemsWithOrder = orderItems.map((it) => ({ ...it, order_id: orderId }));
    addOrder(order, itemsWithOrder);
    clear();
    navigate(`/pedido/${orderId}`);
  }

  let view;
  if (path.startsWith('/pedido/')) {
    const oid = path.split('/').pop() ?? '';
    view = <OrderConfirmationView order={orders.find((o) => o.id === oid) ?? null} />;
  } else if (path.startsWith('/checkout')) {
    view = <CheckoutView store={store} products={products} onPlaceOrder={placeOrder} />;
  } else if (path.startsWith('/carrito')) {
    view = <CartView store={store} products={products} onCheckout={() => navigate('/checkout')} />;
  } else if (path.includes('/pedidos')) {
    view = <CustomerOrdersView store={store} />;
  } else if (path.endsWith('/nosotros')) {
    view = store ? <StoreInfoView store={store} page="about" /> : null;
  } else if (path.endsWith('/contacto')) {
    view = store ? <StoreInfoView store={store} page="contact" /> : null;
  } else if (path.endsWith('/envios')) {
    view = store ? <StoreInfoView store={store} page="shipping" /> : null;
  } else if (path.endsWith('/devoluciones')) {
    view = store ? <StoreInfoView store={store} page="returns" /> : null;
  } else if (path.includes('/producto/')) {
    const pid = path.split('/producto/')[1];
    const product = products.find((p) => p.id === pid) ?? null;
    view = <ProductDetailView store={store} product={product} onAdd={onAdd} />;
  } else {
    view = (
      <CatalogView store={store} products={storeProducts} categories={categories} onAdd={onAdd} />
    );
  }

  return <StorefrontLayout store={store}>{view}</StorefrontLayout>;
}
