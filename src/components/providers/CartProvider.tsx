'use client';

import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { CartContext } from '@/__hooks__/useCartContext';
import { useCart } from '@/__hooks__/useCart';
import type { CartContextValue } from '@/__types__';

interface CartProviderProps {
  readonly children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const cart = useCart();

  const value = useMemo<CartContextValue>(
    () => ({
      state: cart.state,
      isDrawerOpen: cart.isDrawerOpen,
      addItem: cart.addItem,
      setQuantity: cart.setQuantity,
      removeItem: cart.removeItem,
      clear: cart.clear,
      openCart: cart.openCart,
      closeCart: cart.closeCart,
    }),
    [
      cart.addItem,
      cart.clear,
      cart.closeCart,
      cart.isDrawerOpen,
      cart.openCart,
      cart.removeItem,
      cart.setQuantity,
      cart.state,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
