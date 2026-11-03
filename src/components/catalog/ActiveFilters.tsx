'use client';

import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { cn } from '@/__lib__/utils';
import { Button } from '@/components/ui/Button';
import type { CatalogFacets, FacetDimension, ProductQuery } from '@/__types__';

interface ActiveFiltersProps {
  readonly facets: CatalogFacets | null;
  readonly query: ProductQuery;
  readonly onToggleFacet: (dimension: FacetDimension, id: string) => void;
  readonly onClearSearch: () => void;
  readonly onToggleStock: () => void;
  readonly onClearAll: () => void;
  readonly className?: string;
}

interface ActiveChip {
  readonly key: string;
  readonly label: string;
  readonly onRemove: () => void;
}

const CHIP_CLASS = cn(
  'inline-flex items-center gap-2 min-h-[48px] pl-4 pr-3 rounded-2xl',
  'bg-surface border border-border-subtle text-sm text-white',
  'hover:border-border-emphasis',
  'transition-colors duration-200',
);

export function ActiveFilters({
  facets,
  query,
  onToggleFacet,
  onClearSearch,
  onToggleStock,
  onClearAll,
  className,
}: ActiveFiltersProps) {
  const t = useTranslations('filters');
  const bucketsByDimension: Record<FacetDimension, ReadonlyArray<{ id: string; label: string }>> = {
    categoryIds: facets?.categories ?? [],
    sizeIds: facets?.sizes ?? [],
    colors: facets?.colors ?? [],
    priceBucketIds: facets?.priceBuckets ?? [],
  };

  const dimensions: ReadonlyArray<FacetDimension> = [
    'categoryIds',
    'sizeIds',
    'colors',
    'priceBucketIds',
  ];

  const dimensionChips: ReadonlyArray<ActiveChip> = dimensions.flatMap((dimension) =>
    query[dimension].flatMap((id) => {
      const bucket = bucketsByDimension[dimension].find((item) => item.id === id);
      return [
        {
          key: `${dimension}-${id}`,
          label: bucket?.label ?? id,
          onRemove: () => onToggleFacet(dimension, id),
        },
      ];
    }),
  );

  const allChips: ReadonlyArray<ActiveChip> = [
    ...(query.search
      ? [
          {
            key: 'search',
            label: `“${query.search}”`,
            onRemove: onClearSearch,
          },
        ]
      : []),
    ...dimensionChips,
    ...(query.onlyInStock
      ? [
          {
            key: 'stock',
            label: t('stockChip'),
            onRemove: onToggleStock,
          },
        ]
      : []),
  ];

  if (allChips.length === 0) return null;

  return (
    <div className={cn('w-full flex flex-wrap items-center gap-2', className)}>
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-text-faint mr-1">
        {t('active')}
      </span>

      {allChips.map((chip) => (
        <span key={chip.key} className={CHIP_CLASS}>
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            aria-label={t('removeChip', { label: chip.label })}
            className={cn(
              'inline-flex items-center justify-center w-8 h-8 rounded-xl',
              'text-text-muted hover:text-white hover:bg-surface-hover',
              'active:scale-[0.96] transition-all duration-200',
              'focus-visible:outline-none focus-visible:shadow-glow-green',
            )}
          >
            <X width={16} height={16} strokeWidth={2.4} aria-hidden="true" />
          </button>
        </span>
      ))}

      <Button variant="ghost" size="sm" onClick={onClearAll}>
        {t('clearAll')}
      </Button>
    </div>
  );
}
