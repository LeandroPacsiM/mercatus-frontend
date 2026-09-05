import { useState } from 'react';
import type { Product, Category } from '../types/store';
import { Search } from 'lucide-react';

interface ProductsTableProps {
  products: Product[];
  categories: Category[];
  productLimit?: number;
  planName?: string;
  onAdd: () => void;
  onEdit: (productId: string) => void;
  onDeactivate: (productId: string) => void;
}

function formatPrice(amount: number): string {
  return `S/. ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
}

const TH = 'border-b border-border bg-[var(--bg-alt)] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.4px] text-[var(--text-light)]';
const TD = 'px-4 py-2.5';

export function ProductsTable({ products, categories, productLimit, planName, onAdd, onEdit, onDeactivate }: ProductsTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const atLimit = productLimit != null && products.length >= productLimit;

  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? '—';

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && p.active) ||
      (statusFilter === 'inactive' && !p.active);
    const matchesCategory = categoryFilter === 'all' || p.category_id === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-sm border border-border bg-card px-3 py-2">
          <Search className="h-4 w-4 opacity-60" aria-hidden="true" />
          <input
            className="w-full border-none bg-transparent font-sans text-sm text-[var(--text)] outline-none"
            type="text"
            placeholder="Buscar productos"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="cursor-pointer rounded-sm border border-border bg-card px-3 py-[9px] font-sans text-[13px] text-[var(--text)]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
        </select>
        <select
          className="cursor-pointer rounded-sm border border-border bg-card px-3 py-[9px] font-sans text-[13px] text-[var(--text)]"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button
          className="rounded-sm border-none bg-accent px-4 py-[9px] text-[13px] font-semibold text-(--on-accent) transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:bg-[var(--border-dark)] disabled:text-[var(--text-muted)] disabled:hover:bg-[var(--border-dark)]"
          onClick={onAdd}
          disabled={atLimit}
        >
          + Agregar producto
        </button>
      </div>

      <div className="text-[13px] text-[var(--text-light)]">
        {filtered.length} {filtered.length === 1 ? 'producto' : 'productos'}
        {productLimit != null && (
          <span className="text-[var(--text-muted)]">
            {' '}· Límite de tu plan {planName}: {products.length}/{productLimit === 9999 ? '∞' : productLimit}
          </span>
        )}
        {atLimit && (
          <span className="font-semibold text-[var(--warning-text)]">
            {' '}· Has alcanzado el límite. Sube de plan en "Mi Plan" para agregar más.
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-md border border-border bg-card">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className={`${TH} w-9 pl-4`}></th>
              <th className={TH}>Producto</th>
              <th className={TH}>Estado</th>
              <th className={TH}>Categoría</th>
              <th className={`${TH} w-[90px] text-right`}>Stock</th>
              <th className={`${TH} w-[90px] text-right`}>Precio</th>
              <th className={TH}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="cursor-pointer border-b border-border transition-colors hover:bg-[var(--bg-alt)]" onClick={() => onEdit(p.id)}>
                <td className="w-9 pl-4">
                  <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                </td>
                <td>
                  <div className="flex flex-col px-4 py-2.5">
                    <span className="font-semibold text-primary">{p.name}</span>
                    <span className="max-w-[360px] overflow-hidden text-ellipsis whitespace-nowrap text-xs text-[var(--text-muted)] max-[768px]:max-w-[160px]">{p.description}</span>
                  </div>
                </td>
                <td>
                  <span className={`inline-block rounded-full px-2.5 py-[3px] text-[11px] font-semibold ${p.active ? 'bg-[var(--success-soft)] text-[var(--success-text)]' : 'bg-[rgba(149,165,166,0.15)] text-[var(--text-muted)]'}`}>
                    {p.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className={`${TD} text-[var(--text)]`}>{categoryName(p.category_id)}</td>
                <td className={`${TD} w-[90px] text-right ${p.stock === 0 ? 'font-semibold text-[var(--danger-text)]' : ''}`}>
                  {p.stock === 0 ? 'Agotado' : p.stock}
                </td>
                <td className={`${TD} w-[90px] text-right font-semibold text-[var(--text)]`}>{formatPrice(p.price)}</td>
                <td className={`${TD} w-[100px] text-right`} onClick={(e) => e.stopPropagation()}>
                  {p.active ? (
                    <button
                      className="cursor-pointer rounded-sm border border-[var(--border-dark)] bg-transparent px-2.5 py-[5px] text-xs text-[var(--text-light)] transition-all hover:bg-[var(--border)] hover:text-[var(--text)]"
                      onClick={() => onDeactivate(p.id)}
                      title="Desactivar"
                    >
                      Desactivar
                    </button>
                  ) : (
                    <span className="text-xs text-[var(--text-muted)]">Inactivo</span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[var(--text-muted)]">
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
