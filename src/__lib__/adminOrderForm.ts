import type {
  AdminOrder,
  AdminOrderFormErrors,
  AdminOrderFormValues,
  AdminOrderInput,
} from '@/__types__';

/** Límites que aplica el backend (`OrderWrite` en `schemas.py`). */
const MAX_NAME_LENGTH = 120;
const MAX_CONTACT_LENGTH = 160;
const MAX_TRACKING_LENGTH = 64;
const MAX_NOTE_LENGTH = 255;

export function createEmptyOrderValues(): AdminOrderFormValues {
  return {
    customerName: '',
    customerContact: '',
    carrier: '',
    trackingNumber: '',
    status: 'recibido',
    note: '',
    internalNotes: '',
  };
}

/**
 * Convierte un pedido existente en valores de formulario. El comentario del
 * hito arranca vacío: cada guardado añade una nota nueva al historial.
 */
export function toOrderFormValues(order: AdminOrder): AdminOrderFormValues {
  return {
    customerName: order.customerName,
    customerContact: order.customerContact ?? '',
    carrier: order.carrier ?? '',
    trackingNumber: order.trackingNumber ?? '',
    status: order.status,
    note: '',
    internalNotes: order.internalNotes ?? '',
  };
}

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

function isTooLong(value: string, maxLength: number): boolean {
  return value.trim().length > maxLength;
}

/**
 * Valida el formulario con las mismas reglas que el backend.
 * Devuelve un mapa de códigos de error; el componente los traduce.
 */
export function validateOrderForm(values: AdminOrderFormValues): AdminOrderFormErrors {
  const errors: AdminOrderFormErrors = {};

  if (isBlank(values.customerName)) {
    errors.customerName = 'required';
  } else if (isTooLong(values.customerName, MAX_NAME_LENGTH)) {
    errors.customerName = 'tooLong';
  }

  if (isTooLong(values.customerContact, MAX_CONTACT_LENGTH)) {
    errors.customerContact = 'tooLong';
  }

  if (isTooLong(values.trackingNumber, MAX_TRACKING_LENGTH)) {
    errors.trackingNumber = 'tooLong';
  }

  if (isTooLong(values.note, MAX_NOTE_LENGTH)) {
    errors.note = 'tooLong';
  }

  return errors;
}

/** Texto opcional: `null` cuando el campo viene vacío. */
function optional(value: string): string | null {
  return isBlank(value) ? null : value.trim();
}

/** Traduce los valores del formulario al cuerpo que espera el backend. */
export function toOrderInput(values: AdminOrderFormValues): AdminOrderInput {
  return {
    customerName: values.customerName.trim(),
    customerContact: optional(values.customerContact),
    carrier: optional(values.carrier),
    trackingNumber: optional(values.trackingNumber),
    status: values.status,
    note: optional(values.note),
    internalNotes: optional(values.internalNotes),
  };
}
