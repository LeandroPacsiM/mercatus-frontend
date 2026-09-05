import { useState } from 'react';
import type { Product, Category, FulfillmentType } from '../types/store';

interface ProductFormProps {
  storeId: string;
  product: Product | null;
  categories: Category[];
  onSave: (product: Product) => void;
  onCancel: () => void;
}

const LABEL = 'text-sm font-semibold text-[var(--text)]';
const INPUT =
  'rounded-sm border border-border bg-[var(--bg)] px-[14px] py-2.5 font-sans text-sm text-[var(--text)] transition-colors focus:border-accent focus:outline-none';

export function ProductForm({ storeId, product, categories, onSave, onCancel }: ProductFormProps) {
  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [stock, setStock] = useState(product ? String(product.stock) : '');
  const [categoryId, setCategoryId] = useState(product?.category_id ?? categories[0]?.id ?? '');
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>(product?.fulfillmentType ?? 'SHIPPING');
  const [active, setActive] = useState(product?.active ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = product !== null;

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = 'El nombre es obligatorio (mín. 2 caracteres)';
    const priceNum = Number(price);
    if (price === '' || isNaN(priceNum) || priceNum < 0) next.price = 'Precio inválido';
    const stockNum = Number(stock);
    if (stock === '' || isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum))
      next.stock = 'Stock inválido (entero ≥ 0)';
    if (!categoryId) next.category = 'Selecciona una categoría';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const saved: Product = {
      id: product?.id ?? `p-${storeId.slice(0, 4)}-${crypto.randomUUID().slice(0, 8)}`,
      store_id: storeId,
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      stock: Number(stock),
      active,
      category_id: categoryId,
      fulfillmentType,
      createdAt: product?.createdAt ?? new Date().toISOString().slice(0, 10),
    };

    onSave(saved);
  }

  return (
    <div className="max-w-[640px]">
      <form className="flex flex-col gap-[18px] rounded-md border border-border bg-card p-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label className={LABEL} htmlFor="p-name">Nombre del producto</label>
          <input
            id="p-name"
            className={`${INPUT} ${errors.name ? 'border-[var(--danger-text)]' : ''}`}
            type="text"
            placeholder="Ej: Laptop UltraBook 14 pulgadas"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <span className="text-xs text-[var(--danger-text)]">{errors.name}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={LABEL} htmlFor="p-desc">Descripción</label>
          <textarea
            id="p-desc"
            className={`${INPUT} min-h-[80px] resize-y`}
            rows={3}
            placeholder="Describe el producto..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
          <div className="flex flex-col gap-1.5">
            <label className={LABEL} htmlFor="p-price">Precio (S/.)</label>
            <input
              id="p-price"
              className={`${INPUT} ${errors.price ? 'border-[var(--danger-text)]' : ''}`}
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {errors.price && <span className="text-xs text-[var(--danger-text)]">{errors.price}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={LABEL} htmlFor="p-stock">Stock</label>
            <input
              id="p-stock"
              className={`${INPUT} ${errors.stock ? 'border-[var(--danger-text)]' : ''}`}
              type="number"
              min="0"
              step="1"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
            {errors.stock && <span className="text-xs text-[var(--danger-text)]">{errors.stock}</span>}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={LABEL} htmlFor="p-cat">Categoría</label>
          <select
            id="p-cat"
            className={`${INPUT} ${errors.category ? 'border-[var(--danger-text)]' : ''}`}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.category && <span className="text-xs text-[var(--danger-text)]">{errors.category}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={LABEL} htmlFor="p-ful">Tipo de cumplimiento</label>
          <select
            id="p-ful"
            className={INPUT}
            value={fulfillmentType}
            onChange={(e) => setFulfillmentType(e.target.value as FulfillmentType)}
          >
            <option value="SHIPPING">Envío físico (con seguimiento)</option>
            <option value="DIGITAL">Descarga digital (entrega instantánea)</option>
            <option value="PICKUP">Retiro en tienda</option>
          </select>
        </div>

        <div className="flex flex-row items-center gap-3">
          <label className={LABEL}>Estado</label>
          <button
            type="button"
            className={`relative h-6 w-11 cursor-pointer rounded-xl border-none p-0 transition-colors ${active ? 'bg-[var(--success)]' : 'bg-[var(--border-dark)]'}`}
            onClick={() => setActive(!active)}
            role="switch"
            aria-checked={active}
          >
            <span className={`absolute left-[3px] top-[3px] h-[18px] w-[18px] rounded-full bg-white transition-transform ${active ? 'translate-x-5' : ''}`} />
          </button>
          <span className={`text-[13px] font-semibold ${active ? 'text-[var(--success-text)]' : 'text-[var(--text-muted)]'}`}>
            {active ? 'Activo' : 'Inactivo'}
          </span>
        </div>

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
            className="cursor-pointer rounded-sm border-none bg-accent px-5 py-2.5 text-sm font-semibold text-(--on-accent) transition-all hover:bg-[var(--accent-hover)]"
          >
            {isEditing ? 'Guardar Cambios' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}
