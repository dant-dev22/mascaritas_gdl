import type { ConsentCategories, ConsentCategoryDefinition } from '@/__types__';

/** Nombre de la cookie donde guardamos la decisión (JSON codificado). */
export const CONSENT_COOKIE_NAME = 'mascaritas_consent';

/** Versión del aviso. Al subirla se vuelve a preguntar a quien ya había elegido. */
export const CONSENT_VERSION = 1;

/** ~6 meses: caducidad recomendada para renovar el consentimiento (criterio CNIL). */
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 183;

/** Retraso antes de mostrar el banner para no competir con la carga inicial. */
export const CONSENT_BANNER_DELAY_MS = 2000;

/** Evento que se emite al guardar la decisión (integrable con analítica y píxeles). */
export const CONSENT_CHANGE_EVENT = 'mascaritas:consent-change';

/** Evento para reabrir el panel; equivale a retirar o revisar el consentimiento. */
export const CONSENT_OPEN_EVENT = 'mascaritas:open-consent';

/** Categorías mostradas en el panel, en orden de aparición. */
export const CONSENT_CATEGORIES: ReadonlyArray<ConsentCategoryDefinition> = [
  {
    id: 'necessary',
    labelKey: 'categories.necessary.label',
    descriptionKey: 'categories.necessary.description',
    required: true,
  },
  {
    id: 'analytics',
    labelKey: 'categories.analytics.label',
    descriptionKey: 'categories.analytics.description',
    required: false,
  },
  {
    id: 'marketing',
    labelKey: 'categories.marketing.label',
    descriptionKey: 'categories.marketing.description',
    required: false,
  },
];

/** Estado inicial: solo lo imprescindible, sin casillas premarcadas (requisito GDPR). */
export const DEFAULT_CONSENT_CATEGORIES: ConsentCategories = {
  necessary: true,
  analytics: false,
  marketing: false,
};
