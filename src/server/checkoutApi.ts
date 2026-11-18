import type { CheckoutRequestInput, CheckoutResult } from '@/__types__';

/**
 * Cliente server-only del checkout. Crea el pedido real en el backend
 * (FastAPI + MySQL) y traduce su respuesta a un resultado discriminado para
 * que la API Route decida el código HTTP sin lanzar excepciones.
 */
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://127.0.0.1:8000';

export type CheckoutOutcome =
  | { readonly kind: 'created'; readonly order: CheckoutResult }
  | { readonly kind: 'conflict' }
  | { readonly kind: 'invalid' }
  | { readonly kind: 'throttled' }
  | { readonly kind: 'error' };

/** Crea el pedido de la tienda. El servidor recalcula precios y tarifa. */
export async function createStoreOrder(
  payload: CheckoutRequestInput,
): Promise<CheckoutOutcome> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/checkout/pedidos`, {
      method: 'POST',
      headers: { accept: 'application/json', 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (response.status === 201) {
      const order = (await response.json()) as CheckoutResult;
      return { kind: 'created', order };
    }

    // 409: alguna pieza se agotó o cambió entre el carrito y el checkout.
    if (response.status === 409) return { kind: 'conflict' };
    // 422: el cuerpo no cumple el contrato del backend.
    if (response.status === 422) return { kind: 'invalid' };
    if (response.status === 429) return { kind: 'throttled' };

    return { kind: 'error' };
  } catch {
    return { kind: 'error' };
  }
}
