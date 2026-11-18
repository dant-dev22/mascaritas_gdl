import { NextResponse } from 'next/server';
import { createStoreOrder } from '@/server/checkoutApi';
import type { CheckoutRequestInput } from '@/__types__';

const NO_STORE = { 'cache-control': 'no-store' } as const;

/**
 * Proxy server-only del checkout. El pedido lo crea el backend; aquí solo se
 * traduce su respuesta a un código HTTP estable para el navegador.
 */
export async function POST(request: Request): Promise<NextResponse> {
  let payload: CheckoutRequestInput;

  try {
    payload = (await request.json()) as CheckoutRequestInput;
  } catch {
    return NextResponse.json({ message: 'invalid' }, { status: 400, headers: NO_STORE });
  }

  const outcome = await createStoreOrder(payload);

  switch (outcome.kind) {
    case 'created':
      return NextResponse.json(outcome.order, { status: 201, headers: NO_STORE });
    case 'conflict':
      return NextResponse.json({ message: 'conflict' }, { status: 409, headers: NO_STORE });
    case 'invalid':
      return NextResponse.json({ message: 'invalid' }, { status: 400, headers: NO_STORE });
    case 'throttled':
      return NextResponse.json({ message: 'throttled' }, { status: 429, headers: NO_STORE });
    default:
      return NextResponse.json({ message: 'error' }, { status: 502, headers: NO_STORE });
  }
}
