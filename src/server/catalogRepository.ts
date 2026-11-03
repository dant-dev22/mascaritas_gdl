import { buildCatalogParams } from '@/__lib__/catalogUrl';
import type { Locale } from '@/i18n/routing';
import type { CatalogFacets, CatalogListResponse, Product, ProductQuery } from '@/__types__';

/**
 * Repositorio server-only: consulta el backend real (FastAPI + MySQL).
 * Mantiene las firmas que ya consumen las API Routes y los componentes de servidor,
 * así el frontend sigue hablando con `/api/productos` a través de Next.
 */
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://127.0.0.1:8000';

const RELATED_LIMIT = 3;
const REQUEST_INIT: RequestInit = {
  cache: 'no-store',
  headers: { accept: 'application/json' },
};

/** Devuelve `null` cuando el backend responde 404. */
async function request<TData>(path: string): Promise<TData | null> {
  const response = await fetch(`${BACKEND_URL}${path}`, REQUEST_INIT);

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`El backend respondió ${response.status} en ${path}`);
  }

  return (await response.json()) as TData;
}

export async function listProducts(
  query: ProductQuery,
  locale: Locale,
): Promise<CatalogListResponse> {
  const params = buildCatalogParams(query);
  params.set('lang', locale);
  const data = await request<CatalogListResponse>(`/api/productos?${params.toString()}`);

  if (data === null) throw new Error('No pudimos cargar el catálogo.');
  return data;
}

export async function findProductBySlug(slug: string, locale: Locale): Promise<Product | null> {
  const data = await request<CatalogProductPayload>(
    `/api/productos/${encodeURIComponent(slug)}?lang=${locale}`,
  );
  return data?.product ?? null;
}

export async function listRelatedProducts(
  product: Product,
  locale: Locale,
  limit: number = RELATED_LIMIT,
): Promise<ReadonlyArray<Product>> {
  const data = await request<CatalogProductPayload>(
    `/api/productos/${encodeURIComponent(product.slug)}?lang=${locale}`,
  );
  return (data?.related ?? []).slice(0, limit);
}

export async function listAllSlugs(): Promise<ReadonlyArray<string>> {
  const params = new URLSearchParams({ perPage: '100' });
  const data = await request<CatalogListResponse>(`/api/productos?${params.toString()}`);
  return data?.result.items.map((item) => item.slug) ?? [];
}

export async function getCatalogFacets(
  query: ProductQuery,
  locale: Locale,
): Promise<CatalogFacets> {
  const params = buildCatalogParams(query);
  params.set('lang', locale);
  const data = await request<{ facets: CatalogFacets }>(
    `/api/productos/facetas?${params.toString()}`,
  );

  if (data === null) throw new Error('No pudimos cargar las facetas.');
  return data.facets;
}

interface CatalogProductPayload {
  readonly product: Product;
  readonly related: ReadonlyArray<Product>;
}
