import { useState } from 'react';
import type { StoreWithMetrics } from '../types/store';

interface CreateStoreFormProps {
  ownerId: string;
  ownerName: string;
  existingSlugs: string[];
  onStoreCreated: (store: StoreWithMetrics) => void;
  onCancel: () => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function validateSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

const BTN = 'rounded-sm px-5 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40';

export function CreateStoreForm({ ownerId, ownerName, existingSlugs, onStoreCreated, onCancel }: CreateStoreFormProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [slugError, setSlugError] = useState('');

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setName(value);
    if (!slugManuallyEdited) {
      setSlug(slugify(value));
      setSlugError('');
    }
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSlug(value);
    setSlugManuallyEdited(true);
    if (value && !validateSlug(value)) {
      setSlugError('Solo letras minúsculas, números y guiones');
    } else if (existingSlugs.includes(value)) {
      setSlugError('Este slug ya está en uso');
    } else {
      setSlugError('');
    }
  }

  function goToStep2() {
    if (!name.trim()) return;
    if (!slug) setSlug(slugify(name));
    setStep(2);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateSlug(slug) || existingSlugs.includes(slug)) return;

    const newStore: StoreWithMetrics = {
      id: crypto.randomUUID(),
      name: name.trim(),
      slug,
      description: '',
      logoUrl: '',
      active: true,
      owner: ownerName,
      ownerId,
      planId: 'plan-gratis',
      lat: -12.0464,
      lng: -77.0428,
      metrics: { products: 0, orders: 0, revenue: 0 },
    };

    onStoreCreated(newStore);
  }

  const isStep1Valid = name.trim().length >= 2;
  const isStep2Valid = slug.length > 0 && validateSlug(slug) && !existingSlugs.includes(slug);

  return (
    <div className="max-w-[560px]">
      <div className="mb-8 flex items-center justify-center gap-3">
        <div className={`flex items-center gap-2 transition-opacity ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}>
          <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${step >= 1 ? 'bg-accent text-(--on-accent)' : 'bg-[var(--border)] text-[var(--text-light)]'}`}>1</span>
          <span className="text-sm font-semibold text-[var(--text)]">Nombre</span>
        </div>
        <div className="h-0.5 w-12 rounded-sm bg-[var(--border)]" />
        <div className={`flex items-center gap-2 transition-opacity ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}>
          <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${step >= 2 ? 'bg-accent text-(--on-accent)' : 'bg-[var(--border)] text-[var(--text-light)]'}`}>2</span>
          <span className="text-sm font-semibold text-[var(--text)]">Slug</span>
        </div>
      </div>

      <form className="rounded-md border border-border bg-card p-6" onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-[var(--text)]" htmlFor="store-name">
              Nombre de la tienda
            </label>
            <input
              id="store-name"
              className="rounded-sm border border-border bg-[var(--bg)] px-4 py-3 font-sans text-base text-[var(--text)] transition-colors focus:border-accent focus:outline-none"
              type="text"
              placeholder="Ej: Mi Tienda de Tecnología"
              value={name}
              onChange={handleNameChange}
              autoFocus
            />
            <span className="text-xs text-[var(--text-muted)]">
              Este es el nombre que verán tus clientes.
            </span>
            <div className="mt-2 flex justify-between">
              <button type="button" className={`${BTN} border border-border bg-[var(--bg-alt)] text-[var(--text-light)]`} onClick={onCancel}>
                Cancelar
              </button>
              <button
                type="button"
                className={`${BTN} bg-accent text-(--on-accent) hover:bg-[var(--accent-hover)]`}
                disabled={!isStep1Valid}
                onClick={goToStep2}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-[var(--text)]" htmlFor="store-slug">
              Identificador único (slug)
            </label>
            <div className="flex items-center gap-0">
              <input
                id="store-slug"
                className={`flex-1 rounded-sm rounded-r-none border border-border bg-[var(--bg)] px-4 py-3 font-sans text-base text-[var(--text)] transition-colors focus:border-accent focus:outline-none ${slugError ? 'border-[var(--danger-text)]' : ''}`}
                type="text"
                placeholder="mi-tienda"
                value={slug}
                onChange={handleSlugChange}
                autoFocus
              />
              <span className="whitespace-nowrap rounded-sm rounded-l-none border border-l-0 border-border bg-[var(--bg-alt)] px-[14px] py-3 font-mono text-sm text-[var(--text-light)]">.mercatus.app</span>
            </div>
            {slugError && <span className="text-[13px] text-[var(--danger-text)]">{slugError}</span>}
            {slug && !slugError && (
              <div className="flex items-center gap-2 rounded-sm border border-[color:var(--success-soft)] bg-[var(--success-soft)] px-4 py-3">
                <span className="text-[13px] text-[var(--text-light)]">Tu tienda estará en:</span>
                <a
                  className="text-sm font-semibold text-[var(--success-text)] no-underline hover:underline"
                  href={`https://${slug}.mercatus.app`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {slug}.mercatus.app
                </a>
              </div>
            )}
            <span className="text-xs text-[var(--text-muted)]">
              Solo letras minúsculas, números y guiones. No se puede cambiar después.
            </span>
            <div className="mt-2 flex justify-between">
              <button type="button" className={`${BTN} border border-border bg-[var(--bg-alt)] text-[var(--text-light)]`} onClick={() => setStep(1)}>
                ← Atrás
              </button>
              <button
                type="submit"
                className={`${BTN} bg-[var(--success)] text-white hover:bg-[var(--success-text)]`}
                disabled={!isStep2Valid}
              >
                Crear Tienda
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
