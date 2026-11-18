'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { CART_MAX_QUANTITY } from '@/__data__/cart';
import { useCartContext } from '@/__hooks__/useCartContext';
import { cn, formatMXN } from '@/__lib__/utils';
import { BUTTON_ICON_PROPS } from '@/components/ui/Button';
import type { CartLine } from '@/__types__';

interface CartLineItemProps {
  readonly line: CartLine;
  readonly className?: string;
}

const CONTROL_CLASS = cn(
  'touch-target inline-flex items-center justify-center shrink-0',
  'w-12 h-12 rounded-xl',
  'bg-canvas border border-border-subtle text-white',
  'hover:border-border-emphasis hover:bg-surface-hover',
  'active:scale-[0.96]',
  'focus-visible:outline-none focus-visible:shadow-glow-green',
  'disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100',
  'transition-all duration-200 ease-out cursor-pointer',
);

/** Línea del carrito con control de cantidad y atajos de navegación. */
export function CartLineItem({ line, className }: CartLineItemProps) {
  const t = useTranslations('cart');
  const { setQuantity, removeItem } = useCartContext();

  const detailHref = `/producto/${line.slug}`;
  const canIncrease = line.quantity < CART_MAX_QUANTITY;

  return (
    <li className={cn('flex gap-3 py-4', className)}>
      <Link
        href={detailHref}
        aria-label={t('viewProduct', { title: line.title })}
        className="product-ph shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center focus-visible:outline-none focus-visible:shadow-glow-green"
      >
        <span aria-hidden="true" className="font-display text-2xl text-accent-green leading-none">
          {line.title.charAt(0)}
        </span>
      </Link>

      <div className="flex-1 min-w-0 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={detailHref}
            className="text-sm font-medium text-white line-clamp-2 hover:text-accent-green-hover transition-colors focus-visible:outline-none focus-visible:shadow-glow-green rounded"
          >
            {line.title}
          </Link>

          <button
            type="button"
            onClick={() => removeItem(line.productId)}
            aria-label={t('removeLine', { title: line.title })}
            className={CONTROL_CLASS}
          >
            <Trash2 {...BUTTON_ICON_PROPS} aria-hidden="true" />
          </button>
        </div>

        <p className="text-xs text-text-faint">{t('unitPrice', { price: formatMXN(line.priceMXN) })}</p>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setQuantity(line.productId, line.quantity - 1)}
              disabled={line.quantity <= 1}
              aria-label={t('decrease', { title: line.title })}
              className={CONTROL_CLASS}
            >
              <Minus {...BUTTON_ICON_PROPS} aria-hidden="true" />
            </button>

            <span
              aria-live="polite"
              className="min-w-8 text-center text-sm font-semibold text-white"
            >
              {line.quantity}
            </span>

            <button
              type="button"
              onClick={() => setQuantity(line.productId, line.quantity + 1)}
              disabled={!canIncrease}
              aria-label={t('increase', { title: line.title })}
              className={CONTROL_CLASS}
            >
              <Plus {...BUTTON_ICON_PROPS} aria-hidden="true" />
            </button>
          </div>

          <span className="text-sm font-semibold text-white">
            {formatMXN(line.priceMXN * line.quantity)}
          </span>
        </div>
      </div>
    </li>
  );
}
