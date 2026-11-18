import { hasConsent } from '@/__lib__/consent';

/**
 * Medición con el píxel de Meta.
 *
 * Meta cubre Facebook e Instagram: es el mismo sistema de anuncios y el mismo
 * píxel, así que no hay un píxel «de Instagram». La identidad de la medición es
 * la cookie que el propio píxel deja en el navegador (`_fbp`): el sitio no tiene
 * cuentas ni formularios, así que no se envía correo, teléfono ni ningún dato
 * personal en los eventos.
 *
 * El ID sale de una variable de entorno: si falta, el píxel simplemente no se
 * monta, que es lo que queremos en desarrollo. Al ser `NEXT_PUBLIC_*` se hornea
 * en build, de modo que cambiarlo exige reconstruir y reiniciar el proceso.
 */
declare global {
  interface Window {
    /** Cola global de Meta. Existe solo si el píxel ya se cargó. */
    fbq?: (...args: unknown[]) => void;
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/** Moneda de los eventos de comercio: el catálogo se vende en pesos. */
const CURRENCY = 'MXN';

/**
 * Snippet base de Meta, con el «consent mode» de la plataforma.
 *
 * Va en el HTML de todas las páginas —no lo inyecta el cliente— porque el
 * validador de dominio de Meta solo reconoce el píxel si el base code viene en
 * el documento desde el primer byte. Se entrega tal cual lo publica la
 * plataforma, solo con las dos líneas de consentimiento en su lugar:
 * <https://www.facebook.com/business/help/1118145056507593>
 *
 * `fbq('consent', 'revoke')` va **antes** de `init`: Meta solo respeta la pausa
 * si la ve antes de inicializar. En modo revocado no emite eventos ni escribe
 * la cookie `_fbp`.
 *
 * El `PageView` **no** va aquí, a diferencia de como lo publica la plataforma.
 * Meta descarta —no encola— lo que se emite en modo revocado, así que dejarlo
 * en el snippet sería perder la visita de quien acepta después de cargar la
 * página. Se dispara desde `trackPageView`, ya con la pausa liberada.
 */
export function metaBaseCode(id: string): string {
  return `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('consent','revoke');
fbq('init','${id}');`;
}

/**
 * Aplica la decisión de la persona al píxel que ya está en la página.
 *
 * Es la otra mitad del «consent mode»: el snippet nace revocado y aquí se
 * libera con `grant` o se mantiene cerrado con `revoke`. `null` significa que
 * todavía no hay decisión, así que no se toca nada y la pausa continúa.
 */
export function syncMetaConsent(granted: boolean | null): void {
  if (typeof window === 'undefined') return;
  const fbq = window.fbq;
  if (!fbq || granted === null) return;

  fbq('consent', granted ? 'grant' : 'revoke');
}

/** Línea de carrito o de pedido con lo que Meta necesita para el evento. */
export interface MetaLine {
  /** Identificador del producto; el `productId` o, en su defecto, el SKU. */
  readonly id: string;
  readonly quantity: number;
  readonly itemPriceMXN: number;
}

/** Cuerpo común de los eventos de comercio. */
export interface MetaEcommerceEvent {
  /** Importe total en pesos (subtotal + envío; el subtotal si el envío se cotiza). */
  readonly valueMXN: number;
  readonly lines: ReadonlyArray<MetaLine>;
}

/** Convierte las líneas al formato `contents` que espera Meta. */
function toContents(lines: ReadonlyArray<MetaLine>): ReadonlyArray<Record<string, unknown>> {
  return lines.map((line) => ({
    id: line.id,
    quantity: line.quantity,
    item_price: line.itemPriceMXN,
  }));
}

/** Parámetros estándar de comercio; los nombres son los que documenta Meta. */
function ecommerceParams({
  valueMXN,
  lines,
}: MetaEcommerceEvent): Record<string, unknown> {
  return {
    value: valueMXN,
    currency: CURRENCY,
    content_type: 'product',
    content_ids: lines.map((line) => line.id),
    contents: toContents(lines),
    num_items: lines.reduce((total, line) => total + line.quantity, 0),
  };
}

/**
 * `PageView`: la visita a una página del sitio.
 *
 * No va en el base code —ver `metaBaseCode`— porque el snippet lo dispararía en
 * todas las rutas y antes de que haya decisión. Lo emite `Analytics` en cada
 * cambio de ruta pública y solo con el consentimiento ya concedido.
 */
export function trackPageView(): void {
  if (typeof window === 'undefined') return;
  if (!hasConsent('marketing')) return;

  window.fbq?.('track', 'PageView');
}

/**
 * `InitiateCheckout`: la persona entró al checkout con piezas en el carrito.
 *
 * Es un evento estándar de Meta: sirve para construir la audiencia de quienes
 * empiezan a comprar y para medir el abandono del carrito.
 */
export function trackInitiateCheckout(event: MetaEcommerceEvent): void {
  if (typeof window === 'undefined') return;
  if (!hasConsent('marketing')) return;

  window.fbq?.('track', 'InitiateCheckout', ecommerceParams(event));
}

/**
 * `Purchase`: el servidor confirmó el pedido y devolvió su código.
 *
 * Se dispara una sola vez, con el total que calculó el servidor; nunca con
 * datos de contacto. `value` es el importe pagado por el cliente.
 */
export function trackPurchase(event: MetaEcommerceEvent): void {
  if (typeof window === 'undefined') return;
  if (!hasConsent('marketing')) return;

  window.fbq?.('track', 'Purchase', ecommerceParams(event));
}
