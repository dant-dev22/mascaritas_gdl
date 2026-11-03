import { NextResponse } from 'next/server';
import { parseCatalogParams } from '@/__lib__/catalogUrl';
import { resolveLocale } from '@/i18n/routing';
import { listProducts } from '@/server/catalogRepository';

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const query = parseCatalogParams(searchParams);
  const payload = await listProducts(query, resolveLocale(searchParams.get('lang')));

  return NextResponse.json(payload, {
    headers: { 'cache-control': 'no-store' },
  });
}
