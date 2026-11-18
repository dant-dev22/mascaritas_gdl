'use client';

import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { CART_MAX_QUANTITY } from '@/__data__/cart';
import { readCartLines, writeCartLines } from '@/__lib__/cartStorage';
import type { CartAction, CartLine, CartState } from '@/__types__';

const INITIAL_STATE: CartState = {
  lines: [],
  count: 0,
  subtotalMXN: 0,
  isHydrated: false,
};

function computeTotals(lines: ReadonlyArray<CartLine>): Pick<CartState, 'count' | 'subtotalMXN'> {
  return lines.reduce<Pick<CartState, 'count' | 'subtotalMXN'>>(
    (acc, line) => ({
      count: acc.count + line.quantity,
      subtotalMXN: acc.subtotalMXN + line.priceMXN * line.quantity,
    }),
    { count: 0, subtotalMXN: 0 },
  );
}

function withTotals(lines: ReadonlyArray<CartLine>, isHydrated: boolean): CartState {
  return { lines, isHydrated, ...computeTotals(lines) };
}

/** Fija la cantidad de una línea; `0` o menos la elimina del carrito. */
function setLineQuantity(
  lines: ReadonlyArray<CartLine>,
  productId: string,
  quantity: number,
): ReadonlyArray<CartLine> {
  if (quantity < 1) return lines.filter((line) => line.productId !== productId);

  const capped = Math.min(quantity, CART_MAX_QUANTITY);

  return lines.map((line) =>
    line.productId === productId ? { ...line, quantity: capped } : line,
  );
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return withTotals(action.lines, true);
    case 'ADD_ITEM': {
      const existing = state.lines.find((line) => line.productId === action.line.productId);

      if (existing) {
        return withTotals(
          setLineQuantity(state.lines, action.line.productId, existing.quantity + 1),
          state.isHydrated,
        );
      }

      return withTotals([...state.lines, { ...action.line, quantity: 1 }], state.isHydrated);
    }
    case 'SET_QUANTITY':
      return withTotals(
        setLineQuantity(state.lines, action.productId, action.quantity),
        state.isHydrated,
      );
    case 'REMOVE_ITEM':
      return withTotals(
        state.lines.filter((line) => line.productId !== action.productId),
        state.isHydrated,
      );
    case 'CLEAR':
      return withTotals([], state.isHydrated);
    default:
      return state;
  }
}

export function useCart() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // El carrito vive en `localStorage`: se carga después del primer render para
  // que el HTML del servidor y el del cliente coincidan.
  useEffect(() => {
    dispatch({ type: 'HYDRATE', lines: readCartLines() });
  }, []);

  // Sin hidratar no se escribe: borraría el carrito guardado con el estado vacío.
  useEffect(() => {
    if (!state.isHydrated) return;
    writeCartLines(state.lines);
  }, [state.isHydrated, state.lines]);

  const addItem = useCallback((line: Omit<CartLine, 'quantity'>): void => {
    dispatch({ type: 'ADD_ITEM', line });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number): void => {
    dispatch({ type: 'SET_QUANTITY', productId, quantity });
  }, []);

  const removeItem = useCallback((productId: string): void => {
    dispatch({ type: 'REMOVE_ITEM', productId });
  }, []);

  const clear = useCallback((): void => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const openCart = useCallback((): void => {
    setIsDrawerOpen(true);
  }, []);

  const closeCart = useCallback((): void => {
    setIsDrawerOpen(false);
  }, []);

  return useMemo(
    () => ({
      state,
      isDrawerOpen,
      addItem,
      setQuantity,
      removeItem,
      clear,
      openCart,
      closeCart,
    }),
    [
      addItem,
      clear,
      closeCart,
      isDrawerOpen,
      openCart,
      removeItem,
      setQuantity,
      state,
    ],
  );
}
