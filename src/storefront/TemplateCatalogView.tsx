import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, ShoppingBag, Star } from 'lucide-react';
import type { Category, Product, StoreWithMetrics } from '../types/store';
import { FichaCatalogView } from './FichaCatalogView';

interface TemplateCatalogViewProps {
  store: StoreWithMetrics | null;
  products: Product[];
  categories: Category[];
  onAdd: (product: Product) => void;
  variant: 'orbe' | 'ficha';
}

const IMAGES = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85',
];

export function TemplateCatalogView({ store, products, categories, onAdd, variant }: TemplateCatalogViewProps) {
  if (variant === 'ficha') {
    return <FichaCatalogView store={store} products={products} categories={categories} onAdd={onAdd} />;
  }
  const dark = variant === 'orbe';
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('featured');
  const [favorites, setFavorites] = useState<string[]>([]);
  const storeCategories = categories.filter((item) => item.store_id === store?.id && item.active);
  const activeProducts = products.filter((item) => item.active);
  const filtered = useMemo(() => {
    const result = activeProducts.filter((product) => (
      (category === 'all' || product.category_id === category)
      && product.name.toLowerCase().includes(search.toLowerCase())
    ));
    if (sort === 'price-asc') return [...result].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [activeProducts, category, search, sort]);
  const featured = activeProducts.slice(0, 4);
  const palette = dark
    ? { bg: '#12141c', surface: '#1b1e2a', raised: '#242838', text: '#f5f4f0', soft: '#a7abbd', accent: '#ff6b5b', mint: '#4fd1a5', line: 'rgba(255,255,255,.09)' }
    : { bg: '#fafaf6', surface: '#f1eee3', raised: '#ffffff', text: '#17180f', soft: '#5b5c4e', accent: '#ff6a1a', mint: '#2e7d4f', line: '#d9d4c2' };

  return (
    <div className="min-h-full" style={{ background: palette.bg, color: palette.text }}>
      <section className="relative overflow-hidden px-4 py-10 sm:px-8 sm:py-14">
        <div className="pointer-events-none absolute -right-36 -top-36 h-[25rem] w-[25rem] rounded-full border" style={{ borderColor: palette.line }} />
        <div className="pointer-events-none absolute -right-20 -top-20 h-[16rem] w-[16rem] rounded-full border" style={{ borderColor: `${palette.accent}55` }} />
        <div className="relative mx-auto max-w-[1280px]">
          <span className="mb-3 inline-flex items-center gap-2 text-xs text-[#a7abbd]"><span className="h-1.5 w-1.5 rounded-full" style={{ background: palette.mint }} /> Colección 2026 activa</span>
          <h1 className="max-w-xl font-serif text-[clamp(2.3rem,8vw,4.2rem)] leading-[1.05]">{dark ? <>Tecnología que <em style={{ color: palette.accent }}>gira</em> en torno a lo esencial.</> : 'Catálogo técnico para elegir mejor.'}</h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed" style={{ color: palette.soft }}>{store?.description || 'Un catálogo corto, probado a fondo, pensado para elegirse desde el celular.'}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <a href="#orbe-catalogo" className="inline-flex min-h-12 items-center gap-2 rounded-xl px-5 text-sm font-bold no-underline" style={{ background: palette.accent, color: dark ? '#1a0c08' : '#fff' }}>Explorar catálogo <ShoppingBag className="h-4 w-4" /></a>
            <a href="#orbe-historia" className="inline-flex min-h-12 items-center rounded-xl border px-5 text-sm font-bold no-underline" style={{ borderColor: palette.line }}>Cómo elegimos</a>
          </div>
          <div className="mt-7 flex gap-2 overflow-x-auto pb-1">
            {[['4.9', 'Valoración media'], ['24–48h', 'Envío nacional'], ['30 días', 'Para devolver']].map(([value, label]) => <div key={label} className="min-w-[126px] rounded-2xl border p-3" style={{ background: palette.surface, borderColor: palette.line }}><b className="block font-serif text-[22px]" style={{ color: '#f2b84b' }}>{value}</b><span className="text-[11px]" style={{ color: palette.soft }}>{label}</span></div>)}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-4 flex items-baseline justify-between"><h2 className="font-serif text-2xl">Destacados</h2><button type="button" onClick={() => document.getElementById('orbe-catalogo')?.scrollIntoView({ behavior: 'smooth' })} className="text-xs underline underline-offset-4" style={{ color: palette.soft }}>Ver todo</button></div>
          <div className="flex snap-x gap-3 overflow-x-auto pb-2">
            {featured.map((product, index) => <Link key={product.id} to={`/tienda/${store?.slug}/producto/${product.id}`} className="min-w-[64vw] max-w-[230px] snap-start overflow-hidden rounded-2xl border no-underline sm:min-w-[230px]" style={{ background: palette.surface, borderColor: palette.line }}><div className="aspect-square overflow-hidden" style={{ background: palette.raised }}><img src={IMAGES[index % IMAGES.length]} alt="" className="h-full w-full object-cover transition-transform hover:scale-105" /></div><div className="p-3"><span className="text-[11px]" style={{ color: palette.soft }}>Selección</span><h3 className="mt-1 font-serif text-[15px]">{product.name}</h3><div className="mt-3 flex items-center justify-between border-t border-dashed pt-2" style={{ borderColor: palette.line }}><strong className="text-sm">S/. {product.price.toFixed(2)}</strong><button type="button" onClick={(event) => { event.preventDefault(); onAdd(product); }} className="grid h-9 w-9 place-items-center rounded-full border text-lg" style={{ background: palette.raised, borderColor: palette.line }}>+</button></div></div></Link>)}
          </div>
        </div>
      </section>

      <section id="orbe-catalogo" className="border-y px-4 py-10 sm:px-8" style={{ background: palette.surface, borderColor: palette.line }}>
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-5"><h2 className="font-serif text-3xl">Catálogo completo</h2><p className="mt-1 text-sm" style={{ color: palette.soft }}>{filtered.length} productos seleccionados para ti.</p></div>
          <div className="mb-4 flex flex-wrap gap-2">
            <label className="flex min-w-[180px] flex-1 items-center gap-2 rounded-xl border px-3" style={{ borderColor: palette.line, background: palette.bg }}><Search className="h-4 w-4" /><input id="orbe-search" className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none" placeholder="Buscar productos..." value={search} onChange={(event) => setSearch(event.target.value)} /></label>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="min-h-12 rounded-xl border px-3 text-sm" style={{ background: palette.surface, borderColor: palette.line, color: palette.text }}><option value="all">Todas las categorías</option>{storeCategories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="min-h-12 rounded-xl border px-3 text-sm" style={{ background: palette.surface, borderColor: palette.line, color: palette.text }}><option value="featured">Orden destacado</option><option value="price-asc">Precio menor</option><option value="price-desc">Precio mayor</option></select>
          </div>
          <div className="grid gap-3">
            {filtered.map((product, index) => <article key={product.id} className="flex overflow-hidden rounded-2xl border" style={{ background: palette.bg, borderColor: palette.line }}><Link to={`/tienda/${store?.slug}/producto/${product.id}`} className="flex min-w-0 flex-1 no-underline"><div className="h-28 w-28 shrink-0 overflow-hidden sm:h-36 sm:w-36"><img src={IMAGES[index % IMAGES.length]} alt="" className="h-full w-full object-cover" /></div><div className="min-w-0 p-3 sm:p-4"><span className="text-[11px]" style={{ color: palette.soft }}>Producto seleccionado</span><h3 className="mt-1 font-serif text-[15px] leading-tight sm:text-base">{product.name}</h3><div className="mt-2 flex items-center gap-1 text-[11px]" style={{ color: palette.soft }}><Star className="h-3 w-3 fill-[#f2b84b] text-[#f2b84b]" /> Disponible</div><strong className="mt-3 block text-sm">S/. {product.price.toFixed(2)}</strong></div></Link><div className="flex flex-col items-center justify-between p-3"><button type="button" onClick={() => setFavorites((current) => current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id])} aria-label="Favorito" style={{ color: favorites.includes(product.id) ? '#ff7a70' : palette.soft }}><Heart className="h-4 w-4" fill={favorites.includes(product.id) ? 'currentColor' : 'none'} /></button><button type="button" onClick={() => onAdd(product)} className="grid h-9 w-9 place-items-center rounded-full" style={{ background: palette.accent, color: '#1a0c08' }}>+</button></div></article>)}
            {filtered.length === 0 && <p className="py-10 text-center text-sm" style={{ color: palette.soft }}>No encontramos productos con estos filtros.</p>}
          </div>
        </div>
      </section>

      <section id="orbe-historia" className="px-4 py-10 sm:px-8"><div className="mx-auto grid max-w-[1280px] gap-6 md:grid-cols-2 md:items-center"><img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1100&q=85" alt="Selección de dispositivos tecnológicos" className="aspect-[4/3] w-full rounded-2xl border object-cover" style={{ borderColor: palette.line }} /><div><h2 className="font-serif text-3xl">Pocas cosas, bien elegidas.</h2><p className="mt-4 max-w-md text-sm leading-relaxed" style={{ color: palette.soft }}>{store?.description || 'Cada producto pasa semanas de prueba real antes de entrar al catálogo.'}</p><div className="mt-5 grid gap-3">{['Selección verificada', 'Garantía real', 'Soporte humano'].map((item) => <div key={item} className="flex gap-3 border-b py-3" style={{ borderColor: palette.line }}><span className="mt-1 h-2 w-2 shrink-0 rounded-full border-2" style={{ borderColor: palette.mint }} /><span className="text-sm font-semibold">{item}</span></div>)}</div></div></div></section>

      <section id="orbe-opiniones" className="border-y px-4 py-10 sm:px-8" style={{ background: palette.surface, borderColor: palette.line }}><div className="mx-auto max-w-[1280px]"><div className="mb-5"><h2 className="font-serif text-3xl">Clientes satisfechos</h2><p className="mt-1 text-sm" style={{ color: palette.soft }}>4.9 de 5 sobre compras verificadas.</p></div><div className="flex gap-3 overflow-x-auto pb-2">{['La compra fue rápida y el producto llegó perfectamente protegido.', 'El soporte me ayudó a elegir el modelo correcto.', 'Diseño impecable, entrega puntual y pago sencillo.'].map((review) => <article key={review} className="min-w-[78vw] max-w-[320px] rounded-2xl border p-5 sm:min-w-[300px]" style={{ background: palette.raised, borderColor: palette.line }}><span style={{ color: '#f2b84b' }}>★★★★★</span><p className="my-3 font-serif text-[15px]">{review}</p><strong className="block text-xs">Compra verificada</strong></article>)}</div></div></section>

      <section className="px-4 py-10 sm:px-8"><div className="mx-auto max-w-[1280px] rounded-[28px] border p-6 sm:p-8" style={{ background: palette.surface, borderColor: palette.line }}><h2 className="font-serif text-3xl">10% en tu primer pedido</h2><p className="mt-2 text-sm" style={{ color: palette.soft }}>Novedades de catálogo, sin spam.</p><form className="mt-5 flex flex-col gap-2 sm:flex-row" onSubmit={(event) => event.preventDefault()}><input type="email" required placeholder="tu@email.com" className="min-h-12 flex-1 rounded-xl border px-3 text-sm" style={{ background: palette.bg, borderColor: palette.line }} /><button type="submit" className="min-h-12 rounded-xl px-5 text-sm font-bold" style={{ background: palette.mint, color: '#08241a' }}>Quiero mi descuento</button></form></div></section>
    </div>
  );
}
