import { NextResponse } from 'next/server';
import { forwardMercadoPagoWebhook } from '@/server/pagosApi';

const NO_STORE = { 'cache-control': 'no-store' } as const;

/**
 * Proxy del aviso de Mercado Pago. El backend valida la firma y consulta el
 * pago real; aquí solo se reenvía el cuerpo íntegro y se devuelve su estado
 * para que Mercado Pago sepa si debe reintentar.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const rawBody = await request.text();
  const query = new URL(request.url).search;

  const result = await forwardMercadoPagoWebhook({
    rawBody,
    query,
    signature: request.headers.get('x-signature'),
    requestId: request.headers.get('x-request-id'),
  });

  return new NextResponse(result.body, {
    status: result.status,
    headers: { ...NO_STORE, 'content-type': 'application/json' },
  });
}
