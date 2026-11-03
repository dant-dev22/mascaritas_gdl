'use client';

import { useTranslations } from 'next-intl';
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

const SORT_OPTION_KEYS = PRODUCT_SORT_OPTIONS.map((option) => ({
  value: option.id,
  labelKey: option.labelKey,
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
  const tSearch = useTranslations('search');
  const tFilters = useTranslations('filters');
  const { term, setTerm } = useSearchField(searchValue, onSearchChange);

  const sortOptions = SORT_OPTION_KEYS.map((option) => ({
    value: option.value,
    label: tSearch(`sort.${option.labelKey}`),
  }));

  return (
    <div className={cn('w-full flex flex-col gap-4', className)}>
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <Input
          type="search"
          name="buscar"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder={tSearch('placeholder')}
          aria-label={tSearch('ariaLabel')}
          leftIcon={<Search {...BUTTON_ICON_PROPS} aria-hidden="true" />}
          containerClassName="flex-1"
          autoComplete="off"
        />

        <Select
          name="orden"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as ProductSortId)}
          options={sortOptions}
          aria-label={tSearch('sortAriaLabel')}
          containerClassName="sm:w-60"
        />

        <Button
          variant="secondary"
          size="md"
          onClick={onOpenFilters}
          className="lg:hidden"
          leftIcon={<SlidersHorizontal {...BUTTON_ICON_PROPS} aria-hidden="true" />}
        >
          {tFilters('button')}
          {activeFilterCount > 0 ? (
            <span className="ml-0.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-accent-green text-[11px] font-bold text-white">
              {activeFilterCount}
            </span>
          ) : null}
        </Button>
      </div>

      <div className="flex items-center justify-between gap-3 text-sm text-text-muted">
        <p aria-live="polite">
          {totalItems === 0
            ? tSearch('noResults')
            : tSearch.rich('showingRange', {
                start: rangeStart,
                end: rangeEnd,
                total: totalItems,
                b: (chunks) => (
                  <span className="font-semibold text-white tabular-nums">{chunks}</span>
                ),
              })}
        </p>

        {isFetching ? (
          <span className="inline-flex items-center gap-2 text-xs text-text-faint">
            <span
              className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse"
              aria-hidden="true"
            />
            {tSearch('updating')}
          </span>
        ) : null}
      </div>
    </div>
  );
}
