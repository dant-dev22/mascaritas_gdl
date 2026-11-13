'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Check, CircleX, Hammer, Package, Route, Truck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ORDER_STATUS_META } from '@/__data__/orderStatus';
import { formatDateTime } from '@/__lib__/datetime';
import { cn } from '@/__lib__/utils';
import type { OrderStatusIcon, OrderTimelineEvent } from '@/__types__';
import type { Locale } from '@/i18n/routing';

const ICON_MAP: Record<OrderStatusIcon, LucideIcon> = {
  package: Package,
  hammer: Hammer,
  truck: Truck,
  route: Route,
  check: Check,
  x: CircleX,
};

interface OrderStatusTimelineProps {
  /** Hitos en orden cronológico ascendente, tal como los devuelve el backend. */
  readonly timeline: ReadonlyArray<OrderTimelineEvent>;
  readonly className?: string;
}

export function OrderStatusTimeline({ timeline, className }: OrderStatusTimelineProps) {
  const t = useTranslations('tracking');
  const locale = useLocale() as Locale;

  return (
    <ol role="list" className={cn('relative flex flex-col', className)}>
      {timeline.map((event, index) => {
        const meta = ORDER_STATUS_META[event.status];
        const Icon = ICON_MAP[meta.icon];
        const isLast = index === timeline.length - 1;
        const isCancelled = event.status === 'cancelado';

        return (
          <li
            key={`${event.status}-${event.createdAt}-${index}`}
            className="relative flex gap-4 pb-8 last:pb-0"
          >
            {!isLast ? (
              <span
                aria-hidden="true"
                className="absolute left-5 top-11 bottom-0 w-px bg-border-subtle"
              />
            ) : null}

            <span
              className={cn(
                'relative z-10 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1',
                isCancelled
                  ? 'bg-accent-red text-white ring-accent-red/40'
                  : isLast
                    ? 'bg-accent-green text-white ring-accent-green/40'
                    : 'bg-surface text-text-muted ring-border-emphasis',
              )}
            >
              <Icon width={18} height={18} strokeWidth={2.2} aria-hidden="true" />
            </span>

            <div className="min-w-0 flex-1 pt-1">
              <p className="text-sm font-semibold text-white">{t(meta.nameKey)}</p>
              <p className="mt-0.5 text-sm text-text-muted">{t(meta.descriptionKey)}</p>
              {event.note ? (
                <p className="mt-2 rounded-xl bg-canvas px-3 py-2 text-sm text-text-muted">
                  {event.note}
                </p>
              ) : null}
              <time
                dateTime={event.createdAt}
                className="mt-2 block text-xs text-text-faint"
              >
                {formatDateTime(event.createdAt, locale)}
              </time>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
