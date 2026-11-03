import type { Metadata } from 'next';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { ProductGrid } from '@/components/sections/ProductGrid';
import { TrustGrid } from '@/components/sections/TrustGrid';
import { buildAlternates } from '@/__lib__/seo';
import type { Locale } from '@/i18n/routing';

interface HomePageProps {
  readonly params: Promise<{ readonly locale: Locale }>;
}

/** Metadatos de la home: solo aporta los `alternates`; el resto se hereda del layout. */
export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    alternates: buildAlternates(locale, ''),
  };
}

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
