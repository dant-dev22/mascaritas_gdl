'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { buildCatalogParams } from '@/__lib__/catalogUrl';
import type {
  CatalogFacets,
  CatalogListResponse,
  FacetBucket,
  PaginatedResult,
  Product,
  ProductQuery,
} from '@/__types__';

interface LoadedCatalog {
  readonly key: string;
  readonly result: PaginatedResult<Product>;
  readonly facets: CatalogFacets;
}

interface FailedCatalog {
  readonly key: string;
  readonly message: string;
}

interface UseCatalogProductsReturn {
  readonly result: PaginatedResult<Product> | null;
  readonly facets: CatalogFacets | null;
  readonly isLoading: boolean;
  readonly isFetching: boolean;
  readonly error: string | null;
}

const EMPTY_FACETS: CatalogFacets = {
  categories: [],
  sizes: [],
  colors: [],
  priceBuckets: [],
  totalProducts: 0,
};

function isFacetBucket(value: unknown): value is FacetBucket {
  return typeof value === 'object' && value !== null && 'id' in value && 'count' in value;
}

function parseListResponse(payload: unknown): CatalogListResponse | null {
  if (typeof payload !== 'object' || payload === null) return null;
  const candidate = payload as Partial<CatalogListResponse>;
  const result = candidate.result;
  const facets = candidate.facets;

  if (!result || !Array.isArray(result.items) || !result.meta) return null;
  if (!facets || !Array.isArray(facets.categories) || !facets.categories.every(isFacetBucket)) {
    return null;
  }

  return { result, facets };
}

/** Consume el backend mockeado (`/api/productos`) y expone el estado de carga. */
export function useCatalogProducts(
  query: ProductQuery,
  reloadToken: number = 0,
): UseCatalogProductsReturn {
  const t = useTranslations('catalog');
  const locale = useLocale();
  const params = useMemo(() => {
    const next = buildCatalogParams(query);
    next.set('lang', locale);
    return next.toString();
  }, [query, locale]);
  const key = useMemo(() => `${params}#${reloadToken}`, [params, reloadToken]);
  const [loaded, setLoaded] = useState<LoadedCatalog | null>(null);
  const [failed, setFailed] = useState<FailedCatalog | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/productos?${params}`, {
      signal: controller.signal,
      headers: { accept: 'application/json' },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(t('errorLoad'));
        return response.json() as Promise<unknown>;
      })
      .then((payload: unknown) => {
        const parsed = parseListResponse(payload);
        if (parsed === null) throw new Error(t('errorInvalid'));
        setLoaded({ key, result: parsed.result, facets: parsed.facets });
        setFailed(null);
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        setFailed({
          key,
          message: cause instanceof Error ? cause.message : t('errorUnexpected'),
        });
      });

    return () => controller.abort();
  }, [key, params, t]);


  const isFetching = loaded?.key !== key && failed?.key !== key;
  const isLoading = loaded === null && failed === null;
  const error = failed !== null && failed.key === key ? failed.message : null;

  return {
    result: error !== null ? null : (loaded?.result ?? null),
    facets: loaded?.facets ?? (isLoading ? null : EMPTY_FACETS),
    isLoading,
    isFetching,
    error,
  };
}
