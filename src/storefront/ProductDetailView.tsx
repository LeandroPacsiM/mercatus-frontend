import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Product, StoreWithMetrics, FulfillmentType } from '../types/store';
import { useCart } from './CartContext';

interface ProductDetailViewProps {
  store: StoreWithMetrics | null;
  product: Product | null;
  onAdd: (p: Product) => void;
}

const FULFILLMENT_LABEL: Record<FulfillmentType, string> = {
  SHIPPING: 'Envío físico',
  DIGITAL: 'Descarga digital',
  PICKUP: 'Retiro en tienda',
};

const FUL_TONE: Record<FulfillmentType, string> = {
  SHIPPING: 'bg-[var(--accent-soft)] text-[var(--accent-text)]',
  DIGITAL: 'bg-[var(--success-soft)] text-[var(--success-text)]',
  PICKUP: 'bg-[var(--warning-soft)] text-[var(--warning-text)]',
};

export function ProductDetailView({ store, product, onAdd }: ProductDetailViewProps) {
  const { setStore } = useCart();

  useEffect(() => {
    if (store) setStore(store.id);
  }, [store?.id, setStore]);

  if (!product) {
    return (
      <div className="p-10 text-center text-[var(--text-light)]">
        <p>Producto no encontrado.</p>
        <Link to={`/tienda/${store?.slug}`} className="mb-4 inline-block text-[13px] font-semibold text-accent no-underline">← Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to={`/tienda/${store?.slug}`} className="mb-4 inline-block text-[13px] text-accent no-underline">← Volver al catálogo</Link>
      <div className="grid grid-cols-[320px_1fr] gap-7 max-[860px]:grid-cols-1">
        <div className="flex h-[320px] items-center justify-center rounded-md bg-[linear-gradient(135deg,var(--accent),var(--accent-hover))] text-[100px] font-extrabold text-(--on-accent)">{product.name.charAt(0)}</div>
        <div>
          <h1 className="m-0 mb-2 text-2xl font-extrabold text-primary">{product.name}</h1>
          <div className="mb-[14px] text-[22px] font-extrabold text-[var(--text)]">S/. {product.price.toFixed(2)}</div>
          <span className={`mb-[14px] inline-block rounded-[20px] px-2.5 py-[3px] text-[11px] font-bold uppercase tracking-[0.4px] ${FUL_TONE[product.fulfillmentType ?? 'SHIPPING']}`}>
            {FULFILLMENT_LABEL[product.fulfillmentType ?? 'SHIPPING']}
          </span>
          <p className="mb-4 text-sm leading-relaxed text-[var(--text-light)]">{product.description || 'Sin descripción.'}</p>
          <div className={`mb-[18px] text-[13px] font-semibold ${product.stock === 0 ? 'text-[var(--warning-text)]' : 'text-[var(--success-text)]'}`}>
            {product.stock === 0 ? 'Agotado' : `${product.stock} en stock`}
          </div>
          <button
            className="cursor-pointer rounded-sm border-none bg-accent px-[22px] py-3 text-[15px] font-semibold text-(--on-accent) disabled:cursor-not-allowed disabled:bg-[var(--border-dark)] disabled:text-[var(--text-muted)]"
            onClick={() => onAdd(product)}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </div>
  );
}
