import type { Product, Order, StoreWithMetrics, Plan } from '../types/store';
import { StatsCard } from './StatsCard';
import { CircleCheck, CircleDollarSign, Package, ShoppingCart } from 'lucide-react';

interface StoreHomeProps {
  store: StoreWithMetrics;
  products: Product[];
  orders: Order[];
  plans: Plan[];
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

const ORDER_STATUS =
  'inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-center text-xs font-semibold';

const ORDER_STATUS_TONE: Record<string, string> = {
  PENDING: 'bg-[var(--warning-soft)] text-[var(--warning-text)]',
  CONFIRMED: 'bg-[var(--accent-soft)] text-[var(--accent-text)]',
  SHIPPED: 'bg-[rgba(155,89,182,0.12)] text-[#8e44ad]',
  DELIVERED: 'bg-[var(--success-soft)] text-[var(--success-text)]',
  CANCELLED: 'bg-[var(--danger-soft)] text-[var(--danger-text)]',
};

function formatPrice(amount: number): string {
  return `S/. ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
}

export function StoreHome({ store, products, orders, plans }: StoreHomeProps) {
  const activeProducts = products.filter((p) => p.active).length;
  const plan = plans.find((p) => p.id === store.planId) ?? plans[0];
  const revenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((acc, o) => acc + o.total, 0);

  const recent = [...orders]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 3);

  return (
    <div>
      <div className="mb-7 grid grid-cols-4 gap-4 max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1">
        <StatsCard icon={Package} value={products.length} label="Productos totales" />
        <StatsCard icon={CircleCheck} value={activeProducts} label="Productos activos" />
        <StatsCard icon={ShoppingCart} value={orders.length} label="Pedidos" />
        <StatsCard icon={CircleDollarSign} value={formatPrice(revenue)} label="Ventas" trend="up" />
      </div>

      <section className="mb-5 rounded-md border border-border bg-card p-5">
        <h2 className="m-0 mb-4 text-base font-bold text-primary">Resumen operativo</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-[0.4px] text-[var(--text-muted)]">Nombre de la tienda</span>
            <span className="text-[15px] font-semibold text-[var(--text)]">{store.name}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-[0.4px] text-[var(--text-muted)]">URL pública</span>
            <span className="font-mono text-[13px] font-semibold text-[var(--text)]">{store.slug}.mercatus.app</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-[0.4px] text-[var(--text-muted)]">Estado</span>
            <span className={`text-[15px] font-semibold ${store.active ? 'text-[var(--success-text)]' : 'text-[var(--text-muted)]'}`}>
              {store.active ? 'Activa' : 'Inactiva'}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-[0.4px] text-[var(--text-muted)]">Propietario</span>
            <span className="text-[15px] font-semibold text-[var(--text)]">{store.owner}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-[0.4px] text-[var(--text-muted)]">Plan</span>
            <span className="text-[15px] font-semibold text-[var(--text)]">
              <span className="inline-block rounded-xl bg-accent px-2.5 py-[3px] text-xs font-semibold text-(--on-accent)">{plan.name}</span>
            </span>
          </div>
        </div>
      </section>

      <section className="mb-5 rounded-md border border-border bg-card p-5">
        <h2 className="m-0 mb-4 text-base font-bold text-primary">Pedidos recientes</h2>
        <div className="flex flex-col gap-2">
          {recent.map((o) => (
            <div key={o.id} className="grid grid-cols-[2fr_1fr_1fr_auto] items-center gap-3 rounded-sm bg-[var(--bg-alt)] px-[14px] py-3 max-[640px]:grid-cols-2">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-primary">#{o.id.split('-').pop()}</span>
                <span className="text-xs text-[var(--text-light)]">{o.customerName}</span>
              </div>
              <span className={`${ORDER_STATUS} ${ORDER_STATUS_TONE[o.status]}`}>
                {STATUS_LABEL[o.status]}
              </span>
              <span className="text-right text-sm font-semibold text-[var(--text)]">{formatPrice(o.total)}</span>
              <span className="text-right text-xs text-[var(--text-muted)]">{formatDate(o.created_at)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
