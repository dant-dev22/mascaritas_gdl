import type {
  AccentColor,
  Product,
  ProductCategoryId,
  ProductSizeId,
} from './product';

export type ProductSortId =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'rating';

export interface ProductSortOption {
  readonly id: ProductSortId;
  readonly label: string;
}

export interface PriceBucket {
  readonly id: string;
  readonly label: string;
  readonly minMXN: number;
  readonly maxMXN: number | null;
}

export interface ProductQuery {
  readonly search: string;
  readonly categoryIds: ReadonlyArray<ProductCategoryId>;
  readonly sizeIds: ReadonlyArray<ProductSizeId>;
  readonly colors: ReadonlyArray<AccentColor>;
  readonly priceBucketIds: ReadonlyArray<string>;
  readonly onlyInStock: boolean;
  readonly sort: ProductSortId;
  readonly page: number;
  readonly perPage: number;
}

export interface PaginationMeta {
  readonly page: number;
  readonly perPage: number;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly hasPrevPage: boolean;
  readonly hasNextPage: boolean;
  readonly rangeStart: number;
  readonly rangeEnd: number;
}

export interface PaginatedResult<TItem> {
  readonly items: ReadonlyArray<TItem>;
  readonly meta: PaginationMeta;
}

export type FacetDimension = 'categoryIds' | 'sizeIds' | 'colors' | 'priceBucketIds';

export interface FacetBucket {
  readonly id: string;
  readonly label: string;
  readonly count: number;
}

export interface CatalogFacets {
  readonly categories: ReadonlyArray<FacetBucket>;
  readonly sizes: ReadonlyArray<FacetBucket>;
  readonly colors: ReadonlyArray<FacetBucket & { readonly hex: string }>;
  readonly priceBuckets: ReadonlyArray<FacetBucket>;
  readonly totalProducts: number;
}

export type CatalogProduct = Product;

export interface CatalogListResponse {
  readonly result: PaginatedResult<CatalogProduct>;
  readonly facets: CatalogFacets;
}

export interface CatalogProductResponse {
  readonly product: CatalogProduct;
  readonly related: ReadonlyArray<CatalogProduct>;
}

export interface CatalogViewState {
  readonly query: ProductQuery;
  readonly result: PaginatedResult<CatalogProduct> | null;
  readonly facets: CatalogFacets | null;
  readonly isLoading: boolean;
  readonly isFetching: boolean;
  readonly error: string | null;
}
