import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductDetail } from '@/components/product/ProductDetail';
import { ProductDetailSkeleton } from '@/components/product/ProductDetailSkeleton';
import { routing, type Locale } from '@/i18n/routing';
import { buildAlternates } from '@/__lib__/seo';
import { findProductBySlug, listAllSlugs, listRelatedProducts } from '@/server/catalogRepository';

interface ProductPageProps {
  readonly params: Promise<{ readonly locale: Locale; readonly slug: string }>;
}

/**
 * El catálogo es finito: prerenderizamos una página por combinación idioma/slug.
 * Si el backend no responde, devolvemos una lista vacía para no romper el build.
 */
export async function generateStaticParams(): Promise<{ locale: string; slug: string }[]> {
  let slugs: ReadonlyArray<string> = [];

  try {
    slugs = await listAllSlugs();
  } catch {
    slugs = [];
  }

  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await findProductBySlug(slug, locale);

  if (!product) {
    const t = await getTranslations({ locale, namespace: 'meta' });
    return { title: t('productNotFound') };
  }

  return {
    title: `${product.title} ${product.subtitle}`,
    description: product.description,
    alternates: buildAlternates(locale, `/producto/${slug}`),
    openGraph: {
      title: `${product.title} ${product.subtitle}`,
      description: product.description,
      type: 'website',
    },
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="contenido-principal" className="flex-1 flex flex-col">
        <Suspense fallback={<ProductDetailSkeleton />}>
          <ProductContent params={params} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

async function ProductContent({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const product = await findProductBySlug(slug, locale);

  if (!product) {
    notFound();
  }

  const related = await listRelatedProducts(product, locale);

  return <ProductDetail product={product} related={related} />;
}
