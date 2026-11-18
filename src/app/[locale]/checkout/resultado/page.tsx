import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PaymentResult } from '@/components/checkout/PaymentResult';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Skeleton } from '@/components/ui/Skeleton';
import { buildAlternates } from '@/__lib__/seo';
import type { Locale } from '@/i18n/routing';

interface PaymentResultPageProps {
  readonly params: Promise<{ readonly locale: Locale }>;
}

export async function generateMetadata({
  params,
}: PaymentResultPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: t('paymentResultTitle'),
    description: t('paymentResultDescription'),
    alternates: buildAlternates(locale, '/checkout/resultado'),
    // Pantalla de cierre de un pago concreto: no hay nada que indexar.
    robots: { index: false, follow: false },
  };
}

export default async function PaymentResultPage({ params }: PaymentResultPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'paymentResult' });

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
            <h1 className="font-display text-display-lg text-balance text-white">{t('title')}</h1>
            <p className="mt-3 text-base leading-relaxed text-text-muted sm:text-lg">
              {t('description')}
            </p>
          </header>

          {/* `PaymentResult` lee el código del pedido de la URL. */}
          <Suspense fallback={<Skeleton className="h-80 w-full" rounded="rounded-[1.5rem]" />}>
            <PaymentResult />
          </Suspense>
        </section>
      </main>
      <Footer />
    </>
  );
}
