import { routing } from '@/i18n/routing';

export interface LocaleFreeHref {
  readonly pathname: string;
  readonly query: Record<string, string>;
}

/**
 * Devuelve la ubicación actual sin el prefijo de idioma, para reconstruir la
 * misma página en otro idioma mediante `router.replace`.
 */
export function getLocaleFreeHref(): LocaleFreeHref {
  if (typeof window === 'undefined') {
    return { pathname: '/', query: {} };
  }

  const url = new URL(window.location.href);
  const segments = url.pathname.split('/');
  const firstSegment = segments[1];

  if (firstSegment && (routing.locales as ReadonlyArray<string>).includes(firstSegment)) {
    segments.splice(1, 1);
  }

  const query: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    query[key] = value;
  });

  return { pathname: segments.join('/') || '/', query };
}
