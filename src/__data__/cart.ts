/** Clave de `localStorage` donde vive el carrito persistente. */
export const CART_STORAGE_KEY = 'mascaritas_cart_v1';

/**
 * Tope de piezas por línea. Espejo de `CheckoutItemIn.quantity` (`le=20`) en el
 * backend: si sube aquí y no allá, el checkout rechazaría el pedido.
 */
export const CART_MAX_QUANTITY = 20;

export const CART_PATH = '/carrito';
export const CHECKOUT_PATH = '/checkout';
