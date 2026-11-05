import { revalidatePath } from 'next/cache';
import { routing } from '@/i18n/routing';

/**
 * Regenera las páginas afectadas por un cambio de producto, en todos los idiomas.
 * Se llama desde las API Routes del admin después de crear, editar o borrar.
 */
export function revalidateCatalog(slugs: ReadonlyArray<string>): void {
  for (const locale of routing.locales) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/catalogo`);

    for (const slug of slugs) {
      revalidatePath(`/${locale}/producto/${slug}`);
    }
  }
}
