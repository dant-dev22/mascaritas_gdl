'use client';

import { useCallback, useState } from 'react';
import type { CheckoutRequestInput, CheckoutResult } from '@/__types__';

/** Motivo del fallo del checkout; el componente lo traduce con `errors.<clave>`. */
export type CheckoutErrorKey = 'conflict' | 'invalid' | 'throttled' | 'network';

interface UseCheckoutReturn {
  readonly submit: (
    payload: CheckoutRequestInput,
    localSubtotalMXN: number,
  ) => Promise<CheckoutResult | null>;
  readonly isSubmitting: boolean;
  readonly errorKey: CheckoutErrorKey | null;
  readonly result: CheckoutResult | null;
  /** Verdadero cuando el servidor ajustó el subtotal respecto al del carrito. */
  readonly priceChanged: boolean;
}

/**
 * Envía el pedido al proxy de Next (`/api/checkout`) y guarda el resultado.
 * Compara el subtotal que devuelve el servidor con el del carrito para avisar
 * si algún precio cambió entre que se armó el carrito y el checkout.
 */
export function useCheckout(): UseCheckoutReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<CheckoutResult | null>(null);
  const [errorKey, setErrorKey] = useState<CheckoutErrorKey | null>(null);
  const [priceChanged, setPriceChanged] = useState(false);

  const submit = useCallback(
    async (
      payload: CheckoutRequestInput,
      localSubtotalMXN: number,
    ): Promise<CheckoutResult | null> => {
      setIsSubmitting(true);
      setErrorKey(null);

      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { accept: 'application/json', 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          setErrorKey(resolveErrorKey(response.status));
          return null;
        }

        const order = (await response.json()) as CheckoutResult;
        setResult(order);
        setPriceChanged(order.subtotalMXN !== localSubtotalMXN);
        return order;
      } catch {
        setErrorKey('network');
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  return { submit, isSubmitting, errorKey, result, priceChanged };
}

function resolveErrorKey(status: number): CheckoutErrorKey {
  if (status === 409) return 'conflict';
  if (status === 429) return 'throttled';
  if (status === 400) return 'invalid';
  return 'network';
}
