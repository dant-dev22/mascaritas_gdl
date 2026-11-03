import { defineRouting } from 'next-intl/routing';

/** Nombre de la cookie que recuerda el idioma elegido por la persona. */
export const LOCALE_COOKIE_NAME = 'mascaritas_lang';

/** Un año en segundos. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Configuración de enrutamiento por idioma.
 * `localePrefix: 'always'` obliga a que toda URL lleve su prefijo (`/es/...`, `/en/...`).
 */
export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'always',
  localeCookie: {
    name: LOCALE_COOKIE_NAME,
    sameSite: 'lax',
    path: '/',
  },
});

export type Locale = (typeof routing.locales)[number];

/** Verdadero si el valor corresponde a un idioma soportado. */
export function isLocale(value: string | null | undefined): value is Locale {
  return (routing.locales as ReadonlyArray<string>).includes(value ?? '');
}

/** Normaliza un valor arbitrario al idioma activo, con el por defecto como respaldo. */
export function resolveLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : routing.defaultLocale;
}

/** Valor del atributo `lang` del documento por idioma. */
export const HTML_LANG: Record<Locale, string> = {
  es: 'es-MX',
  en: 'en',
};
