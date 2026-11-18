'use client';

import { useTranslations } from 'next-intl';
import { CHECKOUT_PATH } from '@/__data__/cart';
import { CATALOG_PATH } from '@/__lib__/catalogUrl';
import { useCartContext } from '@/__hooks__/useCartContext';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { CartEmptyState } from './CartEmptyState';
import { CartLineItem } from './CartLineItem';
import { CartSummary } from './CartSummary';

/**
 * Carrito a pantalla completa. Comparte los componentes del `CartDrawer`, pero
 * da más espacio para revisar el pedido antes del checkout.
 */
export function CartPageView() {
  const t = useTranslations('cart');
  const { state } = useCartContext();

  // El carrito se lee de `localStorage`: sin hidratar no sabemos si está vacío.
  if (!state.isHydrated) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (state.lines.length === 0) {
    return (
      <CartEmptyState className="rounded-[1.5rem] border border-border-subtle bg-surface p-8 sm:p-12" />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <ul className="divide-y divide-border-subtle rounded-[1.5rem] border border-border-subtle bg-surface px-5">
        {state.lines.map((line) => (
          <CartLineItem key={line.productId} line={line} />
        ))}
      </ul>

      <aside className="flex flex-col gap-4 rounded-[1.5rem] border border-border-subtle bg-surface p-5 lg:sticky lg:top-24">
        <CartSummary subtotalMXN={state.subtotalMXN} />

        <Button as="link" href={CHECKOUT_PATH} variant="primary" size="lg" fullWidth>
          {t('checkout')}
        </Button>

        <Button as="link" href={CATALOG_PATH} variant="secondary" size="md" fullWidth>
          {t('continueShopping')}
        </Button>
      </aside>
    </div>
  );
}
