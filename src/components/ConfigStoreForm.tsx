import { useEffect, useRef, useState } from 'react';
import type { StoreWithMetrics, Plan } from '../types/store';
import { Settings2 } from 'lucide-react';

interface ConfigStoreFormProps {
  store: StoreWithMetrics;
  plans: Plan[];
  onSaved: (updated: StoreWithMetrics) => void;
  onCancel: () => void;
}

const LABEL = 'text-sm font-semibold text-[var(--text)]';
const INPUT =
  'rounded-sm border border-border bg-[var(--bg)] px-[14px] py-2.5 font-sans text-sm text-[var(--text)] transition-colors focus:border-accent focus:outline-none';

export function ConfigStoreForm({ store, plans, onSaved, onCancel }: ConfigStoreFormProps) {
  const plan = plans.find((p) => p.id === store.planId) ?? plans[0];
  const [name, setName] = useState(store.name);
  const [description, setDescription] = useState(store.description);
  const [logoUrl, setLogoUrl] = useState(store.logoUrl);
  const [active, setActive] = useState(store.active);
  const [saved, setSaved] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setName(store.name);
    setDescription(store.description);
    setLogoUrl(store.logoUrl);
    setActive(store.active);
    setSaved(false);
  }, [store.id]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    timeoutRef.current = window.setTimeout(() => {
      onSaved({
        ...store,
        name: name.trim(),
        description: description.trim(),
        logoUrl: logoUrl.trim(),
        active,
        theme: store.theme,
      });
    }, 800);
  }

  return (
    <div className="max-w-[760px]">
      <div className="mb-6">
        <div className="flex items-center gap-[14px]">
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-md bg-primary text-[22px] font-bold text-white">{store.name.charAt(0)}</div>
          <div>
            <h2 className="m-0 text-xl font-bold text-primary">{store.name}</h2>
            <span className="font-mono text-[13px] text-[var(--text-light)]">{store.slug}.mercatus.app</span>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-md border border-border bg-card px-4 py-3">
        <Settings2 className="h-4 w-4 text-[var(--accent-text)]" aria-hidden="true" />
        <div>
          <h2 className="m-0 text-sm font-bold text-primary">Información general</h2>
          <p className="m-0 mt-0.5 text-xs text-[var(--text-muted)]">Los temas y colores se administran desde la sección Temas.</p>
        </div>
      </div>

      <form className="flex flex-col gap-5 rounded-md border border-border bg-card p-6" onSubmit={handleSubmit}>
        <>
            <div>
              <h3 className="m-0 text-base font-bold text-primary">Información general</h3>
              <p className="mb-0 mt-1 text-sm text-[var(--text-light)]">Estos datos ayudan a tus clientes a reconocer tu negocio.</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL} htmlFor="config-name">Nombre</label>
              <input id="config-name" className={INPUT} type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL} htmlFor="config-desc">Descripción</label>
              <textarea id="config-desc" className={`${INPUT} min-h-[80px] resize-y`} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe tu tienda..." />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={LABEL} htmlFor="config-logo">Logo URL (opcional)</label>
              <input id="config-logo" className={INPUT} type="url" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://ejemplo.com/logo.png" />
            </div>
            <div className="flex flex-row items-center gap-3">
              <label className={LABEL}>Estado</label>
              <button type="button" className={`relative h-6 w-11 cursor-pointer rounded-xl border-none p-0 transition-colors ${active ? 'bg-[var(--success)]' : 'bg-[var(--border-dark)]'}`} onClick={() => setActive(!active)} role="switch" aria-checked={active}>
                <span className={`absolute left-[3px] top-[3px] h-[18px] w-[18px] rounded-full bg-white transition-transform ${active ? 'translate-x-5' : ''}`} />
              </button>
              <span className={`text-[13px] font-semibold ${active ? 'text-[var(--success-text)]' : 'text-[var(--text-muted)]'}`}>{active ? 'Activa' : 'Inactiva'}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className={LABEL}>URL pública</label>
              <span className="rounded-sm bg-[var(--bg-alt)] px-[14px] py-2.5 font-mono text-sm text-[var(--text)]">{store.slug}.mercatus.app</span>
              <span className="text-xs text-[var(--text-muted)]">El identificador no se puede cambiar después de crear la tienda.</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className={LABEL}>Plan actual</label>
              <span className="inline-block rounded-xl bg-accent px-3 py-1 text-[13px] font-semibold text-(--on-accent)">{plan.name}</span>
              <span className="text-xs text-[var(--text-muted)]">Cámbialo desde "Mi Plan".</span>
            </div>
        </>

        <div className="flex justify-end gap-2.5 pt-2">
          <button
            type="button"
            className="cursor-pointer rounded-sm border border-border bg-[var(--bg-alt)] px-5 py-2.5 text-sm font-semibold text-[var(--text-light)] transition-all"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`cursor-pointer rounded-sm border-none px-5 py-2.5 text-sm font-semibold transition-all ${saved ? 'bg-[var(--success)] text-white' : 'bg-accent text-(--on-accent) hover:bg-[var(--accent-hover)]'} disabled:cursor-default`}
            disabled={saved}
          >
            {saved ? 'Guardado ✓' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
