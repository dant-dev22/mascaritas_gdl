import { NextResponse } from 'next/server';
import { parseCatalogParams } from '@/__lib__/catalogUrl';
import { getCatalogFacets } from '@/server/catalogRepository';

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const query = parseCatalogParams(searchParams);
  const facets = await getCatalogFacets(query);

  return NextResponse.json({ facets }, { headers: { 'cache-control': 'no-store' } });
}
