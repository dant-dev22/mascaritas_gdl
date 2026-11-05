'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { Button, BUTTON_ICON_PROPS } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { Skeleton } from '@/components/ui/Skeleton';
import { useRouter } from '@/i18n/navigation';
import { useAdminProducts } from '@/__hooks__/useAdminProducts';
import { useToastContext } from '@/__hooks__/useToastContext';
import { MASK_PALETTES } from '@/__data__/masks';
import { formatMXN } from '@/__lib__/utils';
import { ConfirmDialog } from './ConfirmDialog';
import type { Product } from '@/__types__';

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

function ColorSwatch({ color }: { readonly color: Product['accentColor'] }) {
  return (
    <span
      aria-hidden="true"
      className="h-9 w-9 shrink-0 rounded-xl border border-border-subtle"
      style={{ backgroundColor: MASK_PALETTES[color].swatch }}
    />
  );
}

/** Lista administrativa del catálogo: búsqueda, paginación (12 por vista) y acciones. */
export function AdminProductList() {
  const t = useTranslations('Admin');
  const router = useRouter();
  const { pushToast } = useToastContext();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { result, isLoading, isFetching, error, isUnauthorized, refresh } = useAdminProducts(
    search,
    page,
  );

  useEffect(() => {
    if (isUnauthorized) router.replace('/admin/login');
  }, [isUnauthorized, router]);

  const handleDelete = async (): Promise<void> => {
    if (pendingDelete === null) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/productos/${encodeURIComponent(pendingDelete.id)}`,
        { method: 'DELETE' },
      );

      if (response.status === 204) {
        pushToast('success', t('delete.success'));
        setPendingDelete(null);
        refresh();
      } else if (response.status === 401) {
        pushToast('error', t('delete.unauthorized'));
        router.replace('/admin/login');
      } else {
        pushToast('error', t('delete.error'));
      }
    } catch {
      pushToast('error', t('delete.error'));
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
          <h1 className="font-display text-3xl leading-none text-white">{t('list.title')}</h1>
          <p className="mt-2 text-sm text-text-muted">{t('list.subtitle')}</p>
        </div>

        <Button
          as="link"
          href="/admin/nuevo"
          leftIcon={<Plus {...BUTTON_ICON_PROPS} aria-hidden="true" />}
        >
          {t('list.create')}
        </Button>
      </header>

      <div className="mt-6">
        <Input
          type="search"
          name="admin-search"
          aria-label={t('list.searchAria')}
          placeholder={t('list.searchPlaceholder')}
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
        aria-label={t('list.regionLabel')}
        aria-busy={isFetching}
        aria-live="polite"
        className="mt-5"
      >
        {isLoading ? (
          <ListSkeleton />
        ) : error !== null ? (
          <ErrorState message={error} retryLabel={t('list.retry')} onRetry={refresh} />
        ) : items.length === 0 ? (
          hasSearch ? (
            <EmptyState
              title={t('list.noResultsTitle')}
              description={t('list.noResultsDescription', { term })}
              action={
                <Button variant="secondary" onClick={() => setSearch('')}>
                  {t('list.clearSearch')}
                </Button>
              }
            />
          ) : (
            <EmptyState
              title={t('list.emptyTitle')}
              description={t('list.emptyDescription')}
              action={
                <Button
                  as="link"
                  href="/admin/nuevo"
                  leftIcon={<Plus {...BUTTON_ICON_PROPS} aria-hidden="true" />}
                >
                  {t('list.create')}
                </Button>
              }
            />
          )
        ) : (
          <>
            {meta !== null ? (
              <p className="mb-4 text-sm text-text-muted">
                {t.rich('list.showingRange', {
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
                <caption className="sr-only">{t('list.regionLabel')}</caption>
                <thead>
                  <tr className="border-b border-border-subtle">
                    <th scope="col" className={TH_CLASS}>
                      {t('list.columnProduct')}
                    </th>
                    <th scope="col" className={TH_CLASS}>
                      {t('list.columnPrice')}
                    </th>
                    <th scope="col" className={TH_CLASS}>
                      {t('list.columnStock')}
                    </th>
                    <th scope="col" className={TH_CLASS}>
                      {t('list.columnStatus')}
                    </th>
                    <th scope="col" className={`${TH_CLASS} text-right`}>
                      {t('list.columnActions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-border-subtle/60 last:border-0"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <ColorSwatch color={product.accentColor} />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-white">{product.title}</p>
                            <p className="truncate text-xs text-text-faint">
                              {product.sku} · {product.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3 tabular-nums text-white">
                        {formatMXN(product.priceMXN)}
                      </td>

                      <td className="px-5 py-3 tabular-nums text-text-muted">
                        {t('list.stockUnits', { count: product.stockCount })}
                      </td>

                      <td className="px-5 py-3">
                        {product.inStock ? (
                          <Badge variant="success" label={t('list.inStock')} showDot />
                        ) : (
                          <span className="text-xs font-semibold uppercase tracking-wide text-text-faint">
                            {t('list.outOfStock')}
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            as="link"
                            href={`/admin/${product.id}/editar`}
                            variant="secondary"
                            size="sm"
                            aria-label={t('list.editAria', { title: product.title })}
                            leftIcon={<Pencil {...BUTTON_ICON_PROPS} aria-hidden="true" />}
                          >
                            {t('list.edit')}
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPendingDelete(product)}
                            aria-label={t('list.deleteAria', { title: product.title })}
                            leftIcon={<Trash2 {...BUTTON_ICON_PROPS} aria-hidden="true" />}
                          >
                            {t('list.delete')}
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
              {items.map((product) => (
                <li
                  key={product.id}
                  className="rounded-[1.25rem] border border-border-subtle bg-surface p-4"
                >
                  <div className="flex items-start gap-3">
                    <ColorSwatch color={product.accentColor} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-white">{product.title}</p>
                      <p className="truncate text-xs text-text-faint">
                        {product.sku} · {product.slug}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="text-sm font-semibold tabular-nums text-white">
                          {formatMXN(product.priceMXN)}
                        </span>
                        <span className="text-sm tabular-nums text-text-muted">
                          {t('list.stockUnits', { count: product.stockCount })}
                        </span>
                        {product.inStock ? (
                          <Badge variant="success" label={t('list.inStock')} showDot />
                        ) : (
                          <span className="text-xs font-semibold uppercase tracking-wide text-text-faint">
                            {t('list.outOfStock')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      as="link"
                      href={`/admin/${product.id}/editar`}
                      variant="secondary"
                      size="sm"
                      fullWidth
                      leftIcon={<Pencil {...BUTTON_ICON_PROPS} aria-hidden="true" />}
                    >
                      {t('list.edit')}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      onClick={() => setPendingDelete(product)}
                      leftIcon={<Trash2 {...BUTTON_ICON_PROPS} aria-hidden="true" />}
                    >
                      {t('list.delete')}
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
          title={t('delete.title')}
          description={t('delete.description', { title: pendingDelete.title })}
          confirmLabel={t('delete.confirm')}
          busyLabel={t('delete.deleting')}
          cancelLabel={t('delete.cancel')}
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
