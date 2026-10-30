'use client';

import Link from 'next/link';
import { useTransition } from 'react';
import { Check, Eye, ShoppingCart, Star } from 'lucide-react';
import { PRODUCT_IMAGE_ASPECT_RATIO } from '@/__data__/products';
import { useAddToCart } from '@/__hooks__/useAddToCart';
import { cn, formatMXN } from '@/__lib__/utils';
import { Badge } from '@/components/ui/Badge';
import { Button, BUTTON_ICON_PROPS, BUTTON_LARGE_ICON_PROPS } from '@/components/ui/Button';
import { MaskArt } from '@/components/graphics/MaskArt';
import type { Product } from '@/__types__';

interface ProductCardProps {
  readonly product: Product;
  readonly className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isPending, startTransition] = useTransition();
  const addToCart = useAddToCart();
  const detailHref = `/producto/${product.slug}`;
  const hasDiscount = typeof product.oldPriceMXN === 'number';

  const handleAdd = (): void => {
    startTransition(() => {
      addToCart(product);
    });
  };

  return (
    <article
      role="listitem"
      className={cn(
        'group flex flex-col h-full',
        'bg-surface border border-border-subtle rounded-[1.5rem] p-4 sm:p-5 shadow-card',
        'hover:-translate-y-1 hover:border-border-emphasis hover:shadow-[0_20px_60px_-20px_rgba(0,168,107,0.35)]',
        'transition-all duration-300 ease-out',
        className,
      )}
    >
      <Link
        href={detailHref}
        aria-label={`Ver detalle de ${product.title} ${product.subtitle}`}
        className="relative block rounded-2xl overflow-hidden product-ph mb-5 flex items-center justify-center focus-visible:outline-none focus-visible:shadow-glow-green"
        style={{ aspectRatio: PRODUCT_IMAGE_ASPECT_RATIO }}
      >
        <MaskArt
          maskStyle={product.maskStyle}
          accentColor={product.accentColor}
          className="w-[68%] h-[68%] transition-transform duration-300 group-hover:scale-[1.04]"
        />

        {product.badge ? (
          <span className="absolute top-4 left-4 z-10">
            <Badge
              label={product.badge.label}
              variant={product.badge.variant}
              showDot={product.badge.variant === 'last-units'}
            />
          </span>
        ) : null}

        {!product.inStock ? (
          <span className="absolute inset-0 z-10 flex items-center justify-center bg-canvas/70 backdrop-blur-[2px]">
            <span className="font-display text-2xl text-white tracking-wide">
              AGOTADA
            </span>
          </span>
        ) : null}
      </Link>

      <div className="flex-1 flex flex-col">
        <header className="mb-2">
          <h3 className="font-display text-display-md text-white leading-tight">
            <Link
              href={detailHref}
              className="hover:text-accent-green-hover transition-colors focus-visible:outline-none focus-visible:shadow-glow-green rounded"
            >
              {product.title}
            </Link>
          </h3>
          <p className="text-sm text-text-muted mt-1">{product.subtitle}</p>
        </header>

        <div className="flex items-center gap-2 mb-3 text-xs text-text-muted">
          <Star
            width={14}
            height={14}
            fill="currentColor"
            strokeWidth={0}
            aria-hidden="true"
            className="text-[#f4c542]"
          />
          <span className="font-semibold text-white">{product.rating.toFixed(1)}</span>
          <span className="text-text-faint">({product.reviewsCount} reseñas)</span>
        </div>

        <p className="text-sm text-text-muted leading-relaxed mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-baseline gap-2 mb-5 mt-auto">
          <span className="text-[15px] font-semibold text-accent-green">$</span>
          <span className="font-display text-3xl sm:text-4xl text-white leading-none">
            {product.priceMXN.toLocaleString('es-MX')}
          </span>
          <span className="text-sm text-text-muted font-medium">MXN</span>
          {hasDiscount ? (
            <span className="ml-auto text-sm line-through text-text-faint">
              {formatMXN(product.oldPriceMXN ?? product.priceMXN)}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={handleAdd}
            disabled={!product.inStock}
            aria-live="polite"
            aria-busy={isPending}
            leftIcon={
              isPending ? (
                <Check {...BUTTON_LARGE_ICON_PROPS} aria-hidden="true" />
              ) : (
                <ShoppingCart {...BUTTON_LARGE_ICON_PROPS} aria-hidden="true" />
              )
            }
          >
            {!product.inStock
              ? 'Agotada'
              : isPending
                ? '¡Agregado!'
                : 'Agregar al carrito'}
          </Button>

          <Link
            href={detailHref}
            aria-label={`Ver detalle de ${product.title}`}
            className={cn(
              'touch-target shrink-0 inline-flex items-center justify-center',
              'w-12 h-12 rounded-2xl',
              'bg-transparent border border-border-emphasis text-white',
              'hover:bg-surface-hover',
              'active:scale-[0.96]',
              'focus-visible:outline-none focus-visible:shadow-glow-green',
              'transition-all duration-200 ease-out',
            )}
          >
            <Eye {...BUTTON_ICON_PROPS} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
