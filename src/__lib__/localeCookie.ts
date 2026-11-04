import {
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_COOKIE_NAME,
  routing,
  type Locale,
} from '@/i18n/routing';

/** Evento que se emite al persistir la elección de idioma (para reaccionar sin recargar). */
export const LOCALE_CHANGE_EVENT = 'mascaritas:locale-change';

/** Lee la cookie de idioma. Devuelve `null` si no existe o no es válida. */
export function readLocaleCookie(): Locale | null {
  if (typeof document === 'undefined') return null;

  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${LOCALE_COOKIE_NAME}=([^;]+)`),
  );
  const value = match?.[1];

  return value && (routing.locales as ReadonlyArray<string>).includes(value)
    ? (value as Locale)
    : null;
}

/** Persiste la elección de idioma durante un año y avisa a quien escuche el cambio. */
export function writeLocaleCookie(locale: Locale): void {
  if (typeof document === 'undefined') return;

  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent(LOCALE_CHANGE_EVENT));
}

/** Suscripción a los cambios de idioma, apta para `useSyncExternalStore`. */
export function subscribeLocaleCookie(listener: () => void): () => void {
  window.addEventListener(LOCALE_CHANGE_EVENT, listener);

  return () => {
    window.removeEventListener(LOCALE_CHANGE_EVENT, listener);
  };
}
