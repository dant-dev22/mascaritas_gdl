import type { TrackedOrder } from '@/__types__';

/**
 * Repositorio server-only del rastreo público. Consulta el backend real
 * (FastAPI + MySQL) y traduce su respuesta a un resultado discriminado para
 * que la API Route decida el código HTTP sin lanzar excepciones.
 */
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://127.0.0.1:8000';

const REQUEST_INIT: RequestInit = {
  cache: 'no-store',
  headers: { accept: 'application/json' },
};

export type OrderLookup =
  | { readonly kind: 'found'; readonly order: TrackedOrder }
  | { readonly kind: 'not-found' }
  | { readonly kind: 'throttled' }
  | { readonly kind: 'error' };

/** Busca un pedido por su código. El backend normaliza a mayúsculas. */
export async function lookupOrderByCode(code: string): Promise<OrderLookup> {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/pedidos/${encodeURIComponent(code)}`,
      REQUEST_INIT,
    );

    if (response.status === 404) return { kind: 'not-found' };
    if (response.status === 429) return { kind: 'throttled' };
    if (!response.ok) return { kind: 'error' };

    const order = (await response.json()) as TrackedOrder;
    return { kind: 'found', order };
  } catch {
    return { kind: 'error' };
  }
}
