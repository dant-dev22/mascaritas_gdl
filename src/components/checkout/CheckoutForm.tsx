'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Banknote, CreditCard, FileText, Landmark, Mail, MapPin, MessageSquare, Package, Phone, Truck, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CART_PATH } from '@/__data__/cart';
import {
  CHECKOUT_FIELD_LIMITS,
  CONTACT_CHECKOUT_FIELDS,
  EMPTY_CHECKOUT_FORM,
  SHIPPING_CHECKOUT_FIELDS,
} from '@/__data__/checkoutForm';
import {
  CARRIER_OPTIONS,
  DEFAULT_DELIVERY_METHOD,
  DEFAULT_DELIVERY_MODE,
  DELIVERY_MODE_OPTIONS,
  SHIPPING_RATE_MXN,
  isDeliveryMethod,
  resolveShippingMXN,
} from '@/__data__/shipping';
import {
  PAYMENT_METHOD_OPTIONS,
  defaultPaymentMethod,
  isPaymentMethodAllowed,
} from '@/__data__/payment';
import {
  clearFieldError,
  toCheckoutRequest,
  validateCheckoutFields,
  validateCheckoutForm,
} from '@/__lib__/checkoutForm';
import { trackInitiateCheckout, trackPurchase } from '@/__lib__/analytics';
import { cn, formatMXN } from '@/__lib__/utils';
import { buildWhatsAppHref } from '@/__lib__/whatsapp';
import { useCartContext } from '@/__hooks__/useCartContext';
import { useCheckout } from '@/__hooks__/useCheckout';
import { useConsent } from '@/__hooks__/useConsent';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MercadoPagoMark } from '@/components/ui/MercadoPagoMark';
import { Skeleton } from '@/components/ui/Skeleton';
import { Spinner } from '@/components/ui/Spinner';
import { MaskArt } from '@/components/graphics/MaskArt';
import { Textarea } from '@/components/ui/Textarea';
import { CartEmptyState } from '@/components/cart/CartEmptyState';
import { CheckoutSuccess } from './CheckoutSuccess';
import { CheckoutSummary } from './CheckoutSummary';
import type {
  CheckoutFieldName,
  CheckoutFormErrors,
  CheckoutFormValues,
  DeliveryMethod,
  DeliveryMode,
  PaymentIcon,
  PaymentMethod,
  ShippingIcon,
} from '@/__types__';

const FIELD_ICON_PROPS = { width: 18, height: 18, strokeWidth: 2 } as const;

const SHIPPING_ICONS: Record<ShippingIcon, LucideIcon> = {
  'map-pin': MapPin,
  truck: Truck,
  package: Package,
};

const PAYMENT_ICONS: Record<PaymentIcon, LucideIcon> = {
  'credit-card': CreditCard,
  banknote: Banknote,
  landmark: Landmark,
};

const CARD_CLASS = 'rounded-[1.5rem] border border-border-subtle bg-surface p-5 sm:p-6';
const SECTION_TITLE_CLASS = 'mb-4 font-display text-lg text-white';
const ASIDE_CLASS =
  'flex flex-col gap-4 rounded-[1.5rem] border border-border-subtle bg-surface p-5 lg:sticky lg:top-24';

/** Pasos del checkout, en orden: datos, envío, revisión y pago. */
const CHECKOUT_STEPS = ['details', 'shipping', 'review', 'payment'] as const;
type CheckoutStep = (typeof CHECKOUT_STEPS)[number];

/**
 * Flujo de checkout en cuatro pasos, uno por sección. El primero captura los
 * datos de contacto; el segundo la dirección y la modalidad de entrega; el
 * tercero resume el pedido para revisarlo; el cuarto ofrece el método de pago.
 * Solo al confirmar en el pago el servidor crea el pedido y, con pago en línea,
 * devuelve el enlace de Mercado Pago al que se redirige al cliente.
 */
export function CheckoutForm() {
  const t = useTranslations('checkout');
  const { state, clear } = useCartContext();
  const { submit, isSubmitting, errorKey, result, priceChanged } = useCheckout();

  const groupId = useId();
  const [step, setStep] = useState<CheckoutStep>('details');
  const [values, setValues] = useState<CheckoutFormValues>(EMPTY_CHECKOUT_FORM);
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>(DEFAULT_DELIVERY_MODE);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(DEFAULT_DELIVERY_METHOD);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(() =>
    defaultPaymentMethod(DEFAULT_DELIVERY_METHOD),
  );

  // Cambiar de modalidad puede invalidar el método de pago elegido: en ese caso
  // se salta al primero que sí sea compatible.
  const handleDeliverySelect = useCallback((method: DeliveryMethod): void => {
    setDeliveryMethod(method);
    setPaymentMethod((current) =>
      isPaymentMethodAllowed(method, current) ? current : defaultPaymentMethod(method),
    );
  }, []);

  // Solo se ofrecen los métodos compatibles con la modalidad de entrega.
  const paymentOptions = useMemo(
    () =>
      PAYMENT_METHOD_OPTIONS.filter((option) =>
        isPaymentMethodAllowed(deliveryMethod, option.id),
      ),
    [deliveryMethod],
  );

  // Nombres visibles de lo elegido: se reutilizan en el paso de revisión.
  const deliveryModeLabel = useMemo(() => {
    const option = DELIVERY_MODE_OPTIONS.find((item) => item.id === deliveryMode);
    return option ? t(`deliveryModes.${option.labelKey}`) : '';
  }, [deliveryMode, t]);

  const deliveryLabel = useMemo(() => {
    const option = CARRIER_OPTIONS.find((item) => item.id === deliveryMethod);
    return option ? t(`methods.${option.labelKey}`) : '';
  }, [deliveryMethod, t]);

  // La entrega personal se cierra por WhatsApp, así que el envío no se cotiza
  // aquí; el envío a domicilio usa la tarifa de la paquetería elegida.
  const shippingMXN = useMemo(
    () =>
      deliveryMode === 'entrega-personal'
        ? null
        : resolveShippingMXN(deliveryMethod, state.subtotalMXN),
    [deliveryMode, deliveryMethod, state.subtotalMXN],
  );
  const totalMXN = shippingMXN === null ? null : state.subtotalMXN + shippingMXN;

  const pickupWhatsappHref = useMemo(
    () => buildWhatsAppHref(t('pickup.whatsappMessage')),
    [t],
  );

  // La transferencia se cierra por WhatsApp: el mensaje lleva el resumen para
  // que el negocio confirme el monto y pase los datos bancarios.
  const transferenciaWhatsappHref = useMemo(() => {
    const lines = state.lines.map(
      (line) => `• ${line.quantity} × ${line.title} — ${formatMXN(line.priceMXN * line.quantity)}`,
    );
    const body = [
      t('transferencia.whatsappMessage'),
      '',
      ...lines,
      t('transferencia.whatsappTotal', { amount: formatMXN(totalMXN ?? state.subtotalMXN) }),
    ].join('\n');

    return buildWhatsAppHref(body);
  }, [state.lines, state.subtotalMXN, t, totalMXN]);

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

  const goToPayment = useCallback((): void => {
    const nextErrors = validateCheckoutFields(values, CONTACT_CHECKOUT_FIELDS);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStep('shipping');
  }, [values]);

  const goToReview = useCallback((): void => {
    const nextErrors = validateCheckoutFields(values, SHIPPING_CHECKOUT_FIELDS);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStep('review');
  }, [values]);

  // Crea el pedido en el servidor. Solo se ejecuta desde el paso de pago, con
  // la confirmación explícita del cliente.
  const submitOrder = useCallback(async (): Promise<void> => {
    if (state.lines.length === 0) return;

    const nextErrors = validateCheckoutForm(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      // Se vuelve al primer paso donde falte algo.
      const hasContactError = CONTACT_CHECKOUT_FIELDS.some((field) => nextErrors[field]);
      setStep(hasContactError ? 'details' : 'shipping');
      return;
    }

    const order = await submit(
      toCheckoutRequest(values, state.lines, deliveryMethod, paymentMethod),
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
  }, [clear, deliveryMethod, paymentMethod, state.lines, state.subtotalMXN, submit, values]);

  // Enter dentro del formulario avanza de paso; el pedido se crea en el pago.
  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();

      if (step === 'details') {
        goToPayment();
        return;
      }
      if (step === 'shipping') {
        goToReview();
        return;
      }
      if (step === 'review') {
        setStep('payment');
        return;
      }

      // La transferencia se cierra por WhatsApp: aquí no se crea pedido.
      if (paymentMethod === 'transferencia') return;

      void submitOrder();
    },
    [goToPayment, goToReview, paymentMethod, step, submitOrder],
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

  // Con pago en línea el siguiente paso es salir a Mercado Pago; si el cobro es
  // contra entrega, solo se registra el pedido.
  const processingMessage =
    paymentMethod === 'mercado_pago' ? t('connectingPayment') : t('confirmingOrder');

  return (
    <>
      <form
        onSubmit={handleSubmit}
        noValidate
        className={cn(
          'grid gap-8',
          step === 'payment'
            ? 'mx-auto w-full max-w-2xl'
            : 'lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start',
        )}
      >
        <div className="flex flex-col gap-6">
          <StepIndicator
            current={step}
            labels={{
              details: t('steps.details'),
              shipping: t('steps.shipping'),
              review: t('steps.review'),
              payment: t('steps.payment'),
            }}
            progressLabel={t('stepProgress', {
              current: CHECKOUT_STEPS.indexOf(step) + 1,
              total: CHECKOUT_STEPS.length,
            })}
          />

          {step === 'details' ? (
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

                <Input
                  name="customerRfc"
                  label={t('fields.customerRfc')}
                  hint={t('fields.customerRfcHint')}
                  value={values.customerRfc}
                  onChange={handleChange}
                  error={fieldError('customerRfc')}
                  maxLength={CHECKOUT_FIELD_LIMITS.customerRfc}
                  autoComplete="off"
                  leftIcon={<FileText {...FIELD_ICON_PROPS} aria-hidden="true" />}
                />
              </div>
            </section>
          ) : step === 'shipping' ? (
            <>
              <section className={CARD_CLASS}>
                <h2 id={`${groupId}-delivery`} className={SECTION_TITLE_CLASS}>
                  {t('deliverySectionTitle')}
                </h2>

                <div
                  role="radiogroup"
                  aria-labelledby={`${groupId}-delivery`}
                  className="flex flex-col gap-3"
                >
                  {DELIVERY_MODE_OPTIONS.map((option) => (
                    <OptionCard
                      key={option.id}
                      name="deliveryMode"
                      value={option.id}
                      selected={deliveryMode === option.id}
                      onSelect={setDeliveryMode}
                      icon={SHIPPING_ICONS[option.icon]}
                      label={t(`deliveryModes.${option.labelKey}`)}
                      description={t(`deliveryModes.${option.descriptionKey}`)}
                    />
                  ))}
                </div>
              </section>

              {deliveryMode === 'entrega-personal' ? (
                <section className={CARD_CLASS}>
                  <h2 className={SECTION_TITLE_CLASS}>{t('pickup.title')}</h2>

                  <p className="text-sm leading-relaxed text-text-muted">
                    {t('pickup.description')}
                  </p>

                  <Button
                    as="link"
                    href={pickupWhatsappHref}
                    target="_blank"
                    rel="noreferrer noopener"
                    variant="primary"
                    size="lg"
                    fullWidth
                    leftIcon={<MessageSquare {...FIELD_ICON_PROPS} aria-hidden="true" />}
                    className="mt-5"
                  >
                    {t('pickup.whatsappCta')}
                  </Button>
                </section>
              ) : (
                <>
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
                    </div>
                  </section>

                  <section className={CARD_CLASS}>
                    <h2 id={`${groupId}-carrier`} className={SECTION_TITLE_CLASS}>
                      {t('carrierSectionTitle')}
                    </h2>

                    <div
                      role="radiogroup"
                      aria-labelledby={`${groupId}-carrier`}
                      className="flex flex-col gap-3"
                    >
                      {CARRIER_OPTIONS.map((option) => (
                        <OptionCard
                          key={option.id}
                          name="deliveryMethod"
                          value={option.id}
                          selected={deliveryMethod === option.id}
                          onSelect={handleDeliverySelect}
                          icon={SHIPPING_ICONS[option.icon]}
                          label={t(`methods.${option.labelKey}`)}
                          description={t(`methods.${option.descriptionKey}`)}
                          trailing={
                            option.id === 'paqueteria'
                              ? t('methods.pricePendingQuote')
                              : formatMXN(SHIPPING_RATE_MXN[option.id] ?? 0)
                          }
                        />
                      ))}
                    </div>
                  </section>
                </>
              )}
            </>
          ) : step === 'review' ? (
            <section className={CARD_CLASS}>
              <h2 className={SECTION_TITLE_CLASS}>{t('reviewSectionTitle')}</h2>

              <div className="flex flex-col gap-5">
                <ReviewBlock
                  title={t('contactSectionTitle')}
                  actionLabel={t('reviewEdit')}
                  onAction={() => setStep('details')}
                >
                  <ReviewRow label={t('fields.customerName')} value={values.customerName} />
                  <ReviewRow label={t('fields.customerContact')} value={values.customerContact} />
                  {values.customerEmail ? (
                    <ReviewRow label={t('fields.customerEmail')} value={values.customerEmail} />
                  ) : null}
                  {values.customerRfc ? (
                    <ReviewRow label={t('fields.customerRfc')} value={values.customerRfc} />
                  ) : null}
                </ReviewBlock>

                <ReviewBlock
                  title={t('shippingSectionTitle')}
                  actionLabel={t('reviewEdit')}
                  onAction={() => setStep('shipping')}
                >
                  <ReviewRow label={t('fields.shippingStreet')} value={values.shippingStreet} />
                  <ReviewRow label={t('fields.shippingCity')} value={values.shippingCity} />
                  <ReviewRow label={t('fields.shippingState')} value={values.shippingState} />
                  <ReviewRow label={t('fields.shippingZip')} value={values.shippingZip} />
                  {values.shippingReferences ? (
                    <ReviewRow
                      label={t('fields.shippingReferences')}
                      value={values.shippingReferences}
                    />
                  ) : null}
                </ReviewBlock>

                <ReviewBlock
                  title={t('deliverySectionTitle')}
                  actionLabel={t('reviewEdit')}
                  onAction={() => setStep('shipping')}
                >
                  <ReviewRow label={deliveryModeLabel} value={deliveryLabel} />
                </ReviewBlock>

                <ReviewBlock title={t('reviewItemsTitle')}>
                  <ul className="divide-y divide-border-subtle border-y border-border-subtle">
                    {state.lines.map((line) => (
                      <li
                        key={line.productId}
                        className="flex items-center justify-between gap-3 py-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            aria-hidden="true"
                            className="product-ph shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                          >
                            <MaskArt
                              maskStyle={line.maskStyle}
                              accentColor={line.accentColor}
                              className="w-[72%] h-[72%]"
                            />
                          </span>

                          <div className="min-w-0">
                            <p className="text-sm text-white line-clamp-2">{line.title}</p>
                            <p className="text-xs text-text-faint">
                              {line.quantity} × {formatMXN(line.priceMXN)}
                            </p>
                          </div>
                        </div>

                        <span className="shrink-0 text-sm font-semibold text-white">
                          {formatMXN(line.priceMXN * line.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </ReviewBlock>
              </div>
            </section>
          ) : (
            <section className={CARD_CLASS}>
              <h2 id={`${groupId}-payment`} className={SECTION_TITLE_CLASS}>
                {t('paymentSectionTitle')}
              </h2>

              <div
                role="radiogroup"
                aria-labelledby={`${groupId}-payment`}
                className="flex flex-col gap-3"
              >
                {paymentOptions.map((option) => (
                  <OptionCard
                    key={option.id}
                    name="paymentMethod"
                    value={option.id}
                    selected={paymentMethod === option.id}
                    onSelect={setPaymentMethod}
                    icon={PAYMENT_ICONS[option.icon]}
                    label={t(`payments.${option.labelKey}`)}
                    description={t(`payments.${option.descriptionKey}`)}
                  />
                ))}
              </div>

              {/* En este paso el resumen vive dentro del mismo cuadro: el pedido
                  se cierra con un único botón de pago. */}
              <div className="mt-6 border-t border-border-subtle pt-6">
                <CheckoutSummary
                  subtotalMXN={state.subtotalMXN}
                  shippingMXN={shippingMXN}
                  totalMXN={totalMXN}
                  deliveryMethod={deliveryMethod}
                />
              </div>

              {errorKey ? (
                <p
                  role="alert"
                  className="mt-6 rounded-2xl border border-accent-red/40 bg-accent-red/10 px-4 py-3 text-xs leading-relaxed text-white"
                >
                  {t(`errors.${errorKey}`)}
                </p>
              ) : null}

              <div className="mt-6">
                {paymentMethod === 'mercado_pago' ? (
                  <Button
                    type="button"
                    variant="mercadoPago"
                    size="lg"
                    fullWidth
                    disabled={isSubmitting}
                    onClick={() => void submitOrder()}
                  >
                    {isSubmitting ? (
                      processingMessage
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        {t('payWith')}
                        <MercadoPagoMark />
                      </span>
                    )}
                  </Button>
                ) : paymentMethod === 'transferencia' ? (
                  <Button
                    as="link"
                    href={transferenciaWhatsappHref}
                    target="_blank"
                    rel="noreferrer noopener"
                    variant="primary"
                    size="lg"
                    fullWidth
                    leftIcon={<MessageSquare {...FIELD_ICON_PROPS} aria-hidden="true" />}
                  >
                    {t('transferencia.payCta')}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={isSubmitting}
                    onClick={() => void submitOrder()}
                  >
                    {isSubmitting ? processingMessage : t('submit')}
                  </Button>
                )}
              </div>
            </section>
          )}
        </div>

        {/* En el paso de pago el resumen y el botón viven dentro de la tarjeta
            de método de pago, así que aquí no se repite el panel lateral. */}
        {step === 'payment' ? null : (
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

            {step === 'shipping' && deliveryMode === 'entrega-personal' ? (
              <>
                <Button as="link" href={CART_PATH} variant="secondary" size="md" fullWidth>
                  {t('backToCart')}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  fullWidth
                  onClick={() => setStep('details')}
                >
                  {t('back')}
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={
                    step === 'details'
                      ? goToPayment
                      : step === 'shipping'
                        ? goToReview
                        : () => setStep('payment')
                  }
                >
                  {t('next')}
                </Button>

                <Button as="link" href={CART_PATH} variant="secondary" size="md" fullWidth>
                  {t('backToCart')}
                </Button>

                {step === 'details' ? null : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="md"
                    fullWidth
                    onClick={() => setStep(step === 'shipping' ? 'details' : 'shipping')}
                  >
                    {t('back')}
                  </Button>
                )}
              </>
            )}
          </aside>
        )}
      </form>

      {isSubmitting ? <CheckoutProcessing message={processingMessage} /> : null}
    </>
  );
}

interface StepIndicatorProps {
  /** Paso activo. */
  readonly current: CheckoutStep;
  /** Etiqueta visible de cada paso, por id. */
  readonly labels: Record<CheckoutStep, string>;
  readonly progressLabel: string;
}

/** Rastro del avance del checkout: qué paso se ve y cuántos faltan. */
function StepIndicator({ current, labels, progressLabel }: StepIndicatorProps) {
  const currentIndex = CHECKOUT_STEPS.indexOf(current) + 1;

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-text-faint">
        {progressLabel}
      </p>

      <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {CHECKOUT_STEPS.map((id, position) => {
          const index = position + 1;
          const isActive = index === currentIndex;
          const isDone = index < currentIndex;

          return (
            <li key={id} className="flex items-center gap-3">
              {position > 0 ? (
                <span aria-hidden="true" className="h-px w-6 bg-border-subtle sm:w-10" />
              ) : null}

              <span
                className={cn(
                  'inline-flex items-center gap-2 text-sm',
                  isActive ? 'text-white' : 'text-text-muted',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold',
                    isActive || isDone
                      ? 'border-accent-green text-accent-green'
                      : 'border-border-subtle text-text-muted',
                    isActive ? 'bg-accent-green/15' : null,
                  )}
                >
                  {index}
                </span>
                <span className="font-medium">{labels[id]}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

interface ReviewBlockProps {
  readonly title: string;
  /** Acción para regresar a corregir el bloque; sin ella solo se muestra. */
  readonly actionLabel?: string;
  readonly onAction?: () => void;
  readonly children: ReactNode;
}

/** Bloque del paso de revisión: título, atajo para editar y el dato en sí. */
function ReviewBlock({ title, actionLabel, onAction, children }: ReviewBlockProps) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-canvas p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-faint">
          {title}
        </h3>

        {actionLabel && onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="text-xs font-semibold text-accent-green underline-offset-4 hover:underline focus-visible:underline"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

interface ReviewRowProps {
  readonly label: string;
  readonly value: string;
}

/** Par etiqueta/valor dentro de un bloque de la revisión. */
function ReviewRow({ label, value }: ReviewRowProps) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
      <span className="text-xs text-text-muted">{label}</span>
      <span className="text-sm text-white sm:text-right">{value}</span>
    </div>
  );
}

interface CheckoutProcessingProps {
  readonly message: string;
}

/** Bloqueo con indicador mientras el pedido viaja al servidor. */
function CheckoutProcessing({ message }: CheckoutProcessingProps) {
  return (
    <div
      role="status"
      aria-live="assertive"
      className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/85 px-4 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-4 rounded-[1.5rem] border border-border-subtle bg-surface px-10 py-12 text-center shadow-card">
        <Spinner size={40} className="text-accent-green" />
        <p className="font-display text-lg text-white">{message}</p>
      </div>
    </div>
  );
}

interface OptionCardProps<TValue extends string> {
  readonly name: string;
  readonly value: TValue;
  readonly selected: boolean;
  readonly onSelect: (value: TValue) => void;
  readonly icon: LucideIcon;
  readonly label: string;
  readonly description: string;
  /** Texto opcional a la derecha del nombre (ej. la tarifa de envío). */
  readonly trailing?: string;
}

/** Tarjeta seleccionable; el radio real queda oculto tras la etiqueta. */
function OptionCard<TValue extends string>({
  name,
  value,
  selected,
  onSelect,
  icon: Icon,
  label,
  description,
  trailing,
}: OptionCardProps<TValue>) {
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
        name={name}
        value={value}
        checked={selected}
        onChange={() => onSelect(value)}
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
          <span className="text-sm font-semibold text-white">{label}</span>
          {trailing === undefined ? null : (
            <span
              className={cn(
                'shrink-0 text-xs font-semibold',
                selected ? 'text-accent-green' : 'text-text-muted',
              )}
            >
              {trailing}
            </span>
          )}
        </span>
        <span className="text-xs leading-relaxed text-text-muted">{description}</span>
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
