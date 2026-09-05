import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, ShoppingBag, Star } from 'lucide-react';
import type { Category, Product, StoreWithMetrics } from '../types/store';

interface FichaCatalogViewProps {
  store: StoreWithMetrics | null;
  products: Product[];
  categories: Category[];
  onAdd: (product: Product) => void;
}

const IMAGES = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85',
];

export function FichaCatalogView({ store, products, categories, onAdd }: FichaCatalogViewProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('featured');
  const [favorites, setFavorites] = useState<string[]>([]);
  const items = categories.filter((item) => item.store_id === store?.id && item.active);
  const active = products.filter((item) => item.active);
  const filtered = useMemo(() => {
    const result = active.filter((item) => (category === 'all' || item.category_id === category) && item.name.toLowerCase().includes(search.toLowerCase()));
    if (sort === 'price-asc') return [...result].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [active, category, search, sort]);

  return (
    <div className="bg-[#fafaf6] font-mono text-[#17180f]">
      <section className="relative overflow-hidden border-b border-[#d9d4c2] bg-[radial-gradient(circle_at_1px_1px,#d9d4c2_1px,transparent_1.6px)] bg-[length:22px_22px] px-4 sm:px-8">
        <div className="mx-auto grid max-w-[1320px] gap-10 py-14 sm:py-16 md:grid-cols-[1.15fr_.85fr] md:items-center">
          <div>
            <p className="mb-4 text-xs text-[#5b5c4e]">Colección <strong className="text-[#17180f]">2026</strong> — {active.length} fichas activas en catálogo</p>
            <h1 className="max-w-xl font-serif text-[clamp(2.4rem,7vw,4rem)] leading-none">El catálogo técnico<span className="mt-1 block text-[.72em] italic text-[#5b5c4e]">de lo que de verdad usas.</span></h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#5b5c4e]">{store?.description || 'Cada producto lleva su ficha: especificaciones reales, sin relleno. Elegimos pocas cosas, pero las probamos todas.'}</p>
            <div className="mt-7 flex flex-wrap gap-3"><a href="#ficha-catalogo" className="inline-flex min-h-11 items-center rounded-sm bg-[#17180f] px-5 text-xs text-[#fafaf6] no-underline">Ver catálogo</a><a href="#ficha-historia" className="inline-flex min-h-11 items-center rounded-sm border border-[#17180f] px-5 text-xs no-underline hover:bg-[#17180f] hover:text-[#fafaf6]">Cómo elegimos</a></div>
          </div>
          <div className="w-full max-w-[300px] rotate-[-2deg] border border-[#17180f] bg-white p-3 shadow-[8px_8px_0_#f1eee3]"><img src={IMAGES[1]} alt="Producto destacado" className="aspect-square w-full object-cover" /><div className="mt-2 flex justify-between border-t border-dashed border-[#d9d4c2] pt-2 text-[11px]"><span>N.º 002 — Wearables</span><b className="text-[#ff6a1a]">S/. 299</b></div></div>
        </div>
      </section>

      <section className="border-b border-[#d9d4c2] bg-[#f1eee3] px-4 sm:px-8"><div className="mx-auto flex max-w-[1320px] flex-wrap"><span className="border-r border-[#d9d4c2] px-4 py-3 text-xs text-[#5b5c4e]"><b className="text-[#17180f]">24–48h</b> de envío</span><span className="border-r border-[#d9d4c2] px-4 py-3 text-xs text-[#5b5c4e]"><b className="text-[#17180f]">30 días</b> para devolver</span><span className="border-r border-[#d9d4c2] px-4 py-3 text-xs text-[#5b5c4e]"><b className="text-[#17180f]">24 meses</b> de garantía</span><span className="px-4 py-3 text-xs text-[#5b5c4e]"><b className="text-[#17180f]">Soporte</b> antes y después</span></div></section>

      <section id="ficha-catalogo" className="px-4 py-12 sm:px-8"><div className="mx-auto max-w-[1320px]"><div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><h2 className="font-serif text-3xl">Fichas de producto</h2><p className="mt-1 text-xs text-[#5b5c4e]">{filtered.length} productos seleccionados para ti.</p></div><div className="flex flex-wrap gap-2"><label className="flex min-w-[180px] items-center gap-2 border border-[#17180f] bg-[#fafaf6] px-3"><Search className="h-3.5 w-3.5" /><input id="ficha-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar..." className="min-w-0 flex-1 bg-transparent py-2.5 text-xs outline-none" /></label><select value={category} onChange={(event) => setCategory(event.target.value)} className="border border-[#17180f] bg-[#fafaf6] px-3 text-xs"><option value="all">Todas las categorías</option>{items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><select value={sort} onChange={(event) => setSort(event.target.value)} className="border border-[#17180f] bg-[#fafaf6] px-3 text-xs"><option value="featured">Orden destacado</option><option value="price-asc">Precio menor</option><option value="price-desc">Precio mayor</option></select></div></div><div className="grid grid-cols-2 gap-px border border-[#d9d4c2] bg-[#d9d4c2] md:grid-cols-3 lg:grid-cols-4">{filtered.map((product, index) => <article key={product.id} className="group flex flex-col bg-[#fafaf6]"><div className="relative aspect-square overflow-hidden bg-[#f1eee3]"><img src={IMAGES[index % IMAGES.length]} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-[1.03]" /><span className="absolute left-2 top-2 border border-[#17180f] bg-[#fafaf6] px-2 py-1 text-[10px]">N.º {String(index + 1).padStart(2, '0')}</span><button type="button" onClick={() => setFavorites((current) => current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id])} aria-label="Favorito" className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full border border-[#d9d4c2] bg-[#fafaf6]" style={{ color: favorites.includes(product.id) ? '#b93a2c' : '#17180f' }}><Heart className="h-4 w-4" fill={favorites.includes(product.id) ? 'currentColor' : 'none'} /></button><button type="button" onClick={() => onAdd(product)} className="absolute bottom-2 left-2 right-2 min-h-9 bg-[#17180f] text-[11px] text-[#fafaf6] opacity-0 transition-opacity group-hover:opacity-100">Agregar al carrito</button></div><div className="flex flex-1 flex-col p-3"><span className="text-[10px] text-[#5b5c4e]">Ficha técnica</span><Link to={`/tienda/${store?.slug}/producto/${product.id}`} className="mt-1 font-serif text-base leading-tight no-underline">{product.name}</Link><span className="mt-2 text-[11px] text-[#5b5c4e]"><Star className="mr-1 inline h-3 w-3 fill-[#17180f]" /> Producto verificado</span><div className="mt-auto flex items-center justify-between border-t border-dashed border-[#d9d4c2] pt-3"><strong className="text-sm">S/. {product.price.toFixed(2)}</strong><button type="button" onClick={() => onAdd(product)} className="grid h-8 w-8 place-items-center rounded-full border border-[#17180f] text-lg hover:bg-[#17180f] hover:text-[#fafaf6]"><ShoppingBag className="h-3.5 w-3.5" /></button></div></div></article>)}{filtered.length === 0 && <p className="col-span-full bg-[#fafaf6] py-14 text-center text-sm text-[#5b5c4e]">No encontramos productos con estos filtros.</p>}</div></div></section>

      <section id="ficha-historia" className="border-y border-[#d9d4c2] bg-[#f1eee3] px-4 py-12 sm:px-8"><div className="mx-auto grid max-w-[1320px] gap-7 md:grid-cols-2 md:items-center"><img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1100&q=85" alt="Selección de dispositivos" className="aspect-[4/3] w-full object-cover" /><div><h2 className="font-serif text-4xl leading-none">Un catálogo pequeño, revisado a fondo.</h2><p className="mt-4 text-sm leading-relaxed text-[#5b5c4e]">{store?.description || 'No listamos todo lo que existe. Probamos cada producto durante semanas antes de darle una ficha.'}</p><ul className="mt-5 border-t border-[#d9d4c2]">{[['Selección', 'Verificada a mano'], ['Garantía', '24 meses, sin letra pequeña'], ['Soporte', 'Antes y después de la compra']].map(([key, value]) => <li key={key} className="flex justify-between gap-3 border-b border-[#d9d4c2] py-3 text-xs"><span className="text-[#5b5c4e]">{key}</span><span>{value}</span></li>)}</ul></div></div></section>

      <section id="ficha-opiniones" className="px-4 py-12 sm:px-8"><div className="mx-auto max-w-[1320px]"><h2 className="font-serif text-3xl">Lo que dicen quienes compraron</h2><p className="mt-1 text-xs text-[#5b5c4e]">4.9 de 5 sobre compras verificadas.</p><div className="mt-6 grid gap-px border border-[#d9d4c2] bg-[#d9d4c2] md:grid-cols-3">{['La compra fue rápida y el producto llegó perfectamente protegido.', 'El soporte respondió antes de comprar y me ayudó a elegir el modelo correcto.', 'Diseño impecable, entrega puntual y proceso sencillo desde el celular.'].map((review) => <article key={review} className="bg-[#fafaf6] p-5"><span className="text-[#ff6a1a]">★★★★★</span><p className="my-3 font-serif text-base">{review}</p><strong className="block text-xs">Compra verificada</strong></article>)}</div></div></section>

      <section className="bg-[#f1eee3] px-4 py-12 sm:px-8"><div className="mx-auto grid max-w-[1320px] gap-6 bg-[#17180f] p-6 text-[#fafaf6] sm:p-9 md:grid-cols-2 md:items-center"><div><h2 className="font-serif text-4xl">10% en tu primera ficha</h2><p className="mt-2 text-sm text-[#b9b9ac]">Novedades de catálogo y lanzamientos, sin spam.</p></div><form className="flex flex-col gap-2" onSubmit={(event) => event.preventDefault()}><input type="email" required placeholder="tu@email.com" className="min-h-11 border border-[#3a3b2e] bg-[#212215] px-3 text-sm outline-none" /><button type="submit" className="min-h-11 bg-[#ff6a1a] text-xs font-semibold">Quiero mi descuento</button></form></div></section>
    </div>
  );
}
