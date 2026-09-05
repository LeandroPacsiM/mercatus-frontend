import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Product, StoreWithMetrics, Category, FulfillmentType } from '../types/store';
import { useCart } from './CartContext';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import { IndiceCatalogView } from './IndiceCatalogView';
import { TemplateCatalogView } from './TemplateCatalogView';

interface CatalogViewProps {
  store: StoreWithMetrics | null;
  products: Product[];
  categories: Category[];
  onAdd: (p: Product) => void;
}

const FULFILLMENT_LABEL: Record<FulfillmentType, string> = {
  SHIPPING: 'Envío físico',
  DIGITAL: 'Descarga digital',
  PICKUP: 'Retiro en tienda',
};

const FUL_TONE: Record<FulfillmentType, string> = {
  SHIPPING: 'bg-[var(--accent-soft)] text-[var(--accent-text)]',
  DIGITAL: 'bg-[var(--success-soft)] text-[var(--success-text)]',
  PICKUP: 'bg-[var(--warning-soft)] text-[var(--warning-text)]',
};

export function CatalogView({ store, products, categories, onAdd }: CatalogViewProps) {
  const { setStore } = useCart();
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('all');

  useEffect(() => {
    if (store) setStore(store.id);
  }, [store?.id, setStore]);

  const filtered = products.filter(
    (p) =>
      p.active &&
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (cat === 'all' || p.category_id === cat),
  );
  const storeCategories = categories.filter((c) => c.store_id === store?.id);
  const presetId = store?.theme?.presetId ?? 'base';
  const sections = store?.theme?.sections ?? { hero: true, featuredProducts: true, categories: true, footer: true };
  const featured = filtered.slice(0, 3);

  if (store?.theme?.templateId === 'indice') {
    return <IndiceCatalogView store={store} products={products} categories={categories} onAdd={onAdd} />;
  }
  if (store?.theme?.templateId === 'orbe' || store?.theme?.templateId === 'ficha') {
    return <TemplateCatalogView store={store} products={products} categories={categories} onAdd={onAdd} variant={store.theme.templateId} />;
  }

  return (
    <div className={presetId === 'indigo' ? 'space-y-8' : presetId === 'esmeralda' ? 'space-y-6' : ''}>
      {sections.hero && (
        <section className={`mb-7 overflow-hidden rounded-md p-7 max-[640px]:p-5 ${presetId === 'indigo' ? 'bg-[var(--store-primary)] text-white' : presetId === 'esmeralda' ? 'border border-[var(--store-accent)] bg-[var(--store-accent)]/20' : 'bg-[var(--store-primary)] text-white'}`}>
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.6px] opacity-75"><Sparkles className="h-4 w-4" aria-hidden="true" /> Bienvenido a {store?.name ?? 'nuestra tienda'}</div>
            <h1 className="m-0 mb-2 text-3xl font-extrabold">{presetId === 'indigo' ? 'Tecnología para tu próximo nivel' : presetId === 'esmeralda' ? 'Elige productos con propósito' : store?.name ?? 'Tu tienda favorita'}</h1>
            <p className="m-0 max-w-xl text-sm leading-relaxed opacity-80">{store?.description || 'Descubre productos seleccionados para ti y compra de forma sencilla.'}</p>
            <a href="#catalogo" className="mt-5 inline-flex items-center gap-2 rounded-sm bg-[var(--store-accent)] px-4 py-2.5 text-sm font-semibold text-(--on-accent) no-underline hover:no-underline">Explorar catálogo <ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
          </div>
        </section>
      )}

      {sections.categories && storeCategories.length > 0 && (
        <section className="mb-7">
          <h2 className="m-0 mb-3 text-lg font-bold text-primary">Explora por categoría</h2>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold ${cat === 'all' ? 'border-[var(--store-primary)] bg-[var(--store-primary)] text-white' : 'border-border bg-card text-[var(--text-light)]'}`} onClick={() => setCat('all')}>Todo</button>
            {storeCategories.filter((category) => category.active).map((category) => (
              <button key={category.id} type="button" className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold ${cat === category.id ? 'border-[var(--store-primary)] bg-[var(--store-primary)] text-white' : 'border-border bg-card text-[var(--text-light)]'}`} onClick={() => setCat(category.id)}>{category.name}</button>
            ))}
          </div>
        </section>
      )}

      {sections.featuredProducts && featured.length > 0 && !search && cat === 'all' && (
        <section className="mb-7">
          <h2 className="m-0 mb-3 text-lg font-bold text-primary">Productos destacados</h2>
          <div className="grid grid-cols-3 gap-4 max-[640px]:grid-cols-1">
            {featured.map((product) => (
              <Link key={product.id} to={`/tienda/${store?.slug}/producto/${product.id}`} className="group rounded-md border border-border bg-card p-3 no-underline transition-shadow hover:shadow-md">
                <div className="mb-3 flex h-32 items-center justify-center rounded-sm bg-[linear-gradient(145deg,var(--store-accent),var(--store-primary))] text-4xl font-extrabold text-(--on-accent) transition-transform group-hover:scale-[1.02]">{product.name.charAt(0)}</div>
                <span className="block truncate text-sm font-semibold text-[var(--text)]">{product.name}</span>
                <span className="mt-1 block text-sm font-bold text-primary">S/. {product.price.toFixed(2)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div id="catalogo" className="mb-[22px]">
        <h2 className="m-0 mb-1.5 text-2xl font-extrabold text-primary">Catálogo</h2>
        <p className="m-0 text-[15px] text-[var(--text-light)]">Encuentra el producto ideal para ti.</p>
      </div>

      <div className="mb-5 flex flex-wrap gap-3">
        <input
          id="catalog-search"
          className="min-w-0 flex-1 rounded-sm border border-border bg-card px-3 py-2.5 font-sans text-sm text-[var(--text)]"
          placeholder="Buscar productos"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="pointer-events-none -ml-11 flex items-center pr-3 text-[var(--text-muted)]"><Search className="h-4 w-4" /></span>
        <select className="rounded-sm border border-border bg-card px-3 py-2.5 font-sans text-sm text-[var(--text)]" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="all">Todas las categorías</option>
          {storeCategories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-[18px] max-[860px]:grid-cols-2">
        {filtered.map((p) => (
          <div key={p.id} className="flex flex-col overflow-hidden rounded-md border border-border bg-card transition-all duration-150 hover:-translate-y-1 hover:shadow-md">
            <Link to={`/tienda/${store?.slug}/producto/${p.id}`} className="group flex flex-col gap-1.5 p-4 text-inherit no-underline hover:no-underline">
              <div className="mb-2 flex h-[170px] w-full items-center justify-center rounded-sm bg-[linear-gradient(145deg,var(--store-accent),var(--store-primary))] text-[48px] font-extrabold text-(--on-accent) transition-transform group-hover:scale-[1.01]">{p.name.charAt(0)}</div>
              <div className="text-[15px] font-bold text-[var(--text)]">{p.name}</div>
              <div className="text-xs text-[var(--text-muted)]">
                {storeCategories.find((c) => c.id === p.category_id)?.name ?? '—'}
              </div>
              <div className="text-base font-extrabold text-primary">S/. {p.price.toFixed(2)}</div>
              <span className={`mt-2 inline-block rounded-[20px] px-2.5 py-[3px] text-[11px] font-bold uppercase tracking-[0.4px] ${FUL_TONE[p.fulfillmentType ?? 'SHIPPING']}`}>
                {FULFILLMENT_LABEL[p.fulfillmentType ?? 'SHIPPING']}
              </span>
            </Link>
            <button
              className="mx-4 mb-4 cursor-pointer rounded-sm border-none bg-accent p-[9px] text-[13px] font-semibold text-(--on-accent) transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:bg-[var(--border-dark)] disabled:text-[var(--text-muted)] disabled:hover:bg-[var(--border-dark)]"
              onClick={() => onAdd(p)}
              disabled={p.stock === 0}
            >
              {p.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
            </button>
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-full p-10 text-center text-[var(--text-muted)]">No hay productos que coincidan.</div>}
      </div>
    </div>
  );
}
