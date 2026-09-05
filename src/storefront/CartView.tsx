import { Link } from 'react-router-dom';
import type { Product, StoreWithMetrics } from '../types/store';
import { useCart } from './CartContext';

interface CartViewProps {
  store: StoreWithMetrics | null;
  products: Product[];
  onCheckout: () => void;
}

function formatPrice(amount: number): string {
  return `S/. ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
}

export function CartView({ store, products, onCheckout }: CartViewProps) {
  const { items, storeId, setQty, remove } = useCart();
  const lines = items
    .filter((i) => i.storeId === storeId)
    .map((i) => {
      const prod = products.find((p) => p.id === i.productId);
      return prod ? { ...i, prod } : null;
    })
    .filter((l): l is typeof l & { prod: Product } => l !== null);

  const total = lines.reduce((acc, l) => acc + l.prod.price * l.qty, 0);

  if (lines.length === 0) {
    return (
      <div className="py-[50px] text-center">
        <h1 className="m-0 mb-5 text-2xl font-extrabold text-primary">Tu carrito está vacío</h1>
        <Link to={`/tienda/${store?.slug}`} className="font-semibold text-accent no-underline">Seguir comprando</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to={`/tienda/${store?.slug}`} className="mb-3 inline-block text-sm font-semibold text-accent no-underline hover:underline">← Volver al catálogo</Link>
      <h1 className="m-0 mb-5 text-2xl font-extrabold text-primary">Carrito</h1>
      <div className="mb-5 flex flex-col gap-3">
        {lines.map((l) => (
          <div key={l.productId} className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-[14px] rounded-sm border border-border bg-card px-4 py-3">
            <div className="font-semibold text-[var(--text)]">{l.prod.name}</div>
            <div className="text-[13px] text-[var(--text-light)]">{formatPrice(l.prod.price)}</div>
            <div className="flex items-center gap-2">
              <button className="h-7 w-7 cursor-pointer rounded-sm border border-border bg-[var(--bg)] text-base text-[var(--text)]" onClick={() => setQty(l.productId, l.qty - 1)}>−</button>
              <span>{l.qty}</span>
              <button className="h-7 w-7 cursor-pointer rounded-sm border border-border bg-[var(--bg)] text-base text-[var(--text)]" onClick={() => setQty(l.productId, l.qty + 1)}>+</button>
            </div>
            <div className="min-w-[80px] text-right font-bold text-primary">{formatPrice(l.prod.price * l.qty)}</div>
            <button className="cursor-pointer border-none bg-transparent text-sm text-[var(--warning-text)]" onClick={() => remove(l.productId)}>✕</button>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-border pt-4">
        <div className="flex gap-2.5 text-lg text-[var(--text)]">
          <span>Total</span>
          <strong>{formatPrice(total)}</strong>
        </div>
        <button className="cursor-pointer rounded-sm border-none bg-accent px-[26px] py-3 text-[15px] font-bold text-(--on-accent)" onClick={onCheckout}>Pagar</button>
      </div>
    </div>
  );
}
