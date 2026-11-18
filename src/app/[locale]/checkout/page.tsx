import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { buildAlternates } from '@/__lib__/seo';
import type { Locale } from '@/i18n/routing';

interface CheckoutPageProps {
  readonly params: Promise<{ readonly locale: Locale }>;
}

export async function generateMetadata({ params }: CheckoutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: t('checkoutTitle'),
    description: t('checkoutDescription'),
    alternates: buildAlternates(locale, '/checkout'),
    // El checkout depende del carrito del navegador: no hay nada que indexar.
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'checkout' });

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="contenido-principal" className="flex-1 flex flex-col">
        <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <Breadcrumbs
            items={[{ label: t('breadcrumbHome'), href: '/' }, { label: t('breadcrumbCurrent') }]}
            className="mb-6"
          />

          <header className="mb-8 max-w-2xl">
            <h1 className="font-display text-display-lg text-balance text-white">
              {t('pageTitle')}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-text-muted sm:text-lg">
              {t('pageDescription')}
            </p>
          </header>

          <CheckoutForm />
        </section>
      </main>
      <Footer />
    </>
  );
}
