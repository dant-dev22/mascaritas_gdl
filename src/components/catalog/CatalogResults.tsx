'use client';

import { useTranslations } from 'next-intl';
import { RefreshCcw } from 'lucide-react';
import { cn } from '@/__lib__/utils';
import { Button, BUTTON_ICON_PROPS } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton';
import type { Product } from '@/__types__';

interface CatalogResultsProps {
  readonly products: ReadonlyArray<Product>;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly onClearFilters: () => void;
  readonly onRetry: () => void;
  readonly className?: string;
}

const SKELETON_KEYS = ['sk-1', 'sk-2', 'sk-3', 'sk-4', 'sk-5', 'sk-6', 'sk-7', 'sk-8', 'sk-9'];

const GRID_CLASS = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8';

export function CatalogResults({
  products,
  isLoading,
  error,
  onClearFilters,
  onRetry,
  className,
}: CatalogResultsProps) {
  const t = useTranslations('catalog');

  if (isLoading) {
    return (
      <div
        className={cn(GRID_CLASS, className)}
        role="status"
        aria-label={t('loading')}
      >
        {SKELETON_KEYS.map((key) => (
          <ProductCardSkeleton key={key} />
        ))}
      </div>
    );
  }

  if (error !== null) {
    return (
      <EmptyState
        className={className}
        title={t('errorTitle')}
        description={error}
        action={
          <Button
            variant="primary"
            size="md"
            onClick={onRetry}
            leftIcon={<RefreshCcw {...BUTTON_ICON_PROPS} aria-hidden="true" />}
          >
            {t('retry')}
          </Button>
        }
      />
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        className={className}
        title={t('emptyTitle')}
        description={t('emptyDescription')}
        action={
          <Button variant="secondary" size="md" onClick={onClearFilters}>
            {t('clearFiltersAction')}
          </Button>
        }
      />
    );
  }

  return (
    <div role="list" aria-label={t('resultsRegion')} className={cn(GRID_CLASS, className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
