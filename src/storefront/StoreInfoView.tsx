import { Link } from 'react-router-dom';
import type { StoreWithMetrics } from '../types/store';

interface StoreInfoViewProps {
  store: StoreWithMetrics;
  page: 'about' | 'contact' | 'shipping' | 'returns';
}

const CONTENT = {
  about: {
    eyebrow: 'Conoce la tienda',
    title: 'Una experiencia de compra pensada para ti',
    text: 'Aquí encontrarás información sobre nuestra tienda, nuestros productos y la forma en que queremos acompañarte antes y después de tu compra.',
  },
  contact: {
    eyebrow: 'Estamos para ayudarte',
    title: '¿Tienes alguna pregunta?',
    text: 'Escríbenos para recibir ayuda con tus productos, tu pedido o cualquier consulta sobre la experiencia de compra.',
  },
  shipping: {
    eyebrow: 'Información de entrega',
    title: 'Envíos y entregas',
    text: 'Los tiempos y métodos de entrega dependen del producto y de la ubicación indicada durante el checkout. Revisa las opciones disponibles antes de confirmar tu pedido.',
  },
  returns: {
    eyebrow: 'Compra con confianza',
    title: 'Cambios y devoluciones',
    text: 'Consulta las condiciones aplicables a tu compra y conserva la confirmación del pedido para que podamos ayudarte con cualquier solicitud.',
  },
} as const;

export function StoreInfoView({ store, page }: StoreInfoViewProps) {
  const content = CONTENT[page];

  return (
    <div className="mx-auto max-w-3xl">
      <Link to={`/tienda/${store.slug}`} className="mb-6 inline-block text-sm font-semibold text-accent no-underline hover:underline">
        ← Volver a la tienda
      </Link>
      <article className="rounded-md border border-border bg-card p-7 max-[640px]:p-5">
        <span className="text-xs font-semibold uppercase tracking-[0.6px] text-[var(--accent-text)]">{content.eyebrow}</span>
        <h1 className="mb-3 mt-2 text-3xl font-extrabold text-primary">{content.title}</h1>
        <p className="m-0 max-w-2xl text-base leading-relaxed text-[var(--text-light)]">{content.text}</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <div className="rounded-sm bg-[var(--bg-alt)] p-4">
            <h2 className="m-0 text-sm font-bold text-[var(--text)]">{store.name}</h2>
            <p className="mb-0 mt-1 text-xs text-[var(--text-muted)]">Tienda independiente en Mercatus.</p>
          </div>
          <div className="rounded-sm bg-[var(--bg-alt)] p-4">
            <h2 className="m-0 text-sm font-bold text-[var(--text)]">Atención al cliente</h2>
            <p className="mb-0 mt-1 text-xs text-[var(--text-muted)]">Te responderemos por los canales disponibles de la tienda.</p>
          </div>
        </div>
      </article>
    </div>
  );
}
