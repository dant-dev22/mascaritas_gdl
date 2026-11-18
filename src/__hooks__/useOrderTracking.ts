'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { TrackedOrder } from '@/__types__';

type OrderTrackingError = 'notFound' | 'throttled' | 'network';

interface OrderTrackingState {
  /** Código consultado; permite descartar la respuesta de una búsqueda vieja. */
  readonly code: string;
  /** Número de intento; cambia al pedir una recarga. */
  readonly attempt: number;
  readonly order: TrackedOrder | null;
  readonly error: OrderTrackingError | null;
}

interface UseOrderTrackingReturn {
  readonly order: TrackedOrder | null;
  readonly isLoading: boolean;
  readonly error: string | null;
  /** Vuelve a consultar el mismo código (lo usa el resultado del pago). */
  readonly reload: () => void;
}

/**
 * Consulta el estado de un pedido a través del proxy de Next (`/api/pedidos`).
 * Se dispara cada vez que cambia `code`; con `null` o vacío limpia el
 * resultado. `reload` repite la misma consulta.
 */
export function useOrderTracking(code: string | null): UseOrderTrackingReturn {
  const t = useTranslations('tracking.errors');
  const normalized = code?.trim().toUpperCase() ?? '';
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<OrderTrackingState | null>(null);

  const reload = useCallback((): void => {
    setAttempt((current) => current + 1);
  }, []);

  useEffect(() => {
    if (normalized.length === 0) return;

    const controller = new AbortController();

    fetch(`/api/pedidos/${encodeURIComponent(normalized)}`, {
      signal: controller.signal,
      headers: { accept: 'application/json' },
    })
      .then(async (response) => {
        if (response.ok) {
          const payload = (await response.json()) as { order: TrackedOrder };
          setState({ code: normalized, attempt, order: payload.order, error: null });
          return;
        }
        setState({
          code: normalized,
          attempt,
          order: null,
          error: resolveError(response.status),
        });
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setState({ code: normalized, attempt, order: null, error: 'network' });
      });

    return () => controller.abort();
  }, [normalized, attempt]);

  const isCurrent = state !== null && state.code === normalized && state.attempt === attempt;
  const isLoading = normalized.length > 0 && !isCurrent;
  const error = isCurrent && state.error !== null ? t(state.error) : null;

  return {
    order: isCurrent ? state.order : null,
    isLoading,
    error,
    reload,
  };
}

function resolveError(status: number): OrderTrackingError {
  if (status === 404) return 'notFound';
  if (status === 429) return 'throttled';
  return 'network';
}
