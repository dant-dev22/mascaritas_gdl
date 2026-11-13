import { NextResponse } from 'next/server';
import type { AdminOrderInput } from '@/__types__/admin';
import { deleteAdminOrder, getAdminOrder, updateAdminOrder } from '@/server/adminApi';
import { readAdminToken } from '@/server/adminSession';
import { notFoundResponse, toErrorResponse, unauthorizedResponse } from '@/server/adminResponse';

const ORDER_NOT_FOUND = 'Pedido no encontrado';

interface RouteContext {
  readonly params: Promise<{ readonly id: string }>;
}

export async function GET(_request: Request, context: RouteContext): Promise<NextResponse> {
  const token = await readAdminToken();
  if (token === null) return unauthorizedResponse();

  const { id } = await context.params;

  try {
    const order = await getAdminOrder(token, id);
    if (order === null) return notFoundResponse(ORDER_NOT_FOUND);

    return NextResponse.json(order, { headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/** Actualiza un pedido. Si cambia el estado, el backend añade un hito. */
export async function PUT(request: Request, context: RouteContext): Promise<NextResponse> {
  const token = await readAdminToken();
  if (token === null) return unauthorizedResponse();

  const { id } = await context.params;

  try {
    const input = (await request.json()) as AdminOrderInput;
    const order = await updateAdminOrder(token, id, input);
    if (order === null) return notFoundResponse(ORDER_NOT_FOUND);

    return NextResponse.json(order);
  } catch (error) {
    return toErrorResponse(error);
  }
}

/** Borra un pedido junto con su línea de tiempo. */
export async function DELETE(_request: Request, context: RouteContext): Promise<NextResponse> {
  const token = await readAdminToken();
  if (token === null) return unauthorizedResponse();

  const { id } = await context.params;

  try {
    const removed = await deleteAdminOrder(token, id);
    if (!removed) return notFoundResponse(ORDER_NOT_FOUND);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
