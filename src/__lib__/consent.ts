import {
  CONSENT_CHANGE_EVENT,
  CONSENT_COOKIE_NAME,
  CONSENT_MAX_AGE,
  CONSENT_VERSION,
} from '@/__data__/consent';
import type {
  ConsentCategories,
  ConsentCategoryId,
  ConsentDecision,
  ConsentRecord,
} from '@/__types__';

/** Suscriptores locales para que la UI reaccione sin recargar la página. */
const listeners = new Set<() => void>();

/** Valida que un valor desconocido se ajuste a la forma de `ConsentRecord`. */
function isConsentRecord(value: unknown): value is ConsentRecord {
  if (typeof value !== 'object' || value === null) return false;

  const record = value as Partial<ConsentRecord>;
  const categories = record.categories as Partial<ConsentCategories> | undefined;

  return (
    typeof record.version === 'number' &&
    typeof record.updatedAt === 'string' &&
    typeof categories === 'object' &&
    categories !== null &&
    typeof categories.necessary === 'boolean' &&
    typeof categories.analytics === 'boolean' &&
    typeof categories.marketing === 'boolean'
  );
}

/** Serializa el registro para guardarlo en la cookie. */
function encodeConsent(record: ConsentRecord): string {
  return encodeURIComponent(JSON.stringify(record));
}

/**
 * Devuelve la cadena cruda de la cookie de consentimiento.
 * Es un valor estable (string) apto para `useSyncExternalStore`.
 */
export function readConsentRaw(): string | null {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE_NAME}=([^;]*)`),
  );

  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

/**
 * Convierte la cadena cruda en un `ConsentRecord` válido.
 * Devuelve `null` si falta, está corrupto o corresponde a una versión obsoleta
 * del aviso (en ese caso volvemos a preguntar).
 */
export function parseConsent(raw: string | null): ConsentRecord | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!isConsentRecord(parsed) || parsed.version !== CONSENT_VERSION) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

/** Consentimiento vigente, o `null` si todavía no hay una decisión válida. */
export function readConsent(): ConsentRecord | null {
  return parseConsent(readConsentRaw());
}

/** Verdadero si la categoría consultada está permitida. */
export function hasConsent(
  category: ConsentCategoryId,
  record: ConsentRecord | null = readConsent(),
): boolean {
  if (category === 'necessary') return true;

  return record?.categories[category] === true;
}

/** Avisa a los suscriptores y emite un evento para integraciones externas. */
function notify(): void {
  for (const listener of listeners) listener();

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(CONSENT_CHANGE_EVENT, { detail: readConsent() }),
    );
  }
}

/** Suscripción para `useSyncExternalStore`. */
export function subscribeConsent(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

/**
 * Persiste la decisión con su versión y fecha. `necessary` se fuerza a `true`
 * para que el registro siempre sea coherente.
 */
export function saveConsent(
  decision: ConsentDecision,
  categories: ConsentCategories,
): ConsentRecord {
  const record: ConsentRecord = {
    version: CONSENT_VERSION,
    decision,
    categories: {
      necessary: true,
      analytics: categories.analytics,
      marketing: categories.marketing,
    },
    updatedAt: new Date().toISOString(),
  };

  if (typeof document !== 'undefined') {
    document.cookie = `${CONSENT_COOKIE_NAME}=${encodeConsent(record)}; path=/; max-age=${CONSENT_MAX_AGE}; SameSite=Lax`;
  }

  notify();
  return record;
}
