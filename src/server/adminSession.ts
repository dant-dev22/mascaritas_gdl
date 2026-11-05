import { cookies } from 'next/headers';
import { ADMIN_COOKIE_MAX_AGE, ADMIN_COOKIE_NAME } from '@/__lib__/adminCookie';

/** Lee el token de sesión del admin desde la cookie httpOnly. */
export async function readAdminToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE_NAME)?.value ?? null;
}

/** Opciones de la cookie de sesión (httpOnly para que no la lea el cliente). */
export function adminCookieOptions() {
  return {
    name: ADMIN_COOKIE_NAME,
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: ADMIN_COOKIE_MAX_AGE,
  };
}
