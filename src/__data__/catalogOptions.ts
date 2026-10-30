import type {
  PriceBucket,
  ProductSizeId,
  ProductSortOption,
} from '@/__types__';

export const CATALOG_PER_PAGE = 9 as const;

export const PRODUCT_SORT_OPTIONS: ReadonlyArray<ProductSortOption> = [
  { id: 'featured', label: 'Destacados' },
  { id: 'price-asc', label: 'Precio: menor a mayor' },
  { id: 'price-desc', label: 'Precio: mayor a menor' },
  { id: 'newest', label: 'Más recientes' },
  { id: 'rating', label: 'Mejor calificadas' },
] as const;

export const PRICE_BUCKETS: ReadonlyArray<PriceBucket> = [
  { id: 'under-1000', label: 'Menos de $1,000', minMXN: 0, maxMXN: 999 },
  { id: '1000-1299', label: '$1,000 – $1,299', minMXN: 1000, maxMXN: 1299 },
  { id: 'over-1300', label: '$1,300 o más', minMXN: 1300, maxMXN: null },
] as const;

export const DEFAULT_CATALOG_SORT = 'featured' as const satisfies string;

export const DEFAULT_SIZE_IDS: ReadonlyArray<ProductSizeId> = [] as const;

export const SEARCH_DEBOUNCE_MS = 320 as const;

export const SEARCH_MIN_LENGTH = 2 as const;
