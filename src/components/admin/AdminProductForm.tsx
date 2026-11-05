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
import { Switch } from '@/components/ui/Switch';
import { Textarea } from '@/components/ui/Textarea';
import { Link, useRouter } from '@/i18n/navigation';
import {
  ADMIN_ACCENT_OPTIONS,
  ADMIN_BADGE_OPTIONS,
  ADMIN_CATEGORY_OPTIONS,
  ADMIN_SIZE_OPTIONS,
  ADMIN_STYLE_OPTIONS,
} from '@/__data__/adminProductOptions';
import { useToastContext } from '@/__hooks__/useToastContext';
import {
  createEmptyValues,
  toFormValues,
  toProductInput,
  validateForm,
} from '@/__lib__/adminProductForm';
import type {
  AdminFormErrors,
  AdminProductFormValues,
  AdminSelectOption,
  Product,
} from '@/__types__';

interface AdminProductFormProps {
  readonly productId?: string;
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
        <Skeleton key={index} className="h-56 w-full rounded-[1.5rem]" />
      ))}
    </div>
  );
}

/** Formulario de alta y edición de productos, agrupado por bloques temáticos. */
export function AdminProductForm({ productId }: AdminProductFormProps) {
  const t = useTranslations('Admin');
  const router = useRouter();
  const { pushToast } = useToastContext();
  const isEdit = productId !== undefined;

  const [loadStatus, setLoadStatus] = useState<LoadStatus>(isEdit ? 'loading' : 'ready');
  const [reloadToken, setReloadToken] = useState(0);
  const [values, setValues] = useState<AdminProductFormValues>(() => createEmptyValues());
  const [errors, setErrors] = useState<AdminFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    const controller = new AbortController();

    fetch(`/api/admin/productos/${encodeURIComponent(productId)}`, {
      signal: controller.signal,
      headers: { accept: 'application/json' },
    })
      .then(async (response) => {
        if (response.status === 404) return 'missing' as const;
        if (response.status === 401) return 'unauthorized' as const;
        if (!response.ok) throw new Error('load-failed');
        return (await response.json()) as Product;
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
        setValues(toFormValues(outcome));
        setLoadStatus('ready');
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setLoadStatus('failed');
      });

    return () => controller.abort();
  }, [isEdit, productId, reloadToken, router]);

  const update = <TKey extends keyof AdminProductFormValues>(
    key: TKey,
    value: AdminProductFormValues[TKey],
  ): void => {
    setValues((current) => ({ ...current, [key]: value }) as AdminProductFormValues);
    setErrors((current) => {
      if (current[key] === undefined) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const localize = (items: ReadonlyArray<AdminSelectOption>): ReadonlyArray<SelectOption> =>
    items.map((item) => ({ value: item.value, label: t(item.labelKey) }));

  const errorFor = (key: keyof AdminProductFormValues): string | undefined => {
    const code = errors[key];
    return code === undefined ? undefined : t(`form.errors.${code}`);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const nextErrors = validateForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        isEdit ? `/api/admin/productos/${encodeURIComponent(productId)}` : '/api/admin/productos',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(toProductInput(values)),
        },
      );

      if (response.status === 401) {
        pushToast('error', t('form.errorUnauthorized'));
        router.replace('/admin/login');
        return;
      }
      if (response.status === 409) {
        pushToast('error', t('form.errorConflict'));
        return;
      }
      if (!response.ok) {
        pushToast('error', t('form.errorSave'));
        return;
      }

      pushToast('success', isEdit ? t('form.successEdit') : t('form.successCreate'));
      router.push('/admin');
      router.refresh();
    } catch {
      pushToast('error', t('form.errorSave'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = isEdit ? t('form.editTitle') : t('form.createTitle');
  const subtitle = isEdit ? t('form.editSubtitle') : t('form.createSubtitle');

  return (
    <div className="mx-auto w-full max-w-4xl">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted transition-colors duration-200 hover:text-white"
      >
        <ArrowLeft {...BUTTON_ICON_PROPS} aria-hidden="true" />
        {t('form.backToList')}
      </Link>

      <h1 className="mt-4 font-display text-3xl leading-none text-white">{title}</h1>
      <p className="mt-2 text-sm text-text-muted">{subtitle}</p>

      {loadStatus === 'loading' ? (
        <div className="mt-6">
          <FormSkeleton />
        </div>
      ) : loadStatus === 'missing' ? (
        <div className="mt-6">
          <EmptyState
            title={t('form.notFound')}
            description={t('form.notFoundDescription')}
            action={
              <Button as="link" href="/admin" variant="secondary">
                {t('form.backToList')}
              </Button>
            }
          />
        </div>
      ) : loadStatus === 'failed' ? (
        <div className="mt-6">
          <EmptyState
            title={t('form.errorLoad')}
            description={t('form.errorLoadDescription')}
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setLoadStatus('loading');
                  setReloadToken((token) => token + 1);
                }}
              >
                {t('list.retry')}
              </Button>
            }
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5">
          <Section title={t('form.sections.identity')}>
            <Input
              name="title"
              label={t('form.fields.title')}
              value={values.title}
              error={errorFor('title')}
              onChange={(event) => update('title', event.target.value)}
            />
            <Input
              name="subtitle"
              label={t('form.fields.subtitle')}
              value={values.subtitle}
              error={errorFor('subtitle')}
              onChange={(event) => update('subtitle', event.target.value)}
            />
            <Input
              name="slug"
              label={t('form.fields.slug')}
              hint={t('form.fields.slugHint')}
              value={values.slug}
              error={errorFor('slug')}
              onChange={(event) => update('slug', event.target.value)}
            />
            <Input
              name="sku"
              label={t('form.fields.sku')}
              value={values.sku}
              error={errorFor('sku')}
              onChange={(event) => update('sku', event.target.value)}
            />
            <Textarea
              name="description"
              containerClassName="sm:col-span-2"
              label={t('form.fields.description')}
              value={values.description}
              error={errorFor('description')}
              onChange={(event) => update('description', event.target.value)}
            />
            <Textarea
              name="longDescription"
              containerClassName="sm:col-span-2"
              rows={6}
              label={t('form.fields.longDescription')}
              value={values.longDescription}
              error={errorFor('longDescription')}
              onChange={(event) => update('longDescription', event.target.value)}
            />
          </Section>

          <Section title={t('form.sections.pricing')}>
            <Input
              name="priceMXN"
              type="number"
              inputMode="numeric"
              min={0}
              label={t('form.fields.priceMXN')}
              value={values.priceMXN}
              error={errorFor('priceMXN')}
              onChange={(event) => update('priceMXN', event.target.value)}
            />
            <Input
              name="oldPriceMXN"
              type="number"
              inputMode="numeric"
              min={0}
              label={t('form.fields.oldPriceMXN')}
              hint={t('form.fields.oldPriceHint')}
              value={values.oldPriceMXN}
              error={errorFor('oldPriceMXN')}
              onChange={(event) => update('oldPriceMXN', event.target.value)}
            />
            <Select
              name="badgeVariant"
              label={t('form.fields.badgeVariant')}
              options={localize(ADMIN_BADGE_OPTIONS)}
              value={values.badgeVariant}
              onChange={(event) => update('badgeVariant', event.target.value)}
            />
            <Input
              name="badgeLabel"
              label={t('form.fields.badgeLabel')}
              value={values.badgeLabel}
              error={errorFor('badgeLabel')}
              onChange={(event) => update('badgeLabel', event.target.value)}
            />
          </Section>

          <Section title={t('form.sections.classification')}>
            <Select
              name="accentColor"
              label={t('form.fields.accentColor')}
              options={localize(ADMIN_ACCENT_OPTIONS)}
              value={values.accentColor}
              onChange={(event) => update('accentColor', event.target.value)}
            />
            <Select
              name="categoryId"
              label={t('form.fields.categoryId')}
              options={localize(ADMIN_CATEGORY_OPTIONS)}
              value={values.categoryId}
              onChange={(event) => update('categoryId', event.target.value)}
            />
            <Select
              name="sizeId"
              label={t('form.fields.sizeId')}
              options={localize(ADMIN_SIZE_OPTIONS)}
              value={values.sizeId}
              onChange={(event) => update('sizeId', event.target.value)}
            />
            <Select
              name="maskStyle"
              label={t('form.fields.maskStyle')}
              options={localize(ADMIN_STYLE_OPTIONS)}
              value={values.maskStyle}
              onChange={(event) => update('maskStyle', event.target.value)}
            />
          </Section>

          <Section title={t('form.sections.specs')}>
            <Input
              name="finish"
              label={t('form.fields.finish')}
              value={values.finish}
              error={errorFor('finish')}
              onChange={(event) => update('finish', event.target.value)}
            />
            <Input
              name="material"
              label={t('form.fields.material')}
              value={values.material}
              error={errorFor('material')}
              onChange={(event) => update('material', event.target.value)}
            />
            <Input
              name="lining"
              containerClassName="sm:col-span-2"
              label={t('form.fields.lining')}
              value={values.lining}
              error={errorFor('lining')}
              onChange={(event) => update('lining', event.target.value)}
            />
          </Section>

          <Section title={t('form.sections.inventory')}>
            <div className="sm:col-span-2">
              <Switch
                checked={values.inStock}
                onChange={(checked) => update('inStock', checked)}
                label={t('form.fields.inStock')}
                hint={t('form.fields.inStockHint')}
              />
            </div>
            <Input
              name="stockCount"
              type="number"
              inputMode="numeric"
              min={0}
              label={t('form.fields.stockCount')}
              value={values.stockCount}
              error={errorFor('stockCount')}
              onChange={(event) => update('stockCount', event.target.value)}
            />
            <Input
              name="reviewsCount"
              type="number"
              inputMode="numeric"
              min={0}
              label={t('form.fields.reviewsCount')}
              value={values.reviewsCount}
              error={errorFor('reviewsCount')}
              onChange={(event) => update('reviewsCount', event.target.value)}
            />
            <Input
              name="rating"
              type="number"
              inputMode="decimal"
              step="0.1"
              min={0}
              max={5}
              label={t('form.fields.rating')}
              value={values.rating}
              error={errorFor('rating')}
              onChange={(event) => update('rating', event.target.value)}
            />
            <Input
              name="tags"
              label={t('form.fields.tags')}
              hint={t('form.fields.tagsHint')}
              value={values.tags}
              onChange={(event) => update('tags', event.target.value)}
            />
          </Section>

          <Section
            title={t('form.sections.translations')}
            description={t('form.translationsHint')}
          >
            <Input
              name="subtitleEn"
              label={t('form.fields.subtitleEn')}
              value={values.subtitleEn}
              onChange={(event) => update('subtitleEn', event.target.value)}
            />
            <Input
              name="badgeLabelEn"
              label={t('form.fields.badgeLabelEn')}
              value={values.badgeLabelEn}
              onChange={(event) => update('badgeLabelEn', event.target.value)}
            />
            <Textarea
              name="descriptionEn"
              containerClassName="sm:col-span-2"
              label={t('form.fields.descriptionEn')}
              value={values.descriptionEn}
              onChange={(event) => update('descriptionEn', event.target.value)}
            />
            <Textarea
              name="longDescriptionEn"
              containerClassName="sm:col-span-2"
              rows={6}
              label={t('form.fields.longDescriptionEn')}
              value={values.longDescriptionEn}
              onChange={(event) => update('longDescriptionEn', event.target.value)}
            />
            <Input
              name="finishEn"
              label={t('form.fields.finishEn')}
              value={values.finishEn}
              onChange={(event) => update('finishEn', event.target.value)}
            />
            <Input
              name="materialEn"
              label={t('form.fields.materialEn')}
              value={values.materialEn}
              onChange={(event) => update('materialEn', event.target.value)}
            />
            <Input
              name="liningEn"
              containerClassName="sm:col-span-2"
              label={t('form.fields.liningEn')}
              value={values.liningEn}
              onChange={(event) => update('liningEn', event.target.value)}
            />
          </Section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button as="link" href="/admin" variant="secondary">
              {t('form.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? t('form.submitting')
                : isEdit
                  ? t('form.submitEdit')
                  : t('form.submitCreate')}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
