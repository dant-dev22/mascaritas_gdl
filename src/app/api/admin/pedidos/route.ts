import { NextResponse } from 'next/server';
import type { AdminOrderInput } from '@/__types__/admin';
import { createAdminOrder, listAdminOrders } from '@/server/adminApi';
import { readAdminToken } from '@/server/adminSession';
import { toErrorResponse, unauthorizedResponse } from '@/server/adminResponse';

const DEFAULT_PER_PAGE = 12;

/** Lista los pedidos, los más recientes primero. */
export async function GET(request: Request): Promise<NextResponse> {
  const token = await readAdminToken();
  if (token === null) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);

  try {
    const data = await listAdminOrders(token, {
      search: searchParams.get('search') ?? '',
      page: Number(searchParams.get('page') ?? '1'),
      perPage: Number(searchParams.get('perPage') ?? String(DEFAULT_PER_PAGE)),
    });

    return NextResponse.json(data, { headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/** Crea un pedido y registra su primer hito en la línea de tiempo. */
export async function POST(request: Request): Promise<NextResponse> {
  const token = await readAdminToken();
  if (token === null) return unauthorizedResponse();

  try {
    const input = (await request.json()) as AdminOrderInput;
    const order = await createAdminOrder(token, input);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
