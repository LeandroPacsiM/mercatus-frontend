import { useMemo, useState } from 'react';
import type { Plan, StoreWithMetrics } from '../types/store';
import { Eye, PauseCircle, PlayCircle, Search, X } from 'lucide-react';

interface AdminStoresViewProps {
  stores: StoreWithMetrics[];
  plans: Plan[];
  onToggleStore: (storeId: string) => void;
}

type StoreFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';

function formatRevenue(amount: number): string {
  return `S/. ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
}

export function AdminStoresView({ stores, plans, onToggleStore }: AdminStoresViewProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<StoreFilter>('ALL');
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  const filteredStores = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return stores.filter((store) => {
      const matchesQuery = !normalizedQuery
        || store.name.toLowerCase().includes(normalizedQuery)
        || store.slug.toLowerCase().includes(normalizedQuery)
        || store.owner.toLowerCase().includes(normalizedQuery);
      const matchesFilter = filter === 'ALL'
        || (filter === 'ACTIVE' && store.active)
        || (filter === 'INACTIVE' && !store.active);
      return matchesQuery && matchesFilter;
    });
  }, [filter, query, stores]);

  const selectedStore = stores.find((store) => store.id === selectedStoreId) ?? null;
  const selectedPlan = selectedStore ? plans.find((plan) => plan.id === selectedStore.planId) : null;

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.7px] text-[var(--text-muted)]">Supervisión global</span>
            <h2 className="mt-2 text-2xl font-bold text-primary">Tiendas de Mercatus</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--text-light)]">Consulta el estado de cada tienda y aplica medidas administrativas. La gestión de productos y pedidos pertenece al Propietario de Tienda.</p>
          </div>
          <div className="rounded-lg bg-[var(--bg-alt)] px-4 py-3 text-right">
            <span className="block text-2xl font-bold text-primary">{filteredStores.length}</span>
            <span className="text-xs text-[var(--text-light)]">tiendas visibles</span>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <label className="flex min-w-[240px] flex-1 items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm text-[var(--text-light)]">
            <Search className="h-4 w-4" aria-hidden="true" />
            <input className="w-full border-none bg-transparent text-sm text-primary outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por tienda, slug o propietario" />
          </label>
          <div className="flex rounded-lg border border-border bg-white p-1">
            {([['ALL', 'Todas'], ['ACTIVE', 'Activas'], ['INACTIVE', 'Inactivas']] as const).map(([value, label]) => (
              <button key={value} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${filter === value ? 'bg-black text-white' : 'text-[var(--text-light)] hover:bg-[var(--bg-alt)]'}`} onClick={() => setFilter(value)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {filteredStores.map((store) => {
          const plan = plans.find((item) => item.id === store.planId);
          return (
            <article key={store.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-black text-lg font-bold text-white">{store.name.charAt(0)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="m-0 text-base font-bold text-primary">{store.name}</h3>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${store.active ? 'bg-[#c1fbd4] text-black' : 'bg-[#f4f4f5] text-[var(--text-muted)]'}`}>{store.active ? 'Activa' : 'Inactiva'}</span>
                  </div>
                  <p className="mt-1 font-mono text-xs text-[var(--text-light)]">{store.slug}.mercatus.app</p>
                  <p className="mt-2 text-sm text-[var(--text-light)]">Propietario: <strong className="text-primary">{store.owner}</strong></p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-[var(--bg-alt)] p-3 text-center">
                <div><span className="block text-base font-bold text-primary">{store.metrics.products}</span><span className="text-[11px] text-[var(--text-light)]">Productos</span></div>
                <div><span className="block text-base font-bold text-primary">{store.metrics.orders}</span><span className="text-[11px] text-[var(--text-light)]">Pedidos</span></div>
                <div><span className="block text-base font-bold text-primary">{formatRevenue(store.metrics.revenue)}</span><span className="text-[11px] text-[var(--text-light)]">Ventas</span></div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-xs text-[var(--text-light)]">Plan: <strong className="text-primary">{plan?.name ?? 'Sin plan'}</strong></span>
                <div className="flex gap-2">
                  <button className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-semibold text-primary hover:bg-[var(--bg-alt)]" onClick={() => setSelectedStoreId(store.id)}><Eye className="h-3.5 w-3.5" aria-hidden="true" />Detalle</button>
                  <button className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold ${store.active ? 'border border-[#f0b4b4] bg-white text-[#991b1b] hover:bg-[#fff1f1]' : 'bg-black text-white hover:bg-[#3f3f46]'}`} onClick={() => onToggleStore(store.id)}>
                    {store.active ? <PauseCircle className="h-3.5 w-3.5" aria-hidden="true" /> : <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />}
                    {store.active ? 'Suspender' : 'Activar'}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filteredStores.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-card px-5 py-16 text-center">
          <Search className="mx-auto h-9 w-9 text-[var(--text-muted)]" aria-hidden="true" />
          <h3 className="mt-3 text-lg font-bold text-primary">No encontramos tiendas</h3>
          <p className="mt-1 text-sm text-[var(--text-light)]">Prueba con otro nombre, slug o propietario.</p>
        </div>
      )}

      {selectedStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-label={`Detalle de ${selectedStore.name}`}>
          <div className="w-full max-w-lg rounded-xl border border-border bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.7px] text-[var(--text-muted)]">Vista administrativa</span>
                <h2 className="mt-2 text-xl font-bold text-primary">{selectedStore.name}</h2>
              </div>
              <button className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-sm text-[var(--text-light)] hover:bg-[var(--bg-alt)]" onClick={() => setSelectedStoreId(null)} aria-label="Cerrar detalle">Cerrar <X className="h-4 w-4" aria-hidden="true" /></button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-[var(--bg-alt)] p-3"><span className="block text-xs text-[var(--text-light)]">Slug</span><strong>{selectedStore.slug}</strong></div>
              <div className="rounded-lg bg-[var(--bg-alt)] p-3"><span className="block text-xs text-[var(--text-light)]">Plan</span><strong>{selectedPlan?.name ?? 'Sin plan'}</strong></div>
              <div className="rounded-lg bg-[var(--bg-alt)] p-3"><span className="block text-xs text-[var(--text-light)]">Propietario</span><strong>{selectedStore.owner}</strong></div>
              <div className="rounded-lg bg-[var(--bg-alt)] p-3"><span className="block text-xs text-[var(--text-light)]">Estado</span><strong>{selectedStore.active ? 'Activa' : 'Inactiva'}</strong></div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-[var(--text-light)]">Esta vista permite supervisar la tienda. El Administrador no modifica aquí productos, precios, inventario ni pedidos.</p>
          </div>
        </div>
      )}
    </div>
  );
}
