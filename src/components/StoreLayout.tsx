import type { StoreWithMetrics } from '../types/store';
import { ArrowLeft, BarChart3, CreditCard, ExternalLink, House, Package, Palette, Settings2, ShoppingCart, Tags } from 'lucide-react';

interface StoreLayoutProps {
  store: StoreWithMetrics;
  activeView: string;
  onNavigate: (view: string) => void;
  onExit: () => void;
  stores: StoreWithMetrics[];
  onSwitchStore: (storeId: string) => void;
  onConfigure: () => void;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Inicio', icon: House },
  { id: 'orders', label: 'Pedidos', icon: ShoppingCart },
  { id: 'products', label: 'Productos', icon: Package },
  { id: 'inventory', label: 'Inventario', icon: BarChart3 },
  { id: 'categories', label: 'Categorías', icon: Tags },
  { id: 'plan', label: 'Mi Plan', icon: CreditCard },
];

const LINK =
  'flex w-full cursor-pointer items-center gap-2.5 rounded-sm border-none bg-transparent px-[14px] py-2.5 text-left text-sm font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-45';

export function StoreLayout({ store, activeView, onNavigate, onExit, stores, onSwitchStore, onConfigure }: StoreLayoutProps) {
  const subtitle = store.active ? 'Tienda activa' : 'Tienda inactiva';

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[260px] flex-col overflow-y-auto bg-black text-white max-[768px]:-translate-x-full">
      <button
        className="mx-4 mb-2 mt-4 cursor-pointer rounded-sm border border-white/[0.12] bg-white/[0.08] px-3 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-white/[0.16]"
        onClick={onExit}
      >
        <ArrowLeft className="mr-1 inline h-4 w-4" aria-hidden="true" /> Mis Tiendas
      </button>

      <div className="border-b border-white/10 px-5 py-3">
        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.6px] text-white/45" htmlFor="store-switcher">
          Tienda actual
        </label>
        <select
          id="store-switcher"
          className="w-full cursor-pointer rounded-sm border border-white/[0.15] bg-white/[0.08] px-2.5 py-2 text-sm font-semibold text-white outline-none focus:border-[#c1fbd4]"
          value={store.id}
          onChange={(event) => onSwitchStore(event.target.value)}
        >
          {stores.map((item) => <option key={item.id} value={item.id} className="bg-black text-white">{item.name}</option>)}
        </select>
      </div>

      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#c1fbd4] text-lg font-bold text-black">{store.name.charAt(0)}</div>
        <div className="flex min-w-0 flex-col">
          <span className="text-[15px] font-bold">{store.name}</span>
          <span className="font-mono text-[11px] text-white/50">{store.slug}.mercatus.app</span>
        </div>
      </div>

      <span className={`mx-5 mb-1 mt-3 text-[11px] font-semibold uppercase tracking-[0.4px] ${store.active ? 'text-[var(--success-text)]' : 'text-[var(--text-muted)]'}`}>
        {subtitle}
      </span>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => {
          const disabled = item.id !== 'home' && item.id !== 'products' && item.id !== 'inventory' && item.id !== 'categories' && item.id !== 'orders' && item.id !== 'plan';
          return (
            <button
              key={item.id}
              className={`${LINK} ${activeView === item.id ? 'bg-white/[0.15] text-white' : ''}`}
              onClick={() => !disabled && onNavigate(item.id)}
              disabled={disabled}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
        <span className="px-[14px] pb-1 pt-5 text-[10px] font-semibold uppercase tracking-[0.7px] text-white/35">Tienda</span>
        <button
          className={`${LINK} ${activeView === 'config' ? 'bg-white/[0.15] text-white' : ''}`}
          onClick={onConfigure}
        >
          <Settings2 className="h-4 w-4" aria-hidden="true" />
          Configuración
        </button>
        <button
          className={`${LINK} ${activeView === 'themes' ? 'bg-white/[0.15] text-white' : ''}`}
          onClick={() => onNavigate('themes')}
        >
          <Palette className="h-4 w-4" aria-hidden="true" />
          Temas
        </button>
        <a
          className={`${LINK} no-underline hover:no-underline`}
          href={`/tienda/${store.slug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Ver tienda
        </a>
      </nav>

      <div className="border-t border-white/10 px-5 py-4 text-center">
        <span className="text-[11px] text-white/40">Volver al panel global</span>
      </div>
    </aside>
  );
}
