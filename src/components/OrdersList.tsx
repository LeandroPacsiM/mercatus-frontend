import { useState, Fragment } from 'react';
import type { Order, OrderStatus, OrderItem, FulfillmentType, PaymentMethodType } from '../types/store';

interface OrdersListProps {
  orders: Order[];
  orderItems: OrderItem[];
  onUpdateOrder?: (order: Order) => void;
}

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

const BADGE = 'inline-block whitespace-nowrap rounded-full px-2.5 py-[3px] text-[11px] font-semibold';

const BADGE_TONE: Record<string, string> = {
  PENDING: 'bg-[var(--warning-soft)] text-[var(--warning-text)]',
  CONFIRMED: 'bg-[var(--accent-soft)] text-[var(--accent-text)]',
  SHIPPED: 'bg-[rgba(155,89,182,0.12)] text-[#8e44ad]',
  DELIVERED: 'bg-[var(--success-soft)] text-[var(--success-text)]',
  CANCELLED: 'bg-[var(--danger-soft)] text-[var(--danger-text)]',
};

const TH = 'border-b border-border bg-[var(--bg-alt)] px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.4px] text-[var(--text-light)]';
const FIELD_INPUT =
  'rounded-lg border border-border bg-card px-3 py-[9px] font-sans text-sm text-[var(--text)] focus:border-primary focus:outline-none';

interface ShipmentEditorProps {
  order: Order;
  onSave: (order: Order) => void;
}

function ShipmentEditor({ order, onSave }: ShipmentEditorProps) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber ?? '');
  const [carrier, setCarrier] = useState(order.carrier ?? '');
  const [saved, setSaved] = useState(false);

  function handleSave() {
    onSave({ ...order, status, trackingNumber, carrier });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="mt-1.5 flex flex-col gap-3 rounded-[10px] border border-border bg-[var(--bg)] p-[14px_16px]">
      <div className="text-[13px] font-bold uppercase tracking-[0.4px] text-[var(--text)]">Seguimiento de envío</div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        <label className="flex flex-col gap-[5px] text-xs text-[var(--text-light)]">
          <span>Estado</span>
          <select className={FIELD_INPUT} value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)}>
            <option value="CONFIRMED">Confirmado</option>
            <option value="SHIPPED">Enviado</option>
            <option value="DELIVERED">Entregado</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
        </label>
        {order.fulfillmentType !== 'DIGITAL' && order.fulfillmentType !== 'PICKUP' && (
          <>
            <label className="flex flex-col gap-[5px] text-xs text-[var(--text-light)]">
              <span>Transportista</span>
              <input
                className={FIELD_INPUT}
                value={carrier}
                placeholder="Ej: Olva, Laposa"
                onChange={(e) => setCarrier(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-[5px] text-xs text-[var(--text-light)]">
              <span>N° de seguimiento</span>
              <input
                className={FIELD_INPUT}
                value={trackingNumber}
                placeholder="Ej: OLVA123456789"
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </label>
          </>
        )}
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          className="cursor-pointer rounded-lg border-none bg-primary px-[18px] py-[9px] text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-dark)]"
          onClick={handleSave}
        >
          {saved ? 'Guardado ✓' : 'Guardar seguimiento'}
        </button>
      </div>
    </div>
  );
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
};

const STATUS_FILTERS: Array<OrderStatus | 'ALL'> = [
  'ALL',
  'PENDING',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

function formatPrice(amount: number): string {
  return `S/. ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function OrdersList({ orders, orderItems, onUpdateOrder }: OrdersListProps) {
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const visible = orders.filter((o) => filter === 'ALL' || o.status === filter);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            className={`cursor-pointer rounded-full border px-[14px] py-1.5 text-[13px] transition-all ${filter === f ? 'border-accent bg-accent font-semibold text-(--on-accent)' : 'border-border bg-[var(--bg)] text-[var(--text-light)] hover:border-accent'}`}
            onClick={() => setFilter(f)}
          >
            {f === 'ALL' ? 'Todos' : STATUS_LABEL[f]}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-md border border-border bg-card">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className={TH}>Pedido</th>
              <th className={TH}>Fecha</th>
              <th className={TH}>Cliente</th>
              <th className={TH}>Estado</th>
              <th className={`${TH} w-[120px] text-right`}>Total</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((o) => {
              const items = orderItems.filter((i) => i.order_id === o.id);
              const expanded = expandedId === o.id;
              return (
                <Fragment key={o.id}>
                  <tr
                    key={o.id}
                    className="cursor-pointer transition-colors hover:bg-[var(--bg-alt)]"
                    onClick={() => setExpandedId(expanded ? null : o.id)}
                  >
                    <td className="border-b border-border px-4 py-3 font-semibold text-primary">#{o.code}</td>
                    <td className="border-b border-border px-4 py-3 text-[var(--text)]">{formatDate(o.created_at)}</td>
                    <td className="border-b border-border px-4 py-3 text-[var(--text)]">{o.customerName}</td>
                    <td className="border-b border-border px-4 py-3">
                      <span className={`${BADGE} ${BADGE_TONE[o.status]}`}>
                        {STATUS_LABEL[o.status]}
                      </span>
                    </td>
                    <td className="w-[120px] border-b border-border px-4 py-3 text-right font-semibold text-[var(--text)]">{formatPrice(o.total)}</td>
                  </tr>
                  {expanded && (
                    <tr key={`${o.id}-detail`}>
                      <td colSpan={5} className="border-b border-border bg-[var(--bg-alt)] p-0">
                        <div className="flex flex-col gap-3 px-5 py-4">
                          <div className="text-[13px] font-semibold uppercase tracking-[0.4px] text-[var(--text-light)]">Detalle del pedido #{o.code}</div>
                          <div className="flex flex-col gap-1.5">
                            {items.map((i) => (
                              <div key={i.id} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-0 py-1.5 text-sm">
                                <span className="text-[var(--text)]">{i.productName}</span>
                                <span className="text-[13px] text-[var(--text-muted)]">x{i.quantity}</span>
                                <span className="text-[13px] text-[var(--text-light)]">{formatPrice(i.price)}</span>
                                <span className="min-w-[90px] text-right font-semibold text-[var(--text)]">
                                  {formatPrice(i.price * i.quantity)}
                                </span>
                              </div>
                            ))}
                            {items.length === 0 && (
                              <div className="text-[13px] text-[var(--text-muted)]">Sin productos registrados.</div>
                            )}
                          </div>
                           <div className="flex flex-wrap gap-2">
                             <span className="rounded-[20px] border border-border bg-[var(--bg)] px-2.5 py-1 text-xs font-semibold text-[var(--text-light)]">Cumplimiento: {FULFILLMENT_LABEL[o.fulfillmentType ?? 'SHIPPING']}</span>
                             <span className="rounded-[20px] border border-border bg-[var(--bg)] px-2.5 py-1 text-xs font-semibold text-[var(--text-light)]">Pago: {PAYMENT_LABEL[o.paymentMethod ?? 'TARJETA']}</span>
                             {o.trackingNumber && (
                               <span className="rounded-[20px] border border-[color:rgba(14,40,65,0.18)] bg-[rgba(14,40,65,0.06)] px-2.5 py-1 text-xs font-semibold text-primary">
                                 Seguimiento: {o.carrier ? `${o.carrier} ` : ''}{o.trackingNumber}
                               </span>
                             )}
                           </div>
                           <div className="flex items-center justify-end gap-3 border-t border-dashed border-border pt-2.5 text-sm text-[var(--text-light)]">
                             <span>Total</span>
                             <span className="text-base font-bold text-primary">{formatPrice(o.total)}</span>
                           </div>
                           {onUpdateOrder && (
                             <ShipmentEditor order={o} onSave={onUpdateOrder} />
                           )}
                         </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[var(--text-muted)]">
                  No hay pedidos con este estado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
