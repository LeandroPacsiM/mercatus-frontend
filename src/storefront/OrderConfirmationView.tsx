import { Link } from 'react-router-dom';
import type { Order } from '../types/store';
import { initialStores } from '../data/stores';

interface OrderConfirmationViewProps {
  order: Order | null;
}

function formatPrice(amount: number): string {
  return `S/. ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

const FULFILLMENT_MSG: Record<string, { title: string; text: string }> = {
  SHIPPING: {
    title: 'Envío en proceso',
    text: 'Empaquetamos tu pedido. Recibirás el número de seguimiento por correo cuando sea despachado.',
  },
  DIGITAL: {
    title: 'Descarga disponible',
    text: 'Tu producto digital está listo. Enlace de descarga (demo): https://mercatus.app/descargas/demo',
  },
  PICKUP: {
    title: 'Retiro en tienda',
    text: 'Tu pedido queda reservado para retiro en el local de la tienda. Te avisaremos cuando esté listo.',
  },
};


export function OrderConfirmationView({ order }: OrderConfirmationViewProps) {
  if (!order) {
    return (
      <div className="py-[50px] text-center">
        <h1 className="m-0 mb-5 text-2xl font-extrabold text-primary">Pedido no encontrado</h1>
        <Link to="/" className="rounded-sm bg-accent px-5 py-[11px] text-sm font-semibold text-(--on-accent) no-underline">Ir a Mercatus</Link>
      </div>
    );
  }
  const store = initialStores.find((s) => s.id === order.store_id);

  return (
    <div className="mx-auto my-10 max-w-[460px] text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--success)] text-[34px] text-white">✓</div>
      <h1 className="m-0 mb-5 text-2xl font-extrabold text-primary">¡Gracias por tu compra!</h1>
      <p className="mb-[18px] text-[15px] leading-relaxed text-[var(--text-light)]">
        Tu pedido <strong>#{order.code}</strong> fue registrado y está <strong>{STATUS_LABEL[order.status]}</strong>.
      </p>
      <div className="mb-[18px] flex flex-col gap-1.5 rounded-md border border-border bg-card p-4">
        <strong className="text-[15px] text-primary">
          {FULFILLMENT_MSG[order.fulfillmentType ?? 'SHIPPING'].title}
        </strong>
        <span className="text-[13px] leading-normal text-[var(--text-light)]">
          {FULFILLMENT_MSG[order.fulfillmentType ?? 'SHIPPING'].text}
        </span>
      </div>
      <div className="mb-[22px] flex justify-center gap-2.5 text-lg">
        <span>Total pagado</span>
        <strong>{formatPrice(order.total)}</strong>
      </div>
      <div className="flex justify-center gap-3">
        <Link to={`/tienda/${store?.slug}`} className="rounded-sm bg-accent px-5 py-[11px] text-sm font-semibold text-(--on-accent) no-underline">Seguir comprando</Link>
        <Link to="/" className="rounded-sm border border-border bg-transparent px-5 py-[11px] text-sm font-semibold text-accent no-underline">Ir a Mercatus</Link>
      </div>
    </div>
  );
}
