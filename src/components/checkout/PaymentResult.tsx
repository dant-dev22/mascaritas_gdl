'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CheckCircle2, Clock, MessageSquare, PackageSearch, RefreshCw, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { buildWhatsAppHref } from '@/__lib__/whatsapp';
import { cn } from '@/__lib__/utils';
import { useOrderTracking } from '@/__hooks__/useOrderTracking';
import {
  Button,
  BUTTON_ICON_PROPS,
  BUTTON_LARGE_ICON_PROPS,
} from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import type { TrackedOrder } from '@/__types__';

/** Lectura del cobro que se le muestra al cliente. */
type ResultTone = 'paid' | 'pending' | 'failed' | 'expired' | 'refunded';

interface ToneStyle {
  readonly icon: LucideIcon;
  readonly badgeClass: string;
  readonly iconClass: string;
}

const TONE_STYLES: Record<ResultTone, ToneStyle> = {
  paid: {
    icon: CheckCircle2,
    badgeClass: 'bg-accent-green/15 border-accent-green/40',
    iconClass: 'text-accent-green',
  },
  pending: {
    icon: Clock,
    badgeClass: 'bg-surface-hover border-border-emphasis',
    iconClass: 'text-text-muted',
  },
  failed: {
    icon: XCircle,
    badgeClass: 'bg-accent-red/10 border-accent-red/40',
    iconClass: 'text-accent-red',
  },
  expired: {
    icon: Clock,
    badgeClass: 'bg-surface-hover border-border-emphasis',
    iconClass: 'text-text-muted',
  },
  refunded: {
    icon: RefreshCw,
    badgeClass: 'bg-surface-hover border-border-emphasis',
    iconClass: 'text-text-muted',
  },
};

const TONE_TITLE_KEYS = {
  paid: 'paid.title',
  pending: 'pending.title',
  failed: 'failed.title',
  expired: 'expired.title',
  refunded: 'refunded.title',
} as const;

const TONE_DESCRIPTION_KEYS = {
  paid: 'paid.description',
  pending: 'pending.description',
  failed: 'failed.description',
  expired: 'expired.description',
  refunded: 'refunded.description',
} as const;

/**
 * Resultado del pago. Mercado Pago devuelve al cliente aquí con el código del
 * pedido en la URL; el estado real se consulta al backend, porque el aviso del
 * cobro puede llegar unos segundos después de la redirección.
 */
export function PaymentResult() {
  const t = useTranslations('paymentResult');
  const searchParams = useSearchParams();
  const code = (searchParams.get('code') ?? '').trim();
  const { order, isLoading, error, reload } = useOrderTracking(code);

  if (code.length === 0) {
    return <EmptyState title={t('missing.title')} description={t('missing.description')} />;
  }

  if (isLoading && order === null) {
    return <ResultSkeleton />;
  }

  if (error !== null) {
    return (
      <EmptyState
        title={t('errorTitle')}
        description={error}
        action={
          <Button variant="secondary" onClick={reload}>
            {t('refresh')}
          </Button>
        }
      />
    );
  }

  if (order === null) return null;

  return <ResultCard order={order} onRefresh={reload} />;
}

interface ResultCardProps {
  readonly order: TrackedOrder;
  readonly onRefresh: () => void;
}

function ResultCard({ order, onRefresh }: ResultCardProps) {
  const t = useTranslations('paymentResult');
  const tone = resolveTone(order);
  const style = TONE_STYLES[tone];
  const Icon = style.icon;

  // El contra entrega se paga en efectivo al recibir: no hay cobro que esperar.
  const isCashOnDelivery = order.paymentMethod === 'contra_entrega';
  const description =
    tone === 'pending' && isCashOnDelivery
      ? t('pending.contraEntrega')
      : t(TONE_DESCRIPTION_KEYS[tone]);

  const whatsappHref = buildWhatsAppHref(t('whatsappMessage', { code: order.code }));
  const trackingHref = `/rastreo?code=${encodeURIComponent(order.code)}`;

  return (
    <article className="flex flex-col gap-6 rounded-[1.5rem] border border-border-subtle bg-surface p-6 sm:p-8">
      <header className="flex flex-col items-start gap-3">
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex items-center justify-center w-14 h-14 rounded-2xl border',
            style.badgeClass,
            style.iconClass,
          )}
        >
          <Icon {...BUTTON_LARGE_ICON_PROPS} />
        </span>
        <h2 className="font-display text-2xl text-white">{t(TONE_TITLE_KEYS[tone])}</h2>
        <p className="max-w-prose text-sm leading-relaxed text-text-muted">{description}</p>
      </header>

      <div className="rounded-2xl border border-border-subtle bg-canvas px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-faint">
          {t('codeLabel')}
        </p>
        <p className="mt-1 font-display text-3xl tracking-[0.06em] text-white">{order.code}</p>
      </div>

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
          {t('whatsappCta')}
        </Button>

        <Button
          as="link"
          href={trackingHref}
          variant="secondary"
          size="lg"
          leftIcon={<PackageSearch {...BUTTON_ICON_PROPS} aria-hidden="true" />}
          className="sm:flex-1"
        >
          {t('trackingCta')}
        </Button>
      </div>

      {tone === 'pending' && !isCashOnDelivery ? (
        <Button variant="ghost" size="md" fullWidth onClick={onRefresh} leftIcon={<RefreshCw {...BUTTON_ICON_PROPS} aria-hidden="true" />}>
          {t('refresh')}
        </Button>
      ) : null}
    </article>
  );
}

/** Traduce el estado del cobro a la lectura que ve el cliente. */
function resolveTone(order: TrackedOrder): ResultTone {
  switch (order.paymentStatus) {
    case 'pagado':
      return 'paid';
    case 'fallido':
      return 'failed';
    case 'expirado':
      return 'expired';
    case 'reembolsado':
      return 'refunded';
    default:
      return 'pending';
  }
}

function ResultSkeleton() {
  return (
    <div className="rounded-[1.5rem] border border-border-subtle bg-surface p-6 sm:p-8">
      <Skeleton className="h-14 w-14" rounded="rounded-2xl" />
      <Skeleton className="mt-4 h-7 w-56" />
      <Skeleton className="mt-3 h-4 w-full max-w-md" />
      <Skeleton className="mt-6 h-20 w-full" rounded="rounded-2xl" />
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-[60px] flex-1" rounded="rounded-2xl" />
        <Skeleton className="h-[60px] flex-1" rounded="rounded-2xl" />
      </div>
    </div>
  );
}
