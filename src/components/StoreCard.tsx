import type { StoreWithMetrics } from '../types/store';
import { Link } from 'react-router-dom';

interface StoreCardProps {
  store: StoreWithMetrics;
  onConfigure: (storeId: string) => void;
  onEnter: (storeId: string) => void;
}

function formatRevenue(amount: number): string {
  return `S/. ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
}

export function StoreCard({ store, onConfigure, onEnter }: StoreCardProps) {
  return (
    <article className={`flex flex-col rounded-md border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md ${!store.active ? 'opacity-75' : ''}`}>
      <div
        className="-m-1 mb-2 flex cursor-pointer items-center gap-3 rounded-sm p-1 transition-colors hover:bg-[var(--bg-alt)]"
        onClick={() => onEnter(store.id)}
        role="button"
        tabIndex={0}
      >
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-lg font-bold text-white ${store.active ? 'bg-[var(--bg-sidebar)]' : 'bg-[var(--border-dark)]'}`}>
          {store.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-base font-semibold text-primary">{store.name}</h3>
          <span className="font-mono text-xs text-[var(--text-light)]">{store.slug}.mercatus.app</span>
        </div>
        <span className={`whitespace-nowrap px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.3px] ${store.active ? 'rounded-full bg-[var(--success-soft)] text-[var(--success-text)]' : 'rounded-full bg-[rgba(149,165,166,0.15)] text-[var(--text-muted)]'}`}>
          {store.active ? 'Activa' : 'Inactiva'}
        </span>
      </div>

      <p className="mb-4 text-[13px] leading-normal text-[var(--text-light)]">{store.description}</p>

      <div className="mb-4 grid grid-cols-3 gap-2 rounded-sm bg-[var(--bg-alt)] p-3">
        <div className="text-center">
          <span className="block text-base font-bold text-primary">{store.metrics.products}</span>
          <span className="text-[11px] text-[var(--text-light)]">Productos</span>
        </div>
        <div className="text-center">
          <span className="block text-base font-bold text-primary">{store.metrics.orders}</span>
          <span className="text-[11px] text-[var(--text-light)]">Pedidos</span>
        </div>
        <div className="text-center">
          <span className="block text-base font-bold text-primary">{formatRevenue(store.metrics.revenue)}</span>
          <span className="text-[11px] text-[var(--text-light)]">Ventas</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className="flex-1 cursor-pointer rounded-sm border border-border bg-[var(--bg-alt)] px-3 py-2 text-center text-[13px] font-semibold text-[var(--text)] transition-all hover:bg-[var(--border)]"
          onClick={() => onConfigure(store.id)}
        >
          Configurar
        </button>
        <Link
          to={`/tienda/${store.slug}`}
          className={`flex-1 rounded-sm px-3 py-2 text-center text-[13px] font-semibold no-underline transition-all hover:no-underline ${!store.active ? 'cursor-not-allowed bg-[var(--border-dark)] text-[var(--text-muted)]' : 'bg-accent text-black hover:bg-[var(--accent-hover)]'}`}
          onClick={(e) => !store.active && e.preventDefault()}
        >
          Ver tienda
        </Link>
      </div>
    </article>
  );
}
