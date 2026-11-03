import { getTranslations } from 'next-intl/server';
import { MASK_PALETTES, PRODUCT_CATEGORIES, PRODUCT_SIZES } from '@/__data__/masks';
import { cn } from '@/__lib__/utils';
import type { Product } from '@/__types__';

interface ProductSpecsProps {
  readonly product: Product;
  readonly className?: string;
}

export async function ProductSpecs({ product, className }: ProductSpecsProps) {
  const t = await getTranslations('specs');
  const tCategories = await getTranslations('specs.categories');
  const tSizes = await getTranslations('specs.sizes');
  const tColors = await getTranslations('specs.colors');

  const category = PRODUCT_CATEGORIES.find((item) => item.id === product.categoryId);
  const size = PRODUCT_SIZES.find((item) => item.id === product.sizeId);
  const palette = MASK_PALETTES[product.accentColor];

  const rows = [
    { id: 'sku', label: t('rows.sku'), value: product.sku },
    {
      id: 'category',
      label: t('rows.category'),
      value: category ? tCategories(category.label) : product.categoryId,
    },
    {
      id: 'size',
      label: t('rows.size'),
      value: size ? `${tSizes(size.label)} · ${tSizes(size.hint)}` : product.sizeId,
    },
    { id: 'style', label: t('rows.style'), value: product.maskStyle },
    { id: 'color', label: t('rows.color'), value: tColors(palette.label) },
    { id: 'finish', label: t('rows.finish'), value: product.finish },
    { id: 'material', label: t('rows.material'), value: product.material },
    { id: 'lining', label: t('rows.lining'), value: product.lining },
  ] as const;

  return (
    <section
      aria-labelledby="ficha-tecnica"
      className={cn('w-full', className)}
    >
      <h2
        id="ficha-tecnica"
        className="font-display text-2xl sm:text-3xl text-white mb-5"
      >
        {t('title')}
      </h2>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex items-start justify-between gap-4 py-3 border-b border-border-subtle"
          >
            <dt className="text-sm text-text-faint uppercase tracking-wider shrink-0">
              {row.label}
            </dt>
            <dd className="text-sm text-white font-medium text-right capitalize">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      {product.tags.length > 0 ? (
        <ul className="flex flex-wrap gap-2 mt-6" aria-label={t('tagsAria')}>
          {product.tags.map((tag) => (
            <li
              key={tag}
              className="inline-flex items-center min-h-[36px] px-3 rounded-full bg-surface border border-border-subtle text-xs text-text-muted capitalize"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
