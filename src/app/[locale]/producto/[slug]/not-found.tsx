import { getTranslations } from 'next-intl/server';
import { ArrowLeft, Store } from 'lucide-react';
import { CATALOG_PATH } from '@/__lib__/catalogUrl';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button, BUTTON_ICON_PROPS } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export default async function ProductNotFound() {
  const t = await getTranslations('product');

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main
        id="contenido-principal"
        className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24"
      >
        <EmptyState
          className="max-w-2xl"
          title={t('notFound.title')}
          description={t('notFound.description')}
          action={
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <Button
                as="link"
                href={CATALOG_PATH}
                variant="primary"
                size="lg"
                leftIcon={<Store {...BUTTON_ICON_PROPS} aria-hidden="true" />}
              >
                {t('notFound.ctaCatalog')}
              </Button>
              <Button
                as="link"
                href="/"
                variant="secondary"
                size="lg"
                leftIcon={<ArrowLeft {...BUTTON_ICON_PROPS} aria-hidden="true" />}
              >
                {t('notFound.ctaHome')}
              </Button>
            </div>
          }
        />
      </main>
      <Footer />
    </>
  );
}
