import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LegalPage } from '@/components/legal/LegalPage';
import { COOKIES_DOCUMENT } from '@/__data__/legalCookies';
import { buildAlternates } from '@/__lib__/seo';
import type { Locale } from '@/i18n/routing';

const PATHNAME = '/politica-de-cookies';

interface PageProps {
  readonly params: Promise<{ readonly locale: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Legal.meta' });

  return {
    title: t('cookiesTitle'),
    description: t('cookiesDescription'),
    alternates: buildAlternates(locale, PATHNAME),
  };
}

export default async function PoliticaDeCookiesPage({ params }: PageProps) {
  const { locale } = await params;

  return <LegalPage locale={locale} document={COOKIES_DOCUMENT} breadcrumbKey="legalCookies" />;
}
