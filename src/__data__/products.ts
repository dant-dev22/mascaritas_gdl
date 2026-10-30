import type { Product } from '@/__types__';
import { FEATURED_PRODUCT_IDS, PRODUCT_CATALOG } from './catalog';

export const PRODUCT_IMAGE_ASPECT_RATIO = '4 / 5' as const;

export const PRODUCT_PRICE_START_FROM_MXN = Math.min(
  ...PRODUCT_CATALOG.map((product) => product.priceMXN),
);

export function findProductById(id: string): Product | undefined {
  return PRODUCT_CATALOG.find((product) => product.id === id);
}

export function findProductBySlug(slug: string): Product | undefined {
  return PRODUCT_CATALOG.find((product) => product.slug === slug);
}

export const FEATURED_PRODUCTS: ReadonlyArray<Product> = FEATURED_PRODUCT_IDS.flatMap(
  (id) => {
    const product = findProductById(id);
    return product ? [product] : [];
  },
);
