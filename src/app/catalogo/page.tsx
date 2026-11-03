import { Suspense } from 'react';
import type { Metadata } from 'next';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CatalogView } from '@/components/catalog/CatalogView';
import { CatalogSkeleton } from '@/components/catalog/CatalogSkeleton';

export const metadata: Metadata = {
  title: 'Catálogo de máscaras',
  description:
    'Explora máscaras de lucha libre semi-profesionales y profesionales, hechas 100% a mano. Filtra por categoría, talla, color y precio.',
};

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
