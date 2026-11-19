'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/__lib__/utils';
import { MercadoPagoMark } from '@/components/ui/MercadoPagoMark';
import { Spinner } from '@/components/ui/Spinner';

/** Pausa entre el primer aviso y el recordatorio de no cerrar la ventana. */
const WAIT_HINT_DELAY_MS = 1100;
/** Margen para leer los avisos antes de saltar a Mercado Pago. */
const REDIRECT_DELAY_MS = 2400;

interface CheckoutRedirectProps {
  /** `null` mientras el servidor todavía está creando el pedido. */
  readonly paymentUrl: string | null;
  readonly className?: string;
}

/**
 * Pantalla puente hacia Mercado Pago. Crear el pedido no termina la compra, así
 * que aquí solo se avisa que se está enviando al cliente a la plataforma y se
 * salta sola; el cierre real ocurre al volver del pago (`/checkout/resultado`).
 */
export function CheckoutRedirect({ paymentUrl, className }: CheckoutRedirectProps) {
  const t = useTranslations('checkout');
  const [showWaitHint, setShowWaitHint] = useState(false);

  useEffect(() => {
    if (!paymentUrl) return;

    const hintTimer = window.setTimeout(() => setShowWaitHint(true), WAIT_HINT_DELAY_MS);
    const redirectTimer = window.setTimeout(
      () => window.location.assign(paymentUrl),
      REDIRECT_DELAY_MS,
    );

    return () => {
      window.clearTimeout(hintTimer);
      window.clearTimeout(redirectTimer);
    };
  }, [paymentUrl]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'mx-auto flex w-full max-w-2xl flex-col items-center gap-6',
        'rounded-[1.5rem] border border-border-subtle bg-surface p-8 text-center',
        className,
      )}
    >
      <Spinner size={40} className="text-accent-green" />

      <div className="flex flex-col gap-2">
        <p className="font-display text-xl text-white">
          {paymentUrl ? t('redirect.sending') : t('redirect.creating')}
        </p>
        {showWaitHint ? <p className="text-sm text-text-muted">{t('redirect.wait')}</p> : null}
      </div>

      <span className="inline-flex items-center gap-2 text-xs text-text-faint">
        {t('payWith')}
        <MercadoPagoMark />
      </span>
    </div>
  );
}
