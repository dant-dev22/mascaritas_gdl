import { NextResponse } from 'next/server';
import { AdminApiError } from './adminApi';

/** Respuesta estándar cuando no hay sesión válida. */
export function unauthorizedResponse(): NextResponse {
  return NextResponse.json({ message: 'Sesión no válida o expirada' }, { status: 401 });
}

/** Respuesta estándar cuando el producto no existe. */
export function notFoundResponse(): NextResponse {
  return NextResponse.json({ message: 'Producto no encontrado' }, { status: 404 });
}

/** Convierte un error del backend en respuesta HTTP; el resto es 502. */
export function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof AdminApiError) {
    return NextResponse.json({ message: error.message }, { status: error.status });
  }

  console.error('[admin] error inesperado:', error);
  return NextResponse.json({ message: 'No pudimos completar la operación' }, { status: 502 });
}
