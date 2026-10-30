import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductDetail } from '@/components/product/ProductDetail';
import { ProductDetailSkeleton } from '@/components/product/ProductDetailSkeleton';
import { findProductBySlug, listAllSlugs, listRelatedProducts } from '@/server/catalogRepository';

interface ProductPageProps {
  readonly params: Promise<{ readonly slug: string }>;
}

/** El catálogo es finito: prerenderizamos una página por slug. */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await listAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await findProductBySlug(slug);

  if (!product) {
    return { title: 'Máscara no encontrada' };
  }

  return {
    title: `${product.title} ${product.subtitle}`,
    description: product.description,
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
  const { slug } = await params;
  const product = await findProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await listRelatedProducts(product);

  return <ProductDetail product={product} related={related} />;
}
