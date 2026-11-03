import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { locale as getLocale } from 'next/root-params';
import { routing } from './routing';

/**
 * Configuración de la petición para `next-intl`.
 * El idioma se lee del segmento raíz `[locale]` vía `next/root-params`,
 * lo que permite mantener el render estático con `cacheComponents`.
 */
export default getRequestConfig(async () => {
  const requested = await getLocale();
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
