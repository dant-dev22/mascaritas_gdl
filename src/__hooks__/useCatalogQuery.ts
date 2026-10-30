'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { countActiveFilters } from '@/__lib__/catalogEngine';
import {
  CATALOG_PATH,
  buildCatalogParams,
  parseCatalogParams,
  toggleFacetInQuery,
} from '@/__lib__/catalogUrl';
import type {
  FacetDimension,
  ProductQuery,
  ProductSortId,
} from '@/__types__';

interface UseCatalogQueryReturn {
  readonly query: ProductQuery;
  readonly activeFilterCount: number;
  readonly setSearch: (value: string) => void;
  readonly setSort: (sort: ProductSortId) => void;
  readonly setPage: (page: number) => void;
  readonly setOnlyInStock: (value: boolean) => void;
  readonly toggleFacet: (dimension: FacetDimension, id: string) => void;
  readonly clearAll: () => void;
}

/**
 * La URL es la única fuente de verdad del catálogo: filtros, búsqueda,
 * orden y página viven en los search params (deep linking + atrás/adelante).
 */
export function useCatalogQuery(): UseCatalogQueryReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = useMemo(
    () => parseCatalogParams(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const commit = useCallback(
    (nextQuery: ProductQuery): void => {
      const basePath = pathname.startsWith(CATALOG_PATH) ? pathname : CATALOG_PATH;
      const queryString = buildCatalogParams(nextQuery).toString();
      const href = queryString.length > 0 ? `${basePath}?${queryString}` : basePath;
      router.replace(href, { scroll: false });
    },
    [pathname, router],
  );

  const setSearch = useCallback(
    (value: string): void => {
      commit({ ...query, search: value, page: 1 });
    },
    [commit, query],
  );

  const setSort = useCallback(
    (sort: ProductSortId): void => {
      commit({ ...query, sort, page: 1 });
    },
    [commit, query],
  );

  const setPage = useCallback(
    (page: number): void => {
      commit({ ...query, page });
    },
    [commit, query],
  );

  const setOnlyInStock = useCallback(
    (value: boolean): void => {
      commit({ ...query, onlyInStock: value, page: 1 });
    },
    [commit, query],
  );

  const toggleFacet = useCallback(
    (dimension: FacetDimension, id: string): void => {
      commit(toggleFacetInQuery(query, dimension, id));
    },
    [commit, query],
  );

  const clearAll = useCallback((): void => {
    commit({ ...query, search: '', page: 1, categoryIds: [], sizeIds: [], colors: [], priceBucketIds: [], onlyInStock: false });
  }, [commit, query]);

  const activeFilterCount = useMemo(() => countActiveFilters(query), [query]);

  return {
    query,
    activeFilterCount,
    setSearch,
    setSort,
    setPage,
    setOnlyInStock,
    toggleFacet,
    clearAll,
  };
}
