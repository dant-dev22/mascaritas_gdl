import type { AdminNavItem } from '@/__types__';

/** Productos por vista en el panel (tope de 12 que pedimos siempre). */
export const ADMIN_PER_PAGE = 12 as const;

/** Milisegundos de espera antes de lanzar la búsqueda del panel. */
export const ADMIN_SEARCH_DEBOUNCE_MS = 320 as const;

/** Autocierre de los avisos flotantes. */
export const ADMIN_TOAST_DURATION_MS = 4200 as const;

export const ADMIN_NAV_ITEMS: ReadonlyArray<AdminNavItem> = [
  { id: 'products', labelKey: 'nav.products', href: '/admin', icon: 'products' },
  { id: 'site', labelKey: 'nav.viewSite', href: '/', icon: 'site' },
] as const;
