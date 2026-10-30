import { ArrowLeft, Store } from 'lucide-react';
import { CATALOG_PATH } from '@/__lib__/catalogUrl';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button, BUTTON_ICON_PROPS } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export default function ProductNotFound() {
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
          title="Esa máscara no está en el ring"
          description="El producto que buscas no existe o ya no está disponible. Vuelve al catálogo para ver las piezas de esta temporada."
          action={
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <Button
                as="link"
                href={CATALOG_PATH}
                variant="primary"
                size="lg"
                leftIcon={<Store {...BUTTON_ICON_PROPS} aria-hidden="true" />}
              >
                Ver catálogo completo
              </Button>
              <Button
                as="link"
                href="/"
                variant="secondary"
                size="lg"
                leftIcon={<ArrowLeft {...BUTTON_ICON_PROPS} aria-hidden="true" />}
              >
                Volver al inicio
              </Button>
            </div>
          }
        />
      </main>
      <Footer />
    </>
  );
}
