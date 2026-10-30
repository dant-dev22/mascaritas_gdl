import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { ProductGrid } from '@/components/sections/ProductGrid';
import { TrustGrid } from '@/components/sections/TrustGrid';

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main id="contenido-principal" className="flex-1 flex flex-col">
        <Hero />
        <ProductGrid />
        <TrustGrid />
      </main>
      <Footer />
    </>
  );
}
