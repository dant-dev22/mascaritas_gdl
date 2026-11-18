'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, MapPin, Package, Phone, Truck, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CART_PATH } from '@/__data__/cart';
import { CHECKOUT_FIELD_LIMITS, EMPTY_CHECKOUT_FORM } from '@/__data__/checkoutForm';
import {
  DEFAULT_DELIVERY_METHOD,
  SHIPPING_METHOD_OPTIONS,
  SHIPPING_RATE_MXN,
  isDeliveryMethod,
  resolveShippingMXN,
} from '@/__data__/shipping';
import type { ShippingMethodOption } from '@/__data__/shipping';
import { clearFieldError, toCheckoutRequest, validateCheckoutForm } from '@/__lib__/checkoutForm';
import { trackInitiateCheckout, trackPurchase } from '@/__lib__/analytics';
import { cn, formatMXN } from '@/__lib__/utils';
import { useCartContext } from '@/__hooks__/useCartContext';
import { useCheckout } from '@/__hooks__/useCheckout';
import { useConsent } from '@/__hooks__/useConsent';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { Textarea } from '@/components/ui/Textarea';
import { CartEmptyState } from '@/components/cart/CartEmptyState';
import { CheckoutSuccess } from './CheckoutSuccess';
import { CheckoutSummary } from './CheckoutSummary';
import type {
  CheckoutFieldName,
  CheckoutFormErrors,
  CheckoutFormValues,
  DeliveryMethod,
  ShippingIcon,
} from '@/__types__';

const FIELD_ICON_PROPS = { width: 18, height: 18, strokeWidth: 2 } as const;

const METHOD_ICONS: Record<ShippingIcon, LucideIcon> = {
  'map-pin': MapPin,
  truck: Truck,
  package: Package,
};

const CARD_CLASS = 'rounded-[1.5rem] border border-border-subtle bg-surface p-5 sm:p-6';
const SECTION_TITLE_CLASS = 'mb-4 font-display text-lg text-white';
const ASIDE_CLASS =
  'flex flex-col gap-4 rounded-[1.5rem] border border-border-subtle bg-surface p-5 lg:sticky lg:top-24';

/**
 * Flujo de checkout: captura los datos de contacto y envío, calcula el envío
 * con las mismas reglas que el backend y, al confirmar, delega el pedido al
 * servidor. Al cerrarse con éxito muestra el código y el acceso a WhatsApp.
 */
export function CheckoutForm() {
  const t = useTranslations('checkout');
  const { state, clear } = useCartContext();
  const { submit, isSubmitting, errorKey, result, priceChanged } = useCheckout();

  const groupId = useId();
  const [values, setValues] = useState<CheckoutFormValues>(EMPTY_CHECKOUT_FORM);
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(DEFAULT_DELIVERY_METHOD);

  const shippingMXN = useMemo(
    () => resolveShippingMXN(deliveryMethod, state.subtotalMXN),
    [deliveryMethod, state.subtotalMXN],
  );
  const totalMXN = shippingMXN === null ? null : state.subtotalMXN + shippingMXN;

  const consent = useConsent();
  const initiateCheckoutSent = useRef(false);

  // `InitiateCheckout`: se manda una sola vez, cuando hay carrito y ya hay
  // consentimiento de marketing. Si la persona acepta después de entrar, el
  // efecto vuelve a correr al cambiar la decisión y recién ahí se emite.
  useEffect(() => {
    if (consent?.categories.marketing !== true || initiateCheckoutSent.current) return;
    if (!state.isHydrated || result !== null || state.lines.length === 0) return;

    initiateCheckoutSent.current = true;
    trackInitiateCheckout({
      valueMXN: totalMXN ?? state.subtotalMXN,
      lines: state.lines.map((line) => ({
        id: line.productId,
        quantity: line.quantity,
        itemPriceMXN: line.priceMXN,
      })),
    });
  }, [consent, result, state.isHydrated, state.lines, state.subtotalMXN, totalMXN]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      const field = event.target.name as CheckoutFieldName;
      const { value } = event.target;

      setValues((previous) => ({ ...previous, [field]: value }));
      setErrors((previous) => clearFieldError(previous, field));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();
      if (state.lines.length === 0) return;

      const nextErrors = validateCheckoutForm(values);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) return;

      const order = await submit(
        toCheckoutRequest(values, state.lines, deliveryMethod),
        state.subtotalMXN,
      );

      // El pedido ya existe en el servidor: se mide la conversión antes de
      // vaciar el carrito, con el total que calculó el servidor.
      if (order) {
        trackPurchase({
          valueMXN: order.totalMXN ?? order.subtotalMXN,
          lines: order.items.map((item) => ({
            id: item.productId ?? item.sku,
            quantity: item.quantity,
            itemPriceMXN: item.unitPriceMXN,
          })),
        });
        clear();
      }
    },
    [clear, deliveryMethod, state.lines, state.subtotalMXN, submit, values],
  );

  const fieldError = useCallback(
    (field: CheckoutFieldName): string | undefined => {
      const code = errors[field];
      return code ? t(`errors.${code}`) : undefined;
    },
    [errors, t],
  );

  // El carrito vive en `localStorage`: hasta hidratar no sabemos si hay piezas.
  if (!state.isHydrated) return <CheckoutSkeleton />;

  if (result) {
    return (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <CheckoutSuccess order={result} />
        <aside className={ASIDE_CLASS}>
          <CheckoutSummary
            subtotalMXN={result.subtotalMXN}
            shippingMXN={result.shippingMXN}
            totalMXN={result.totalMXN}
            deliveryMethod={
              isDeliveryMethod(result.deliveryMethod) ? result.deliveryMethod : deliveryMethod
            }
            priceChanged={priceChanged}
          />
        </aside>
      </div>
    );
  }

  if (state.lines.length === 0) {
    return <CartEmptyState className={cn(CARD_CLASS, 'py-8 sm:py-12')} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start"
    >
      <div className="flex flex-col gap-6">
        <section className={CARD_CLASS}>
          <h2 id={`${groupId}-delivery`} className={SECTION_TITLE_CLASS}>
            {t('deliverySectionTitle')}
          </h2>

          <div
            role="radiogroup"
            aria-labelledby={`${groupId}-delivery`}
            className="flex flex-col gap-3"
          >
            {SHIPPING_METHOD_OPTIONS.map((option) => (
              <MethodOption
                key={option.id}
                option={option}
                selected={deliveryMethod === option.id}
                onSelect={setDeliveryMethod}
              />
            ))}
          </div>
        </section>

        <section className={CARD_CLASS}>
          <h2 className={SECTION_TITLE_CLASS}>{t('contactSectionTitle')}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              name="customerName"
              label={t('fields.customerName')}
              value={values.customerName}
              onChange={handleChange}
              error={fieldError('customerName')}
              maxLength={CHECKOUT_FIELD_LIMITS.customerName}
              autoComplete="name"
              leftIcon={<User {...FIELD_ICON_PROPS} aria-hidden="true" />}
              containerClassName="sm:col-span-2"
            />

            <Input
              name="customerContact"
              label={t('fields.customerContact')}
              hint={t('fields.customerContactHint')}
              value={values.customerContact}
              onChange={handleChange}
              error={fieldError('customerContact')}
              maxLength={CHECKOUT_FIELD_LIMITS.customerContact}
              autoComplete="tel"
              inputMode="tel"
              leftIcon={<Phone {...FIELD_ICON_PROPS} aria-hidden="true" />}
            />

            <Input
              name="customerEmail"
              type="email"
              label={t('fields.customerEmail')}
              value={values.customerEmail}
              onChange={handleChange}
              error={fieldError('customerEmail')}
              maxLength={CHECKOUT_FIELD_LIMITS.customerEmail}
              autoComplete="email"
              leftIcon={<Mail {...FIELD_ICON_PROPS} aria-hidden="true" />}
            />
          </div>
        </section>

        <section className={CARD_CLASS}>
          <h2 className={SECTION_TITLE_CLASS}>{t('shippingSectionTitle')}</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              name="shippingStreet"
              label={t('fields.shippingStreet')}
              value={values.shippingStreet}
              onChange={handleChange}
              error={fieldError('shippingStreet')}
              maxLength={CHECKOUT_FIELD_LIMITS.shippingStreet}
              autoComplete="street-address"
              containerClassName="sm:col-span-2"
            />

            <Input
              name="shippingCity"
              label={t('fields.shippingCity')}
              value={values.shippingCity}
              onChange={handleChange}
              error={fieldError('shippingCity')}
              maxLength={CHECKOUT_FIELD_LIMITS.shippingCity}
              autoComplete="address-level2"
            />

            <Input
              name="shippingState"
              label={t('fields.shippingState')}
              value={values.shippingState}
              onChange={handleChange}
              error={fieldError('shippingState')}
              maxLength={CHECKOUT_FIELD_LIMITS.shippingState}
              autoComplete="address-level1"
            />

            <Input
              name="shippingZip"
              label={t('fields.shippingZip')}
              value={values.shippingZip}
              onChange={handleChange}
              error={fieldError('shippingZip')}
              maxLength={CHECKOUT_FIELD_LIMITS.shippingZip}
              autoComplete="postal-code"
              inputMode="numeric"
            />

            <Textarea
              name="shippingReferences"
              label={t('fields.shippingReferences')}
              value={values.shippingReferences}
              onChange={handleChange}
              maxLength={CHECKOUT_FIELD_LIMITS.shippingReferences}
              rows={2}
              containerClassName="sm:col-span-2"
            />

            <Textarea
              name="note"
              label={t('fields.note')}
              hint={t('fields.noteHint')}
              value={values.note}
              onChange={handleChange}
              maxLength={CHECKOUT_FIELD_LIMITS.note}
              rows={3}
              containerClassName="sm:col-span-2"
            />
          </div>
        </section>
      </div>

      <aside className={ASIDE_CLASS}>
        <CheckoutSummary
          subtotalMXN={state.subtotalMXN}
          shippingMXN={shippingMXN}
          totalMXN={totalMXN}
          deliveryMethod={deliveryMethod}
        />

        {errorKey ? (
          <p
            role="alert"
            className="rounded-2xl border border-accent-red/40 bg-accent-red/10 px-4 py-3 text-xs leading-relaxed text-white"
          >
            {t(`errors.${errorKey}`)}
          </p>
        ) : null}

        <Button type="submit" variant="primary" size="lg" fullWidth disabled={isSubmitting}>
          {isSubmitting ? t('submitting') : t('submit')}
        </Button>

        <Button as="link" href={CART_PATH} variant="secondary" size="md" fullWidth>
          {t('backToCart')}
        </Button>
      </aside>
    </form>
  );
}

interface MethodOptionProps {
  readonly option: ShippingMethodOption;
  readonly selected: boolean;
  readonly onSelect: (method: DeliveryMethod) => void;
}

/** Tarjeta seleccionable de modalidad de entrega; el radio real queda oculto. */
function MethodOption({ option, selected, onSelect }: MethodOptionProps) {
  const t = useTranslations('checkout.methods');
  const Icon = METHOD_ICONS[option.icon];
  const priceLabel =
    option.id === 'paqueteria'
      ? t('pricePendingQuote')
      : formatMXN(SHIPPING_RATE_MXN[option.id] ?? 0);

  return (
    <label
      className={cn(
        'flex items-start gap-3 rounded-2xl border bg-canvas p-4',
        'cursor-pointer transition-all duration-200 ease-out',
        'hover:border-border-emphasis',
        'focus-within:shadow-glow-green',
        selected ? 'border-accent-green bg-surface-hover' : 'border-border-subtle',
      )}
    >
      <input
        type="radio"
        name="deliveryMethod"
        value={option.id}
        checked={selected}
        onChange={() => onSelect(option.id)}
        className="sr-only"
      />

      <span
        aria-hidden="true"
        className={cn(
          'mt-0.5 inline-flex items-center justify-center w-10 h-10 shrink-0 rounded-xl border',
          selected ? 'border-accent-green text-accent-green' : 'border-border-subtle text-text-muted',
        )}
      >
        <Icon {...FIELD_ICON_PROPS} />
      </span>

      <span className="flex-1 min-w-0 flex flex-col gap-1">
        <span className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-white">{t(option.labelKey)}</span>
          <span
            className={cn(
              'shrink-0 text-xs font-semibold',
              selected ? 'text-accent-green' : 'text-text-muted',
            )}
          >
            {priceLabel}
          </span>
        </span>
        <span className="text-xs leading-relaxed text-text-muted">{t(option.descriptionKey)}</span>
      </span>
    </label>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
      <div className="flex flex-col gap-6">
        <Skeleton className="h-56 w-full" rounded="rounded-[1.5rem]" />
        <Skeleton className="h-48 w-full" rounded="rounded-[1.5rem]" />
      </div>
      <Skeleton className="h-64 w-full" rounded="rounded-[1.5rem]" />
    </div>
  );
}
