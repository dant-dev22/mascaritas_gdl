import { NextResponse } from 'next/server';
import type { AdminProductInput } from '@/__types__/admin';
import { deleteAdminProduct, getAdminProduct, updateAdminProduct } from '@/server/adminApi';
import { readAdminToken } from '@/server/adminSession';
import { notFoundResponse, toErrorResponse, unauthorizedResponse } from '@/server/adminResponse';
import { revalidateCatalog } from '@/server/revalidateCatalog';

interface RouteContext {
  readonly params: Promise<{ readonly id: string }>;
}

export async function GET(_request: Request, context: RouteContext): Promise<NextResponse> {
  const token = await readAdminToken();
  if (token === null) return unauthorizedResponse();

  const { id } = await context.params;

  try {
    const product = await getAdminProduct(token, id);
    if (product === null) return notFoundResponse();

    return NextResponse.json(product, { headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/** Actualiza un producto. Revalida el slug nuevo y el anterior (por si cambió). */
export async function PUT(request: Request, context: RouteContext): Promise<NextResponse> {
  const token = await readAdminToken();
  if (token === null) return unauthorizedResponse();

  const { id } = await context.params;

  try {
    const input = (await request.json()) as AdminProductInput;
    const previous = await getAdminProduct(token, id);
    const product = await updateAdminProduct(token, id, input);

    if (product === null) return notFoundResponse();

    const slugs = new Set([product.slug, previous?.slug ?? product.slug]);
    revalidateCatalog([...slugs]);
    return NextResponse.json(product);
  } catch (error) {
    return toErrorResponse(error);
  }
}

/** Borra un producto y regenera el catálogo público. */
export async function DELETE(_request: Request, context: RouteContext): Promise<NextResponse> {
  const token = await readAdminToken();
  if (token === null) return unauthorizedResponse();

  const { id } = await context.params;

  try {
    const previous = await getAdminProduct(token, id);
    const removed = await deleteAdminProduct(token, id);

    if (!removed) return notFoundResponse();

    if (previous !== null) revalidateCatalog([previous.slug]);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
