import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CatalogSkeleton } from '@/components/catalog/CatalogSkeleton';

export default function CatalogoLoading() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="contenido-principal" className="flex-1 flex flex-col">
        <CatalogSkeleton />
      </main>
      <Footer />
    </>
  );
}
