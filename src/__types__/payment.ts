/**
 * Métodos de pago del checkout. Espejo de `order_data.py` en el backend: si
 * añades uno, actualízalo en ambos lados.
 */
export type PaymentMethod = 'mercado_pago' | 'contra_entrega' | 'transferencia';

/**
 * Estados del cobro. `no_aplica` corresponde a los pedidos capturados a mano,
 * que no pasan por el checkout.
 */
export type PaymentStatus =
  | 'pendiente'
  | 'pagado'
  | 'fallido'
  | 'expirado'
  | 'reembolsado'
  | 'no_aplica';

/** Icono que representa un método de pago. */
export type PaymentIcon = 'credit-card' | 'banknote' | 'landmark';
