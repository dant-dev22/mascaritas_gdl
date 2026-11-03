import { getTranslations } from 'next-intl/server';
import { Star } from 'lucide-react';
import { CATALOG_PATH } from '@/__lib__/catalogUrl';
import { cn } from '@/__lib__/utils';
import { Badge } from '@/components/ui/Badge';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ProductGallery } from './ProductGallery';
import { ProductSpecs } from './ProductSpecs';
import { PurchasePanel } from './PurchasePanel';
import { RelatedProducts } from './RelatedProducts';
import type { Product } from '@/__types__';

interface ProductDetailProps {
  readonly product: Product;
  readonly related: ReadonlyArray<Product>;
  readonly className?: string;
}

export async function ProductDetail({ product, related, className }: ProductDetailProps) {
  const tProduct = await getTranslations('product');
  const tCatalog = await getTranslations('catalog');

  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12', className)}>
      <Breadcrumbs
        items={[
          { label: tCatalog('breadcrumbHome'), href: '/' },
          { label: tCatalog('breadcrumbCurrent'), href: CATALOG_PATH },
          { label: product.title },
        ]}
        className="mb-6"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        <ProductGallery product={product} />

        <div className="flex flex-col gap-6">
          <header>
            {product.badge ? (
              <span className="inline-block mb-4">
                <Badge
                  label={product.badge.label}
                  variant={product.badge.variant}
                  showDot={product.badge.variant === 'last-units'}
                />
              </span>
            ) : null}

            <h1 className="font-display text-display-lg text-white text-balance leading-none mb-3">
              {product.title}
            </h1>
            <p className="text-lg text-accent-green font-medium mb-4">{product.subtitle}</p>

            <div className="flex items-center gap-3 text-sm text-text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Star
                  width={16}
                  height={16}
                  fill="currentColor"
                  strokeWidth={0}
                  aria-hidden="true"
                  className="text-[#f4c542]"
                />
                <span className="font-semibold text-white">{product.rating.toFixed(1)}</span>
              </span>
              <span className="text-text-faint">·</span>
              <span>{tProduct('reviewsVerified', { count: product.reviewsCount })}</span>
              <span className="text-text-faint">·</span>
              <span>{product.sku}</span>
            </div>
          </header>

          <p className="text-text-muted leading-relaxed">{product.longDescription}</p>

          <PurchasePanel product={product} />
        </div>
      </div>

      <ProductSpecs product={product} className="mt-14 sm:mt-20" />

      <RelatedProducts products={related} className="mt-14 sm:mt-20" />
    </div>
  );
}
