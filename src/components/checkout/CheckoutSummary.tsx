'use client';

import { useTranslations } from 'next-intl';
import { FREE_SHIPPING_THRESHOLD_MXN } from '@/__data__/shipping';
import { cn, formatMXN } from '@/__lib__/utils';
import type { DeliveryMethod } from '@/__types__';

interface CheckoutSummaryProps {
  readonly subtotalMXN: number;
  /** `null` cuando el envío se cotiza por WhatsApp (paquetería privada). */
  readonly shippingMXN: number | null;
  /** `null` mientras el total no puede calcularse (envío por cotizar). */
  readonly totalMXN: number | null;
  readonly deliveryMethod: DeliveryMethod;
  /** Verdadero si el servidor ajustó el subtotal respecto al del carrito. */
  readonly priceChanged?: boolean;
  readonly className?: string;
}

/**
 * Desglose del pedido: subtotal, envío y total. En paquetería privada el envío
 * queda "por cotizar" y el total no se cierra hasta acordarlo por WhatsApp.
 */
export function CheckoutSummary({
  subtotalMXN,
  shippingMXN,
  totalMXN,
  deliveryMethod,
  priceChanged = false,
  className,
}: CheckoutSummaryProps) {
  const t = useTranslations('checkout.summary');

  const pendingQuote = shippingMXN === null;
  const freeShipping = shippingMXN === 0;
  const hint = resolveHint({ pendingQuote, freeShipping, deliveryMethod }, t);

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <h2 className="font-display text-xl text-white">{t('title')}</h2>

      <dl className="flex flex-col gap-2">
        <SummaryRow label={t('subtotal')} value={formatMXN(subtotalMXN)} />

        <SummaryRow
          label={t('shipping')}
          value={
            pendingQuote
              ? t('shippingPending')
              : freeShipping
                ? t('shippingFree')
                : formatMXN(shippingMXN)
          }
          highlight={freeShipping}
        />

        <div className="mt-1 flex items-baseline justify-between gap-3 border-t border-border-subtle pt-3">
          <dt className="text-sm text-text-muted">{t('total')}</dt>
          <dd
            className={cn(
              'font-display text-3xl leading-none',
              totalMXN === null ? 'text-text-muted text-2xl' : 'text-white',
            )}
          >
            {totalMXN === null ? t('shippingPending') : formatMXN(totalMXN)}
          </dd>
        </div>
      </dl>

      {hint ? <p className="text-xs text-text-faint">{hint}</p> : null}

      {priceChanged ? (
        <p
          role="status"
          className="rounded-2xl border border-accent-red/40 bg-accent-red/10 px-4 py-3 text-xs leading-relaxed text-white"
        >
          {t('priceChanged')}
        </p>
      ) : null}
    </div>
  );
}

interface SummaryRowProps {
  readonly label: string;
  readonly value: string;
  readonly highlight?: boolean;
}

function SummaryRow({ label, value, highlight = false }: SummaryRowProps) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-sm text-text-muted">{label}</dt>
      <dd className={cn('text-sm font-semibold', highlight ? 'text-accent-green' : 'text-white')}>
        {value}
      </dd>
    </div>
  );
}

interface HintContext {
  readonly pendingQuote: boolean;
  readonly freeShipping: boolean;
  readonly deliveryMethod: DeliveryMethod;
}

/** Nota al pie del resumen; depende de la modalidad y del estado del envío. */
function resolveHint(
  { pendingQuote, freeShipping, deliveryMethod }: HintContext,
  t: (key: string, values?: Record<string, string>) => string,
): string | null {
  if (pendingQuote) return t('pendingQuoteHint');
  if (freeShipping) return t('freeShippingApplied');
  if (deliveryMethod === 'correos') {
    return t('freeShippingHint', { amount: formatMXN(FREE_SHIPPING_THRESHOLD_MXN) });
  }
  return null;
}
