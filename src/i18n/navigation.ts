import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Envoltorios de navegación conscientes del idioma.
 * `Link` conserva el prefijo del idioma activo (`/es`, `/en`).
 */
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
