'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAddToCart } from './useAddToCart';
import type { Product } from '@/__types__';

/** Fase visible del botón después de pulsarlo. */
export type AddToCartStatus = 'idle' | 'adding' | 'added';

/** Tiempo mínimo que se muestra el spinner antes de dar por agregado el artículo. */
const ADDING_MS = 550;
/** Tiempo que permanece el acuse de agregado antes de volver al estado base. */
const ADDED_MS = 1300;

interface UseAddToCartFeedbackReturn {
  readonly add: (product: Product) => void;
  readonly status: AddToCartStatus;
}

/**
 * Envuelve `useAddToCart` con la retroalimentación del botón. Agregar al carrito
 * es instantáneo (vive en `localStorage`), así que se sostiene el spinner un
 * instante para que el cambio se perciba y luego se muestra el acuse.
 */
export function useAddToCartFeedback(): UseAddToCartFeedbackReturn {
  const addToCart = useAddToCart();
  const [status, setStatus] = useState<AddToCartStatus>('idle');
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback((): void => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const add = useCallback(
    (product: Product): void => {
      clearTimers();
      addToCart(product);
      setStatus('adding');
      timers.current.push(
        window.setTimeout(() => {
          setStatus('added');
          timers.current.push(window.setTimeout(() => setStatus('idle'), ADDED_MS));
        }, ADDING_MS),
      );
    },
    [addToCart, clearTimers],
  );

  return { add, status };
}
