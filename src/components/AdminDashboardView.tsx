import type { Plan, StoreWithMetrics } from '../types/store';
import { StatsCard } from './StatsCard';
import { CircleCheck, CircleDollarSign, ShoppingCart, Store } from 'lucide-react';

interface AdminDashboardViewProps {
  stores: StoreWithMetrics[];
  plans: Plan[];
  onNavigate: (view: string) => void;
}

export function AdminDashboardView({ stores, plans, onNavigate }: AdminDashboardViewProps) {
  const activeStores = stores.filter((store) => store.active).length;
  const products = stores.reduce((total, store) => total + store.metrics.products, 0);
  const orders = stores.reduce((total, store) => total + store.metrics.orders, 0);
  const revenue = stores.reduce((total, store) => total + store.metrics.revenue, 0);

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-xl border border-[#c1fbd4] bg-[#eafff0] p-6">
        <span className="text-xs font-bold uppercase tracking-[0.7px] text-[#166534]">Centro de control</span>
        <h2 className="mt-2 text-2xl font-bold text-black">Supervisa el estado de Mercatus</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#3f3f46]">
          Desde aquí puedes revisar tiendas, usuarios, planes y actividad general. La operación diaria de productos, inventario y pedidos corresponde a cada Propietario de Tienda.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-[#3f3f46]" onClick={() => onNavigate('admin-stores')}>Revisar tiendas</button>
          <button className="rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-[#f4f4f5]" onClick={() => onNavigate('admin-users')}>Ver usuarios</button>
        </div>
      </section>

      <div className="grid grid-cols-4 gap-4 max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1">
        <StatsCard icon={Store} value={stores.length} label="Tiendas registradas" />
        <StatsCard icon={CircleCheck} value={activeStores} label="Tiendas activas" />
        <StatsCard icon={ShoppingCart} value={orders} label="Pedidos registrados" trend="up" />
        <StatsCard icon={CircleDollarSign} value={`S/ ${revenue.toLocaleString('es-PE', { maximumFractionDigits: 0 })}`} label="Ventas acumuladas" trend="up" />
      </div>

      <div className="grid grid-cols-1 gap-6 min-[1025px]:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="m-0 text-base font-bold text-primary">Estado de la plataforma</h2>
              <p className="mt-1 text-sm text-[var(--text-light)]">Indicadores globales para orientar la supervisión.</p>
            </div>
            <span className="rounded-full bg-[#c1fbd4] px-2.5 py-1 text-xs font-semibold text-black">Operativa</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-[var(--bg-alt)] p-3"><span className="block text-xl font-bold text-primary">{products}</span><span className="text-xs text-[var(--text-light)]">Productos publicados</span></div>
            <div className="rounded-lg bg-[var(--bg-alt)] p-3"><span className="block text-xl font-bold text-primary">{plans.length}</span><span className="text-xs text-[var(--text-light)]">Planes disponibles</span></div>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="m-0 text-base font-bold text-primary">Acciones recomendadas</h2>
          <div className="mt-4 flex flex-col gap-2">
            <button className="flex items-center justify-between rounded-lg border border-border bg-transparent px-3 py-3 text-left text-sm hover:bg-[var(--bg-alt)]" onClick={() => onNavigate('admin-stores')}><span>Comprobar tiendas inactivas</span><span>→</span></button>
            <button className="flex items-center justify-between rounded-lg border border-border bg-transparent px-3 py-3 text-left text-sm hover:bg-[var(--bg-alt)]" onClick={() => onNavigate('admin-activity')}><span>Consultar actividad reciente</span><span>→</span></button>
            <button className="flex items-center justify-between rounded-lg border border-border bg-transparent px-3 py-3 text-left text-sm hover:bg-[var(--bg-alt)]" onClick={() => onNavigate('plans')}><span>Revisar planes y límites</span><span>→</span></button>
          </div>
        </section>
      </div>
    </div>
  );
}
