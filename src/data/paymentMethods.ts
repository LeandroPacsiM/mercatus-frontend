import type { PaymentMethodType } from '../types/store';

export interface PaymentMethod {
  type: PaymentMethodType;
  label: string;
  enabled: boolean;
  description: string;
}

export const paymentMethods: PaymentMethod[] = [
  {
    type: 'TARJETA',
    label: 'Tarjeta de crédito/débito',
    enabled: true,
    description: 'Pasarela simulada en la demo (datos de tarjeta de prueba).',
  },
  {
    type: 'TRANSFERENCIA',
    label: 'Transferencia bancaria',
    enabled: false,
    description: 'Pago manual mediante comprobante de transferencia.',
  },
  {
    type: 'CONTRA_ENTREGA',
    label: 'Contra entrega (COD)',
    enabled: false,
    description: 'Pago en efectivo al recibir el pedido.',
  },
  {
    type: 'BILLETERA',
    label: 'Billetera / Shop Pay',
    enabled: false,
    description: 'Pago acelerado con billetera digital.',
  },
];
