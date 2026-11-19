import type { CheckoutFieldName, CheckoutFormValues } from '@/__types__';

/** Estado inicial del formulario de envío. */
export const EMPTY_CHECKOUT_FORM: CheckoutFormValues = {
  customerName: '',
  customerContact: '',
  customerEmail: '',
  shippingStreet: '',
  shippingCity: '',
  shippingState: '',
  shippingZip: '',
  shippingReferences: '',
};

/** Campos obligatorios, en el orden en que aparecen en el formulario. */
export const REQUIRED_CHECKOUT_FIELDS: ReadonlyArray<CheckoutFieldName> = [
  'customerName',
  'customerContact',
  'shippingStreet',
  'shippingCity',
  'shippingState',
  'shippingZip',
];

/** Largo máximo por campo. Espejo de los límites de `CheckoutRequest`. */
export const CHECKOUT_FIELD_LIMITS: Record<CheckoutFieldName, number> = {
  customerName: 120,
  customerContact: 160,
  customerEmail: 160,
  shippingStreet: 160,
  shippingCity: 96,
  shippingState: 96,
  shippingZip: 12,
  shippingReferences: 255,
};
