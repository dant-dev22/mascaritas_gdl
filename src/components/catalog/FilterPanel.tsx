'use client';

import { RotateCcw } from 'lucide-react';
import { cn } from '@/__lib__/utils';
import { isFacetActive } from '@/__lib__/catalogUrl';
import { VISIBLE_SIZE_IDS } from '@/__data__/catalogOptions';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button, BUTTON_ICON_PROPS } from '@/components/ui/Button';
import type {
  CatalogFacets,
  FacetDimension,
  ProductQuery,
  ProductSizeId,
} from '@/__types__';

interface FilterPanelProps {
  readonly facets: CatalogFacets | null;
  readonly query: ProductQuery;
  readonly activeFilterCount: number;
  readonly onToggleFacet: (dimension: FacetDimension, id: string) => void;
  readonly onToggleStock: (value: boolean) => void;
  readonly onClearAll: () => void;
  readonly className?: string;
}

interface FilterSectionProps {
  readonly title: string;
  readonly description?: string;
  readonly children: React.ReactNode;
}

function FilterSection({ title, description, children }: FilterSectionProps) {
  return (
    <fieldset className="border-t border-border-subtle pt-5 first:border-t-0 first:pt-0">
      <legend className="text-xs font-semibold uppercase tracking-[0.16em] text-white mb-1">
        {title}
      </legend>
      {description ? (
        <p className="text-xs text-text-faint mb-2">{description}</p>
      ) : null}
      <div className="flex flex-col">{children}</div>
    </fieldset>
  );
}

export function FilterPanel({
  facets,
  query,
  activeFilterCount,
  onToggleFacet,
  onToggleStock,
  onClearAll,
  className,
}: FilterPanelProps) {
  return (
    <div className={cn('w-full flex flex-col gap-5', className)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl text-white leading-none">Filtros</h2>
        {activeFilterCount > 0 ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            leftIcon={<RotateCcw {...BUTTON_ICON_PROPS} aria-hidden="true" />}
          >
            Limpiar
          </Button>
        ) : null}
      </div>

      <FilterSection title="Categoría">
        {(facets?.categories ?? []).map((bucket) => (
          <Checkbox
            key={bucket.id}
            name="categoria"
            label={bucket.label}
            count={bucket.count}
            checked={isFacetActive(query, 'categoryIds', bucket.id)}
            onChange={() => onToggleFacet('categoryIds', bucket.id)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Talla">
        {(facets?.sizes ?? [])
          .filter((bucket) => VISIBLE_SIZE_IDS.includes(bucket.id as ProductSizeId))
          .map((bucket) => (
            <Checkbox
              key={bucket.id}
              name="talla"
              label={bucket.label}
              count={bucket.count}
              checked={isFacetActive(query, 'sizeIds', bucket.id)}
              onChange={() => onToggleFacet('sizeIds', bucket.id)}
            />
          ))}
      </FilterSection>

      <FilterSection title="Color principal">
        {(facets?.colors ?? []).map((bucket) => (
          <Checkbox
            key={bucket.id}
            name="color"
            label={bucket.label}
            count={bucket.count}
            swatch={bucket.hex}
            checked={isFacetActive(query, 'colors', bucket.id)}
            onChange={() => onToggleFacet('colors', bucket.id)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Precio">
        {(facets?.priceBuckets ?? []).map((bucket) => (
          <Checkbox
            key={bucket.id}
            name="precio"
            label={bucket.label}
            count={bucket.count}
            checked={isFacetActive(query, 'priceBucketIds', bucket.id)}
            onChange={() => onToggleFacet('priceBucketIds', bucket.id)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Disponibilidad">
        <Checkbox
          name="stock"
          label="Solo piezas disponibles"
          hint="Oculta las máscaras agotadas"
          checked={query.onlyInStock}
          onChange={(event) => onToggleStock(event.target.checked)}
        />
      </FilterSection>
    </div>
  );
}
