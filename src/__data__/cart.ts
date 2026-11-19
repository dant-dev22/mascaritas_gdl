import type { AccentColor, MaskStyle } from '@/__types__';

/** Clave de `localStorage` donde vive el carrito persistente. */
export const CART_STORAGE_KEY = 'mascaritas_cart_v1';

/**
 * Tope de piezas por línea. Espejo de `CheckoutItemIn.quantity` (`le=20`) en el
 * backend: si sube aquí y no allá, el checkout rechazaría el pedido.
 */
export const CART_MAX_QUANTITY = 20;

export const CART_PATH = '/carrito';
export const CHECKOUT_PATH = '/checkout';

/** Paletas válidas para la miniatura del carrito; espejo de `MASK_PALETTES`. */
export const CART_ACCENT_COLORS: ReadonlyArray<AccentColor> = [
  'gold',
  'green',
  'red',
  'blue',
  'purple',
  'silver',
];

/** Estilos válidos para la miniatura del carrito. */
export const CART_MASK_STYLES: ReadonlyArray<MaskStyle> = [
  'tiburon',
  'diablo',
  'galactico',
  'aguila',
  'serpiente',
  'pantera',
];

/** Se usan cuando una línea guardada por una versión previa no trae estos datos. */
export const DEFAULT_CART_MASK_STYLE: MaskStyle = 'tiburon';
export const DEFAULT_CART_ACCENT_COLOR: AccentColor = 'gold';
