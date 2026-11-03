import { getTranslations } from 'next-intl/server';
import { PRODUCT_IMAGE_ASPECT_RATIO } from '@/__data__/products';
import { Skeleton } from '@/components/ui/Skeleton';

/**
 * Estado de carga de la vista de producto: replica la retícula de dos columnas
 * (galería + panel de compra) para evitar saltos de layout al hidratar.
 */
export async function ProductDetailSkeleton() {
  const t = await getTranslations('product');

  return (
    <div
      role="status"
      aria-label={t('loading')}
      className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
    >
      <Skeleton className="h-4 w-56 mb-6" rounded="rounded-lg" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
        <div className="w-full flex flex-col gap-4">
          <div
            className="w-full rounded-[1.5rem] overflow-hidden"
            style={{ aspectRatio: PRODUCT_IMAGE_ASPECT_RATIO }}
          >
            <Skeleton className="w-full h-full" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-20 flex-1" />
            <Skeleton className="h-20 flex-1" />
            <Skeleton className="h-20 flex-1" />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Skeleton className="h-7 w-32" rounded="rounded-full" />
          <Skeleton className="h-12 w-4/5" />
          <Skeleton className="h-5 w-2/5" rounded="rounded-lg" />
          <Skeleton className="h-4 w-1/2" rounded="rounded-lg" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
