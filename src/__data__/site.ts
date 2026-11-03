import type { Locale } from '@/i18n/routing';

/** URL canónica del sitio en producción, sin barra final. */
export const SITE_URL = 'https://mascaritasgdl.com';

/** Valor `hreflang` por idioma para los enlaces alternativos (`<link rel="alternate">`). */
export const LOCALE_HREFLANG: Record<Locale, string> = {
  es: 'es-MX',
  en: 'en',
};

/** Código `og:locale` por idioma (formato `idioma_PAÍS`). */
export const OG_LOCALE: Record<Locale, string> = {
  es: 'es_MX',
  en: 'en_US',
};
