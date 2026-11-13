import { NextResponse } from 'next/server';
import { lookupOrderByCode } from '@/server/orderRepository';

interface RouteContext {
  readonly params: Promise<{ readonly code: string }>;
}

const NO_STORE = { 'cache-control': 'no-store' } as const;

/**
 * Proxy server-only hacia el backend. El código del pedido viaja en la URL,
 * así que la respuesta nunca se cachea.
 */
export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const { code } = await context.params;
  const trimmed = code.trim();

  if (trimmed.length === 0) {
    return NextResponse.json({ message: 'notFound' }, { status: 404, headers: NO_STORE });
  }

  const result = await lookupOrderByCode(trimmed);

  switch (result.kind) {
    case 'found':
      return NextResponse.json({ order: result.order }, { headers: NO_STORE });
    case 'not-found':
      return NextResponse.json({ message: 'notFound' }, { status: 404, headers: NO_STORE });
    case 'throttled':
      return NextResponse.json({ message: 'throttled' }, { status: 429, headers: NO_STORE });
    default:
      return NextResponse.json({ message: 'error' }, { status: 502, headers: NO_STORE });
  }
}
