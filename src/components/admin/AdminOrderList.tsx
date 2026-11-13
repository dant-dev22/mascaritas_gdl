'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { Button, BUTTON_ICON_PROPS } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';
import { OrderStatusBadge } from '@/components/order/OrderStatusBadge';
import { useRouter } from '@/i18n/navigation';
import { useAdminOrders } from '@/__hooks__/useAdminOrders';
import { useToastContext } from '@/__hooks__/useToastContext';
import { ORDER_CARRIER_LABEL_KEYS } from '@/__data__/orderStatus';
import { formatDateTime } from '@/__lib__/datetime';
import { ConfirmDialog } from './ConfirmDialog';
import type { AdminOrder } from '@/__types__';
import type { Locale } from '@/i18n/routing';

const TH_CLASS =
  'px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-text-faint';

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 6 }, (_, index) => (
        <Skeleton key={index} className="h-16 w-full" />
      ))}
    </div>
  );
}

function ErrorState({
  message,
  retryLabel,
  onRetry,
}: {
  readonly message: string;
  readonly retryLabel: string;
  readonly onRetry: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 rounded-[1.5rem] border border-border-subtle bg-surface px-6 py-12 text-center"
    >
      <p className="text-sm text-text-muted">{message}</p>
      <Button variant="secondary" onClick={onRetry}>
        {retryLabel}
      </Button>
    </div>
  );
}

/** Lista administrativa de pedidos: búsqueda, paginación (12 por vista) y acciones. */
export function AdminOrderList() {
  const t = useTranslations('Admin');
  const tTracking = useTranslations('tracking');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { pushToast } = useToastContext();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<AdminOrder | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { result, isLoading, isFetching, error, isUnauthorized, refresh } = useAdminOrders(
    search,
    page,
  );

  useEffect(() => {
    if (isUnauthorized) router.replace('/admin/login');
  }, [isUnauthorized, router]);

  const carrierLabel = (carrier: string | null): string => {
    if (carrier === null) return t('orders.noCarrier');
    return carrier in ORDER_CARRIER_LABEL_KEYS
      ? tTracking(ORDER_CARRIER_LABEL_KEYS[carrier])
      : carrier;
  };

  const handleDelete = async (): Promise<void> => {
    if (pendingDelete === null) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/pedidos/${encodeURIComponent(pendingDelete.id)}`,
        { method: 'DELETE' },
      );

      if (response.status === 204) {
        pushToast('success', t('orderDelete.success'));
        setPendingDelete(null);
        refresh();
      } else if (response.status === 401) {
        pushToast('error', t('orderDelete.unauthorized'));
        router.replace('/admin/login');
      } else {
        pushToast('error', t('orderDelete.error'));
      }
    } catch {
      pushToast('error', t('orderDelete.error'));
    } finally {
      setIsDeleting(false);
    }
  };

  const items = result?.items ?? [];
  const meta = result?.meta ?? null;
  const term = search.trim();
  const hasSearch = term.length > 0;

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl leading-none text-white">{t('orders.title')}</h1>
          <p className="mt-2 text-sm text-text-muted">{t('orders.subtitle')}</p>
        </div>

        <Button
          as="link"
          href="/admin/pedidos/nuevo"
          leftIcon={<Plus {...BUTTON_ICON_PROPS} aria-hidden="true" />}
        >
          {t('orders.create')}
        </Button>
      </header>

      <div className="mt-6">
        <Input
          type="search"
          name="admin-order-search"
          aria-label={t('orders.searchAria')}
          placeholder={t('orders.searchPlaceholder')}
          leftIcon={<Search {...BUTTON_ICON_PROPS} aria-hidden="true" />}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
      </div>

      <div
        role="region"
        aria-label={t('orders.regionLabel')}
        aria-busy={isFetching}
        aria-live="polite"
        className="mt-5"
      >
        {isLoading ? (
          <ListSkeleton />
        ) : error !== null ? (
          <ErrorState message={error} retryLabel={t('orders.retry')} onRetry={refresh} />
        ) : items.length === 0 ? (
          hasSearch ? (
            <EmptyState
              title={t('orders.noResultsTitle')}
              description={t('orders.noResultsDescription', { term })}
              action={
                <Button variant="secondary" onClick={() => setSearch('')}>
                  {t('orders.clearSearch')}
                </Button>
              }
            />
          ) : (
            <EmptyState
              title={t('orders.emptyTitle')}
              description={t('orders.emptyDescription')}
              action={
                <Button
                  as="link"
                  href="/admin/pedidos/nuevo"
                  leftIcon={<Plus {...BUTTON_ICON_PROPS} aria-hidden="true" />}
                >
                  {t('orders.create')}
                </Button>
              }
            />
          )
        ) : (
          <>
            {meta !== null ? (
              <p className="mb-4 text-sm text-text-muted">
                {t.rich('orders.showingRange', {
                  start: meta.rangeStart,
                  end: meta.rangeEnd,
                  total: meta.totalItems,
                  b: (chunks) => <span className="font-semibold text-white">{chunks}</span>,
                })}
              </p>
            ) : null}

            {/* Tabla en escritorio */}
            <div className="hidden overflow-hidden rounded-[1.5rem] border border-border-subtle bg-surface sm:block">
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">{t('orders.regionLabel')}</caption>
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th scope="col" className={TH_CLASS}>
                      {t('orders.columnCode')}
                    </th>
                    <th scope="col" className={TH_CLASS}>
                      {t('orders.columnCustomer')}
                    </th>
                    <th scope="col" className={TH_CLASS}>
                      {t('orders.columnStatus')}
                    </th>
                    <th scope="col" className={TH_CLASS}>
                      {t('orders.columnShipping')}
                    </th>
                    <th scope="col" className={`${TH_CLASS} text-right`}>
                      {t('orders.columnActions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((order) => (
                    <tr key={order.id} className="border-b border-border-subtle/60 last:border-0">
                      <td className="px-5 py-3">
                        <p className="font-semibold tabular-nums text-white">{order.code}</p>
                        <p className="text-xs text-text-faint">
                          {formatDateTime(order.createdAt, locale)}
                        </p>
                      </td>

                      <td className="px-5 py-3">
                        <p className="truncate font-medium text-white">{order.customerName}</p>
                        {order.customerContact !== null ? (
                          <p className="truncate text-xs text-text-faint">
                            {order.customerContact}
                          </p>
                        ) : null}
                      </td>

                      <td className="px-5 py-3">
                        <OrderStatusBadge status={order.status} />
                      </td>

                      <td className="px-5 py-3">
                        <p className="text-sm text-text-muted">{carrierLabel(order.carrier)}</p>
                        {order.trackingNumber !== null ? (
                          <p className="truncate text-xs tabular-nums text-text-faint">
                            {order.trackingNumber}
                          </p>
                        ) : null}
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            as="link"
                            href={`/admin/pedidos/${order.id}/editar`}
                            variant="secondary"
                            size="sm"
                            aria-label={t('orders.editAria', { code: order.code })}
                            leftIcon={<Pencil {...BUTTON_ICON_PROPS} aria-hidden="true" />}
                          >
                            {t('orders.edit')}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPendingDelete(order)}
                            aria-label={t('orders.deleteAria', { code: order.code })}
                            leftIcon={<Trash2 {...BUTTON_ICON_PROPS} aria-hidden="true" />}
                          >
                            {t('orders.delete')}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tarjetas en móvil */}
            <ul className="flex flex-col gap-3 sm:hidden">
              {items.map((order) => (
                <li
                  key={order.id}
                  className="rounded-[1.25rem] border border-border-subtle bg-surface p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold tabular-nums text-white">{order.code}</p>
                      <p className="text-xs text-text-faint">
                        {formatDateTime(order.createdAt, locale)}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="mt-3">
                    <p className="truncate font-medium text-white">{order.customerName}</p>
                    {order.customerContact !== null ? (
                      <p className="truncate text-xs text-text-faint">{order.customerContact}</p>
                    ) : null}
                    <p className="mt-1 text-sm text-text-muted">
                      {carrierLabel(order.carrier)}
                      {order.trackingNumber !== null ? ` · ${order.trackingNumber}` : ''}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      as="link"
                      href={`/admin/pedidos/${order.id}/editar`}
                      variant="secondary"
                      size="sm"
                      fullWidth
                      leftIcon={<Pencil {...BUTTON_ICON_PROPS} aria-hidden="true" />}
                    >
                      {t('orders.edit')}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      onClick={() => setPendingDelete(order)}
                      leftIcon={<Trash2 {...BUTTON_ICON_PROPS} aria-hidden="true" />}
                    >
                      {t('orders.delete')}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            {meta !== null ? (
              <div className="mt-6">
                <Pagination meta={meta} onPageChange={setPage} />
              </div>
            ) : null}
          </>
        )}
      </div>

      {pendingDelete !== null ? (
        <ConfirmDialog
          title={t('orderDelete.title')}
          description={t('orderDelete.description', { code: pendingDelete.code })}
          confirmLabel={t('orderDelete.confirm')}
          busyLabel={t('orderDelete.deleting')}
          cancelLabel={t('orderDelete.cancel')}
          isBusy={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => {
            if (!isDeleting) setPendingDelete(null);
          }}
        />
      ) : null}
    </div>
  );
}
