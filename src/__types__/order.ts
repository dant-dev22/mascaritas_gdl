import type { DeliveryMethod } from './checkout';

/**
 * Estados por los que pasa un pedido. Espejo del backend (`OrderStatus` en
 * `schemas.py`); si añades uno, actualízalo en ambos lados.
 */
export type OrderStatus =
  | 'recibido'
  | 'en_preparacion'
  | 'enviado'
  | 'en_transito'
  | 'entregado'
  | 'cancelado';

/** Hito visible de la línea de tiempo de un pedido. */
export interface OrderTimelineEvent {
  readonly status: OrderStatus;
  readonly note: string | null;
  readonly createdAt: string;
}

/** Icono disponible para representar un estado del pedido. */
export type OrderStatusIcon =
  | 'package'
  | 'hammer'
  | 'truck'
  | 'route'
  | 'check'
  | 'x';

/** Metadatos de presentación de un estado del pedido. */
export interface OrderStatusMeta {
  readonly id: OrderStatus;
  /** Clave del namespace `tracking` con el nombre del estado. */
  readonly nameKey: string;
  /** Clave del namespace `tracking` con la descripción del estado. */
  readonly descriptionKey: string;
  readonly icon: OrderStatusIcon;
}

/**
 * Vista pública del pedido: exactamente lo que el backend devuelve al
 * consultar por código. No incluye contacto ni notas internas.
 */
export interface TrackedOrder {
  readonly code: string;
  readonly status: OrderStatus;
  readonly customerName: string;
  readonly carrier: string | null;
  readonly trackingNumber: string | null;
  readonly timeline: ReadonlyArray<OrderTimelineEvent>;
}

/**
 * Vista del pedido en el panel: añade el contacto, las notas internas y el
 * detalle de tienda (origen, modalidad de entrega, líneas e importes).
 * Espejo de `AdminOrderOut` en el backend.
 */
export interface AdminOrder {
  readonly id: string;
  readonly code: string;
  readonly customerName: string;
  readonly customerContact: string | null;
  readonly customerEmail: string | null;
  readonly origin: OrderOrigin;
  readonly deliveryMethod: DeliveryMethod | null;
  readonly shippingStreet: string | null;
  readonly shippingCity: string | null;
  readonly shippingState: string | null;
  readonly shippingZip: string | null;
  readonly shippingReferences: string | null;
  readonly subtotalMXN: number | null;
  readonly shippingMXN: number | null;
  readonly totalMXN: number | null;
  readonly carrier: string | null;
  readonly trackingNumber: string | null;
  readonly status: OrderStatus;
  readonly internalNotes: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly items: ReadonlyArray<AdminOrderItem>;
  readonly timeline: ReadonlyArray<OrderTimelineEvent>;
}

/** Origen del pedido: capturado a mano en el panel o generado por la tienda. */
export type OrderOrigin = 'manual' | 'tienda';

/**
 * Línea de un pedido de la tienda. Guarda el snapshot del producto al momento
 * de comprar: el catálogo puede cambiar o el producto desaparecer después.
 */
export interface AdminOrderItem {
  readonly productId: string | null;
  readonly productName: string;
  readonly sku: string;
  readonly unitPriceMXN: number;
  readonly quantity: number;
  readonly lineTotalMXN: number;
}
