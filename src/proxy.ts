import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE_NAME, ADMIN_LOGIN_SEGMENT } from './__lib__/adminCookie';
import {
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_COOKIE_NAME,
  isLocale,
  routing,
  type Locale,
} from './i18n/routing';

/** Tercer criterio de detección: cabecera `Accept-Language` del navegador. */
function matchAcceptLanguage(header: string | null): Locale | undefined {
  if (!header) return undefined;

  const preferred = header
    .split(',')
    .map((part) => {
      const [tag, quality] = part.trim().split(';q=');
      return { tag: tag.trim().toLowerCase(), quality: quality ? Number(quality) : 1 };
    })
    .filter((entry) => entry.tag.length > 0 && !Number.isNaN(entry.quality))
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of preferred) {
    if (tag.startsWith('es')) return 'es';
    if (tag.startsWith('en')) return 'en';
  }

  return undefined;
}

/** Resuelve el idioma activo: cookie `mascaritas_lang` → `Accept-Language` → `es`. */
function resolveActiveLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  if (isLocale(cookieLocale)) return cookieLocale;

  return matchAcceptLanguage(request.headers.get('accept-language')) ?? routing.defaultLocale;
}

/**
 * Refresca la cookie de idioma SOLO si la persona ya había elegido antes.
 * En la primera visita no se escribe nada, para que el popup de bienvenida
 * pueda preguntar el idioma preferido.
 */
function refreshLocaleCookie(
  response: NextResponse,
  request: NextRequest,
  locale: Locale,
): void {
  if (!request.cookies.has(LOCALE_COOKIE_NAME)) return;

  response.cookies.set({
    name: LOCALE_COOKIE_NAME,
    value: locale,
    path: '/',
    sameSite: 'lax',
    maxAge: LOCALE_COOKIE_MAX_AGE,
  });
}

/**
 * Protege el panel admin: si no hay cookie de sesión, manda al login.
 * La comprobación del token en sí ocurre en el servidor (API Routes y layout),
 * aquí solo evitamos renderizar el panel sin sesión.
 */
function guardAdminArea(request: NextRequest, locale: Locale): NextResponse | null {
  const rest = request.nextUrl.pathname.slice(locale.length + 1);

  if (!rest.startsWith('/admin')) return null;
  if (rest === ADMIN_LOGIN_SEGMENT) return null;
  if (request.cookies.get(ADMIN_COOKIE_NAME)?.value) return null;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${ADMIN_LOGIN_SEGMENT}`;
  url.search = '';
  return NextResponse.redirect(url);
}

/**
 * Enrutado por idioma. Manejamos la redirección y la cookie a mano (en lugar del
 * middleware de `next-intl`, que siempre escribe una cookie de sesión) porque
 * necesitamos distinguir "primera visita" de "elección ya guardada".
 */
export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split('/')[1];

  // La URL ya lleva prefijo de idioma: protegemos el admin y refrescamos la cookie.
  if (isLocale(firstSegment)) {
    const adminRedirect = guardAdminArea(request, firstSegment);
    if (adminRedirect !== null) return adminRedirect;

    const response = NextResponse.next();
    refreshLocaleCookie(response, request, firstSegment);
    return response;
  }

  // Sin prefijo: redirigimos conservando la ruta y los query params.
  const locale = resolveActiveLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;

  const response = NextResponse.redirect(url);
  refreshLocaleCookie(response, request, locale);
  return response;
}

export const config = {
  // Excluye API, internos de Next/Vercel y cualquier ruta que apunte a un archivo.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
