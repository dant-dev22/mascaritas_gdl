'use client';

import { useTranslations } from 'next-intl';
import { cn, formatMXN } from '@/__lib__/utils';

interface CartSummaryProps {
  readonly subtotalMXN: number;
  readonly className?: string;
}

/** Subtotal del carrito. El envío se resuelve en el checkout. */
export function CartSummary({ subtotalMXN, className }: CartSummaryProps) {
  const t = useTranslations('cart');

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-text-muted">{t('subtotal')}</span>
        <span className="font-display text-3xl text-white leading-none">
          {formatMXN(subtotalMXN)}
        </span>
      </div>
      <p className="text-xs text-text-faint">{t('shippingNote')}</p>
    </div>
  );
}
