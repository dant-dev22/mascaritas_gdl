import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CATALOG_PATH } from '@/__lib__/catalogUrl';
import { cn } from '@/__lib__/utils';
import { ProductCard } from './ProductCard';
import type { Product } from '@/__types__';

interface RelatedProductsProps {
  readonly products: ReadonlyArray<Product>;
  readonly className?: string;
}

export function RelatedProducts({ products, className }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="relacionados" className={cn('w-full', className)}>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
        <h2 id="relacionados" className="font-display text-display-md text-white">
          También te puede servir
        </h2>

        <Link
          href={CATALOG_PATH}
          className="group inline-flex items-center gap-1.5 min-h-[48px] text-sm font-semibold text-text-muted hover:text-white transition-colors"
        >
          Ver todo el catálogo
          <ArrowRight
            width={18}
            height={18}
            strokeWidth={2}
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      <div
        role="list"
        aria-label="Productos relacionados"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
