import { LOCALE_HREFLANG, SITE_URL } from '@/__data__/site';
import type { Locale } from '@/i18n/routing';

/**
 * Concatena la URL del sitio con una ruta, garantizando exactamente una barra
 * entre ambas. `absoluteUrl('/')` devuelve la raíz del sitio.
 */
export function absoluteUrl(pathname: string): string {
  // Colapsamos las barras iniciales para no generar `//` al unir con el dominio.
  const normalized = `/${pathname.replace(/^\/+/, '')}`;
  return `${SITE_URL}${normalized}`;
}

/**
 * Genera el mapa de enlaces alternativos (`hreflang`) para una ruta sin prefijo
 * de idioma. `x-default` apunta a la versión en español (idioma por defecto).
 *
 * @param pathnameWithoutLocale Ruta sin idioma: `''`, `'/catalogo'`, `'/producto/<slug>'`.
 */
export function buildLanguageAlternates(
  pathnameWithoutLocale: string,
): Record<string, string> {
  const languages: Record<string, string> = {};

  for (const [locale, hreflang] of Object.entries(LOCALE_HREFLANG)) {
    languages[hreflang] = absoluteUrl(`/${locale}${pathnameWithoutLocale}`);
  }

  languages['x-default'] = absoluteUrl(`/es${pathnameWithoutLocale}`);

  return languages;
}

/**
 * Construye el objeto `alternates` para `generateMetadata`.
 *
 * El `canonical` es autorreferente: apunta a la misma página en su propio
 * idioma. Si apuntara siempre al español, Google trataría la versión inglesa
 * como contenido duplicado y no la posicionaría.
 *
 * @param locale Idioma de la página que se está renderizando.
 * @param pathnameWithoutLocale Ruta sin prefijo de idioma: `''`, `'/catalogo'`,
 *   `'/producto/<slug>'`.
 */
export function buildAlternates(
  locale: Locale,
  pathnameWithoutLocale: string,
): {
  canonical: string;
  languages: Record<string, string>;
} {
  return {
    canonical: absoluteUrl(`/${locale}${pathnameWithoutLocale}`),
    languages: buildLanguageAlternates(pathnameWithoutLocale),
  };
}
