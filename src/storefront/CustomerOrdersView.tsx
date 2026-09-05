import { Link } from 'react-router-dom';
import type { Order, OrderStatus, OrderItem, StoreWithMetrics, FulfillmentType, PaymentMethodType } from '../types/store';
import { useCustomer } from './customerContext';
import { useOrders } from './ordersContext';
import { TrackingMap } from './TrackingMap';

interface CustomerOrdersViewProps {
  store: StoreWithMetrics | null;
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

const BADGE = 'inline-block whitespace-nowrap rounded-full px-2.5 py-[3px] text-[11px] font-semibold';

const BADGE_TONE: Record<OrderStatus, string> = {
  PENDING: 'bg-[var(--warning-soft)] text-[var(--warning-text)]',
  CONFIRMED: 'bg-[var(--accent-soft)] text-[var(--accent-text)]',
  SHIPPED: 'bg-[rgba(155,89,182,0.12)] text-[#8e44ad]',
  DELIVERED: 'bg-[var(--success-soft)] text-[var(--success-text)]',
  CANCELLED: 'bg-[var(--danger-soft)] text-[var(--danger-text)]',
};

const FULFILLMENT_LABEL: Record<FulfillmentType, string> = {
  SHIPPING: 'Envío físico',
  DIGITAL: 'Descarga digital',
  PICKUP: 'Retiro en tienda',
};

const PAYMENT_LABEL: Record<PaymentMethodType, string> = {
  TARJETA: 'Tarjeta',
  TRANSFERENCIA: 'Transferencia',
  CONTRA_ENTREGA: 'Contra entrega',
  BILLETERA: 'Billetera',
};

function formatPrice(amount: number): string {
  return `S/. ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function CustomerOrdersView({ store }: CustomerOrdersViewProps) {
  const { currentCustomer, openAuth } = useCustomer();
  const { orders, orderItems, updateOrder } = useOrders();

  const isAuthed = !!currentCustomer;

  if (!isAuthed) {
    return (
      <div className="mx-auto max-w-[760px] py-[50px] text-center">
        <h1 className="m-0 mb-5 text-2xl font-extrabold text-primary">Mis pedidos</h1>
        <p className="mb-4 text-sm text-[var(--text-light)]">Inicia sesión para ver el historial de tus pedidos en {store?.name}.</p>
        <div className="mb-[18px] flex justify-center gap-2.5">
          <button className="cursor-pointer rounded-sm border border-border bg-card px-[14px] py-2 text-[13px] font-semibold text-[var(--text)]" onClick={() => openAuth('login')}>Iniciar sesión</button>
          <button className="cursor-pointer rounded-sm border border-accent bg-accent px-[14px] py-2 text-[13px] font-semibold text-(--on-accent)" onClick={() => openAuth('register')}>
            Crear cuenta
          </button>
        </div>
      </div>
    );
  }

  const myOrders: Order[] = orders.filter(
    (o) => o.store_id === store?.id && o.user_id === currentCustomer!.id,
  );

  function handleCancel(o: Order) {
    updateOrder({ ...o, status: 'CANCELLED' });
  }

  return (
    <div className="mx-auto max-w-[760px]">
      <h1 className="m-0 mb-5 text-2xl font-extrabold text-primary">Mis pedidos</h1>
      {myOrders.length === 0 && (
        <p className="mb-4 text-sm text-[var(--text-light)]">Aún no tienes pedidos en {store?.name}.</p>
      )}
      <div className="flex flex-col gap-[14px]">
        {myOrders.map((o) => {
          const items: OrderItem[] = orderItems.filter((i) => i.order_id === o.id);
          return (
            <div key={o.id} className="rounded-md border border-border bg-card px-[18px] py-4">
              <div className="mb-2.5 flex items-center gap-3">
                <span className="font-extrabold text-primary">#{o.code}</span>
                <span className="text-[13px] text-[var(--text-muted)]">{formatDate(o.created_at)}</span>
                <span className={`${BADGE} ${BADGE_TONE[o.status]}`}>
                  {STATUS_LABEL[o.status]}
                </span>
              </div>
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-[20px] border border-border bg-[var(--bg)] px-2.5 py-1 text-xs font-semibold text-[var(--text-light)]">{FULFILLMENT_LABEL[o.fulfillmentType ?? 'SHIPPING']}</span>
                <span className="rounded-[20px] border border-border bg-[var(--bg)] px-2.5 py-1 text-xs font-semibold text-[var(--text-light)]">Pago: {PAYMENT_LABEL[o.paymentMethod ?? 'TARJETA']}</span>
                {o.trackingNumber && (
                  <span className="rounded-[20px] border border-[color:rgba(14,40,65,0.18)] bg-[rgba(14,40,65,0.06)] px-2.5 py-1 text-xs font-semibold text-primary">
                    Seguimiento: {o.carrier ? `${o.carrier} ` : ''}{o.trackingNumber}
                  </span>
                )}
              </div>
              <div className="mb-3 flex flex-col gap-1.5 border-t border-dashed border-border pt-2.5">
                {items.map((i) => (
                  <div key={i.id} className="flex justify-between text-sm text-[var(--text)]">
                    <span>{i.productName} x{i.quantity}</span>
                    <span>{formatPrice(i.price * i.quantity)}</span>
                  </div>
                ))}
                {items.length === 0 && <div className="text-sm text-[var(--text)]">Sin productos registrados.</div>}
              </div>
              {store && o.fulfillmentType === 'SHIPPING' && (
                <TrackingMap order={o} store={store} updateOrder={updateOrder} />
              )}
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--text)]">Total: {formatPrice(o.total)}</span>
                {o.status === 'PENDING' && (
                  <button
                    className="cursor-pointer rounded-sm border border-[var(--danger-text)] bg-transparent px-4 py-2 text-[13px] font-semibold text-[var(--danger-text)] hover:bg-[var(--danger-soft)]"
                    onClick={() => handleCancel(o)}
                  >
                    Cancelar pedido
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <Link to={`/tienda/${store?.slug}`} className="mt-4 inline-block font-semibold text-accent no-underline">← Volver al catálogo</Link>
    </div>
  );
}
