import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CatalogView } from '@/components/catalog/CatalogView';
import { CatalogSkeleton } from '@/components/catalog/CatalogSkeleton';
import { buildAlternates } from '@/__lib__/seo';
import type { Locale } from '@/i18n/routing';

interface CatalogoPageProps {
  readonly params: Promise<{ readonly locale: Locale }>;
}

export async function generateMetadata({ params }: CatalogoPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: t('catalogTitle'),
    description: t('catalogDescription'),
    alternates: buildAlternates(locale, '/catalogo'),
  };
}

export default function CatalogoPage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="contenido-principal" className="flex-1 flex flex-col">
        {/* `CatalogView` lee los filtros de la URL vía `useSearchParams`. */}
        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogView />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
