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
 * Vista del pedido en el panel: añade el contacto y las notas internas.
 * Espejo de `AdminOrderOut` en el backend.
 */
export interface AdminOrder {
  readonly id: string;
  readonly code: string;
  readonly customerName: string;
  readonly customerContact: string | null;
  readonly carrier: string | null;
  readonly trackingNumber: string | null;
  readonly status: OrderStatus;
  readonly internalNotes: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly timeline: ReadonlyArray<OrderTimelineEvent>;
}
