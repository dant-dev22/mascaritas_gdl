'use client';

import { CheckCircle2, MessageSquare, PackageSearch } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { buildWhatsAppHref } from '@/__lib__/whatsapp';
import { formatMXN } from '@/__lib__/utils';
import {
  Button,
  BUTTON_ICON_PROPS,
  BUTTON_LARGE_ICON_PROPS,
} from '@/components/ui/Button';
import type { CheckoutResult } from '@/__types__';

interface CheckoutSuccessProps {
  readonly order: CheckoutResult;
}

/**
 * Pantalla de cierre: muestra el código del pedido, el detalle enviado al
 * servidor y los accesos para rastrearlo o confirmarlo por WhatsApp.
 */
export function CheckoutSuccess({ order }: CheckoutSuccessProps) {
  const t = useTranslations('checkout');
  const trackingHref = `/rastreo?code=${encodeURIComponent(order.code)}`;
  const whatsappHref = buildWhatsAppHref(
    t('success.whatsappMessage', { code: order.code }),
  );

  return (
    <article className="flex flex-col gap-6 rounded-[1.5rem] border border-border-subtle bg-surface p-6 sm:p-8">
      <header className="flex flex-col items-start gap-3">
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-green/15 border border-accent-green/40 text-accent-green"
        >
          <CheckCircle2 {...BUTTON_LARGE_ICON_PROPS} />
        </span>
        <h2 className="font-display text-2xl text-white">{t('success.title')}</h2>
        <p className="max-w-prose text-sm leading-relaxed text-text-muted">
          {t('success.description')}
        </p>
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

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          as="link"
          href={whatsappHref}
          target="_blank"
          rel="noreferrer noopener"
          variant="primary"
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
    </article>
  );
}
