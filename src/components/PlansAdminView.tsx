import type { Plan } from '../types/store';
import { Check, CreditCard, Store } from 'lucide-react';

interface PlansAdminViewProps {
  plans: Plan[];
  storePlanIds: string[];
  onSavePlan: (plan: Plan) => void;
}

const INPUT =
  'bg-[var(--bg)] rounded-sm border border-border px-2.5 py-[9px] font-sans text-sm text-[var(--text)] focus:border-accent focus:outline-none';

export function PlansAdminView({ plans, storePlanIds, onSavePlan }: PlansAdminViewProps) {
  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-[#c1fbd4] p-3 text-black"><CreditCard className="h-5 w-5" aria-hidden="true" /></div>
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.7px] text-[var(--text-muted)]">Configuración comercial</span>
            <h2 className="mt-2 text-2xl font-bold text-primary">Planes y límites</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--text-light)]">Define las opciones que pueden contratar los Propietarios de Tienda. Los cambios se muestran durante esta sesión y afectan la información presentada en la plataforma.</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 max-[640px]:grid-cols-1">
          <div className="flex items-center gap-3 rounded-lg bg-[var(--bg-alt)] p-3"><CreditCard className="h-5 w-5 text-[var(--text-muted)]" aria-hidden="true" /><div><strong className="block text-lg text-primary">{plans.length}</strong><span className="text-xs text-[var(--text-light)]">Planes disponibles</span></div></div>
          <div className="flex items-center gap-3 rounded-lg bg-[var(--bg-alt)] p-3"><Store className="h-5 w-5 text-[var(--text-muted)]" aria-hidden="true" /><div><strong className="block text-lg text-primary">{storePlanIds.length}</strong><span className="text-xs text-[var(--text-light)]">Tiendas con plan</span></div></div>
        </div>
      </section>
      <div className="grid grid-cols-2 gap-[18px] max-md:grid-cols-1">
        {plans.map((p) => (
          <div key={p.id} className="flex flex-col gap-[14px] rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-[var(--text-muted)]">Plan {p.id.replace('plan-', '')}</span>
                <h3 className="mt-1 text-lg font-bold text-primary">{p.name}</h3>
              </div>
              <div className="rounded-lg bg-[var(--bg-alt)] p-2 text-[var(--text-muted)]"><CreditCard className="h-4 w-4" aria-hidden="true" /></div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--text-light)]">Nombre</label>
              <input
                className={INPUT}
                value={p.name}
                onChange={(e) => onSavePlan({ ...p, name: e.target.value })}
              />
            </div>
            <div className="flex flex-row gap-[14px]">
              <div className="flex flex-1 flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--text-light)]">Precio (S/.)</label>
                <input
                  className={INPUT}
                  type="number"
                  min={0}
                  value={p.priceMonthly}
                  onChange={(e) => onSavePlan({ ...p, priceMonthly: Number(e.target.value) })}
                />
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--text-light)]">Límite productos</label>
                <input
                  className={INPUT}
                  type="number"
                  min={1}
                  value={p.productLimit === 9999 ? '' : p.productLimit}
                  placeholder="∞"
                  onChange={(e) =>
                    onSavePlan({
                      ...p,
                      productLimit: e.target.value === '' ? 9999 : Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-[var(--bg-alt)] px-3 py-2 text-xs text-[var(--text-light)]">
              <span>Tiendas usando este plan</span>
              <strong className="text-primary">{storePlanIds.filter((planId) => planId === p.id).length}</strong>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--text-light)]">Beneficios (uno por línea)</label>
              <textarea
                className={`${INPUT} resize-y`}
                rows={4}
                value={p.features.join('\n')}
                onChange={(e) =>
                  onSavePlan({ ...p, features: e.target.value.split('\n').map((f) => f.trim()).filter(Boolean) })
                }
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]"><Check className="h-3.5 w-3.5 text-[#166534]" aria-hidden="true" />Los cambios se reflejan durante la sesión.</div>
          </div>
        ))}
      </div>
    </div>
  );
}
