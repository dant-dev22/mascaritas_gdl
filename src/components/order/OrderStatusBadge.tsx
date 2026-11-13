'use client';

import { useTranslations } from 'next-intl';
import { Check, CircleX, Hammer, Package, Route, Truck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ORDER_STATUS_META } from '@/__data__/orderStatus';
import { cn } from '@/__lib__/utils';
import type { OrderStatus, OrderStatusIcon } from '@/__types__';

const ICON_MAP: Record<OrderStatusIcon, LucideIcon> = {
  package: Package,
  hammer: Hammer,
  truck: Truck,
  route: Route,
  check: Check,
  x: CircleX,
};

/** Verde para el cierre exitoso, rojo para la cancelación y neutro para el resto. */
const TONE_MAP: Record<OrderStatus, string> = {
  recibido: 'bg-surface-hover text-white ring-border-emphasis',
  en_preparacion: 'bg-surface-hover text-white ring-border-emphasis',
  enviado: 'bg-surface-hover text-white ring-border-emphasis',
  en_transito: 'bg-surface-hover text-white ring-border-emphasis',
  entregado: 'bg-accent-green text-white ring-accent-green/40',
  cancelado: 'bg-accent-red text-white ring-accent-red/40',
};

interface OrderStatusBadgeProps {
  readonly status: OrderStatus;
  readonly className?: string;
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const t = useTranslations('tracking');
  const meta = ORDER_STATUS_META[status];
  const Icon = ICON_MAP[meta.icon];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-4 py-2 ring-1',
        'text-[11px] font-bold uppercase tracking-[0.14em]',
        TONE_MAP[status],
        className,
      )}
    >
      <Icon width={16} height={16} strokeWidth={2.2} aria-hidden="true" />
      {t(meta.nameKey)}
    </span>
  );
}
