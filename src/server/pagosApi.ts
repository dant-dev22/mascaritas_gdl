/**
 * Cliente server-only del webhook de pagos. La API solo escucha en
 * `127.0.0.1`, así que el aviso de Mercado Pago entra por aquí y se reenvía
 * al backend sin tocar el cuerpo ni la firma.
 */
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://127.0.0.1:8000';

export interface WebhookForwardInput {
  /** Cuerpo original: la firma se calcula sobre el manifiesto, no sobre él. */
  readonly rawBody: string;
  /** Cadena de consulta tal como llegó (`?type=payment&data.id=...`). */
  readonly query: string;
  readonly signature: string | null;
  readonly requestId: string | null;
}

export interface WebhookForwardResult {
  readonly status: number;
  readonly body: string;
}

/** Reenvía el aviso al backend y devuelve su respuesta tal cual. */
export async function forwardMercadoPagoWebhook(
  input: WebhookForwardInput,
): Promise<WebhookForwardResult> {
  const headers: Record<string, string> = {
    accept: 'application/json',
    'content-type': 'application/json',
  };
  if (input.signature) headers['x-signature'] = input.signature;
  if (input.requestId) headers['x-request-id'] = input.requestId;

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/pagos/mercadopago/webhook${input.query}`,
      { method: 'POST', headers, body: input.rawBody, cache: 'no-store' },
    );

    return { status: response.status, body: await response.text() };
  } catch {
    // 502: Mercado Pago reintenta el aviso más tarde.
    return { status: 502, body: JSON.stringify({ message: 'error' }) };
  }
}
