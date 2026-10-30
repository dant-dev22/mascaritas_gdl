import { MASK_PALETTES, PRODUCT_CATEGORIES } from '@/__data__/masks';
import {
  CATALOG_PER_PAGE,
  DEFAULT_CATALOG_SORT,
  PRICE_BUCKETS,
  PRODUCT_SORT_OPTIONS,
} from '@/__data__/catalogOptions';
import type {
  AccentColor,
  FacetDimension,
  ProductCategoryId,
  ProductQuery,
  ProductSizeId,
  ProductSortId,
} from '@/__types__';

export const CATALOG_PATH = '/catalogo';

export const CATALOG_PARAM = {
  search: 'q',
  categories: 'cat',
  sizes: 'talla',
  colors: 'color',
  price: 'precio',
  inStock: 'stock',
  sort: 'orden',
  page: 'pagina',
} as const;

const CATEGORY_IDS: ReadonlyArray<string> = PRODUCT_CATEGORIES.map((item) => item.id);
const SIZE_IDS: ReadonlyArray<string> = ['infantil', 'adulto', 'adulto-xl'];
const COLOR_IDS: ReadonlyArray<string> = Object.keys(MASK_PALETTES);
const PRICE_IDS: ReadonlyArray<string> = PRICE_BUCKETS.map((item) => item.id);
const SORT_IDS: ReadonlyArray<string> = PRODUCT_SORT_OPTIONS.map((item) => item.id);

function readList(
  params: URLSearchParams,
  key: string,
  allowed: ReadonlyArray<string>,
): ReadonlyArray<string> {
  const raw = params.get(key);
  if (!raw) return [];
  return raw
    .split(',')
    .map((value) => value.trim())
    .filter((value) => allowed.includes(value));
}

function readPage(params: URLSearchParams): number {
  const raw = Number.parseInt(params.get(CATALOG_PARAM.page) ?? '', 10);
  return Number.isFinite(raw) && raw > 0 ? raw : 1;
}

function readSort(params: URLSearchParams): ProductSortId {
  const raw = params.get(CATALOG_PARAM.sort);
  if (raw && SORT_IDS.includes(raw)) return raw as ProductSortId;
  return DEFAULT_CATALOG_SORT;
}

export const DEFAULT_PRODUCT_QUERY: ProductQuery = {
  search: '',
  categoryIds: [],
  sizeIds: [],
  colors: [],
  priceBucketIds: [],
  onlyInStock: false,
  sort: DEFAULT_CATALOG_SORT,
  page: 1,
  perPage: CATALOG_PER_PAGE,
};

export function parseCatalogParams(
  params: URLSearchParams,
  perPage: number = CATALOG_PER_PAGE,
): ProductQuery {
  return {
    search: (params.get(CATALOG_PARAM.search) ?? '').trim(),
    categoryIds: readList(params, CATALOG_PARAM.categories, CATEGORY_IDS) as ReadonlyArray<
      ProductCategoryId
    >,
    sizeIds: readList(params, CATALOG_PARAM.sizes, SIZE_IDS) as ReadonlyArray<ProductSizeId>,
    colors: readList(params, CATALOG_PARAM.colors, COLOR_IDS) as ReadonlyArray<AccentColor>,
    priceBucketIds: readList(params, CATALOG_PARAM.price, PRICE_IDS),
    onlyInStock: params.get(CATALOG_PARAM.inStock) === '1',
    sort: readSort(params),
    page: readPage(params),
    perPage,
  };
}

export function buildCatalogParams(query: ProductQuery): URLSearchParams {
  const params = new URLSearchParams();

  if (query.search) params.set(CATALOG_PARAM.search, query.search);
  if (query.categoryIds.length > 0)
    params.set(CATALOG_PARAM.categories, query.categoryIds.join(','));
  if (query.sizeIds.length > 0) params.set(CATALOG_PARAM.sizes, query.sizeIds.join(','));
  if (query.colors.length > 0) params.set(CATALOG_PARAM.colors, query.colors.join(','));
  if (query.priceBucketIds.length > 0)
    params.set(CATALOG_PARAM.price, query.priceBucketIds.join(','));
  if (query.onlyInStock) params.set(CATALOG_PARAM.inStock, '1');
  if (query.sort !== DEFAULT_CATALOG_SORT) params.set(CATALOG_PARAM.sort, query.sort);
  if (query.page > 1) params.set(CATALOG_PARAM.page, String(query.page));

  return params;
}

export function buildCatalogHref(query: ProductQuery): string {
  const params = buildCatalogParams(query);
  const queryString = params.toString();
  return queryString.length > 0 ? `${CATALOG_PATH}?${queryString}` : CATALOG_PATH;
}

/** Convierte un objeto de `searchParams` de Next a `URLSearchParams`. */
export function toSearchParams(
  input: Record<string, string | ReadonlyArray<string> | undefined>,
): URLSearchParams {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(input)) {
    if (value === undefined) continue;
    params.set(key, Array.isArray(value) ? value.join(',') : String(value));
  }

  return params;
}

export function toggleId<TId extends string>(
  list: ReadonlyArray<TId>,
  id: TId,
): ReadonlyArray<TId> {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

/** Devuelve una copia del query con una faceta alternada y la paginación reiniciada. */
export function toggleFacetInQuery(
  query: ProductQuery,
  dimension: FacetDimension,
  id: string,
): ProductQuery {
  switch (dimension) {
    case 'categoryIds':
      return {
        ...query,
        page: 1,
        categoryIds: toggleId(query.categoryIds, id as ProductCategoryId),
      };
    case 'sizeIds':
      return { ...query, page: 1, sizeIds: toggleId(query.sizeIds, id as ProductSizeId) };
    case 'colors':
      return { ...query, page: 1, colors: toggleId(query.colors, id as AccentColor) };
    case 'priceBucketIds':
      return { ...query, page: 1, priceBucketIds: toggleId(query.priceBucketIds, id) };
  }
}

export function isFacetActive(
  query: ProductQuery,
  dimension: FacetDimension,
  id: string,
): boolean {
  const list: ReadonlyArray<string> = query[dimension];
  return list.includes(id);
}
