import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LegalPage } from '@/components/legal/LegalPage';
import { TERMS_DOCUMENT } from '@/__data__/legalTerms';
import { buildAlternates } from '@/__lib__/seo';
import type { Locale } from '@/i18n/routing';

const PATHNAME = '/terminos-y-condiciones';

interface PageProps {
  readonly params: Promise<{ readonly locale: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Legal.meta' });

  return {
    title: t('termsTitle'),
    description: t('termsDescription'),
    alternates: buildAlternates(locale, PATHNAME),
  };
}

export default async function TerminosYCondicionesPage({ params }: PageProps) {
  const { locale } = await params;

  return <LegalPage locale={locale} document={TERMS_DOCUMENT} breadcrumbKey="legalTerms" />;
}
