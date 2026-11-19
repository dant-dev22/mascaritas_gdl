import type { DeliveryMethod, DeliveryMode, ShippingIcon } from '@/__types__';

/**
 * Tarifas y modalidades de entrega. Espejo de `app/order_data.py` en el
 * backend: si cambia una tarifa allá, cámbiala también aquí.
 */

/** Modalidades disponibles, en el orden en que se muestran. */
export const DELIVERY_METHODS: ReadonlyArray<DeliveryMethod> = ['zmg', 'correos', 'paqueteria'];

export const DEFAULT_DELIVERY_METHOD: DeliveryMethod = 'correos';

/** Primera decisión del paso de envío; por defecto se ofrece envío a domicilio. */
export const DEFAULT_DELIVERY_MODE: DeliveryMode = 'envio';

/** Tarifa fija por modalidad. La paquetería privada se cotiza por WhatsApp. */
export const SHIPPING_RATE_MXN: Record<DeliveryMethod, number | null> = {
  zmg: 50,
  correos: 80,
  paqueteria: null,
};

export const FREE_SHIPPING_THRESHOLD_MXN = 999;

/** Solo Correos de México regala el envío a partir del umbral. */
export const FREE_SHIPPING_METHODS: ReadonlyArray<DeliveryMethod> = ['correos'];

/** Tarifa de envío en MXN, o `null` cuando hay que cotizarla por WhatsApp. */
export function resolveShippingMXN(method: DeliveryMethod, subtotalMXN: number): number | null {
  if (method === 'paqueteria') return null;
  if (FREE_SHIPPING_METHODS.includes(method) && subtotalMXN >= FREE_SHIPPING_THRESHOLD_MXN) {
    return 0;
  }
  return SHIPPING_RATE_MXN[method];
}

/** Verdadero si el valor corresponde a una modalidad soportada. */
export function isDeliveryMethod(value: string | null | undefined): value is DeliveryMethod {
  return (DELIVERY_METHODS as ReadonlyArray<string>).includes(value ?? '');
}

export interface ShippingMethodOption {
  readonly id: DeliveryMethod;
  /** Clave del namespace `checkout.methods` con el nombre visible. */
  readonly labelKey: string;
  /** Clave del namespace `checkout.methods` con la descripción visible. */
  readonly descriptionKey: string;
  readonly icon: ShippingIcon;
}

export const SHIPPING_METHOD_OPTIONS: ReadonlyArray<ShippingMethodOption> = [
  { id: 'zmg', labelKey: 'zmg', descriptionKey: 'zmgDescription', icon: 'map-pin' },
  { id: 'correos', labelKey: 'correos', descriptionKey: 'correosDescription', icon: 'truck' },
  {
    id: 'paqueteria',
    labelKey: 'paqueteria',
    descriptionKey: 'paqueteriaDescription',
    icon: 'package',
  },
];

/**
 * Paqueterías que se ofrecen cuando se eligió envío a domicilio. Excluye la
 * entrega personal en la ZMG: esa rama se resuelve por WhatsApp.
 */
export const CARRIER_OPTIONS: ReadonlyArray<ShippingMethodOption> = SHIPPING_METHOD_OPTIONS.filter(
  (option) => option.id !== 'zmg',
);

export interface DeliveryModeOption {
  readonly id: DeliveryMode;
  /** Clave del namespace `checkout.deliveryModes` con el nombre visible. */
  readonly labelKey: string;
  /** Clave del namespace `checkout.deliveryModes` con la descripción visible. */
  readonly descriptionKey: string;
  readonly icon: ShippingIcon;
}

/** Modalidades de primer nivel del paso de envío, en orden. */
export const DELIVERY_MODE_OPTIONS: ReadonlyArray<DeliveryModeOption> = [
  { id: 'envio', labelKey: 'envio', descriptionKey: 'envioDescription', icon: 'truck' },
  {
    id: 'entrega-personal',
    labelKey: 'entregaPersonal',
    descriptionKey: 'entregaPersonalDescription',
    icon: 'map-pin',
  },
];
