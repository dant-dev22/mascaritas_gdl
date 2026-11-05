import { NextResponse } from 'next/server';
import type { AdminProductInput } from '@/__types__/admin';
import { createAdminProduct, listAdminProducts } from '@/server/adminApi';
import { readAdminToken } from '@/server/adminSession';
import { toErrorResponse, unauthorizedResponse } from '@/server/adminResponse';
import { revalidateCatalog } from '@/server/revalidateCatalog';

const DEFAULT_PER_PAGE = 12;

/** Lista el catálogo completo (incluye productos sin stock). */
export async function GET(request: Request): Promise<NextResponse> {
  const token = await readAdminToken();
  if (token === null) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);

  try {
    const data = await listAdminProducts(token, {
      search: searchParams.get('search') ?? '',
      sort: searchParams.get('sort') ?? 'featured',
      page: Number(searchParams.get('page') ?? '1'),
      perPage: Number(searchParams.get('perPage') ?? String(DEFAULT_PER_PAGE)),
    });

    return NextResponse.json(data, { headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    return toErrorResponse(error);
  }
}

/** Crea un producto y regenera el catálogo público. */
export async function POST(request: Request): Promise<NextResponse> {
  const token = await readAdminToken();
  if (token === null) return unauthorizedResponse();

  try {
    const input = (await request.json()) as AdminProductInput;
    const product = await createAdminProduct(token, input);

    revalidateCatalog([product.slug]);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
