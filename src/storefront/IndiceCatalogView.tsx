import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, ShoppingBag, Star } from 'lucide-react';
import type { Category, Product, StoreWithMetrics } from '../types/store';

interface IndiceCatalogViewProps {
  store: StoreWithMetrics | null;
  products: Product[];
  categories: Category[];
  onAdd: (product: Product) => void;
}

const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=85',
];

function productImage(index: number) {
  return PRODUCT_IMAGES[index % PRODUCT_IMAGES.length];
}

export function IndiceCatalogView({ store, products, categories, onAdd }: IndiceCatalogViewProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [openProduct, setOpenProduct] = useState<string | null>(null);
  useEffect(() => {
    const handleHeaderSearch = (event: Event) => {
      setSearch((event as CustomEvent<string>).detail);
    };
    window.addEventListener('indice-search', handleHeaderSearch);
    return () => window.removeEventListener('indice-search', handleHeaderSearch);
  }, []);
  const storeCategories = categories.filter((item) => item.store_id === store?.id && item.active);
  const activeProducts = products.filter((item) => item.active);
  const featured = activeProducts.slice(0, 4);
  const filtered = useMemo(() => activeProducts.filter((product) => (
    (category === 'all' || product.category_id === category)
      && product.name.toLowerCase().includes(search.toLowerCase())
  )), [activeProducts, category, search]);

  function toggleFavorite(id: string) {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return (
    <div className="overflow-hidden bg-white pt-24 text-[#111110]">
      <section className="relative overflow-hidden border-b border-[#e7e4da] px-4 py-12 sm:px-8 sm:py-16">
        <div className="pointer-events-none absolute -right-32 -top-40 h-[28rem] w-[28rem] rounded-full border border-[#e7e4da] sm:-right-24" />
        <div className="relative mx-auto max-w-[1180px]">
          <span className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#1b4cff]"><span className="h-2 w-2 rounded-full bg-[#ff4d6d]" /> Colección 2026</span>
          <h1 className="max-w-3xl font-sans text-[clamp(3.5rem,11vw,8rem)] font-black uppercase leading-[0.82] tracking-[-0.06em]">Tecnología<br /><span className="text-[#1b4cff]">sin ruido.</span></h1>
          <div className="mt-8 flex max-w-xl flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-sm text-base leading-relaxed text-[#6e6c62]">Un catálogo corto contado como revista: productos elegidos, probados y preparados para acompañarte.</p>
            <a href="#indice-catalogo" className="inline-flex w-fit items-center rounded-sm bg-[#1b4cff] px-5 py-3 text-sm font-bold text-white no-underline hover:bg-[#123ad1]">Ver el índice</a>
          </div>
        </div>
      </section>

      <section id="lookbook" className="mx-auto max-w-[1180px] px-4 py-10 sm:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div><span className="text-xs font-bold uppercase tracking-[0.16em] text-[#6e6c62]">Selección</span><h2 className="mt-1 text-3xl font-black uppercase tracking-[-0.04em]">Destacados</h2></div>
          <span className="text-sm text-[#6e6c62]">{featured.length} piezas</span>
        </div>
        <div className="flex snap-x gap-4 overflow-x-auto pb-3">
          {featured.map((product, index) => (
            <article key={product.id} className="min-w-[min(78vw,310px)] snap-start sm:min-w-[300px]">
              <Link to={`/tienda/${store?.slug}/producto/${product.id}`} className="group block no-underline">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#f7f6f1]">
                  <img src={productImage(index)} alt="" className="h-full w-full object-cover grayscale transition duration-300 group-hover:scale-105 group-hover:grayscale-0" />
                  <span className="absolute left-3 top-3 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider">N.º {String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="mt-3 flex items-start justify-between gap-3"><div><span className="text-xs text-[#6e6c62]">Selección</span><h3 className="mt-1 text-lg font-bold leading-tight">{product.name}</h3></div><span className="whitespace-nowrap text-sm font-bold">S/. {product.price.toFixed(2)}</span></div>
              </Link>
              <button type="button" onClick={() => onAdd(product)} className="mt-3 inline-flex items-center gap-2 border-b border-[#1b4cff] pb-1 text-sm font-bold text-[#1b4cff]">Agregar al pedido <ShoppingBag className="h-4 w-4" /></button>
            </article>
          ))}
        </div>
      </section>

      <section id="indice-catalogo" className="border-y border-[#e7e4da] bg-[#f7f6f1] px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div><span className="text-xs font-bold uppercase tracking-[0.16em] text-[#6e6c62]">Catálogo</span><h2 className="mt-1 text-3xl font-black uppercase tracking-[-0.04em]">Índice completo</h2></div>
            <label className="flex w-full max-w-sm items-center gap-2 border-b border-[#111110] py-2"><Search className="h-4 w-4" /><input id="catalog-search" className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="Buscar en el catálogo..." value={search} onChange={(event) => setSearch(event.target.value)} /></label>
          </div>
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            <button type="button" onClick={() => setCategory('all')} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold ${category === 'all' ? 'bg-[#1b4cff] text-white' : 'border border-[#d9d4c2] bg-white'}`}>Todo</button>
            {storeCategories.map((item) => <button key={item.id} type="button" onClick={() => setCategory(item.id)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold ${category === item.id ? 'bg-[#1b4cff] text-white' : 'border border-[#d9d4c2] bg-white'}`}>{item.name}</button>)}
          </div>
          <div className="divide-y divide-[#d9d4c2] border-y border-[#d9d4c2]">
            {filtered.map((product, index) => (
              <div key={product.id} className="border-b border-[#d9d4c2] last:border-b-0">
                <div className="grid grid-cols-[32px_56px_minmax(0,1fr)_auto] items-center gap-3 py-4 sm:grid-cols-[40px_72px_minmax(0,1fr)_auto_auto]">
                <span className="text-xs text-[#6e6c62]">{String(index + 1).padStart(2, '0')}</span>
                <img src={productImage(index)} alt="" className="h-14 w-14 object-cover grayscale sm:h-16 sm:w-16" />
                <button type="button" onClick={() => setOpenProduct(openProduct === product.id ? null : product.id)} className="min-w-0 text-left"><strong className="block truncate text-sm sm:text-base">{product.name}</strong><span className="mt-1 block text-xs text-[#6e6c62]">Producto seleccionado · {openProduct === product.id ? 'Ocultar ficha' : 'Ver ficha'}</span></button>
                <span className="text-right text-sm font-bold">S/. {product.price.toFixed(2)}</span>
                <div className="col-span-2 flex items-center gap-3 sm:col-span-1"><button type="button" onClick={() => toggleFavorite(product.id)} className={`text-xs ${favorites.includes(product.id) ? 'text-[#ff4d6d]' : 'text-[#6e6c62]'}`} aria-label="Favorito"><Heart className="h-4 w-4" fill={favorites.includes(product.id) ? 'currentColor' : 'none'} /></button><button type="button" onClick={() => onAdd(product)} className="text-xs font-bold text-[#1b4cff]">Agregar</button><span className="hidden items-center gap-1 text-xs text-[#6e6c62] sm:inline-flex"><Star className="h-3 w-3 fill-[#ffd23f] text-[#ffd23f]" /> Seleccionado</span></div>
                </div>
                {openProduct === product.id && <div className="grid gap-4 bg-white p-4 sm:grid-cols-[120px_1fr_auto] sm:items-center"><img src={productImage(index)} alt={product.name} className="h-24 w-full object-cover grayscale sm:w-28" /><p className="text-sm leading-relaxed text-[#6e6c62]">{product.description || 'Producto seleccionado para este catálogo.'}</p><Link to={`/tienda/${store?.slug}/producto/${product.id}`} className="text-sm font-bold text-[#1b4cff] no-underline">Ver producto</Link></div>}
              </div>
            ))}
            {filtered.length === 0 && <p className="py-10 text-center text-sm text-[#6e6c62]">No encontramos productos con estos filtros.</p>}
          </div>
        </div>
      </section>

      <section id="historia" className="mx-auto grid max-w-[1180px] gap-8 px-4 py-12 sm:px-8 md:grid-cols-[1fr_1fr] md:items-center">
        <div className="overflow-hidden bg-[#f7f6f1]"><img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1100&q=85" alt="Selección de dispositivos tecnológicos" className="aspect-[4/3] h-full w-full object-cover grayscale" /></div>
        <div><span className="text-xs font-bold uppercase tracking-[0.16em] text-[#1b4cff]">Nuestra forma de elegir</span><h2 className="mt-3 text-4xl font-black uppercase leading-[0.9] tracking-[-0.05em]">Pocas cosas,<br />bien elegidas</h2><p className="mt-5 max-w-md leading-relaxed text-[#6e6c62]">{store?.description || 'Cada producto tiene un lugar porque fue seleccionado para hacer mejor tu día.'}</p><div className="mt-7 grid gap-4 text-sm sm:grid-cols-3 md:grid-cols-1"><div><b className="text-[#1b4cff]">01</b><p className="mt-1">Selección verificada</p></div><div><b className="text-[#1b4cff]">02</b><p className="mt-1">Compra sencilla</p></div><div><b className="text-[#1b4cff]">03</b><p className="mt-1">Soporte humano</p></div></div></div>
      </section>

      <section id="opiniones" className="border-y border-[#e7e4da] bg-[#f7f6f1] px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-5 flex items-end justify-between gap-4"><h2 className="text-3xl font-black uppercase tracking-[-0.04em]">Clientes satisfechos</h2><span className="text-sm text-[#6e6c62]">4.9 de 5</span></div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {['La compra fue rápida y el producto llegó perfectamente protegido.', 'El soporte me ayudó a elegir el modelo correcto.', 'Diseño impecable, entrega puntual y pago sencillo.'].map((review) => <blockquote key={review} className="min-w-[260px] rounded-sm bg-white p-5 text-sm leading-relaxed">★★★★★<br /><span className="text-[#6e6c62]">“{review}”</span></blockquote>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-4 py-12 sm:px-8">
        <div className="flex flex-col gap-5 bg-[#111110] p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div><h2 className="text-3xl font-black uppercase leading-[.9]">10% en tu<br />primer pedido</h2><p className="mt-2 text-sm text-white/70">Novedades del índice, sin spam.</p></div>
          <form className="flex w-full max-w-md gap-2" onSubmit={(event) => { event.preventDefault(); }}>
            <input type="email" required placeholder="tu@email.com" className="min-w-0 flex-1 border border-white/20 bg-white/10 px-3 py-2 text-sm outline-none placeholder:text-white/50" />
            <button type="submit" className="shrink-0 bg-[#1b4cff] px-4 py-2 text-sm font-bold">Quiero mi descuento</button>
          </form>
        </div>
      </section>
    </div>
  );
}
