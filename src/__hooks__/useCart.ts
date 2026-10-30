'use client';

import { useCallback, useMemo, useReducer } from 'react';
import type { CartAction, CartLine, CartState } from '@/__types__';

const INITIAL_STATE: CartState = {
  lines: [],
  count: 0,
  subtotalMXN: 0,
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

function withTotals(lines: ReadonlyArray<CartLine>): CartState {
  return { lines, ...computeTotals(lines) };
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.lines.find((line) => line.productId === action.line.productId);

      if (existing) {
        return withTotals(
          state.lines.map((line) =>
            line.productId === action.line.productId
              ? { ...line, quantity: line.quantity + 1 }
              : line,
          ),
        );
      }

      return withTotals([...state.lines, { ...action.line, quantity: 1 }]);
    }
    case 'REMOVE_ITEM':
      return withTotals(state.lines.filter((line) => line.productId !== action.productId));
    case 'CLEAR':
      return INITIAL_STATE;
    default:
      return state;
  }
}

export function useCart() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const addItem = useCallback((line: Omit<CartLine, 'quantity'>): void => {
    dispatch({ type: 'ADD_ITEM', line });
  }, []);

  const removeItem = useCallback((productId: string): void => {
    dispatch({ type: 'REMOVE_ITEM', productId });
  }, []);

  const clear = useCallback((): void => {
    dispatch({ type: 'CLEAR' });
  }, []);

  return useMemo(
    () => ({ state, addItem, removeItem, clear }),
    [addItem, clear, removeItem, state],
  );
}
