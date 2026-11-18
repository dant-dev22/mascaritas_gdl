import type { OrderOrigin, OrderStatus, OrderStatusMeta } from '@/__types__';

/** Estados que forman la línea de progreso, en orden. */
export const ORDER_PROGRESS_STATUSES: ReadonlyArray<OrderStatus> = [
  'recibido',
  'en_preparacion',
  'enviado',
  'en_transito',
  'entregado',
] as const;

/** Todos los estados posibles, incluido el corte de un pedido. */
export const ORDER_STATUSES: ReadonlyArray<OrderStatus> = [
  ...ORDER_PROGRESS_STATUSES,
  'cancelado',
];

/** Estado terminal de un pedido que se canceló. */
export const CANCELLED_ORDER_STATUS: OrderStatus = 'cancelado';

/** Presentación de cada estado: nombre, descripción e icono. */
export const ORDER_STATUS_META: Record<OrderStatus, OrderStatusMeta> = {
  recibido: {
    id: 'recibido',
    nameKey: 'status.recibido',
    descriptionKey: 'status.recibidoHint',
    icon: 'package',
  },
  en_preparacion: {
    id: 'en_preparacion',
    nameKey: 'status.en_preparacion',
    descriptionKey: 'status.en_preparacionHint',
    icon: 'hammer',
  },
  enviado: {
    id: 'enviado',
    nameKey: 'status.enviado',
    descriptionKey: 'status.enviadoHint',
    icon: 'truck',
  },
  en_transito: {
    id: 'en_transito',
    nameKey: 'status.en_transito',
    descriptionKey: 'status.en_transitoHint',
    icon: 'route',
  },
  entregado: {
    id: 'entregado',
    nameKey: 'status.entregado',
    descriptionKey: 'status.entregadoHint',
    icon: 'check',
  },
  cancelado: {
    id: 'cancelado',
    nameKey: 'status.cancelado',
    descriptionKey: 'status.canceladoHint',
    icon: 'x',
  },
};

/**
 * Paqueterías conocidas. Si el pedido trae un valor fuera de esta lista se
 * muestra tal cual, para no perder información capturada a mano.
 */
export const ORDER_CARRIER_LABEL_KEYS: Record<string, string> = {
  correos_de_mexico: 'carriers.correosDeMexico',
  estafeta: 'carriers.estafeta',
  dhl: 'carriers.dhl',
  fedex: 'carriers.fedex',
  paqueteria_privada: 'carriers.paqueteriaPrivada',
  otro: 'carriers.otro',
};

/** Paqueterías ofrecidas en el formulario del panel, en orden de aparición. */
export const ORDER_CARRIER_IDS: ReadonlyArray<string> = [
  'correos_de_mexico',
  'estafeta',
  'dhl',
  'fedex',
  'paqueteria_privada',
  'otro',
] as const;

/** Índice del estado dentro de la línea de progreso; -1 si está cancelado. */
export function getProgressIndex(status: OrderStatus): number {
  return ORDER_PROGRESS_STATUSES.indexOf(status);
}

/** Orígenes posibles de un pedido, en orden de aparición. */
export const ORDER_ORIGINS: ReadonlyArray<OrderOrigin> = ['manual', 'tienda'] as const;

/** Clave i18n (namespace `Admin.orderForm`) con el nombre del origen. */
export const ORDER_ORIGIN_LABEL_KEYS: Record<OrderOrigin, string> = {
  manual: 'origin.manual',
  tienda: 'origin.tienda',
};
