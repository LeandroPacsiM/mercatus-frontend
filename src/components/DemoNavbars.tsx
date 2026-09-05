import { useState } from 'react';
import { Link } from 'react-router-dom';

const LINKS = ['Cómo funciona', 'Características', 'Planes', 'FAQ'];

function GlassNavbar() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-[var(--bg)]/85 px-8 py-[14px] backdrop-blur-xl">
      <div className="text-xl font-bold text-primary">🛍️ Mercatus</div>
      <nav className="hidden gap-6 md:flex">
        {LINKS.map((l) => (
          <a key={l} href="#" onClick={(e) => e.preventDefault()} className="text-sm text-[var(--text-light)] no-underline transition-colors hover:text-primary">{l}</a>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <a href="#" onClick={(e) => e.preventDefault()} className="text-sm font-semibold text-[var(--text)] no-underline">Iniciar sesión</a>
        <a href="#" onClick={(e) => e.preventDefault()} className="rounded-sm bg-accent px-[18px] py-[9px] text-sm font-semibold text-(--on-accent) no-underline">Probar gratis</a>
      </div>
    </header>
  );
}

function PillNavbar() {
  return (
    <div className="bg-[var(--bg-alt)] px-6 py-6">
      <header className="mx-auto flex max-w-[900px] items-center justify-between gap-4 rounded-full border border-border bg-card py-2 pl-6 pr-2 shadow-md">
        <div className="text-lg font-bold text-primary">🛍️ Mercatus</div>
        <nav className="hidden gap-5 lg:flex">
          {LINKS.map((l) => (
            <a key={l} href="#" onClick={(e) => e.preventDefault()} className="text-sm text-[var(--text-light)] no-underline transition-colors hover:text-primary">{l}</a>
          ))}
        </nav>
        <a href="#" onClick={(e) => e.preventDefault()} className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-(--on-accent) no-underline">Probar gratis</a>
      </header>
    </div>
  );
}

function MegaNavbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="relative z-10 flex items-center justify-between border-b border-border bg-[var(--bg)] px-8 py-[14px]">
      <div className="text-xl font-bold text-primary">🛍️ Mercatus</div>
      <nav className="hidden items-center gap-6 md:flex">
        <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
          <button className="cursor-pointer border-none bg-transparent text-sm text-[var(--text-light)] hover:text-primary">
            Productos ▾
          </button>
          {open && (
            <div className="absolute left-1/2 top-full w-[420px] -translate-x-1/2 pt-3 motion-safe:animate-fade-in">
              <div className="grid grid-cols-2 gap-1 rounded-md border border-border bg-card p-3 shadow-lg">
                {[
                  ['🏪', 'Multi-tienda', 'Varias tiendas, una cuenta'],
                  ['📦', 'Inventario', 'Stock en tiempo real'],
                  ['🛒', 'Pedidos', 'Seguimiento completo'],
                  ['📊', 'Dashboard', 'Métricas por tienda'],
                ].map(([icon, title, desc]) => (
                  <a
                    key={title}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="rounded-sm p-3 no-underline transition-colors hover:bg-[var(--bg-alt)] hover:no-underline"
                  >
                    <div className="text-xl">{icon}</div>
                    <div className="text-sm font-bold text-[var(--text)]">{title}</div>
                    <div className="text-xs text-[var(--text-light)]">{desc}</div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        {['Planes', 'FAQ'].map((l) => (
          <a key={l} href="#" onClick={(e) => e.preventDefault()} className="text-sm text-[var(--text-light)] no-underline transition-colors hover:text-primary">{l}</a>
        ))}
      </nav>
      <a href="#" onClick={(e) => e.preventDefault()} className="rounded-sm bg-accent px-[18px] py-[9px] text-sm font-semibold text-(--on-accent) no-underline">Probar gratis</a>
    </header>
  );
}

function DrawerNavbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="flex items-center justify-between border-b border-border bg-[var(--bg)] px-5 py-3">
      <div className="text-lg font-bold text-primary">🛍️ Mercatus</div>
      <button
        className="flex cursor-pointer flex-col gap-1 border-none bg-transparent p-1"
        onClick={() => setOpen(!open)}
        aria-label="Abrir menú"
        aria-expanded={open}
      >
        <span className={`block h-0.5 w-6 rounded-sm bg-[var(--text)] transition-transform ${open ? 'translate-y-[6px] rotate-45' : ''}`} />
        <span className={`block h-0.5 w-6 rounded-sm bg-[var(--text)] transition-opacity ${open ? 'opacity-0' : ''}`} />
        <span className={`block h-0.5 w-6 rounded-sm bg-[var(--text)] transition-transform ${open ? '-translate-y-[6px] -rotate-45' : ''}`} />
      </button>
      <div className={`fixed inset-y-0 right-0 z-50 flex w-[280px] flex-col gap-1 bg-[var(--bg-sidebar)] p-5 text-white shadow-lg transition-transform duration-150 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <button className="mb-3 cursor-pointer self-end border-none bg-transparent text-xl text-white/70" onClick={() => setOpen(false)} aria-label="Cerrar menú">✕</button>
        {['Inicio', ...LINKS, 'Iniciar sesión'].map((l) => (
          <a key={l} href="#" onClick={(e) => e.preventDefault()} className="rounded-sm px-3 py-2.5 text-sm font-medium text-white/70 no-underline transition-colors hover:bg-white/10 hover:text-white hover:no-underline">{l}</a>
        ))}
        <a href="#" onClick={(e) => e.preventDefault()} className="mt-3 rounded-sm bg-accent px-3 py-2.5 text-center text-sm font-semibold text-(--on-accent) no-underline">Probar gratis</a>
      </div>
    </header>
  );
}

const VARIANTS: Array<{ id: string; title: string; desc: string; el: () => React.JSX.Element }> = [
  { id: 'glass', title: '1. Glass sticky', desc: 'La actual: translúcida con blur al scroll. Sobria, SaaS.', el: GlassNavbar },
  { id: 'pill', title: '2. Píldora flotante', desc: 'Estilo Shopify/Linear: flota sobre el hero, bordes full.', el: PillNavbar },
  { id: 'mega', title: '3. Mega-menu', desc: 'Dropdown de productos al hover. Para cuando haya más secciones.', el: MegaNavbar },
  { id: 'drawer', title: '4. Drawer móvil', desc: 'Hamburguesa animada + panel lateral. Ideal < 768px.', el: DrawerNavbar },
];

export function DemoNavbars() {
  return (
    <div className="min-h-screen bg-[var(--bg)] font-sans text-[var(--text)]">
      <div className="mx-auto max-w-[1100px] px-8 py-10">
        <Link to="/" className="text-sm font-semibold text-accent no-underline">← Volver</Link>
        <h1 className="m-0 mb-2 mt-4 text-[28px] font-extrabold text-primary">Variantes de navbar</h1>
        <p className="m-0 mb-8 text-[15px] text-[var(--text-light)]">Construidas con tus tokens. Elige una para la landing.</p>
      </div>
      {VARIANTS.map((v) => (
        <section key={v.id} className="mb-10">
          <div className="mx-auto mb-3 max-w-[1100px] px-8">
            <h2 className="m-0 text-lg font-bold text-primary">{v.title}</h2>
            <p className="m-0 text-sm text-[var(--text-light)]">{v.desc}</p>
          </div>
          <div className="border-y border-border">
            <v.el />
          </div>
        </section>
      ))}
    </div>
  );
}
