import { PRODUCT_IMAGE_ASPECT_RATIO } from '@/__data__/products';
import { Skeleton } from '@/components/ui/Skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-surface border border-border-subtle rounded-[1.5rem] p-4 sm:p-5 shadow-card">
      <div className="w-full mb-5" style={{ aspectRatio: PRODUCT_IMAGE_ASPECT_RATIO }}>
        <Skeleton className="w-full h-full" />
      </div>

      <Skeleton className="h-6 w-3/4 mb-3" rounded="rounded-lg" />
      <Skeleton className="h-4 w-1/2 mb-4" rounded="rounded-lg" />
      <Skeleton className="h-4 w-full mb-2" rounded="rounded-lg" />
      <Skeleton className="h-4 w-4/5 mb-6" rounded="rounded-lg" />
      <Skeleton className="h-9 w-2/5 mb-5" rounded="rounded-lg" />
      <Skeleton className="h-12 w-full mt-auto" />
    </div>
  );
}
