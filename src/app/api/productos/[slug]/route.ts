import { NextResponse } from 'next/server';
import { resolveLocale } from '@/i18n/routing';
import { findProductBySlug, listRelatedProducts } from '@/server/catalogRepository';

interface RouteContext {
  readonly params: Promise<{ readonly slug: string }>;
}

export async function GET(
  request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const { slug } = await context.params;
  const locale = resolveLocale(new URL(request.url).searchParams.get('lang'));
  const product = await findProductBySlug(slug, locale);

  if (!product) {
    return NextResponse.json({ message: 'Producto no encontrado' }, { status: 404 });
  }

  const related = await listRelatedProducts(product, locale);

  return NextResponse.json(
    { product, related },
    { headers: { 'cache-control': 'no-store' } },
  );
}
