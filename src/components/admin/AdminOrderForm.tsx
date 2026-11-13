'use client';

import { useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import { Button, BUTTON_ICON_PROPS } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Select, type SelectOption } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { Textarea } from '@/components/ui/Textarea';
import { OrderStatusTimeline } from '@/components/order/OrderStatusTimeline';
import { Link, useRouter } from '@/i18n/navigation';
import {
  ORDER_CARRIER_IDS,
  ORDER_CARRIER_LABEL_KEYS,
  ORDER_STATUSES,
  ORDER_STATUS_META,
} from '@/__data__/orderStatus';
import { useToastContext } from '@/__hooks__/useToastContext';
import {
  createEmptyOrderValues,
  toOrderFormValues,
  toOrderInput,
  validateOrderForm,
} from '@/__lib__/adminOrderForm';
import type {
  AdminOrder,
  AdminOrderFormErrors,
  AdminOrderFormValues,
} from '@/__types__';

interface AdminOrderFormProps {
  readonly orderId?: string;
}

type LoadStatus = 'loading' | 'ready' | 'missing' | 'failed';

function Section({
  title,
  description,
  children,
}: {
  readonly title: string;
  readonly description?: string;
  readonly children: ReactNode;
}) {
  return (
    <section className="rounded-[1.5rem] border border-border-subtle bg-surface p-5 sm:p-6">
      <h2 className="font-display text-xl leading-none text-white">{title}</h2>
      {description !== undefined ? (
        <p className="mt-2 text-sm leading-relaxed text-text-muted">{description}</p>
      ) : null}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function FormSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      {Array.from({ length: 3 }, (_, index) => (
        <Skeleton key={index} className="h-48 w-full rounded-[1.5rem]" />
      ))}
    </div>
  );
}

/** Formulario de alta y edición de pedidos, con el historial visible al editar. */
export function AdminOrderForm({ orderId }: AdminOrderFormProps) {
  const t = useTranslations('Admin');
  const tTracking = useTranslations('tracking');
  const router = useRouter();
  const { pushToast } = useToastContext();
  const isEdit = orderId !== undefined;

  const [loadStatus, setLoadStatus] = useState<LoadStatus>(isEdit ? 'loading' : 'ready');
  const [reloadToken, setReloadToken] = useState(0);
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [values, setValues] = useState<AdminOrderFormValues>(() => createEmptyOrderValues());
  const [errors, setErrors] = useState<AdminOrderFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    const controller = new AbortController();

    fetch(`/api/admin/pedidos/${encodeURIComponent(orderId)}`, {
      signal: controller.signal,
      headers: { accept: 'application/json' },
    })
      .then(async (response) => {
        if (response.status === 404) return 'missing' as const;
        if (response.status === 401) return 'unauthorized' as const;
        if (!response.ok) throw new Error('load-failed');
        return (await response.json()) as AdminOrder;
      })
      .then((outcome) => {
        if (outcome === 'missing') {
          setLoadStatus('missing');
          return;
        }
        if (outcome === 'unauthorized') {
          router.replace('/admin/login');
          return;
        }
        setOrder(outcome);
        setValues(toOrderFormValues(outcome));
        setLoadStatus('ready');
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setLoadStatus('failed');
      });

    return () => controller.abort();
  }, [isEdit, orderId, reloadToken, router]);

  const update = <TKey extends keyof AdminOrderFormValues>(
    key: TKey,
    value: AdminOrderFormValues[TKey],
  ): void => {
    setValues((current) => ({ ...current, [key]: value }) as AdminOrderFormValues);
    setErrors((current) => {
      if (current[key] === undefined) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const errorFor = (key: keyof AdminOrderFormValues): string | undefined => {
    const code = errors[key];
    return code === undefined ? undefined : t(`orderForm.errors.${code}`);
  };

  const statusOptions: ReadonlyArray<SelectOption> = ORDER_STATUSES.map((status) => ({
    value: status,
    label: tTracking(ORDER_STATUS_META[status].nameKey),
  }));

  const carrierOptions: ReadonlyArray<SelectOption> = [
    { value: '', label: t('orderForm.fields.carrierNone') },
    ...ORDER_CARRIER_IDS.map((carrier) => ({
      value: carrier,
      label: tTracking(ORDER_CARRIER_LABEL_KEYS[carrier]),
    })),
  ];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const nextErrors = validateOrderForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        isEdit ? `/api/admin/pedidos/${encodeURIComponent(orderId)}` : '/api/admin/pedidos',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(toOrderInput(values)),
        },
      );

      if (response.status === 401) {
        pushToast('error', t('orderForm.errorUnauthorized'));
        router.replace('/admin/login');
        return;
      }
      if (!response.ok) {
        pushToast('error', t('orderForm.errorSave'));
        return;
      }

      pushToast('success', isEdit ? t('orderForm.successEdit') : t('orderForm.successCreate'));
      router.push('/admin/pedidos');
      router.refresh();
    } catch {
      pushToast('error', t('orderForm.errorSave'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = isEdit ? t('orderForm.editTitle') : t('orderForm.createTitle');
  const subtitle = isEdit ? t('orderForm.editSubtitle') : t('orderForm.createSubtitle');

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Link
        href="/admin/pedidos"
        className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted transition-colors duration-200 hover:text-white"
      >
        <ArrowLeft {...BUTTON_ICON_PROPS} aria-hidden="true" />
        {t('orderForm.backToList')}
      </Link>

      <h1 className="mt-4 font-display text-3xl leading-none text-white">{title}</h1>
      <p className="mt-2 text-sm text-text-muted">{subtitle}</p>

      {isEdit && order !== null ? (
        <p className="mt-3 text-sm text-text-muted">
          {t('orderForm.codeLabel')}:{' '}
          <span className="font-semibold tabular-nums text-white">{order.code}</span>
        </p>
      ) : null}

      {loadStatus === 'loading' ? (
        <div className="mt-6">
          <FormSkeleton />
        </div>
      ) : loadStatus === 'missing' ? (
        <div className="mt-6">
          <EmptyState
            title={t('orderForm.notFound')}
            description={t('orderForm.notFoundDescription')}
            action={
              <Button as="link" href="/admin/pedidos" variant="secondary">
                {t('orderForm.backToList')}
              </Button>
            }
          />
        </div>
      ) : loadStatus === 'failed' ? (
        <div className="mt-6">
          <EmptyState
            title={t('orderForm.errorLoad')}
            description={t('orderForm.errorLoadDescription')}
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setLoadStatus('loading');
                  setReloadToken((token) => token + 1);
                }}
              >
                {t('orders.retry')}
              </Button>
            }
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5">
          <Section title={t('orderForm.sections.customer')}>
            <Input
              name="customerName"
              label={t('orderForm.fields.customerName')}
              value={values.customerName}
              error={errorFor('customerName')}
              onChange={(event) => update('customerName', event.target.value)}
            />
            <Input
              name="customerContact"
              label={t('orderForm.fields.customerContact')}
              value={values.customerContact}
              error={errorFor('customerContact')}
              onChange={(event) => update('customerContact', event.target.value)}
            />
          </Section>

          <Section title={t('orderForm.sections.shipping')}>
            <Select
              name="carrier"
              label={t('orderForm.fields.carrier')}
              options={carrierOptions}
              value={values.carrier}
              onChange={(event) => update('carrier', event.target.value)}
            />
            <Input
              name="trackingNumber"
              label={t('orderForm.fields.trackingNumber')}
              value={values.trackingNumber}
              error={errorFor('trackingNumber')}
              onChange={(event) => update('trackingNumber', event.target.value)}
            />
          </Section>

          <Section
            title={t('orderForm.sections.status')}
            description={t('orderForm.statusHint')}
          >
            <Select
              name="status"
              label={t('orderForm.fields.status')}
              options={statusOptions}
              value={values.status}
              onChange={(event) =>
                update('status', event.target.value as AdminOrderFormValues['status'])
              }
            />
            <Textarea
              name="note"
              containerClassName="sm:col-span-2"
              label={t('orderForm.fields.note')}
              value={values.note}
              error={errorFor('note')}
              onChange={(event) => update('note', event.target.value)}
            />
          </Section>

          <Section title={t('orderForm.sections.notes')}>
            <Textarea
              name="internalNotes"
              containerClassName="sm:col-span-2"
              rows={4}
              label={t('orderForm.fields.internalNotes')}
              value={values.internalNotes}
              onChange={(event) => update('internalNotes', event.target.value)}
            />
          </Section>

          {isEdit && order !== null ? (
            <Section
              title={t('orderForm.sections.timeline')}
              description={t('orderForm.timelineHint')}
            >
              <div className="sm:col-span-2">
                <OrderStatusTimeline timeline={order.timeline} />
              </div>
            </Section>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button as="link" href="/admin/pedidos" variant="secondary">
              {t('orderForm.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? t('orderForm.submitting')
                : isEdit
                  ? t('orderForm.submitEdit')
                  : t('orderForm.submitCreate')}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
