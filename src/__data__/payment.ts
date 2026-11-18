import type { DeliveryMethod, PaymentIcon, PaymentMethod, PaymentStatus } from '@/__types__';

/**
 * Métodos de pago y su compatibilidad con cada modalidad de entrega. Espejo de
 * `app/order_data.py` en el backend: si cambia una regla allá, cámbiala aquí.
 */

/** Métodos disponibles, en el orden en que se muestran. */
export const PAYMENT_METHODS: ReadonlyArray<PaymentMethod> = ['mercado_pago', 'contra_entrega'];

/**
 * Qué métodos acepta cada modalidad de entrega:
 * - La paquetería privada se cotiza a mano y todavía no tiene total, así que
 *   no se puede cobrar en línea.
 * - Correos de México exige prepago: el paquete no sale sin pago.
 */
export const PAYMENT_METHODS_BY_DELIVERY: Record<DeliveryMethod, ReadonlyArray<PaymentMethod>> = {
  zmg: ['mercado_pago', 'contra_entrega'],
  correos: ['mercado_pago'],
  paqueteria: ['contra_entrega'],
};

/** Métodos válidos para una modalidad, en el orden en que se muestran. */
export function availablePaymentMethods(
  deliveryMethod: DeliveryMethod,
): ReadonlyArray<PaymentMethod> {
  return PAYMENT_METHODS.filter((method) =>
    PAYMENT_METHODS_BY_DELIVERY[deliveryMethod].includes(method),
  );
}

/** Verdadero si la pareja modalidad de entrega / método de pago es válida. */
export function isPaymentMethodAllowed(
  deliveryMethod: DeliveryMethod,
  paymentMethod: PaymentMethod,
): boolean {
  return PAYMENT_METHODS_BY_DELIVERY[deliveryMethod].includes(paymentMethod);
}

/** Primer método válido para una modalidad; sirve de valor por defecto. */
export function defaultPaymentMethod(deliveryMethod: DeliveryMethod): PaymentMethod {
  return availablePaymentMethods(deliveryMethod)[0];
}

export interface PaymentMethodOption {
  readonly id: PaymentMethod;
  /** Clave del namespace `checkout.payments` con el nombre visible. */
  readonly labelKey: string;
  /** Clave del namespace `checkout.payments` con la descripción visible. */
  readonly descriptionKey: string;
  readonly icon: PaymentIcon;
}

export const PAYMENT_METHOD_OPTIONS: ReadonlyArray<PaymentMethodOption> = [
  {
    id: 'mercado_pago',
    labelKey: 'mercadoPago',
    descriptionKey: 'mercadoPagoDescription',
    icon: 'credit-card',
  },
  {
    id: 'contra_entrega',
    labelKey: 'contraEntrega',
    descriptionKey: 'contraEntregaDescription',
    icon: 'banknote',
  },
];

/** Clave i18n (namespace `Admin.orderForm`) con el nombre del estado del cobro. */
export const PAYMENT_STATUS_LABEL_KEYS: Record<PaymentStatus, string> = {
  pendiente: 'paymentStatuses.pendiente',
  pagado: 'paymentStatuses.pagado',
  fallido: 'paymentStatuses.fallido',
  expirado: 'paymentStatuses.expirado',
  reembolsado: 'paymentStatuses.reembolsado',
  no_aplica: 'paymentStatuses.no_aplica',
};
