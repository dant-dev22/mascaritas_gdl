import { PRICE_BUCKETS } from '@/__data__/catalogOptions';
import { MASK_PALETTES, PRODUCT_CATEGORIES, PRODUCT_SIZES } from '@/__data__/masks';
import type {
  CatalogFacets,
  FacetBucket,
  PaginatedResult,
  PaginationMeta,
  PriceBucket,
  Product,
  ProductQuery,
  ProductSortId,
} from '@/__types__';

/** Quita acentos y normaliza para búsquedas tipo "galactico" === "Galáctico". */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function buildSearchIndex(product: Product): string {
  const category = PRODUCT_CATEGORIES.find((item) => item.id === product.categoryId);
  const size = PRODUCT_SIZES.find((item) => item.id === product.sizeId);

  return normalizeText(
    [
      product.title,
      product.subtitle,
      product.description,
      product.sku,
      product.maskStyle,
      MASK_PALETTES[product.accentColor].label,
      category?.label ?? '',
      size?.label ?? '',
      ...product.tags,
    ].join(' '),
  );
}

export function matchesSearch(product: Product, term: string): boolean {
  if (term.length === 0) return true;
  return buildSearchIndex(product).includes(term);
}

function resolvePriceBucket(bucketId: string): PriceBucket | null {
  return PRICE_BUCKETS.find((bucket) => bucket.id === bucketId) ?? null;
}

function matchesPriceBuckets(priceMXN: number, buckets: ReadonlyArray<PriceBucket>): boolean {
  return buckets.some(
    (bucket) =>
      priceMXN >= bucket.minMXN &&
      (bucket.maxMXN === null || priceMXN <= bucket.maxMXN),
  );
}

export function filterProducts(
  products: ReadonlyArray<Product>,
  query: ProductQuery,
): ReadonlyArray<Product> {
  const term = normalizeText(query.search);
  const buckets = query.priceBucketIds
    .map(resolvePriceBucket)
    .filter((bucket): bucket is PriceBucket => bucket !== null);

  return products.filter((product) => {
    if (!matchesSearch(product, term)) return false;

    if (query.categoryIds.length > 0 && !query.categoryIds.includes(product.categoryId)) {
      return false;
    }
    if (query.sizeIds.length > 0 && !query.sizeIds.includes(product.sizeId)) {
      return false;
    }
    if (query.colors.length > 0 && !query.colors.includes(product.accentColor)) {
      return false;
    }
    if (buckets.length > 0 && !matchesPriceBuckets(product.priceMXN, buckets)) {
      return false;
    }
    if (query.onlyInStock && !product.inStock) return false;

    return true;
  });
}

const COMPARATORS: Record<
  Exclude<ProductSortId, 'featured'>,
  (a: Product, b: Product) => number
> = {
  'price-asc': (a, b) => a.priceMXN - b.priceMXN,
  'price-desc': (a, b) => b.priceMXN - a.priceMXN,
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  rating: (a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount,
};

export function sortProducts(
  products: ReadonlyArray<Product>,
  sort: ProductSortId,
): ReadonlyArray<Product> {
  const items = Array.from(products);
  if (sort === 'featured') return items;
  return items.sort(COMPARATORS[sort]);
}

export function buildPaginationMeta(
  totalItems: number,
  page: number,
  perPage: number,
): PaginationMeta {
  const safePerPage = perPage > 0 ? perPage : 1;
  const totalPages = Math.max(1, Math.ceil(totalItems / safePerPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const offset = (safePage - 1) * safePerPage;

  return {
    page: safePage,
    perPage: safePerPage,
    totalItems,
    totalPages,
    hasPrevPage: safePage > 1,
    hasNextPage: safePage < totalPages,
    rangeStart: totalItems === 0 ? 0 : offset + 1,
    rangeEnd: Math.min(offset + safePerPage, totalItems),
  };
}

export function paginateProducts(
  products: ReadonlyArray<Product>,
  page: number,
  perPage: number,
): PaginatedResult<Product> {
  const meta = buildPaginationMeta(products.length, page, perPage);
  const offset = (meta.page - 1) * meta.perPage;

  return {
    items: products.slice(offset, offset + meta.perPage),
    meta,
  };
}

export function queryCatalog(
  products: ReadonlyArray<Product>,
  query: ProductQuery,
): PaginatedResult<Product> {
  const filtered = filterProducts(products, query);
  const sorted = sortProducts(filtered, query.sort);
  return paginateProducts(sorted, query.page, query.perPage);
}

function countBy(
  products: ReadonlyArray<Product>,
  predicate: (product: Product) => boolean,
): number {
  return products.reduce((acc, product) => (predicate(product) ? acc + 1 : acc), 0);
}

/**
 * Las facetas se calculan sobre el conjunto que respeta únicamente la búsqueda
 * de texto, de forma que los conteos no "desaparezcan" al aplicar un filtro.
 */
export function buildCatalogFacets(
  products: ReadonlyArray<Product>,
  query: ProductQuery,
): CatalogFacets {
  const term = normalizeText(query.search);
  const base = products.filter((product) => matchesSearch(product, term));

  const categories: ReadonlyArray<FacetBucket> = PRODUCT_CATEGORIES.map((category) => ({
    id: category.id,
    label: category.label,
    count: countBy(base, (product) => product.categoryId === category.id),
  }));

  const sizes: ReadonlyArray<FacetBucket> = PRODUCT_SIZES.map((size) => ({
    id: size.id,
    label: size.label,
    count: countBy(base, (product) => product.sizeId === size.id),
  }));

  const colors: ReadonlyArray<FacetBucket & { readonly hex: string }> = (
    Object.keys(MASK_PALETTES) as ReadonlyArray<Product['accentColor']>
  ).map((colorId) => ({
    id: colorId,
    label: MASK_PALETTES[colorId].label,
    hex: MASK_PALETTES[colorId].swatch,
    count: countBy(base, (product) => product.accentColor === colorId),
  }));

  const priceBuckets: ReadonlyArray<FacetBucket> = PRICE_BUCKETS.map((bucket) => ({
    id: bucket.id,
    label: bucket.label,
    count: countBy(base, (product) => matchesPriceBuckets(product.priceMXN, [bucket])),
  }));

  return {
    categories,
    sizes,
    colors,
    priceBuckets,
    totalProducts: base.length,
  };
}

export function hasActiveFilters(query: ProductQuery): boolean {
  return (
    query.search.length > 0 ||
    query.categoryIds.length > 0 ||
    query.sizeIds.length > 0 ||
    query.colors.length > 0 ||
    query.priceBucketIds.length > 0 ||
    query.onlyInStock
  );
}

export function countActiveFilters(query: ProductQuery): number {
  return (
    query.categoryIds.length +
    query.sizeIds.length +
    query.colors.length +
    query.priceBucketIds.length +
    (query.onlyInStock ? 1 : 0)
  );
}
