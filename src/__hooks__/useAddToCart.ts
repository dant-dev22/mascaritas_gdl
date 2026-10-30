'use client';

import { useCallback } from 'react';
import { useCartContext } from './useCartContext';
import type { Product } from '@/__types__';

/** Mapea un `Product` a la línea del carrito y lo agrega. */
export function useAddToCart(): (product: Product) => void {
  const { addItem } = useCartContext();

  return useCallback(
    (product: Product): void => {
      addItem({
        productId: product.id,
        slug: product.slug,
        title: product.title,
        priceMXN: product.priceMXN,
      });
    },
    [addItem],
  );
}
