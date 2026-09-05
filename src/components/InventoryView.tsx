import type { Product, Category } from '../types/store';

interface InventoryViewProps {
  products: Product[];
  categories: Category[];
  onAdjustStock: (productId: string, newStock: number) => void;
}

const LOW_STOCK_THRESHOLD = 5;

const TH = 'border-b border-border bg-[var(--bg-alt)] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.4px] text-[var(--text-light)]';

function formatPrice(amount: number): string {
  return `S/. ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
}

export function InventoryView({ products, categories, onAdjustStock }: InventoryViewProps) {
  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? '—';
  const lowStock = products.filter((p) => p.stock < LOW_STOCK_THRESHOLD && p.active);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2.5 rounded-sm border border-[color:var(--warning-soft)] bg-[var(--warning-soft)] px-4 py-3">
        <span className="text-base">⚠️</span>
        {lowStock.length === 0 ? (
          <span className="text-[13px] font-medium text-[var(--warning-text)]">Sin alertas de stock bajo.</span>
        ) : (
          <span className="text-[13px] font-medium text-[var(--warning-text)]">
            {lowStock.length} {lowStock.length === 1 ? 'producto con' : 'productos con'} stock bajo (menor a {LOW_STOCK_THRESHOLD} unidades).
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-md border border-border bg-card">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className={TH}>Producto</th>
              <th className={TH}>Categoría</th>
              <th className={`${TH} w-[110px] text-right`}>Precio</th>
              <th className={`${TH} w-[110px] text-right`}>Stock actual</th>
              <th className={TH}>Estado</th>
              <th className={`${TH} w-20 text-right`}>Ajustar</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const isLow = p.stock < LOW_STOCK_THRESHOLD;
              return (
                <tr key={p.id} className={isLow ? 'bg-[rgba(231,76,60,0.04)]' : ''}>
                  <td className="px-4 py-2.5">
                    <span className="font-semibold text-primary">{p.name}</span>
                  </td>
                  <td className="px-4 py-2.5 text-[var(--text)] max-[768px]:hidden">{categoryName(p.category_id)}</td>
                  <td className="w-[110px] px-4 py-2.5 text-right">{formatPrice(p.price)}</td>
                  <td className="w-[110px] px-4 py-2.5 text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      <button
                        className="h-7 w-7 cursor-pointer rounded-sm border border-[var(--border-dark)] bg-[var(--bg)] text-base font-semibold text-[var(--text)] transition-colors hover:bg-[var(--border)] disabled:cursor-not-allowed disabled:opacity-40"
                        onClick={() => onAdjustStock(p.id, Math.max(0, p.stock - 1))}
                        disabled={p.stock === 0}
                        aria-label="Restar"
                      >
                        −
                      </button>
                      <input
                        className={`w-14 border bg-[var(--bg)] px-2 py-1.5 text-center font-sans text-sm text-[var(--text)] focus:border-accent focus:outline-none ${isLow ? 'rounded-sm border-[var(--danger-text)] font-semibold text-[var(--danger-text)]' : 'rounded-sm border-border'}`}
                        type="number"
                        min="0"
                        value={p.stock}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          if (!isNaN(v) && v >= 0) onAdjustStock(p.id, v);
                        }}
                      />
                      <button
                        className="h-7 w-7 cursor-pointer rounded-sm border border-[var(--border-dark)] bg-[var(--bg)] text-base font-semibold text-[var(--text)] transition-colors hover:bg-[var(--border)]"
                        onClick={() => onAdjustStock(p.id, p.stock + 1)}
                        aria-label="Sumar"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>
                    {!p.active ? (
                      <span className="inline-block rounded-full bg-[rgba(149,165,166,0.15)] px-2.5 py-[3px] text-[11px] font-semibold text-[var(--text-muted)]">Inactivo</span>
                    ) : isLow ? (
                      <span className="inline-block rounded-full bg-[var(--danger-soft)] px-2.5 py-[3px] text-[11px] font-semibold text-[var(--danger-text)]">Stock bajo</span>
                    ) : (
                      <span className="inline-block rounded-full bg-[var(--success-soft)] px-2.5 py-[3px] text-[11px] font-semibold text-[var(--success-text)]">En stock</span>
                    )}
                  </td>
                  <td className="w-20 px-4 py-2.5 text-right">
                    <button
                      className="cursor-pointer rounded-sm border border-[var(--border-dark)] bg-transparent px-2.5 py-[5px] text-xs text-[var(--text-light)] transition-all hover:bg-[var(--border)] hover:text-[var(--text)]"
                      onClick={() => onAdjustStock(p.id, p.stock + 10)}
                    >
                      +10
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
