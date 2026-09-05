import type { StoreWithMetrics } from '../types/store';
import { StoreCard } from './StoreCard';
import { ArrowRight, CircleCheck, Package, Settings2, Store } from 'lucide-react';

interface StoreGridProps {
  stores: StoreWithMetrics[];
  onConfigure: (storeId: string) => void;
  onEnter: (storeId: string) => void;
  onCreate: () => void;
}

export function StoreGrid({ stores, onConfigure, onEnter, onCreate }: StoreGridProps) {
  if (stores.length === 0) {
    return (
      <div className="rounded-md border border-border bg-card p-6 max-[640px]:p-5">
        <div className="mx-auto max-w-3xl">
          <div className="mb-7 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-accent text-(--on-accent)">
              <Store className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="m-0 mb-1 text-xs font-semibold uppercase tracking-[0.6px] text-[var(--accent-text)]">Primer paso</p>
              <h2 className="m-0 text-2xl font-bold text-primary">Crea tu primera tienda</h2>
              <p className="mb-0 mt-2 max-w-xl text-sm leading-relaxed text-[var(--text-light)]">
                Mercatus te ayuda a construir tu catálogo y recibir pedidos en un solo lugar. Empieza con la identidad de tu tienda y luego completa tu catálogo.
              </p>
            </div>
          </div>

          <div className="mb-7 grid grid-cols-3 gap-3 max-[640px]:grid-cols-1">
            {[
              { icon: Store, title: 'Crea tu tienda', description: 'Define su nombre y dirección pública.' },
              { icon: Settings2, title: 'Configura la identidad', description: 'Agrega descripción, logo y apariencia.' },
              { icon: Package, title: 'Publica productos', description: 'Crea categorías y agrega tu primer producto.' },
            ].map((step, index) => (
              <div key={step.title} className="rounded-sm border border-border bg-[var(--bg-alt)] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <step.icon className="h-5 w-5 text-[var(--accent-text)]" aria-hidden="true" />
                  <span className="text-xs font-bold text-[var(--text-muted)]">0{index + 1}</span>
                </div>
                <h3 className="m-0 mb-1 text-sm font-bold text-[var(--text)]">{step.title}</h3>
                <p className="m-0 text-xs leading-relaxed text-[var(--text-light)]">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-border pt-5 max-[640px]:flex-col max-[640px]:items-stretch">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <CircleCheck className="h-4 w-4 text-[var(--success-text)]" aria-hidden="true" />
              Podrás completar los siguientes pasos desde el panel de tu tienda.
            </div>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm border-none bg-accent px-5 py-2.5 text-sm font-semibold text-(--on-accent) transition-colors hover:bg-[var(--accent-hover)]"
              onClick={onCreate}
            >
              Crear mi primera tienda
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-5 max-[1024px]:grid-cols-2 max-[640px]:grid-cols-1">
      {stores.map((store) => (
        <StoreCard key={store.id} store={store} onConfigure={onConfigure} onEnter={onEnter} />
      ))}
    </div>
  );
}
