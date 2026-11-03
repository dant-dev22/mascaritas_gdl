import type {
  PriceBucket,
  ProductSizeId,
  ProductSortOption,
} from '@/__types__';

export const CATALOG_PER_PAGE = 9 as const;

export const PRODUCT_SORT_OPTIONS: ReadonlyArray<ProductSortOption> = [
  { id: 'featured', labelKey: 'featured' },
  { id: 'price-asc', labelKey: 'priceAsc' },
  { id: 'price-desc', labelKey: 'priceDesc' },
  { id: 'newest', labelKey: 'newest' },
  { id: 'rating', labelKey: 'rating' },
] as const;

export const PRICE_BUCKETS: ReadonlyArray<PriceBucket> = [
  { id: 'under-500', label: 'Menos de $500', minMXN: 0, maxMXN: 499 },
  { id: 'under-1000', label: 'Menos de $1,000', minMXN: 0, maxMXN: 999 },
  { id: 'over-1000', label: 'Más de $1,000', minMXN: 1000, maxMXN: null },
] as const;

export const DEFAULT_CATALOG_SORT = 'featured' as const satisfies string;

export const DEFAULT_SIZE_IDS: ReadonlyArray<ProductSizeId> = [] as const;

/** Tallas visibles en el panel de filtros (por ahora solo Adulto). */
export const VISIBLE_SIZE_IDS: ReadonlyArray<ProductSizeId> = ['adulto'] as const;

export const SEARCH_DEBOUNCE_MS = 320 as const;

export const SEARCH_MIN_LENGTH = 2 as const;
