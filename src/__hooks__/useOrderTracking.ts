'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { TrackedOrder } from '@/__types__';

type OrderTrackingError = 'notFound' | 'throttled' | 'network';

interface OrderTrackingState {
  /** Código consultado; permite descartar la respuesta de una búsqueda vieja. */
  readonly code: string;
  readonly order: TrackedOrder | null;
  readonly error: OrderTrackingError | null;
}

interface UseOrderTrackingReturn {
  readonly order: TrackedOrder | null;
  readonly isLoading: boolean;
  readonly error: string | null;
}

/**
 * Consulta el estado de un pedido a través del proxy de Next (`/api/pedidos`).
 * Se dispara cada vez que cambia `code`; con `null` o vacío limpia el resultado.
 */
export function useOrderTracking(code: string | null): UseOrderTrackingReturn {
  const t = useTranslations('tracking.errors');
  const normalized = code?.trim().toUpperCase() ?? '';
  const [state, setState] = useState<OrderTrackingState | null>(null);

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
          setState({ code: normalized, order: payload.order, error: null });
          return;
        }
        setState({ code: normalized, order: null, error: resolveError(response.status) });
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setState({ code: normalized, order: null, error: 'network' });
      });

    return () => controller.abort();
  }, [normalized]);

  const isCurrent = state !== null && state.code === normalized;
  const isLoading = normalized.length > 0 && !isCurrent;
  const error = isCurrent && state.error !== null ? t(state.error) : null;

  return {
    order: isCurrent ? state.order : null,
    isLoading,
    error,
  };
}

function resolveError(status: number): OrderTrackingError {
  if (status === 404) return 'notFound';
  if (status === 429) return 'throttled';
  return 'network';
}
