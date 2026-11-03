'use client';

import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { Check, MessageSquare, ShieldCheck, ShoppingCart, Truck } from 'lucide-react';
import { useAddToCart } from '@/__hooks__/useAddToCart';
import { formatMXN } from '@/__lib__/utils';
import { buildWhatsAppHref } from '@/__lib__/whatsapp';
import { Button, BUTTON_ICON_PROPS, BUTTON_LARGE_ICON_PROPS } from '@/components/ui/Button';
import type { Product } from '@/__types__';

interface PurchasePanelProps {
  readonly product: Product;
}

const BENEFITS = [
  { id: 'shipping', icon: Truck, textKey: 'benefits.shipping' },
  { id: 'handmade', icon: ShieldCheck, textKey: 'benefits.handmade' },
] as const;

export function PurchasePanel({ product }: PurchasePanelProps) {
  const t = useTranslations('product');
  const tCatalog = useTranslations('catalog');
  const [isPending, startTransition] = useTransition();
  const addToCart = useAddToCart();

  const hasDiscount =
    typeof product.oldPriceMXN === 'number' && product.oldPriceMXN > product.priceMXN;

  const discountPercent = hasDiscount
    ? Math.round((1 - product.priceMXN / (product.oldPriceMXN ?? product.priceMXN)) * 100)
    : 0;

  const whatsAppHref = buildWhatsAppHref(
    t('whatsappMessage', {
      title: product.title,
      subtitle: product.subtitle,
      sku: product.sku,
    }),
  );

  const handleAdd = (): void => {
    startTransition(() => {
      addToCart(product);
    });
  };

  return (
    <div className="w-full bg-surface border border-border-subtle rounded-[1.5rem] p-5 sm:p-6 shadow-card">
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-lg font-semibold text-accent-green">$</span>
        <span className="font-display text-4xl sm:text-5xl text-white leading-none">
          {product.priceMXN.toLocaleString('es-MX')}
        </span>
        <span className="text-sm text-text-muted font-medium">{tCatalog('priceCurrency')}</span>
      </div>

      {hasDiscount ? (
        <p className="text-sm text-text-muted mb-4">
          <span className="line-through text-text-faint">
            {formatMXN(product.oldPriceMXN ?? product.priceMXN)}
          </span>{' '}
          <span className="font-semibold text-accent-red">
            {t('discount', { percent: discountPercent })}
          </span>
        </p>
      ) : (
        <p className="text-sm text-text-faint mb-4">{t('priceFinal')}</p>
      )}

      <div className="flex items-center gap-2 mb-5 text-sm">
        {product.inStock ? (
          <>
            <span
              className="w-2 h-2 rounded-full bg-accent-green animate-pulse"
              aria-hidden="true"
            />
            <span className="text-white font-medium">{t('inStock')}</span>
            <span className="text-text-muted">
              {t('stockAvailable', { count: product.stockCount })}
            </span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-accent-red" aria-hidden="true" />
            <span className="text-white font-medium">{t('outOfStock')}</span>
            <span className="text-text-muted">{t('waitlist')}</span>
          </>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Button
          variant="primary"
          size="lg"
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
          {!product.inStock ? t('noStock') : isPending ? t('added') : t('addToCart')}
        </Button>

        <Button
          as="link"
          href={whatsAppHref}
          variant="secondary"
          size="lg"
          fullWidth
          target="_blank"
          rel="noreferrer noopener"
          leftIcon={<MessageSquare {...BUTTON_LARGE_ICON_PROPS} aria-hidden="true" />}
        >
          {t('askWhatsapp')}
        </Button>
      </div>

      <ul className="mt-6 pt-5 border-t border-border-subtle flex flex-col gap-3">
        {BENEFITS.map((benefit) => (
          <li key={benefit.id} className="flex items-start gap-3 text-sm text-text-muted">
            <benefit.icon
              {...BUTTON_ICON_PROPS}
              aria-hidden="true"
              className="shrink-0 mt-0.5 text-accent-green"
            />
            <span>{t(benefit.textKey)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
