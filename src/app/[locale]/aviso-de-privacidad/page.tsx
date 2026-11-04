import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LegalPage } from '@/components/legal/LegalPage';
import { PRIVACY_DOCUMENT } from '@/__data__/legalPrivacy';
import { buildAlternates } from '@/__lib__/seo';
import type { Locale } from '@/i18n/routing';

const PATHNAME = '/aviso-de-privacidad';

interface PageProps {
  readonly params: Promise<{ readonly locale: Locale }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Legal.meta' });

  return {
    title: t('privacyTitle'),
    description: t('privacyDescription'),
    alternates: buildAlternates(locale, PATHNAME),
  };
}

export default async function AvisoDePrivacidadPage({ params }: PageProps) {
  const { locale } = await params;

  return <LegalPage locale={locale} document={PRIVACY_DOCUMENT} breadcrumbKey="legalPrivacy" />;
}
