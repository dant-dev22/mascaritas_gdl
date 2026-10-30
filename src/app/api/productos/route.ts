import { NextResponse } from 'next/server';
import { parseCatalogParams } from '@/__lib__/catalogUrl';
import { listProducts } from '@/server/catalogRepository';

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const query = parseCatalogParams(searchParams);
  const payload = await listProducts(query);

  return NextResponse.json(payload, {
    headers: { 'cache-control': 'no-store' },
  });
}
