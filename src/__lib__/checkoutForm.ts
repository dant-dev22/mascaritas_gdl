import { REQUIRED_CHECKOUT_FIELDS } from '@/__data__/checkoutForm';
import type {
  CartLine,
  CheckoutFieldName,
  CheckoutFormErrors,
  CheckoutFormValues,
  CheckoutRequestInput,
  DeliveryMethod,
  PaymentMethod,
} from '@/__types__';

/** Forma mínima de correo que acepta el backend. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida el formulario de envío. Es un límite del sistema: todo lo que escribe
 * la persona pasa por aquí antes de viajar al backend.
 */
export function validateCheckoutForm(values: CheckoutFormValues): CheckoutFormErrors {
  const errors: CheckoutFormErrors = {};

  for (const field of REQUIRED_CHECKOUT_FIELDS) {
    if (values[field].trim().length === 0) errors[field] = 'required';
  }

  const email = values.customerEmail.trim();
  if (email.length > 0 && !EMAIL_PATTERN.test(email)) errors.customerEmail = 'email';

  return errors;
}

/** Convierte los valores del formulario en el cuerpo que espera el backend. */
export function toCheckoutRequest(
  values: CheckoutFormValues,
  lines: ReadonlyArray<CartLine>,
  deliveryMethod: DeliveryMethod,
  paymentMethod: PaymentMethod,
): CheckoutRequestInput {
  return {
    customerName: values.customerName.trim(),
    customerContact: values.customerContact.trim(),
    customerEmail: toOptional(values.customerEmail),
    customerRfc: toOptional(values.customerRfc),
    deliveryMethod,
    // La pareja modalidad/método la valida el formulario antes de llegar aquí.
    paymentMethod,
    shippingStreet: values.shippingStreet.trim(),
    shippingCity: values.shippingCity.trim(),
    shippingState: values.shippingState.trim(),
    shippingZip: values.shippingZip.trim(),
    shippingReferences: toOptional(values.shippingReferences),
    // El checkout de la tienda ya no captura nota: se manda `null`.
    note: null,
    // El precio nunca viaja desde el navegador: lo recalcula el servidor.
    items: lines.map((line) => ({ productId: line.productId, quantity: line.quantity })),
  };
}

/** Quita el error de un campo en cuanto la persona lo corrige. */
export function clearFieldError(
  errors: CheckoutFormErrors,
  field: CheckoutFieldName,
): CheckoutFormErrors {
  if (!(field in errors)) return errors;

  const next = { ...errors };
  delete next[field];
  return next;
}

/** El backend espera `null` en los opcionales vacíos, no cadenas vacías. */
function toOptional(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
