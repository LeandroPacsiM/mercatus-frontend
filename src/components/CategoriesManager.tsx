import { useState } from 'react';
import type { Category } from '../types/store';

interface CategoriesManagerProps {
  categories: Category[];
  onAdd: (name: string) => void;
  onToggle: (categoryId: string) => void;
}

export function CategoriesManager({ categories, onAdd, onToggle }: CategoriesManagerProps) {
  const [newName, setNewName] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newName.trim().length < 2) return;
    onAdd(newName.trim());
    setNewName('');
  }

  return (
    <div className="flex flex-col gap-4">
      <form className="flex gap-3" onSubmit={handleSubmit}>
        <input
          className="flex-1 rounded-sm border border-border bg-[var(--bg)] px-[14px] py-2.5 font-sans text-sm text-[var(--text)] focus:border-accent focus:outline-none"
          type="text"
          placeholder="Nombre de la categoría"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-sm border-none bg-accent px-4 py-[9px] text-[13px] font-semibold text-(--on-accent) transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-40"
          disabled={newName.trim().length < 2}
        >
          + Crear categoría
        </button>
      </form>

      <div className="text-[13px] text-[var(--text-light)]">
        {categories.length} {categories.length === 1 ? 'categoría' : 'categorías'}
      </div>

      <div className="flex flex-col gap-2">
        {categories.map((c) => (
          <div key={c.id} className={`flex items-center gap-3 rounded-sm border border-border bg-card px-4 py-3 ${c.active ? '' : 'opacity-65'}`}>
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${c.active ? 'bg-accent' : 'bg-[var(--border-dark)]'}`} />
            <span className="flex-1 text-sm font-semibold text-[var(--text)]">{c.name}</span>
            <span className={`px-2.5 py-[3px] text-[11px] font-semibold ${c.active ? 'rounded-full bg-[var(--success-soft)] text-[var(--success-text)]' : 'rounded-full bg-[rgba(149,165,166,0.15)] text-[var(--text-muted)]'}`}>
              {c.active ? 'Activa' : 'Inactiva'}
            </span>
            <button
              className="cursor-pointer rounded-sm border border-[var(--border-dark)] bg-transparent px-3 py-[5px] text-xs text-[var(--text-light)] transition-all hover:bg-[var(--border)] hover:text-[var(--text)]"
              onClick={() => onToggle(c.id)}
            >
              {c.active ? 'Desactivar' : 'Activar'}
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="rounded-md border border-dashed border-border p-8 text-center text-[var(--text-muted)]">No hay categorías todavía.</div>
        )}
      </div>
    </div>
  );
}
