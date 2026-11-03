'use client';

import { useCallback, useState } from 'react';
import { useCatalogProducts } from '@/__hooks__/useCatalogProducts';
import { useCatalogQuery } from '@/__hooks__/useCatalogQuery';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Pagination } from '@/components/ui/Pagination';
import { ActiveFilters } from './ActiveFilters';
import { CatalogResults } from './CatalogResults';
import { CatalogToolbar } from './CatalogToolbar';
import { FilterDrawer } from './FilterDrawer';
import { FilterPanel } from './FilterPanel';

export function CatalogView() {
  const {
    query,
    activeFilterCount,
    setSearch,
    setSort,
    setPage,
    setOnlyInStock,
    toggleFacet,
    clearAll,
  } = useCatalogQuery();

  const [reloadToken, setReloadToken] = useState(0);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const { result, facets, isLoading, isFetching, error } = useCatalogProducts(
    query,
    reloadToken,
  );

  const meta = result?.meta ?? null;

  const closeDrawer = useCallback((): void => {
    setDrawerOpen(false);
  }, []);

  const openDrawer = useCallback((): void => {
    setDrawerOpen(true);
  }, []);

  const handleRetry = useCallback((): void => {
    setReloadToken((token) => token + 1);
  }, []);

  const handleToggleStock = useCallback((): void => {
    setOnlyInStock(!query.onlyInStock);
  }, [query.onlyInStock, setOnlyInStock]);

  const handleClearSearch = useCallback((): void => {
    setSearch('');
  }, [setSearch]);

  const handleToggleStockFromCheckbox = useCallback(
    (value: boolean): void => {
      setOnlyInStock(value);
    },
    [setOnlyInStock],
  );

  const handlePageChange = useCallback(
    (page: number): void => {
      setPage(page);
      window.scrollTo({ top: 0 });
    },
    [setPage],
  );

  const panelProps = {
    facets,
    query,
    activeFilterCount,
    onToggleFacet: toggleFacet,
    onToggleStock: handleToggleStockFromCheckbox,
    onClearAll: clearAll,
  } as const;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs
        items={[{ label: 'Inicio', href: '/' }, { label: 'Catálogo' }]}
        className="mb-6"
      />

      <header className="mb-8 sm:mb-10 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-green mb-3">
          {facets?.totalProducts ?? 0} máscaras disponibles
        </p>
        <h1 className="font-display text-display-lg text-white text-balance mb-3">
          Catálogo completo
        </h1>
        <p className="text-text-muted text-base sm:text-lg leading-relaxed">
          Filtra por categoría, talla, color y precio. Cada pieza está hecha 100%
          a mano y resiste entrenamiento real.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-12">
        <aside className="hidden lg:block" aria-label="Filtros del catálogo">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-6 pr-1">
            <FilterPanel {...panelProps} />
          </div>
        </aside>

        <div className="flex flex-col gap-6 min-w-0">
          <CatalogToolbar
            searchValue={query.search}
            onSearchChange={setSearch}
            sort={query.sort}
            onSortChange={setSort}
            totalItems={meta?.totalItems ?? 0}
            rangeStart={meta?.rangeStart ?? 0}
            rangeEnd={meta?.rangeEnd ?? 0}
            activeFilterCount={activeFilterCount}
            onOpenFilters={openDrawer}
            isFetching={isFetching}
          />

          <ActiveFilters
            facets={facets}
            query={query}
            onToggleFacet={toggleFacet}
            onClearSearch={handleClearSearch}
            onToggleStock={handleToggleStock}
            onClearAll={clearAll}
          />

          <CatalogResults
            products={result?.items ?? []}
            isLoading={isLoading}
            error={error}
            onClearFilters={clearAll}
            onRetry={handleRetry}
          />

          {meta ? (
            <Pagination meta={meta} onPageChange={handlePageChange} className="mt-4" />
          ) : null}
        </div>
      </div>

      <FilterDrawer isOpen={isDrawerOpen} onClose={closeDrawer}>
        <FilterPanel {...panelProps} />
      </FilterDrawer>
    </section>
  );
}
