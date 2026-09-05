import type { StoreWithMetrics } from '../types/store';
import { StatsCard } from './StatsCard';
import { CircleCheck, Package, ShoppingCart, Store } from 'lucide-react';

interface DashboardViewProps {
  stores: StoreWithMetrics[];
  onSelectStore: (storeId: string) => void;
}

export function DashboardView({ stores, onSelectStore }: DashboardViewProps) {
  const totalStores = stores.length;
  const activeStores = stores.filter((s) => s.active).length;
  const totalProducts = stores.reduce((acc, s) => acc + s.metrics.products, 0);
  const totalOrders = stores.reduce((acc, s) => acc + s.metrics.orders, 0);

  const recentActivity = [
    { store: 'Tech Store', action: 'Nuevo pedido #47', time: 'Hace 2h' },
    { store: 'Gaming Zone', action: 'Producto agregado: Silla Gamer Pro', time: 'Hace 5h' },
    { store: 'Tech Store', action: 'Pedido #46 completado', time: 'Ayer' },
    { store: 'Gaming Zone', action: 'Nuevo pedido #112', time: 'Ayer' },
  ];

  return (
    <div>
      <div className="mb-8 grid grid-cols-4 gap-4 max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1">
        <StatsCard icon={Store} value={totalStores} label="Total Tiendas" trend="up" />
        <StatsCard icon={CircleCheck} value={activeStores} label="Tiendas Activas" />
        <StatsCard icon={Package} value={totalProducts} label="Total Productos" trend="up" />
        <StatsCard icon={ShoppingCart} value={totalOrders} label="Total Pedidos" trend="up" />
      </div>

      <div className="grid grid-cols-1 gap-6 min-[1025px]:grid-cols-2">
        <section className="rounded-md border border-border bg-card p-5">
          <h2 className="m-0 mb-4 text-base font-bold text-primary">Tus Tiendas</h2>
          <div className="flex flex-col gap-1">
            {stores.map((store) => (
              <button
                key={store.id}
                className="flex cursor-pointer items-center gap-3 rounded-sm border-none bg-transparent p-2.5 text-left transition-colors hover:bg-[var(--bg-alt)]"
                onClick={() => onSelectStore(store.id)}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-[var(--bg-sidebar)] text-sm font-bold text-white">{store.name.charAt(0)}</div>
                <div className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-[var(--text)]">{store.name}</span>
                  <span className="font-mono text-xs text-[var(--text-light)]">{store.slug}.mercatus.app</span>
                </div>
                <span className={`px-2 py-[3px] text-[11px] font-semibold ${store.active ? 'rounded-full bg-[var(--success-soft)] text-[var(--success-text)]' : 'rounded-full bg-[rgba(149,165,166,0.15)] text-[var(--text-muted)]'}`}>
                  {store.active ? 'Activa' : 'Inactiva'}
                </span>
                <span className="whitespace-nowrap text-xs text-[var(--text-light)]">{store.metrics.orders} pedidos</span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-border bg-card p-5">
          <h2 className="m-0 mb-4 text-base font-bold text-primary">Actividad Reciente</h2>
          <div className="flex flex-col gap-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] text-[var(--text)]">
                    <strong>{item.store}</strong> — {item.action}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
