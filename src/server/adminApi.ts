import type { PaginatedResult, Product } from '@/__types__';
import type { AdminLoginResponse, AdminProductInput, AdminProductListParams, AdminUser } from '@/__types__/admin';

/**
 * Cliente server-only del panel admin: habla con el backend FastAPI
 * reenviando el token de sesión. No se ejecuta en el navegador.
 */
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://127.0.0.1:8000';

/** Error del backend con su código HTTP, para que la API Route lo propague. */
export class AdminApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'AdminApiError';
  }
}

interface RequestOptions {
  readonly method?: 'GET' | 'POST' | 'PUT';
  readonly token?: string;
  readonly body?: unknown;
}

async function readDetail(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { detail?: unknown };
    if (typeof body.detail === 'string') return body.detail;
  } catch {
    // Respuesta sin JSON: usamos el mensaje genérico.
  }
  return `El backend respondió ${response.status}`;
}

/** Petición genérica. Devuelve `null` cuando el backend responde 404. */
async function request<TData>(path: string, options: RequestOptions = {}): Promise<TData | null> {
  const headers: Record<string, string> = { accept: 'application/json' };
  if (options.token) headers.authorization = `Bearer ${options.token}`;
  if (options.body !== undefined) headers['content-type'] = 'application/json';

  const response = await fetch(`${BACKEND_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: 'no-store',
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new AdminApiError(response.status, await readDetail(response));

  return (await response.json()) as TData;
}

/** Inicia sesión. Devuelve `null` si las credenciales son incorrectas. */
export async function login(email: string, password: string): Promise<AdminLoginResponse | null> {
  const headers = { 'content-type': 'application/json', accept: 'application/json' };
  const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  });

  if (response.status === 401) return null;
  if (!response.ok) throw new AdminApiError(response.status, await readDetail(response));

  return (await response.json()) as AdminLoginResponse;
}

/** Devuelve el usuario de la sesión, o `null` si el token no sirve. */
export async function fetchMe(token: string): Promise<AdminUser | null> {
  try {
    return await request<AdminUser>('/api/auth/me', { token });
  } catch {
    return null;
  }
}

export async function listAdminProducts(
  token: string,
  params: AdminProductListParams = {},
): Promise<PaginatedResult<Product>> {
  const search = new URLSearchParams();
  if (params.search) search.set('search', params.search);
  if (params.sort) search.set('sort', params.sort);
  if (params.page) search.set('page', String(params.page));
  if (params.perPage) search.set('perPage', String(params.perPage));

  const data = await request<PaginatedResult<Product>>(`/api/admin/productos?${search.toString()}`, {
    token,
  });

  if (data === null) throw new AdminApiError(502, 'No pudimos cargar el catálogo');
  return data;
}

export async function getAdminProduct(token: string, id: string): Promise<Product | null> {
  return request<Product>(`/api/admin/productos/${encodeURIComponent(id)}`, { token });
}

export async function createAdminProduct(token: string, input: AdminProductInput): Promise<Product> {
  const data = await request<Product>('/api/admin/productos', { method: 'POST', token, body: input });
  if (data === null) throw new AdminApiError(502, 'No pudimos crear el producto');
  return data;
}

export async function updateAdminProduct(
  token: string,
  id: string,
  input: AdminProductInput,
): Promise<Product | null> {
  return request<Product>(`/api/admin/productos/${encodeURIComponent(id)}`, {
    method: 'PUT',
    token,
    body: input,
  });
}

/** Borra un producto. Devuelve `false` si no existía. */
export async function deleteAdminProduct(token: string, id: string): Promise<boolean> {
  const response = await fetch(`${BACKEND_URL}/api/admin/productos/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers: { accept: 'application/json', authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (response.status === 204) return true;
  if (response.status === 404) return false;
  throw new AdminApiError(response.status, await readDetail(response));
}
