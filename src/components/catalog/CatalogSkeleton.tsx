import { getTranslations } from 'next-intl/server';
import { Skeleton } from '@/components/ui/Skeleton';
import { ProductCardSkeleton } from '@/components/product/ProductCardSkeleton';

const SKELETON_KEYS = ['sk-1', 'sk-2', 'sk-3', 'sk-4', 'sk-5', 'sk-6'];

/**
 * Estado de carga del catálogo: replica la retícula real (aside de filtros +
 * toolbar + grid) para que el cambio de layout sea imperceptible.
 */
export async function CatalogSkeleton() {
  const t = await getTranslations('catalog');

  return (
    <section
      role="status"
      aria-label={t('loading')}
      className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      <Skeleton className="h-4 w-40 mb-6" rounded="rounded-lg" />

      <div className="mb-8 sm:mb-10 max-w-2xl">
        <Skeleton className="h-3 w-32 mb-3" rounded="rounded-lg" />
        <Skeleton className="h-12 w-2/3 mb-3" />
        <Skeleton className="h-5 w-full mb-2" rounded="rounded-lg" />
        <Skeleton className="h-5 w-4/5" rounded="rounded-lg" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-12">
        <div className="hidden lg:flex flex-col gap-4">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>

        <div className="flex flex-col gap-6 min-w-0">
          <div className="flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 sm:w-56" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {SKELETON_KEYS.map((key) => (
              <ProductCardSkeleton key={key} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
