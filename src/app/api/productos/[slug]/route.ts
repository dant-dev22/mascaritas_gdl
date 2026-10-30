import { NextResponse } from 'next/server';
import { findProductBySlug, listRelatedProducts } from '@/server/catalogRepository';

interface RouteContext {
  readonly params: Promise<{ readonly slug: string }>;
}

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const { slug } = await context.params;
  const product = await findProductBySlug(slug);

  if (!product) {
    return NextResponse.json({ message: 'Producto no encontrado' }, { status: 404 });
  }

  const related = await listRelatedProducts(product);

  return NextResponse.json(
    { product, related },
    { headers: { 'cache-control': 'no-store' } },
  );
}
