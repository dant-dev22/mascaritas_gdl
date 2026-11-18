import { CART_MAX_QUANTITY, CART_STORAGE_KEY } from '@/__data__/cart';
import type { CartLine } from '@/__types__';

/**
 * `localStorage` es un límite del sistema: el usuario puede editarlo a mano y
 * el contenido puede venir de una versión previa del sitio. Todo lo que se lee
 * pasa por aquí antes de entrar al estado del carrito.
 */

function toPositiveInt(value: unknown): number {
  const parsed = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 0;
  return Math.min(Math.floor(parsed), CART_MAX_QUANTITY);
}

function toPrice(value: unknown): number | null {
  const parsed = typeof value === 'number' ? value : Number.parseFloat(String(value));
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return Math.round(parsed);
}

function toText(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

/** Valida una línea guardada. Devuelve `null` si está corrupta. */
function parseLine(raw: unknown): CartLine | null {
  if (typeof raw !== 'object' || raw === null) return null;

  const entry = raw as Record<string, unknown>;
  const productId = toText(entry.productId);
  const slug = toText(entry.slug);
  const title = toText(entry.title);
  const priceMXN = toPrice(entry.priceMXN);
  const quantity = toPositiveInt(entry.quantity);

  if (!productId || !slug || !title || priceMXN === null || quantity === 0) return null;

  return { productId, slug, title, priceMXN, quantity };
}

/** Lee el carrito guardado. Devuelve `[]` en el servidor o si está corrupto. */
export function readCartLines(): CartLine[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Un mismo producto solo puede ocupar una línea.
    const byProduct = new Map<string, CartLine>();

    for (const entry of parsed) {
      const line = parseLine(entry);
      if (line === null) continue;

      const existing = byProduct.get(line.productId);
      byProduct.set(
        line.productId,
        existing
          ? {
              ...line,
              quantity: Math.min(existing.quantity + line.quantity, CART_MAX_QUANTITY),
            }
          : line,
      );
    }

    return [...byProduct.values()];
  } catch {
    return [];
  }
}

/** Guarda el carrito. Ignora fallos de cuota o de modo privado. */
export function writeCartLines(lines: ReadonlyArray<CartLine>): void {
  if (typeof window === 'undefined') return;

  try {
    if (lines.length === 0) {
      window.localStorage.removeItem(CART_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
  } catch {
    /* el carrito sigue vivo en memoria aunque no se pueda persistir */
  }
}
