import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { CartProvider } from '@/components/providers/CartProvider';
import { LanguageGate } from '@/components/layout/LanguageGate';
import { CookieBanner } from '@/components/layout/CookieBanner';
import { HTML_LANG, routing, type Locale } from '@/i18n/routing';
import { OG_LOCALE, SITE_URL } from '@/__data__/site';
import '../globals.css';

interface LocaleLayoutProps {
  readonly children: React.ReactNode;
  readonly params: Promise<{ readonly locale: string }>;
}

/** Prerenderizamos una entrada por idioma (requerido por `cacheComponents`). */
export function generateStaticParams(): { locale: Locale }[] {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  // Normalizamos el idioma a la unión `Locale` para poder indexar tablas por idioma.
  const activeLocale: Locale = hasLocale(routing.locales, locale)
    ? locale
    : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  const siteName = tCommon('brandName');
  const description = t('description');

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('titleDefault'),
      template: t('titleTemplate'),
    },
    description,
    applicationName: siteName,
    keywords: t.raw('keywords') as string[],
    authors: [{ name: siteName }],
    creator: siteName,
    openGraph: {
      type: 'website',
      locale: OG_LOCALE[activeLocale],
      title: siteName,
      description,
      siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: siteName,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // El segmento `[locale]` actúa como catch-all: valida que el idioma exista.
  if (!hasLocale(routing.locales, locale)) notFound();

  const tA11y = await getTranslations('a11y');

  return (
    <html lang={HTML_LANG[locale]} className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-canvas text-white font-sans">
        <a
          href="#contenido-principal"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100]
                     focus:touch-target focus:px-4 focus:rounded-xl
                     focus:bg-accent-green focus:text-white focus:shadow-glow-green"
        >
          {tA11y('skipToContent')}
        </a>
        <NextIntlClientProvider>
          <CartProvider>{children}</CartProvider>
          <LanguageGate />
          <CookieBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
