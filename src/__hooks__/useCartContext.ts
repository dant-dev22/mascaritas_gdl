'use client';

import { createContext, useContext } from 'react';
import type { CartContextValue } from '@/__types__';

export const CartContext = createContext<CartContextValue | null>(null);

export function useCartContext(): CartContextValue {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error('useCartContext debe usarse dentro de <CartProvider>');
  }

  return context;
}
