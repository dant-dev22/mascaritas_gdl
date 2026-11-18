'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { CART_PATH, CHECKOUT_PATH } from '@/__data__/cart';
import { cn } from '@/__lib__/utils';
import { useCartContext } from '@/__hooks__/useCartContext';
import { Button, BUTTON_ICON_PROPS } from '@/components/ui/Button';
import { CartEmptyState } from './CartEmptyState';
import { CartLineItem } from './CartLineItem';
import { CartSummary } from './CartSummary';

/**
 * Carrito lateral. Se monta junto al `Header` y se abre desde su botón, así que
 * está disponible en todas las páginas públicas.
 */
export function CartDrawer() {
  const t = useTranslations('cart');
  const { state, isDrawerOpen, closeCart } = useCartContext();

  useEffect(() => {
    if (!isDrawerOpen) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') closeCart();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDrawerOpen, closeCart]);

  if (!isDrawerOpen) return null;

  const isEmpty = state.lines.length === 0;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label={t('drawerTitle')}
    >
      <button
        type="button"
        aria-label={t('closeDrawer')}
        onClick={closeCart}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-default"
      />

      <div
        className={cn(
          'absolute right-0 top-0 h-full w-[92%] max-w-md',
          'bg-canvas border-l border-border-subtle',
          'flex flex-col',
          'overflow-hidden',
        )}
      >
        <div className="flex items-center justify-between gap-3 p-5 border-b border-border-subtle">
          <h2 className="font-display text-2xl text-white leading-none">{t('drawerTitle')}</h2>
          <button
            type="button"
            onClick={closeCart}
            autoFocus
            aria-label={t('closeDrawer')}
            className={cn(
              'touch-target inline-flex items-center justify-center shrink-0',
              'w-12 h-12 rounded-2xl',
              'bg-surface border border-border-subtle text-white',
              'hover:border-border-emphasis hover:bg-surface-hover',
              'active:scale-[0.96]',
              'focus-visible:outline-none focus-visible:shadow-glow-green',
              'transition-all duration-200 ease-out cursor-pointer',
            )}
          >
            <X {...BUTTON_ICON_PROPS} aria-hidden="true" />
          </button>
        </div>

        {isEmpty ? (
          <CartEmptyState className="flex-1 p-6" onNavigate={closeCart} />
        ) : (
          <>
            <ul className="flex-1 min-h-0 overflow-y-auto divide-y divide-border-subtle px-5">
              {state.lines.map((line) => (
                <CartLineItem key={line.productId} line={line} />
              ))}
            </ul>

            <div className="border-t border-border-subtle p-5 flex flex-col gap-4">
              <CartSummary subtotalMXN={state.subtotalMXN} />

              <div className="flex flex-col gap-2">
                <Button
                  as="link"
                  href={CHECKOUT_PATH}
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={closeCart}
                >
                  {t('checkout')}
                </Button>

                <Link
                  href={CART_PATH}
                  onClick={closeCart}
                  className="touch-target inline-flex items-center justify-center text-sm font-medium text-text-muted hover:text-white transition-colors focus-visible:outline-none focus-visible:shadow-glow-green rounded"
                >
                  {t('viewCart')}
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
