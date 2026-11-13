'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useOrderTracking } from '@/__hooks__/useOrderTracking';
import { ORDER_CARRIER_LABEL_KEYS } from '@/__data__/orderStatus';
import { cn } from '@/__lib__/utils';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { OrderStatusBadge } from './OrderStatusBadge';
import { OrderStatusTimeline } from './OrderStatusTimeline';
import { OrderTrackerForm } from './OrderTrackerForm';
import type { TrackedOrder } from '@/__types__';

const SKELETON_ROWS = ['a', 'b', 'c'] as const;

/**
 * Formulario y resultado del rastreo. Lee el código desde la URL, así el
 * enlace es compartible; la cabecera de la página sí se renderiza en servidor.
 */
export function OrderTracker() {
  const t = useTranslations('tracking');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlCode = (searchParams.get('code') ?? '').trim();
  const { order, isLoading, error } = useOrderTracking(urlCode);

  const handleSubmit = useCallback(
    (rawCode: string): void => {
      const code = rawCode.trim().toUpperCase();
      if (code.length === 0) return;
      router.replace(`${pathname}?code=${encodeURIComponent(code)}`, { scroll: false });
    },
    [pathname, router],
  );

  const handleReset = useCallback((): void => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  const hasQuery = urlCode.length > 0;

  return (
    <>
      <div className="rounded-[1.5rem] border border-border-subtle bg-surface p-6 sm:p-8">
        <OrderTrackerForm
          key={urlCode}
          initialCode={urlCode}
          onSubmit={handleSubmit}
          isSubmitting={isLoading}
          error={error}
        />
      </div>

      <section
        aria-label={t('result.regionLabel')}
        aria-busy={isLoading}
        className="mt-8"
      >
        {!hasQuery ? (
          <EmptyState title={t('empty.title')} description={t('empty.description')} />
        ) : isLoading ? (
          <OrderResultSkeleton />
        ) : error ? (
          <EmptyState
            title={t('result.errorTitle')}
            description={error}
            action={
              <Button variant="secondary" onClick={handleReset}>
                {t('form.reset')}
              </Button>
            }
          />
        ) : order ? (
          <OrderResultCard order={order} onReset={handleReset} />
        ) : null}
      </section>
    </>
  );
}

interface OrderResultCardProps {
  readonly order: TrackedOrder;
  readonly onReset: () => void;
}

function OrderResultCard({ order, onReset }: OrderResultCardProps) {
  const t = useTranslations('tracking');
  const carrierLabel = resolveCarrierLabel(order.carrier, t);

  return (
    <article className="rounded-[1.5rem] border border-border-subtle bg-surface p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-faint">
            {t('result.codeLabel')}
          </p>
          <p className="font-display text-2xl tracking-[0.06em] text-white">{order.code}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DetailField label={t('result.customerLabel')} value={order.customerName} />
        <DetailField label={t('result.carrierLabel')} value={carrierLabel} />
        <DetailField label={t('result.trackingNumberLabel')} value={order.trackingNumber} />
      </dl>

      <div className="mt-8 border-t border-border-subtle pt-8">
        <h2 className="mb-5 font-display text-xl text-white">{t('result.timelineTitle')}</h2>
        <OrderStatusTimeline timeline={order.timeline} />
      </div>

      <div className="mt-8">
        <Button variant="secondary" onClick={onReset}>
          {t('form.reset')}
        </Button>
      </div>
    </article>
  );
}

interface DetailFieldProps {
  readonly label: string;
  readonly value: string | null;
}

function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-faint">
        {label}
      </dt>
      <dd className={cn('mt-1 text-sm', value ? 'text-white' : 'text-text-faint')}>
        {value ?? '—'}
      </dd>
    </div>
  );
}

function OrderResultSkeleton() {
  return (
    <div className="rounded-[1.5rem] border border-border-subtle bg-surface p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-9 w-32" rounded="rounded-full" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="mt-8 flex flex-col gap-4 border-t border-border-subtle pt-8">
        {SKELETON_ROWS.map((row) => (
          <div key={row} className="flex gap-4">
            <Skeleton className="h-10 w-10" rounded="rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Traduce el slug de paquetería; si no está en el catálogo, muestra el valor crudo. */
function resolveCarrierLabel(
  carrier: string | null,
  translate: (key: string) => string,
): string | null {
  if (!carrier) return null;
  const key = ORDER_CARRIER_LABEL_KEYS[carrier];
  return key ? translate(key) : carrier;
}
