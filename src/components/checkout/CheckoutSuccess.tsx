'use client';

import { useEffect } from 'react';
import { CheckCircle2, CreditCard, MessageSquare, PackageSearch } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { buildWhatsAppHref } from '@/__lib__/whatsapp';
import { formatMXN } from '@/__lib__/utils';
import {
  Button,
  BUTTON_ICON_PROPS,
  BUTTON_LARGE_ICON_PROPS,
} from '@/components/ui/Button';
import { MercadoPagoMark } from '@/components/ui/MercadoPagoMark';
import type { CheckoutResult } from '@/__types__';

/** Margen para que se alcance a leer el código antes de salir a Mercado Pago. */
const REDIRECT_DELAY_MS = 1500;

interface CheckoutSuccessProps {
  readonly order: CheckoutResult;
}

/**
 * Pantalla de cierre: muestra el código del pedido, el detalle enviado al
 * servidor y los accesos para rastrearlo o confirmarlo por WhatsApp.
 *
 * Con pago en línea el pedido nace sin cobrar, así que la pantalla lleva
 * directo al enlace de Mercado Pago; el código queda a la vista por si la
 * redirección no ocurre y hay que retomar el pago a mano.
 */
export function CheckoutSuccess({ order }: CheckoutSuccessProps) {
  const t = useTranslations('checkout');
  const trackingHref = `/rastreo?code=${encodeURIComponent(order.code)}`;
  const whatsappHref = buildWhatsAppHref(
    t('success.whatsappMessage', { code: order.code }),
  );

  const paymentUrl = order.paymentUrl;

  useEffect(() => {
    if (!paymentUrl) return;

    const timer = window.setTimeout(() => {
      window.location.assign(paymentUrl);
    }, REDIRECT_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [paymentUrl]);

  const heading = paymentUrl ? t('success.onlineTitle') : t('success.title');
  const description = paymentUrl ? t('success.onlineDescription') : t('success.description');

  return (
    <article className="flex flex-col gap-6 rounded-[1.5rem] border border-border-subtle bg-surface p-6 sm:p-8">
      <header className="flex flex-col items-start gap-3">
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-green/15 border border-accent-green/40 text-accent-green"
        >
          {paymentUrl ? (
            <CreditCard {...BUTTON_LARGE_ICON_PROPS} />
          ) : (
            <CheckCircle2 {...BUTTON_LARGE_ICON_PROPS} />
          )}
        </span>
        <h2 className="font-display text-2xl text-white">{heading}</h2>
        <p className="max-w-prose text-sm leading-relaxed text-text-muted">{description}</p>
      </header>

      <div className="rounded-2xl border border-border-subtle bg-canvas px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-faint">
          {t('success.codeLabel')}
        </p>
        <p className="mt-1 font-display text-3xl tracking-[0.06em] text-white">
          {order.code}
        </p>
      </div>

      <ul className="divide-y divide-border-subtle border-y border-border-subtle">
        {order.items.map((item, index) => (
          <li
            key={`${item.sku}-${index}`}
            className="flex items-start justify-between gap-3 py-3"
          >
            <div className="min-w-0">
              <p className="text-sm text-white line-clamp-2">{item.productName}</p>
              <p className="text-xs text-text-faint">
                {item.sku} · {formatMXN(item.unitPriceMXN)} c/u
              </p>
            </div>
            <span className="shrink-0 text-sm font-semibold text-white">
              {item.quantity} × {formatMXN(item.lineTotalMXN)}
            </span>
          </li>
        ))}
      </ul>

      {paymentUrl ? (
        <Button as="link" href={paymentUrl} variant="mercadoPago" size="lg" fullWidth>
          <span className="inline-flex items-center gap-2">
            {t('success.payCta')}
            <MercadoPagoMark />
          </span>
        </Button>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          as="link"
          href={whatsappHref}
          target="_blank"
          rel="noreferrer noopener"
          variant={paymentUrl ? 'ghost' : 'primary'}
          size="lg"
          leftIcon={<MessageSquare {...BUTTON_LARGE_ICON_PROPS} aria-hidden="true" />}
          className="sm:flex-1"
        >
          {t('success.whatsappCta')}
        </Button>

        <Button
          as="link"
          href={trackingHref}
          variant="secondary"
          size="lg"
          leftIcon={<PackageSearch {...BUTTON_ICON_PROPS} aria-hidden="true" />}
          className="sm:flex-1"
        >
          {t('success.trackingCta')}
        </Button>
      </div>

      {paymentUrl ? (
        <p className="text-xs leading-relaxed text-text-faint">{t('success.payHint')}</p>
      ) : null}
    </article>
  );
}
