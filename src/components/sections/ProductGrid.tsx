'use client';

import { useTranslations } from 'next-intl';
import { FEATURED_PRODUCTS } from '@/__data__/products';
import { useScrollReveal } from '@/__hooks__/useScrollReveal';
import { CATALOG_PATH } from '@/__lib__/catalogUrl';
import { cn } from '@/__lib__/utils';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProductCard } from '@/components/product/ProductCard';

interface ProductGridProps {
  readonly className?: string;
}

export function ProductGrid({ className }: ProductGridProps) {
  const t = useTranslations('featured');
  const tA11y = useTranslations('a11y');
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });

  return (
    <section
      id="productos"
      ref={ref}
      className={cn('content-auto border-t border-border-subtle', className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <SectionHeading
          eyebrow={t('eyebrow')}
          eyebrowColor="green"
          title={t('heading')}
          description={t('description')}
          ctaLabel={t('ctaLabel')}
          ctaHref={CATALOG_PATH}
        />

        <div
          role="list"
          aria-label={tA11y('featuredMasks')}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {FEATURED_PRODUCTS.map((product, index) => (
            <div
              key={product.id}
              className={cn('reveal-enter h-full', isVisible ? 'is-visible' : '')}
              data-delay={index + 1}
              style={{ transitionDelay: `${index * 60}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
