import type { Locale } from '@/i18n/routing';

/** Detecta si el valor ya trae zona horaria (`Z` o un desplazamiento `±hh:mm`). */
const TIMEZONE_PATTERN = /(?:Z|[+-]\d{2}:?\d{2})$/i;

const INTL_LOCALE: Record<Locale, string> = {
  es: 'es-MX',
  en: 'en-US',
};

/**
 * El backend serializa las fechas en UTC sin sufijo de zona
 * (`2026-11-05T12:34:56`). `new Date()` las leería como hora local, así que
 * añadimos la `Z` cuando no viene zona para interpretarlas como UTC.
 */
export function parseUtcDate(value: string): Date {
  return new Date(TIMEZONE_PATTERN.test(value) ? value : `${value}Z`);
}

/** Formatea una fecha en el idioma del sitio y la zona horaria del visitante. */
export function formatDateTime(value: string, locale: Locale): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parseUtcDate(value));
}
