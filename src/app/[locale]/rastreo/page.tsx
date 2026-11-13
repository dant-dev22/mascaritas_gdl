import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { OrderTracker } from '@/components/order/OrderTracker';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Skeleton } from '@/components/ui/Skeleton';
import { buildAlternates } from '@/__lib__/seo';
import type { Locale } from '@/i18n/routing';

interface RastreoPageProps {
  readonly params: Promise<{ readonly locale: Locale }>;
}

export async function generateMetadata({ params }: RastreoPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: t('trackingTitle'),
    description: t('trackingDescription'),
    alternates: buildAlternates(locale, '/rastreo'),
  };
}

/** Esqueleto del formulario y del resultado mientras se resuelve el código. */
function TrackingFallback() {
  return (
    <>
      <Skeleton className="h-44 w-full" />
      <Skeleton className="mt-8 h-32 w-full" />
    </>
  );
}

export default async function RastreoPage({ params }: RastreoPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tracking' });

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="contenido-principal" className="flex-1 flex flex-col">
        <section className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <Breadcrumbs
            items={[{ label: t('breadcrumbHome'), href: '/' }, { label: t('breadcrumbCurrent') }]}
            className="mb-6"
          />

          <header className="mb-8 max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent-green">
              {t('hero.eyebrow')}
            </p>
            <h1 className="mb-3 font-display text-display-lg text-balance text-white">
              {t('hero.title')}
            </h1>
            <p className="text-base leading-relaxed text-text-muted sm:text-lg">
              {t('hero.description')}
            </p>
          </header>

          {/* `OrderTracker` lee el código de la URL vía `useSearchParams`. */}
          <Suspense fallback={<TrackingFallback />}>
            <OrderTracker />
          </Suspense>
        </section>
      </main>
      <Footer />
    </>
  );
}
