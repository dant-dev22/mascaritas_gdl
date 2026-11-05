import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME } from '@/__lib__/adminCookie';
import { fetchMe, login } from '@/server/adminApi';
import { adminCookieOptions, readAdminToken } from '@/server/adminSession';
import { toErrorResponse } from '@/server/adminResponse';

interface LoginBody {
  readonly email?: string;
  readonly password?: string;
}

/** Inicia sesión y guarda el token en una cookie httpOnly. */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json().catch(() => null)) as LoginBody | null;

  if (!body?.email || !body.password) {
    return NextResponse.json({ message: 'Faltan correo y contraseña' }, { status: 400 });
  }

  try {
    const session = await login(body.email, body.password);

    if (session === null) {
      return NextResponse.json({ message: 'Correo o contraseña incorrectos' }, { status: 401 });
    }

    const response = NextResponse.json({ user: session.user });
    response.cookies.set({ ...adminCookieOptions(), value: session.accessToken });
    return response;
  } catch (error) {
    return toErrorResponse(error);
  }
}

/** Devuelve el usuario de la sesión actual, o 401 si no hay sesión válida. */
export async function GET(): Promise<NextResponse> {
  const token = await readAdminToken();
  if (token === null) {
    return NextResponse.json({ message: 'Sin sesión' }, { status: 401 });
  }

  const user = await fetchMe(token);
  if (user === null) {
    return NextResponse.json({ message: 'Sesión no válida' }, { status: 401 });
  }

  return NextResponse.json({ user }, { headers: { 'cache-control': 'no-store' } });
}

/** Cierra la sesión borrando la cookie. */
export async function DELETE(): Promise<NextResponse> {
  const response = new NextResponse(null, { status: 204 });
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}
