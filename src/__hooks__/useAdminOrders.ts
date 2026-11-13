'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ADMIN_PER_PAGE, ADMIN_SEARCH_DEBOUNCE_MS } from '@/__data__/adminNav';
import { useDebouncedValue } from '@/__hooks__/useDebouncedValue';
import type { AdminOrder, PaginatedResult } from '@/__types__';

interface LoadedOrders {
  readonly key: string;
  readonly result: PaginatedResult<AdminOrder>;
}

interface FailedOrders {
  readonly key: string;
  readonly message: string;
  readonly unauthorized: boolean;
}

export interface UseAdminOrdersReturn {
  readonly result: PaginatedResult<AdminOrder> | null;
  readonly isLoading: boolean;
  readonly isFetching: boolean;
  readonly error: string | null;
  readonly isUnauthorized: boolean;
  readonly refresh: () => void;
}

function isPaginatedResult(value: unknown): value is PaginatedResult<AdminOrder> {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<PaginatedResult<AdminOrder>>;
  return Array.isArray(candidate.items) && typeof candidate.meta === 'object';
}

/** Lista los pedidos del panel con búsqueda y paginación (12 por vista). */
export function useAdminOrders(search: string, page: number): UseAdminOrdersReturn {
  const t = useTranslations('Admin');
  const debouncedSearch = useDebouncedValue(search.trim(), ADMIN_SEARCH_DEBOUNCE_MS);
  const [reloadToken, setReloadToken] = useState(0);

  const params = useMemo(() => {
    return new URLSearchParams({
      search: debouncedSearch,
      page: String(page),
      perPage: String(ADMIN_PER_PAGE),
    }).toString();
  }, [debouncedSearch, page]);

  const key = useMemo(() => `${params}#${reloadToken}`, [params, reloadToken]);
  const [loaded, setLoaded] = useState<LoadedOrders | null>(null);
  const [failed, setFailed] = useState<FailedOrders | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/admin/pedidos?${params}`, {
      signal: controller.signal,
      headers: { accept: 'application/json' },
    })
      .then(async (response) => {
        if (response.status === 401) {
          throw Object.assign(new Error(t('orders.errorUnauthorized')), { unauthorized: true });
        }
        if (!response.ok) throw new Error(t('orders.errorLoad'));
        return response.json() as Promise<unknown>;
      })
      .then((payload: unknown) => {
        if (!isPaginatedResult(payload)) throw new Error(t('orders.errorLoad'));
        setLoaded({ key, result: payload });
        setFailed(null);
      })
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        const unauthorized =
          cause instanceof Error && 'unauthorized' in cause
            ? Boolean((cause as { unauthorized?: boolean }).unauthorized)
            : false;
        setFailed({
          key,
          message: cause instanceof Error ? cause.message : t('orders.errorLoad'),
          unauthorized,
        });
      });

    return () => controller.abort();
  }, [key, params, t]);

  const refresh = useCallback((): void => {
    setReloadToken((token) => token + 1);
  }, []);

  const isFetching = loaded?.key !== key && failed?.key !== key;
  const isLoading = loaded === null && failed === null;
  const activeError = failed !== null && failed.key === key ? failed : null;

  return {
    result: activeError === null ? (loaded?.result ?? null) : null,
    isLoading,
    isFetching,
    error: activeError?.message ?? null,
    isUnauthorized: activeError?.unauthorized ?? false,
    refresh,
  };
}
