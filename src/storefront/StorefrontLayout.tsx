import { useState, type CSSProperties, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { useCustomer } from './customerContext';
import type { StoreWithMetrics } from '../types/store';
import { resolveStoreTheme, getOnColor } from '../data/storeThemes';
import { Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';

interface StorefrontLayoutProps {
  store?: StoreWithMetrics | null;
  children: ReactNode;
}

interface IndiceHeaderProps {
  store?: StoreWithMetrics | null;
  count: number;
  onOpenAuth: () => void;
}

function IndiceHeader({ store, count, onOpenAuth }: IndiceHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  function toggleSearch() {
    const next = !searchOpen;
    setSearchOpen(next);
    if (next) window.setTimeout(() => document.getElementById('catalog-search')?.focus(), 120);
  }

  return (
    <header className="fixed left-0 right-0 top-4 z-40 flex justify-center px-4">
      <nav className={`flex min-h-[50px] max-w-full items-center gap-1 rounded-full border border-[#e7e4da] bg-white/[.9] p-1.5 shadow-[0_8px_24px_rgba(17,17,16,.08)] backdrop-blur-md transition-[width] ${searchOpen ? 'w-[min(560px,92vw)]' : ''}`}>
        {!searchOpen && (
          <>
            <Link to={`/tienda/${store?.slug ?? ''}`} className="flex items-center gap-2 px-2.5 py-1.5 font-sans text-lg font-black tracking-tight text-[#111110] no-underline">
              <span className="relative h-[22px] w-[22px] rounded-full bg-[#1b4cff] after:absolute after:inset-[6px] after:rounded-full after:bg-[#ffd23f]" />
              <span>{store?.name ?? 'Índice'}</span>
            </Link>
            <div className="hidden items-center gap-1 min-[760px]:flex" aria-label="Navegación principal">
              <a href="#lookbook" className="rounded-full px-3 py-2 text-xs font-semibold text-[#6e6c62] hover:bg-[#f7f6f1] hover:text-[#111110]">Revista</a>
              <a href="#indice-catalogo" className="rounded-full px-3 py-2 text-xs font-semibold text-[#6e6c62] hover:bg-[#f7f6f1] hover:text-[#111110]">Índice</a>
              <a href="#historia" className="rounded-full px-3 py-2 text-xs font-semibold text-[#6e6c62] hover:bg-[#f7f6f1] hover:text-[#111110]">Nosotros</a>
              <a href="#opiniones" className="rounded-full px-3 py-2 text-xs font-semibold text-[#6e6c62] hover:bg-[#f7f6f1] hover:text-[#111110]">Opiniones</a>
            </div>
          </>
        )}
        {searchOpen && (
          <input id="indice-nav-search" autoFocus className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-[#111110] outline-none" placeholder="Buscar en el catálogo..." onChange={(event) => window.dispatchEvent(new CustomEvent('indice-search', { detail: event.target.value }))} onKeyDown={(event) => { if (event.key === 'Escape') setSearchOpen(false); }} />
        )}
        <button type="button" onClick={toggleSearch} className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full text-[#111110] hover:bg-[#f7f6f1]" aria-label={searchOpen ? 'Cerrar búsqueda' : 'Buscar'}>
          <Search className="h-4 w-4" />
        </button>
        <button type="button" onClick={onOpenAuth} className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full text-[#111110] hover:bg-[#f7f6f1]" aria-label="Iniciar sesión">
          <UserRound className="h-4 w-4" />
        </button>
        <Link to="/carrito" className="relative grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full text-[#111110] no-underline hover:bg-[#f7f6f1]" aria-label={`Abrir carrito${count ? ` (${count})` : ''}`}>
          <ShoppingBag className="h-4 w-4" />
          {count > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#1b4cff] px-1 text-[10px] font-bold text-white">{count}</span>}
        </Link>
      </nav>
    </header>
  );
}

function OrbeHeader({ store, count, onOpenAuth }: IndiceHeaderProps) {
  return (
    <header className="sticky top-0 z-40 min-h-[60px] border-b border-white/10 bg-[#12141c]/90 px-4 backdrop-blur-md sm:px-6">
      <div className="mx-auto flex min-h-[60px] max-w-[1280px] items-center justify-between gap-3">
        <Link to={`/tienda/${store?.slug ?? ''}`} className="flex items-center gap-2 font-serif text-xl font-semibold text-[#f5f4f0] no-underline">
          <span className="h-2 w-2 rounded-full bg-[#ff6b5b]" />{store?.name ?? 'Orbe'}
        </Link>
        <nav className="hidden items-center gap-5 text-xs font-semibold text-[#a7abbd] md:flex">
          <a href="#orbe-catalogo" className="hover:text-[#f5f4f0]">Catálogo</a>
          <a href="#orbe-historia" className="hover:text-[#f5f4f0]">Nosotros</a>
          <a href="#orbe-opiniones" className="hover:text-[#f5f4f0]">Opiniones</a>
        </nav>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => document.getElementById('orbe-search')?.focus()} className="grid h-10 w-10 place-items-center rounded-full text-[#a7abbd] hover:bg-[#242838] hover:text-[#f5f4f0]" aria-label="Buscar"><Search className="h-4 w-4" /></button>
          <button type="button" onClick={onOpenAuth} className="grid h-10 w-10 place-items-center rounded-full text-[#a7abbd] hover:bg-[#242838] hover:text-[#f5f4f0]" aria-label="Cuenta"><UserRound className="h-4 w-4" /></button>
          <Link to="/carrito" className="relative grid h-10 w-10 place-items-center rounded-full text-[#a7abbd] no-underline hover:bg-[#242838] hover:text-[#f5f4f0]" aria-label="Carrito"><ShoppingBag className="h-4 w-4" />{count > 0 && <span className="absolute right-0 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-[#ff6b5b] px-1 text-[10px] font-bold text-[#12141c]">{count}</span>}</Link>
        </div>
      </div>
    </header>
  );
}

function FichaHeader({ store, count, onOpenAuth }: IndiceHeaderProps) {
  return (
    <>
      <div className="bg-[#17180f] px-4 py-2 text-center font-mono text-[11px] text-[#fafaf6] sm:text-xs">Envío estándar gratis desde <strong className="text-[#ff6a1a]">S/. 250</strong> — pedidos antes de las 14:00 salen el mismo día</div>
      <header className="sticky top-0 z-40 border-b border-[#d9d4c2] bg-[#fafaf6]/95 px-4 backdrop-blur-md sm:px-8">
        <div className="mx-auto grid min-h-16 max-w-[1320px] grid-cols-[auto_1fr_auto] items-center gap-3">
          <Link to={`/tienda/${store?.slug ?? ''}`} className="font-serif text-[23px] italic font-semibold text-[#17180f] no-underline">{store?.name ?? 'Ficha'}<span className="text-[#ff6a1a]">.</span></Link>
          <nav className="hidden items-center justify-center gap-6 font-mono text-xs md:flex"><a href="#ficha-catalogo" className="hover:underline">Catálogo</a><a href="#ficha-historia" className="hover:underline">Nosotros</a><a href="#ficha-opiniones" className="hover:underline">Opiniones</a></nav>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => document.getElementById('ficha-search')?.focus()} className="grid h-10 w-10 place-items-center rounded-full text-[#17180f] hover:bg-[#f1eee3]" aria-label="Buscar"><Search className="h-4 w-4" /></button>
            <button type="button" onClick={onOpenAuth} className="grid h-10 w-10 place-items-center rounded-full text-[#17180f] hover:bg-[#f1eee3]" aria-label="Cuenta"><UserRound className="h-4 w-4" /></button>
            <Link to="/carrito" className="relative inline-flex min-h-10 items-center gap-2 rounded-full border border-[#17180f] px-3 font-mono text-xs no-underline hover:bg-[#17180f] hover:text-[#fafaf6]" aria-label="Carrito"><span className="hidden sm:inline">Carrito</span><ShoppingBag className="h-4 w-4" /><b className="grid h-5 min-w-5 place-items-center rounded-full bg-[#17180f] text-[10px] text-[#fafaf6]">{count}</b></Link>
          </div>
        </div>
      </header>
    </>
  );
}

const AUTH_BTN =
  'cursor-pointer rounded-sm border border-border bg-card px-[14px] py-2 text-[13px] font-semibold text-[var(--text)]';
const INPUT =
  'rounded-sm border border-border bg-card px-3 py-2.5 font-sans text-sm text-[var(--text)] focus:border-accent focus:outline-none';

export function StorefrontLayout({ store, children }: StorefrontLayoutProps) {
  const { count } = useCart();
  const { currentCustomer, login, register, logout, authOpen, openAuth, closeAuth } = useCustomer();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthed = !!currentCustomer;
  const isIndice = store?.theme?.templateId === 'indice';
  const isOrbe = store?.theme?.templateId === 'orbe';
  const isFicha = store?.theme?.templateId === 'ficha';

  const theme = resolveStoreTheme(store?.theme);
  const storeStyle = {
    '--store-primary': theme.primary,
    '--store-accent': theme.accent,
    '--store-accent-hover': theme.accent,
    '--store-surface': theme.surface ?? 'var(--bg-card)',
    '--on-accent': getOnColor(theme.accent),
  } as CSSProperties;

  function resetForm() {
    setName('');
    setEmail('');
    setPassword('');
    setConfirm('');
    setError(null);
  }

  function handleOpenAuth(mode: 'login' | 'register') {
    resetForm();
    openAuth(mode);
  }

  function handleSwitch(mode: 'login' | 'register') {
    resetForm();
    openAuth(mode);
  }

  function handleCloseAuth() {
    resetForm();
    closeAuth();
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!store) return;
    const res = login(email.trim(), password, store.id);
    if (!res.ok) {
      setError(res.error ?? 'No se pudo iniciar sesión.');
      return;
    }
    closeAuth();
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!store) return;
    if (!name.trim() || !email.trim() || !password) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    const res = register({ store_id: store.id, name, email, password });
    if (!res.ok) {
      setError(res.error ?? 'No se pudo completar el registro.');
      return;
    }
    closeAuth();
  }

  return (
    <div className="storefront flex min-h-screen flex-col bg-[var(--bg)]" style={storeStyle}>
      {isIndice ? (
        <IndiceHeader
          store={store}
          count={count}
          onOpenAuth={() => handleOpenAuth('login')}
        />
      ) : null}
      {isOrbe ? (
        <OrbeHeader store={store} count={count} onOpenAuth={() => handleOpenAuth('login')} />
      ) : null}
      {isFicha ? (
        <FichaHeader store={store} count={count} onOpenAuth={() => handleOpenAuth('login')} />
      ) : null}
      {!isIndice && !isOrbe && !isFicha && <header className="sticky top-0 z-10 border-b border-border bg-[var(--bg-card)] px-7 py-[14px] max-[640px]:px-4">
        <div className="flex items-center gap-4">
          <button type="button" className="hidden cursor-pointer border-none bg-transparent p-1 text-primary max-[860px]:block" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/" className="text-xl font-extrabold tracking-[-0.5px] text-primary no-underline">{store?.name ?? 'Mercatus'}</Link>
        <nav className="flex flex-1 items-center gap-4 text-xs font-semibold text-[var(--text-light)] max-[860px]:hidden">
          {store && (
            <>
              <Link to={`/tienda/${store.slug}`} className="text-[var(--text-light)] no-underline hover:text-primary hover:no-underline">Inicio</Link>
              <a href={`/tienda/${store.slug}#catalogo`} className="text-[var(--text-light)] no-underline hover:text-primary hover:no-underline">Catálogo</a>
              <Link to={`/tienda/${store.slug}/nosotros`} className="text-[var(--text-light)] no-underline hover:text-primary hover:no-underline">Nosotros</Link>
              <Link to={`/tienda/${store.slug}/contacto`} className="text-[var(--text-light)] no-underline hover:text-primary hover:no-underline">Contacto</Link>
            </>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" className="cursor-pointer border-none bg-transparent p-2 text-[var(--text-light)] hover:text-primary" onClick={() => document.getElementById('catalog-search')?.focus()} aria-label="Buscar productos"><Search className="h-4 w-4" /></button>
          {isIndice && (
            <button
              type="button"
              className="cursor-pointer border-none bg-transparent p-2 text-[var(--text-light)] hover:text-primary"
              onClick={() => handleOpenAuth(isAuthed ? 'login' : 'login')}
              aria-label={isAuthed ? 'Ver cuenta' : 'Iniciar sesión'}
            >
              <UserRound className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
        {isAuthed && !isIndice ? (
          <div className="flex items-center gap-2.5">
            <Link to={`/tienda/${store?.slug}/pedidos`} className={`${AUTH_BTN} no-underline hover:no-underline`}>
              Mis pedidos
            </Link>
            <span className="text-[13px] font-bold text-primary">{currentCustomer!.name}</span>
            <button className={AUTH_BTN} onClick={logout}>Salir</button>
          </div>
        ) : !isIndice ? (
          <div className="flex items-center gap-2">
            <button className={AUTH_BTN} onClick={() => handleOpenAuth('login')}>Iniciar sesión</button>
            <button className={`${AUTH_BTN} border-accent bg-accent text-(--on-accent)`} onClick={() => handleOpenAuth('register')}>
              Crear cuenta
            </button>
          </div>
        ) : null}
        <Link
          to="/carrito"
          className={isIndice
            ? 'relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-primary no-underline transition-colors hover:border-accent hover:no-underline'
            : 'inline-flex items-center gap-2 rounded-sm border border-border px-[14px] py-2 text-sm font-semibold text-primary no-underline transition-colors hover:border-accent hover:no-underline'}
          aria-label={`Abrir carrito${count > 0 ? ` (${count} productos)` : ''}`}
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          {!isIndice && <>Carrito{count > 0 ? ` (${count})` : ''}</>}
          {isIndice && count > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-(--on-accent)">{count}</span>}
        </Link>
        </div>
        {mobileMenuOpen && store && (
          <nav className="mt-3 flex flex-col gap-1 border-t border-border pt-3 text-sm font-semibold text-[var(--text-light)] min-[861px]:hidden">
            <Link to={`/tienda/${store.slug}`} className="rounded-sm px-2 py-2 no-underline hover:bg-[var(--bg-alt)]">Inicio</Link>
            <a href={`/tienda/${store.slug}#catalogo`} className="rounded-sm px-2 py-2 no-underline hover:bg-[var(--bg-alt)]">Catálogo</a>
            <Link to={`/tienda/${store.slug}/nosotros`} className="rounded-sm px-2 py-2 no-underline hover:bg-[var(--bg-alt)]">Nosotros</Link>
            <Link to={`/tienda/${store.slug}/contacto`} className="rounded-sm px-2 py-2 no-underline hover:bg-[var(--bg-alt)]">Contacto</Link>
          </nav>
        )}
      </header>}

      <main className={isIndice || isOrbe || isFicha ? 'flex-1' : 'mx-auto w-full max-w-[1080px] flex-1 p-7'}>{children}</main>

      <footer className={isIndice ? 'border-t border-[#e7e4da] bg-[#111110] px-5 py-10 text-[13px] text-white/70' : isOrbe ? 'border-t border-white/10 bg-[#12141c] px-5 py-10 text-[13px] text-[#a7abbd]' : isFicha ? 'border-t border-[#d9d4c2] bg-[#fafaf6] px-5 py-10 text-[13px] text-[#5b5c4e]' : 'border-t border-border p-5 text-[13px] text-[var(--text-muted)]'}>
        <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-4 max-[640px]:flex-col max-[640px]:items-start">
          <span>{isIndice ? <><strong className="text-white">{store?.name ?? 'Índice'}</strong><br />Catálogo técnico contado como revista.</> : isOrbe ? <><strong className="text-[#f5f4f0]">{store?.name ?? 'Orbe'}</strong><br />Tecnología esencial, elegida a mano.</> : isFicha ? <><strong className="text-[#17180f]">{store?.name ?? 'Ficha'}.</strong><br />Catálogo técnico de tecnología esencial.</> : <>Potenciado por <strong>Mercatus</strong> · Plataforma de tiendas online</>}</span>
          {store && (
            <nav className="flex flex-wrap gap-3">
              <Link to={`/tienda/${store.slug}/envios`} className={isIndice ? 'text-white/70 no-underline hover:text-white hover:underline' : isOrbe ? 'text-[#a7abbd] no-underline hover:text-[#f5f4f0] hover:underline' : isFicha ? 'text-[#5b5c4e] no-underline hover:text-[#17180f] hover:underline' : 'text-[var(--text-muted)] no-underline hover:text-primary hover:underline'}>Envíos</Link>
              <Link to={`/tienda/${store.slug}/devoluciones`} className={isIndice ? 'text-white/70 no-underline hover:text-white hover:underline' : isOrbe ? 'text-[#a7abbd] no-underline hover:text-[#f5f4f0] hover:underline' : isFicha ? 'text-[#5b5c4e] no-underline hover:text-[#17180f] hover:underline' : 'text-[var(--text-muted)] no-underline hover:text-primary hover:underline'}>Devoluciones</Link>
              <Link to={`/tienda/${store.slug}/contacto`} className={isIndice ? 'text-white/70 no-underline hover:text-white hover:underline' : isOrbe ? 'text-[#a7abbd] no-underline hover:text-[#f5f4f0] hover:underline' : isFicha ? 'text-[#5b5c4e] no-underline hover:text-[#17180f] hover:underline' : 'text-[var(--text-muted)] no-underline hover:text-primary hover:underline'}>Contacto</Link>
            </nav>
          )}
        </div>
      </footer>

      {authOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(14,40,65,0.45)] p-5" onClick={handleCloseAuth}>
          <div className="relative w-full max-w-[400px] rounded-md bg-card p-7 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <button className="absolute right-[14px] top-[14px] cursor-pointer border-none bg-transparent text-base text-[var(--text-muted)]" onClick={handleCloseAuth} aria-label="Cerrar">✕</button>
            {authOpen === 'login' ? (
              <form className="flex flex-col" onSubmit={handleLogin}>
                <h2 className="m-0 mb-1.5 text-[22px] font-extrabold text-primary">Iniciar sesión</h2>
                <p className="m-0 mb-4 text-sm text-[var(--text-light)]">Accede a tu cuenta de {store?.name}.</p>
                {error && <div className="mb-1 rounded-sm border border-[color:var(--danger-soft)] bg-[var(--danger-soft)] px-3 py-[9px] text-[13px] text-[var(--danger-text)]">{error}</div>}
                <label className="mb-1 mt-2.5 text-[13px] font-semibold text-[var(--text-light)]" htmlFor="sf-email">Correo</label>
                <input
                  id="sf-email"
                  className={INPUT}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  autoComplete="email"
                />
                <label className="mb-1 mt-2.5 text-[13px] font-semibold text-[var(--text-light)]" htmlFor="sf-pass">Contraseña</label>
                <input
                  id="sf-pass"
                  className={INPUT}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña"
                  autoComplete="current-password"
                />
                <button className="mt-[18px] cursor-pointer rounded-sm border-none bg-accent p-3 text-[15px] font-bold text-(--on-accent)" type="submit">Entrar</button>
                <p className="mt-4 text-center text-[13px] text-[var(--text-light)]">
                  ¿No tienes cuenta?{' '}
                  <button type="button" className="cursor-pointer border-none bg-transparent text-[13px] font-semibold text-accent" onClick={() => handleSwitch('register')}>
                    Crear una
                  </button>
                </p>
              </form>
            ) : (
              <form className="flex flex-col" onSubmit={handleRegister}>
                <h2 className="m-0 mb-1.5 text-[22px] font-extrabold text-primary">Crear cuenta</h2>
                <p className="m-0 mb-4 text-sm text-[var(--text-light)]">Regístrate en {store?.name}.</p>
                {error && <div className="mb-1 rounded-sm border border-[color:var(--danger-soft)] bg-[var(--danger-soft)] px-3 py-[9px] text-[13px] text-[var(--danger-text)]">{error}</div>}
                <label className="mb-1 mt-2.5 text-[13px] font-semibold text-[var(--text-light)]" htmlFor="sf-name">Nombre completo</label>
                <input
                  id="sf-name"
                  className={INPUT}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Ana Torres"
                  autoComplete="name"
                />
                <label className="mb-1 mt-2.5 text-[13px] font-semibold text-[var(--text-light)]" htmlFor="sf-email-r">Correo</label>
                <input
                  id="sf-email-r"
                  className={INPUT}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  autoComplete="email"
                />
                <label className="mb-1 mt-2.5 text-[13px] font-semibold text-[var(--text-light)]" htmlFor="sf-pass-r">Contraseña</label>
                <input
                  id="sf-pass-r"
                  className={INPUT}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                />
                <label className="mb-1 mt-2.5 text-[13px] font-semibold text-[var(--text-light)]" htmlFor="sf-conf">Confirmar contraseña</label>
                <input
                  id="sf-conf"
                  className={INPUT}
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repite tu contraseña"
                  autoComplete="new-password"
                />
                <button className="mt-[18px] cursor-pointer rounded-sm border-none bg-accent p-3 text-[15px] font-bold text-(--on-accent)" type="submit">Registrarme</button>
                <p className="mt-4 text-center text-[13px] text-[var(--text-light)]">
                  ¿Ya tienes cuenta?{' '}
                  <button type="button" className="cursor-pointer border-none bg-transparent text-[13px] font-semibold text-accent" onClick={() => handleSwitch('login')}>
                    Inicia sesión
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
