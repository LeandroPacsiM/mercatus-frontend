import type { StoreWithMetrics, Plan } from '../types/store';

interface PlansViewProps {
  store: StoreWithMetrics;
  productsCount: number;
  plans: Plan[];
  onUpgrade: (planId: string) => void;
}

function formatPrice(amount: number): string {
  return amount === 0 ? 'Gratis' : `S/. ${amount} / mes`;
}

export function PlansView({ store, productsCount, plans, onUpgrade }: PlansViewProps) {
  const current = plans.find((p) => p.id === store.planId) ?? plans[0];
  const pct = Math.min(100, Math.round((productsCount / current.productLimit) * 100));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-md border border-border bg-card p-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.4px] text-[var(--text-light)]">Plan actual de {store.name}</span>
          <h2 className="my-1 text-2xl font-bold text-primary">{current.name}</h2>
          <span className="text-lg font-bold text-[var(--text)]">{formatPrice(current.priceMonthly)}</span>
        </div>
        <div className="min-w-[260px] max-w-[420px] flex-1">
          <div className="mb-1.5 flex justify-between text-[13px] text-[var(--text-light)]">
            <span>Productos</span>
            <span>
              {productsCount} / {current.productLimit === 9999 ? '∞' : current.productLimit}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-md bg-[var(--border)]">
            <div className="h-full rounded-md bg-accent transition-all" style={{ width: `${pct}%` }} />
          </div>
          <span className="mt-2 block text-xs leading-normal text-[var(--text-muted)]">
            {productsCount >= current.productLimit
              ? 'Has alcanzado el límite de tu plan. Haz upgrade para agregar más productos.'
              : 'Espacio disponible en tu plan actual.'}
          </span>
        </div>
      </div>

      <h3 className="m-0 text-lg font-bold text-primary">Cambiar de plan</h3>
      <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
        {plans.map((p) => {
          const isCurrent = p.id === store.planId;
          const featured = p.id === 'plan-basico';
          return (
            <div
              key={p.id}
              className={`relative flex flex-col rounded-md border p-[22px] ${featured ? 'border-mint bg-mint' : 'border-border bg-card'} ${isCurrent ? 'shadow-[inset_0_0_0_2px_var(--accent)]' : ''}`}
            >
              <h4 className={`m-0 mb-1.5 text-lg font-bold ${featured ? 'text-primary' : 'text-primary'}`}>{p.name}</h4>
              <div className={`mb-[14px] text-xl font-extrabold ${featured ? 'text-primary' : 'text-[var(--text)]'}`}>{formatPrice(p.priceMonthly)}</div>
              <ul className="m-0 mb-[18px] flex flex-1 list-none flex-col gap-[7px] p-0">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className={`relative pl-5 text-[13px] ${featured ? 'text-primary' : 'text-[var(--text)]'} before:absolute before:left-0 before:font-bold before:text-[#146c43] before:content-['✓']`}
                  >
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className="cursor-pointer rounded-sm border-none bg-accent p-2.5 text-sm font-semibold text-(--on-accent) transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-default disabled:bg-[var(--border-dark)] disabled:text-[var(--text-muted)] disabled:hover:bg-[var(--border-dark)]"
                disabled={isCurrent}
                onClick={() => onUpgrade(p.id)}
              >
                {isCurrent ? 'Plan actual' : 'Elegir plan'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
