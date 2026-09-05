import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product, StoreWithMetrics, PaymentMethodType, FulfillmentType } from '../types/store';
import { paymentMethods } from '../data/paymentMethods';
import { useCart } from './CartContext';
import { useCustomer } from './customerContext';

interface CheckoutViewProps {
  store: StoreWithMetrics | null;
  products: Product[];
  onPlaceOrder: (data: { customerName: string; email: string; address: string; paymentMethod: PaymentMethodType }) => void;
}

const FULFILLMENT_NOTE: Record<FulfillmentType, string> = {
  SHIPPING: 'Recibirás tu pedido por envío. Te enviaremos el número de seguimiento por correo.',
  DIGITAL: 'Producto digital: recibirás el enlace de descarga al instante tras el pago.',
  PICKUP: 'Retiro en tienda: pasa a recoger tu pedido en el local.',
};

const INPUT =
  'rounded-sm border border-border bg-card px-3 py-2.5 font-sans text-sm text-[var(--text)]';

function formatPrice(amount: number): string {
  return `S/. ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
}

export function CheckoutView({ store, products, onPlaceOrder }: CheckoutViewProps) {
  const { items, storeId } = useCart();
  const { currentCustomer, openAuth } = useCustomer();
  const isAuthed = !!currentCustomer;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('TARJETA');

  const lines = items
    .filter((i) => i.storeId === storeId)
    .map((i) => {
      const prod = products.find((p) => p.id === i.productId);
      return prod ? { ...i, prod } : null;
    })
    .filter((l): l is typeof l & { prod: Product } => l !== null);

  const total = lines.reduce((acc, l) => acc + l.prod.price * l.qty, 0);
  const fulfillmentType: FulfillmentType = lines[0]?.prod.fulfillmentType ?? 'SHIPPING';
  const enabledMethods = paymentMethods.filter((m) => m.enabled);

  if (lines.length === 0) {
    return (
      <div className="py-[50px] text-center">
        <h1 className="m-0 mb-5 text-2xl font-extrabold text-primary">No hay productos para pagar</h1>
        <Link to={`/tienda/${store?.slug}`} className="font-semibold text-accent no-underline">← Volver al catálogo</Link>
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <div className="py-[50px] text-center">
        <h1 className="m-0 mb-5 text-2xl font-extrabold text-primary">Inicia sesión para pagar</h1>
        <p className="mx-0 my-2 mb-4 text-sm leading-relaxed text-[var(--text-light)]">
          Para completar tu compra necesitas una cuenta en <strong>{store?.name}</strong>.
          Regístrate o inicia sesión para continuar.
        </p>
        <div className="mb-[18px] flex justify-center gap-2.5">
          <button className="cursor-pointer rounded-sm border border-border bg-card px-[14px] py-2 text-[13px] font-semibold text-[var(--text)]" onClick={() => openAuth('login')}>Iniciar sesión</button>
          <button className="cursor-pointer rounded-sm border border-accent bg-accent px-[14px] py-2 text-[13px] font-semibold text-(--on-accent)" onClick={() => openAuth('register')}>
            Crear cuenta
          </button>
        </div>
        <Link to="/carrito" className="font-semibold text-accent no-underline">← Volver al carrito</Link>
      </div>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onPlaceOrder({
      customerName: name.trim(),
      email: email.trim(),
      address: address.trim(),
      paymentMethod,
    });
  }

  return (
    <div>
      <Link to="/carrito" className="font-semibold text-accent no-underline">← Volver al carrito</Link>
      <h1 className="m-0 mb-5 mt-3 text-2xl font-extrabold text-primary">Pago</h1>
      <div className="grid grid-cols-[1fr_340px] items-start gap-7 max-[860px]:grid-cols-1">
        <form className="flex flex-col gap-2" onSubmit={submit}>
          <label className="mt-1.5 text-[13px] font-semibold text-[var(--text-light)]">Nombre completo</label>
          <input className={INPUT} value={name} onChange={(e) => setName(e.target.value)} required />

          <label className="mt-1.5 text-[13px] font-semibold text-[var(--text-light)]">Correo</label>
          <input className={INPUT} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label className="mt-1.5 text-[13px] font-semibold text-[var(--text-light)]">Dirección de envío</label>
          <textarea className={INPUT} rows={3} value={address} onChange={(e) => setAddress(e.target.value)} />

          <p className="mx-0 mb-1 mt-2.5 rounded-sm border border-border bg-card px-3 py-2.5 text-[13px] leading-normal text-[var(--text-light)]">{FULFILLMENT_NOTE[fulfillmentType]}</p>

          <label className="mt-1.5 text-[13px] font-semibold text-[var(--text-light)]">Método de pago</label>
          <div className="flex flex-col gap-2.5">
            {enabledMethods.map((m) => (
              <label key={m.type} className={`grid cursor-pointer grid-cols-[auto_1fr] grid-rows-[auto_auto] items-center gap-x-2.5 rounded-sm border bg-card px-[14px] py-3 ${paymentMethod === m.type ? 'border-accent bg-[var(--accent-soft)]' : 'border-border'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={m.type}
                  checked={paymentMethod === m.type}
                  onChange={() => setPaymentMethod(m.type)}
                  className="row-span-2 h-[18px] w-[18px] accent-[var(--accent)]"
                />
                <span className="text-sm font-bold text-[var(--text)]">{m.label}</span>
                <span className="text-xs text-[var(--text-light)]">{m.description}</span>
              </label>
            ))}
          </div>

          <button className="mt-4 cursor-pointer rounded-sm border-none bg-accent p-[13px] text-[15px] font-bold text-(--on-accent)" type="submit">Pagar {formatPrice(total)}</button>
        </form>

        <div className="rounded-md border border-border bg-card p-[18px]">
          <h2 className="m-0 mb-3 text-base font-bold text-primary">Resumen</h2>
          {lines.map((l) => (
            <div key={l.productId} className="flex justify-between border-b border-border px-0 py-1.5 text-sm text-[var(--text)]">
              <span>{l.prod.name} x{l.qty}</span>
              <span>{formatPrice(l.prod.price * l.qty)}</span>
            </div>
          ))}
          <div className="mb-0 mt-2 flex justify-between border-b-0 pt-0 text-base">
            <strong>Total</strong>
            <strong>{formatPrice(total)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
