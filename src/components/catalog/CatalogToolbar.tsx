'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import { PRODUCT_SORT_OPTIONS } from '@/__data__/catalogOptions';
import { useSearchField } from '@/__hooks__/useSearchField';
import { cn } from '@/__lib__/utils';
import { Button, BUTTON_ICON_PROPS } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { ProductSortId } from '@/__types__';

interface CatalogToolbarProps {
  readonly searchValue: string;
  readonly onSearchChange: (value: string) => void;
  readonly sort: ProductSortId;
  readonly onSortChange: (sort: ProductSortId) => void;
  readonly totalItems: number;
  readonly rangeStart: number;
  readonly rangeEnd: number;
  readonly activeFilterCount: number;
  readonly onOpenFilters: () => void;
  readonly isFetching: boolean;
  readonly className?: string;
}

const SORT_OPTIONS = PRODUCT_SORT_OPTIONS.map((option) => ({
  value: option.id,
  label: option.label,
}));

export function CatalogToolbar({
  searchValue,
  onSearchChange,
  sort,
  onSortChange,
  totalItems,
  rangeStart,
  rangeEnd,
  activeFilterCount,
  onOpenFilters,
  isFetching,
  className,
}: CatalogToolbarProps) {
  const { term, setTerm } = useSearchField(searchValue, onSearchChange);

  return (
    <div className={cn('w-full flex flex-col gap-4', className)}>
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <Input
          type="search"
          name="buscar"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Busca por nombre, estilo o color…"
          aria-label="Buscar máscaras"
          leftIcon={<Search {...BUTTON_ICON_PROPS} aria-hidden="true" />}
          containerClassName="flex-1"
          autoComplete="off"
        />

        <Select
          name="orden"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as ProductSortId)}
          options={SORT_OPTIONS}
          aria-label="Ordenar resultados"
          containerClassName="sm:w-60"
        />

        <Button
          variant="secondary"
          size="md"
          onClick={onOpenFilters}
          className="lg:hidden"
          leftIcon={<SlidersHorizontal {...BUTTON_ICON_PROPS} aria-hidden="true" />}
        >
          Filtros
          {activeFilterCount > 0 ? (
            <span className="ml-0.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-accent-green text-[11px] font-bold text-white">
              {activeFilterCount}
            </span>
          ) : null}
        </Button>
      </div>

      <div className="flex items-center justify-between gap-3 text-sm text-text-muted">
        <p aria-live="polite">
          {totalItems === 0 ? (
            <>Sin resultados</>
          ) : (
            <>
              Mostrando{' '}
              <span className="font-semibold text-white tabular-nums">
                {rangeStart}–{rangeEnd}
              </span>{' '}
              de <span className="font-semibold text-white tabular-nums">{totalItems}</span>{' '}
              máscaras
            </>
          )}
        </p>

        {isFetching ? (
          <span className="inline-flex items-center gap-2 text-xs text-text-faint">
            <span
              className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse"
              aria-hidden="true"
            />
            Actualizando
          </span>
        ) : null}
      </div>
    </div>
  );
}
