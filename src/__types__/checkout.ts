import type { OrderStatus, OrderTimelineEvent } from './order';
import type { PaymentMethod, PaymentStatus } from './payment';

/** Modalidades de entrega del checkout. Espejo de `order_data.py` en el backend:
 * si añades una, actualízala en ambos lados.
 */
export type DeliveryMethod = 'zmg' | 'correos' | 'paqueteria';

/**
 * Primera decisión del paso de envío: mandar el pedido a domicilio o
 * entregarlo en persona en la ZMG, en cuyo caso el cierre se coordina por
 * WhatsApp y el checkout termina ahí.
 */
export type DeliveryMode = 'envio' | 'entrega-personal';

/** Icono que representa una modalidad de entrega. */
export type ShippingIcon = 'map-pin' | 'truck' | 'package';

/** Campos editables del formulario de envío. */
export interface CheckoutFormValues {
  readonly customerName: string;
  readonly customerContact: string;
  readonly customerEmail: string;
  readonly customerRfc: string;
  readonly shippingStreet: string;
  readonly shippingCity: string;
  readonly shippingState: string;
  readonly shippingZip: string;
  readonly shippingReferences: string;
}

export type CheckoutFieldName = keyof CheckoutFormValues;

/** Motivo por el que un campo no pasa la validación. */
export type CheckoutFieldError = 'required' | 'email';

export type CheckoutFormErrors = Partial<Record<CheckoutFieldName, CheckoutFieldError>>;

/** Línea que viaja al backend: solo identificador y cantidad, nunca precios. */
export interface CheckoutLineInput {
  readonly productId: string;
  readonly quantity: number;
}

/** Cuerpo del checkout. Espejo de `CheckoutRequest`. */
export interface CheckoutRequestInput {
  readonly customerName: string;
  readonly customerContact: string;
  readonly customerEmail: string | null;
  readonly customerRfc: string | null;
  readonly deliveryMethod: DeliveryMethod;
  readonly paymentMethod: PaymentMethod;
  readonly shippingStreet: string;
  readonly shippingCity: string;
  readonly shippingState: string;
  readonly shippingZip: string;
  readonly shippingReferences: string | null;
  readonly note: string | null;
  readonly items: ReadonlyArray<CheckoutLineInput>;
}

/** Línea del pedido con el snapshot del producto al momento de la venta. */
export interface CheckoutResultItem {
  readonly productId: string | null;
  readonly productName: string;
  readonly sku: string;
  readonly unitPriceMXN: number;
  readonly quantity: number;
  readonly lineTotalMXN: number;
}

/** Confirmación del checkout. Espejo de `CheckoutResult`. */
export interface CheckoutResult {
  readonly code: string;
  readonly status: OrderStatus;
  /** Slug de la modalidad elegida; `null` en pedidos capturados a mano. */
  readonly deliveryMethod: string | null;
  /** Método de pago elegido; `null` en pedidos capturados a mano. */
  readonly paymentMethod: PaymentMethod | null;
  readonly paymentStatus: PaymentStatus;
  readonly customerName: string;
  readonly items: ReadonlyArray<CheckoutResultItem>;
  readonly subtotalMXN: number;
  /** `null` cuando la modalidad se cotiza a mano (paquetería privada). */
  readonly shippingMXN: number | null;
  readonly totalMXN: number | null;
  readonly freeShipping: boolean;
  readonly shippingPendingQuote: boolean;
  /** Enlace de cobro de Mercado Pago. `null` con pago contra entrega o si la pasarela falló. */
  readonly paymentUrl: string | null;
  readonly timeline: ReadonlyArray<OrderTimelineEvent>;
}
