import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Building2,
  KeyRound,
  Package,
  PackagePlus,
  ShoppingBag,
  ShoppingCart,
  Store,
  TriangleAlert,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';
import { initialPlans } from '../data/plans';
import { initialStores } from '../data/stores';
import { paymentAllies } from '../data/allies';
import { LogoMarquee } from './LogoMarquee';

function FlipCard({ icon: Icon, title, text, tint, badge }: { icon: LucideIcon; title: string; text: string; tint: string; badge?: number }) {
  return (
    <div className="group h-72 cursor-pointer [perspective:1200px]">
      <div className="flip-inner relative h-full transition-transform duration-700 ease-[cubic-bezier(0.3,0.7,0.3,1)] will-change-transform [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)_scale(1.02)]">
        <div className={`${CARD} absolute inset-0 [backface-visibility:hidden]`}>
          {badge !== undefined && (
            <div className="absolute -top-[14px] left-6 flex h-7 w-7 items-center justify-center rounded-full bg-black text-[13px] font-bold text-white">{badge}</div>
          )}
          <div className={`my-3 inline-flex rounded-xl p-2.5 ${tint}`}><Icon className="h-8 w-8" /></div>
          <h3 className="m-0 mb-1 text-lg font-bold text-black">{title}</h3>
        </div>
        <div className="absolute inset-0 flex flex-col justify-center rounded-xl bg-black p-8 text-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="mb-3 inline-flex w-fit rounded-xl bg-white/10 p-2"><Icon className="h-6 w-6" /></div>
          <h3 className="m-0 mb-2 text-lg font-bold">{title}</h3>
          <p className="m-0 text-sm leading-relaxed text-[#d4d4d8]">{text}</p>
        </div>
      </div>
    </div>
  );
}

function formatPlanPrice(amount: number): string {
  return amount === 0 ? 'Gratis' : `S/. ${amount} / mes`;
}

const CARD = 'rounded-xl border border-[#e4e4e7] bg-white p-8';
const SECTION_TITLE = 'm-0 mb-3 text-center text-[30px] font-bold text-black';
const EYEBROW = 'mb-4 inline-block rounded-full bg-[#c1fbd4] px-3 py-1 text-xs font-bold uppercase tracking-[0.5px] text-black';
const ICON_TINTS = [
  'bg-[#c1fbd4]',
  'bg-[#d4f9e0]',
  'bg-[#d4d4d8]',
  'bg-[#fbfbf5]',
];

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const steps: Array<{ icon: LucideIcon; title: string; text: string }> = [
    { icon: UserPlus, title: 'Regístrate', text: 'Crea tu cuenta de Propietario de Tienda en segundos.' },
    { icon: Store, title: 'Crea tu tienda', text: 'Elige un slug único y publica tu {slug}.mercatus.app.' },
    { icon: PackagePlus, title: 'Agrega productos', text: 'Carga tu catálogo e controla el inventario.' },
    { icon: ShoppingCart, title: 'Gestiona pedidos', text: 'Recibe pedidos y haz crecer tu negocio.' },
  ];

  const features: Array<{ icon: LucideIcon; title: string; text: string }> = [
    { icon: Building2, title: 'Multi-tienda', text: 'Administra varias tiendas desde una sola cuenta.' },
    { icon: Package, title: 'Productos e Inventario', text: 'Alta, edición y control de stock en tiempo real.' },
    { icon: ShoppingBag, title: 'Pedidos', text: 'Seguimiento de pedidos con estados y detalle.' },
    { icon: BarChart3, title: 'Dashboard', text: 'Métricas por tienda: productos, pedidos e ingresos.' },
    { icon: TriangleAlert, title: 'Alertas de stock', text: 'Avisa cuando un producto baje de stock.' },
    { icon: KeyRound, title: 'Roles', text: 'Propietario de Tienda y Administrador de Plataforma.' },
  ];

  const faqs = [
    { q: '¿Mercatus es gratis?', a: 'Sí, el plan Gratis permite crear tu tienda con hasta 5 productos. Puedes hacer upgrade cuando crezcas.' },
    { q: '¿Puedo tener varias tiendas?', a: 'Sí, los planes Básico y Pro permiten tiendas ilimitadas bajo una misma cuenta.' },
    { q: '¿Se cobra por transacción?', a: 'El modelo de planes define tu capacidad. El cobro por transacción se activará en la Fase 3 (pasarela de pago).' },
    { q: '¿Mis datos están seguros?', a: 'La autenticación protege los recursos y las credenciales no se almacenan en texto plano.' },
  ];

  const heroTop = !scrolled;
  return (
    <div className="bg-[#fbfbf5] font-sans text-black">
      <header className={`sticky top-0 z-50 flex items-center justify-between border-none px-8 py-[14px] transition-colors duration-150 ${scrolled ? 'bg-white' : 'bg-transparent'}`}>
        <div className={`text-xl font-bold ${heroTop ? 'text-white' : 'text-black'}`}><span className="inline-flex items-center gap-2"><ShoppingBag className="h-6 w-6" />Mercatus</span></div>
        <nav className="hidden gap-6 md:flex">
          <a href="#como" className={`text-sm no-underline transition-colors ${heroTop ? 'text-[#d4d4d8] hover:text-white' : 'text-[#52525b] hover:text-black'}`}>Cómo funciona</a>
          <a href="#caracteristicas" className={`text-sm no-underline transition-colors ${heroTop ? 'text-[#d4d4d8] hover:text-white' : 'text-[#52525b] hover:text-black'}`}>Características</a>
          <a href="#planes" className={`text-sm no-underline transition-colors ${heroTop ? 'text-[#d4d4d8] hover:text-white' : 'text-[#52525b] hover:text-black'}`}>Planes</a>
          <a href="#faq" className={`text-sm no-underline transition-colors ${heroTop ? 'text-[#d4d4d8] hover:text-white' : 'text-[#52525b] hover:text-black'}`}>FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className={`text-sm font-semibold no-underline ${heroTop ? 'text-white hover:text-[#d4d4d8]' : 'text-black hover:text-[#52525b]'}`}>Iniciar sesión</Link>
          <Link to="/register" className={`rounded-full px-5 py-2.5 text-sm font-semibold no-underline transition-transform hover:scale-[1.03] hover:no-underline ${heroTop ? 'bg-white text-black hover:bg-[#d4d4d8]' : 'bg-black text-white hover:bg-[#3f3f46]'}`}>Probar gratis</Link>
        </div>
      </header>

      <section className="-mt-[65px] bg-black px-6 pb-24 pt-40 text-center">
        <h1 className="mx-auto mb-5 max-w-[900px] text-[44px] font-extralight leading-[1.05] tracking-[0.5px] text-white motion-safe:animate-fade-up md:text-[68px] max-md:text-[32px]">Tu tienda online en minutos</h1>
        <p className="mx-auto mb-9 max-w-[620px] text-lg leading-relaxed text-[#d4d4d8] motion-safe:animate-fade-up motion-safe:[animation-delay:100ms]">
          Mercatus es la plataforma SaaS para crear y gestionar tu tienda digital:
          productos, inventario y pedidos en un solo lugar.
        </p>
        <div className="flex flex-wrap justify-center gap-[14px] motion-safe:animate-fade-up motion-safe:[animation-delay:200ms]">
          <Link to="/register" className="rounded-full bg-white px-8 py-3.5 text-base font-semibold text-black no-underline transition-transform hover:scale-[1.03] hover:no-underline">Crear mi tienda</Link>
          <Link to="/tienda/techstore" className="rounded-full border-2 border-white bg-transparent px-8 py-3.5 text-base font-semibold text-white no-underline transition-colors hover:bg-[#1e2c31] hover:no-underline">Ver tienda demo →</Link>
        </div>
      </section>

      <div className="border-b border-[#e4e4e7]">
        <LogoMarquee
          eyebrow="Venden con Mercatus"
          items={initialStores.map((s) => ({ name: s.name, href: `/tienda/${s.slug}` }))}
        />
      </div>

      <section id="como" className="mx-auto max-w-[1100px] px-8 pb-24 pt-8 text-center">
        <span className={EYEBROW}>Cómo funciona</span>
        <h2 className={SECTION_TITLE}>Cómo funciona</h2>
        <div className="mt-10 grid grid-cols-1 gap-8 text-left md:grid-cols-4">
          {steps.map((s, i) => (
            <FlipCard key={s.title} icon={s.icon} title={s.title} text={s.text} tint={ICON_TINTS[i % ICON_TINTS.length]} badge={i + 1} />
          ))}
        </div>
      </section>

      <section id="caracteristicas" className="bg-[#d4f9e0] px-8 py-24 text-center">
        <div className="mx-auto max-w-[1100px]">
          <span className={EYEBROW}>Características</span>
          <h2 className={SECTION_TITLE}>Características</h2>
          <div className="mt-10 grid grid-cols-1 gap-8 text-left md:grid-cols-3">
            {features.map((f, i) => (
              <FlipCard key={f.title} icon={f.icon} title={f.title} text={f.text} tint={ICON_TINTS[(i + 2) % ICON_TINTS.length]} />
            ))}
          </div>
        </div>
      </section>

      <section id="planes" className="mx-auto max-w-[1100px] px-8 py-24 text-center">
        <span className={EYEBROW}>Planes</span>
        <h2 className={SECTION_TITLE}>Planes</h2>
        <p className="mb-12 text-center text-[#52525b]">Elige el plan que mejor se adapte a tu negocio.</p>
        <div className="grid grid-cols-1 items-stretch gap-8 text-left md:grid-cols-3">
          {initialPlans.map((p) => (
            <div
              key={p.id}
              className={`relative flex flex-col rounded-xl border p-7 ${p.id === 'plan-basico' ? 'border-[#c1fbd4] bg-[#c1fbd4]' : 'border-[#e4e4e7] bg-white'}`}
            >
              {p.id === 'plan-basico' && (
                <span className="absolute -top-3 right-5 rounded-full bg-black px-3 py-1 text-[11px] font-bold uppercase text-white">Popular</span>
              )}
              <h3 className="m-0 mb-2 text-xl font-bold text-black">{p.name}</h3>
              <div className="mb-4 text-[22px] font-extrabold text-black">{formatPlanPrice(p.priceMonthly)}</div>
              <ul className="m-0 mb-5 flex flex-1 list-none flex-col gap-2 p-0">
                {p.features.map((feat) => (
                  <li
                    key={feat}
                    className={`relative pl-[22px] text-sm ${p.id === 'plan-basico' ? 'text-black' : 'text-black'} before:absolute before:left-0 before:font-bold before:text-[#52525b] before:content-['✓']`}
                  >
                    {feat}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="rounded-full bg-black p-[11px] text-center text-sm font-semibold text-white no-underline transition-colors hover:bg-[#3f3f46] hover:no-underline"
              >
                Empezar
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="bg-[#d4f9e0] px-8 py-24 text-center">
        <div className="mx-auto max-w-[1100px]">
          <span className={EYEBROW}>FAQ</span>
          <h2 className={SECTION_TITLE}>Preguntas frecuentes</h2>
          <div className="mt-10 grid grid-cols-1 gap-8 text-left md:grid-cols-2">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-[#e4e4e7] bg-white px-6 py-5">
                <h3 className="m-0 mb-2 text-[15px] font-bold text-black">{f.q}</h3>
                <p className="m-0 text-sm leading-relaxed text-[#52525b]">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="bg-black">
        <LogoMarquee eyebrow="Pagos compatibles" items={paymentAllies} tone="dark" />
      </div>

      <section className="bg-black px-6 py-20 text-center">
        <h2 className="m-0 mb-2 text-[30px] font-extralight tracking-[0.5px] text-white">Empieza gratis hoy</h2>
        <p className="m-0 mb-8 text-base text-[#d4d4d8]">Crea tu tienda y lleva tu negocio en línea.</p>
        <Link
          to="/register"
          className="rounded-full bg-white px-8 py-3.5 text-base font-semibold text-black no-underline transition-transform hover:scale-[1.03] hover:bg-[#d4d4d8] hover:no-underline"
        >
          Crear mi tienda
        </Link>
      </section>

      <footer className="flex items-center justify-between bg-black px-8 py-6">
        <span className="inline-flex items-center gap-2 text-xl font-bold text-white"><ShoppingBag className="h-6 w-6" />Mercatus</span>
        <span className="text-[13px] text-[#71717a]">© 2026 Mercatus Platform. Todos los derechos reservados.</span>
      </footer>
    </div>
  );
}
