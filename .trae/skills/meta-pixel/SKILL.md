---
name: meta-pixel
description: Experto en Meta Pixel y pixeles de terceros como TikTok en ldn; cubre implementación, eventos, consentimiento y depuración. Úsala ante cualquier alta, cambio o mantenimiento de un píxel. No para SEO ni analítica sin pixeles.
---

# Meta Pixel y pixeles de terceros

Implementa y mantiene la medición del sitio: IDs, snippets base, eventos de producto, consentimiento y depuración. Dirige la implementación como un especialista en Meta Pixel, pero la regla del proyecto es común a todos los proveedores.

## Reglas fijas del proyecto

- **Son dos pixeles, no tres.** Meta cubre Facebook e Instagram (mismo sistema de anuncios y mismo pixel); TikTok es aparte. Nunca crear un pixel «de Instagram» ni uno por red social.
- **Sin ID, el pixel no se monta.** Los IDs salen de variables de entorno; vacíos en desarrollo es el comportamiento esperado, no un bug.
- **Nada sale del navegador antes del consentimiento.** Hasta que la persona acepta el muro de cookies, ningún pixel emite datos: los dos base codes están en el HTML en modo restringido (Meta revocado, TikTok en espera) y callan.
- **El sitio no tiene cuentas ni formularios.** La identidad de medición es la cookie que deja cada pixel (`_fbp` de Meta, `_ttp` de TikTok). No hay CAPI, ni Advanced Matching, ni subida de listas de correos, ni correo/teléfono en los eventos. No introducirlos.
- **Eventos estándar antes que personalizados.** Al ser estándar, la red ya sabe qué significan, aparecen en reportes sin configuración y sirven como evento de optimización de campaña cuando haya volumen.
- **Los IDs son `NEXT_PUBLIC_*`: se hornean en build.** Cambiar `.env.local` exige rebuild + `pm2 restart`; reiniciar no basta. El despliegue lo hace la skill `deploy`.
- **Añadir un proveedor obliga a actualizar el aviso de privacidad** (`privacyCopy` en [copy.ts](file:///c:/Users/dante/Documents/trae_projects/ldn/src/lib/copy.ts)) y reflejar solo los servicios activos.

## Dónde vive cada cosa

| Archivo | Responsabilidad |
|---|---|
| [analytics.ts](file:///c:/Users/dante/Documents/trae_projects/ldn/src/lib/analytics.ts) | IDs, snippets base (`metaBaseCode`, `tiktokBaseCode`), `syncMetaConsent` / `syncTikTokConsent`, eventos (`trackPageView`, `trackCtaPrincipal`, `trackViewContent`, `trackSocialClick`), tipos globales `window.fbq` / `window.ttq` |
| [analytics.tsx](file:///c:/Users/dante/Documents/trae_projects/ldn/src/components/analytics/analytics.tsx) | Resuelve el consentimiento y lo aplica a cada pixel; dispara el `PageView` solo en `/`; monta el muro si no hay decisión |
| [consent-gate.tsx](file:///c:/Users/dante/Documents/trae_projects/ldn/src/components/analytics/consent-gate.tsx) | Muro de cookies bloqueante (Radix Dialog) |
| [consent.ts](file:///c:/Users/dante/Documents/trae_projects/ldn/src/lib/consent.ts) | Estado de consentimiento en `localStorage` (`ldn:consent`): `granted` \| `denied` \| `null` |
| [layout.tsx](file:///c:/Users/dante/Documents/trae_projects/ldn/src/app/layout.tsx) | Base codes de ambos pixeles inline en `<head>` (server-rendered) |
| [.env.example](file:///c:/Users/dante/Documents/trae_projects/ldn/.env.example) | `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID` |

## Modelos de carga (respetarlos)

**Los dos van en el HTML.** Los base codes de Meta y TikTok se renderizan inline en el `<head>` desde `layout.tsx` porque las plataformas solo reconocen el pixel si el código viene en el documento; inyectado tras hidratar, la página no tiene pixel para quien la audita.

**TikTok** llama `holdConsent()` antes de `load()`: arranca en modo restringido, encola los eventos y no manda nada. Al resolverse la decisión, `Analytics` llama `syncTikTokConsent` → `grantConsent()` (libera la cola) o `revokeConsent()` (la descarta). Sin decisión, la espera continúa.

**Meta** llama `fbq('consent','revoke')` **antes** de `fbq('init')` —Meta solo respeta la pausa si la ve antes de inicializar—: nace revocado y en ese estado no emite eventos ni escribe `_fbp`. `syncMetaConsent` libera con `fbq('consent','grant')` o mantiene cerrado con `revoke`.

**El `PageView` no va en ningún base code.** Los snippets lo dispararían en todas las rutas y antes de que haya decisión. Se emite desde `Analytics` con `trackPageView()`: solo en `/` (landing), solo una vez y solo con la decisión ya aplicada. Restringido a esa ruta a propósito —hoy lo que se mide es el landing— y fuera del snippet porque Meta descarta lo emitido en modo revocado, así que dentro del snippet se perdería la visita de quien acepta tarde.

**Cualquier proveedor nuevo:** base code en el HTML de origen + API de consentimiento (o montaje condicionado) + tipos en `analytics.ts`. Nunca inyectar el base code solo tras hidratar si el proveedor audita el documento.

## Eventos

- `PageView` — la visita al landing principal. Lo emite `trackPageView()` desde `Analytics`, solo en `/`, una vez y con la decisión concedida. No es evento de producto y **no** vive en el base code.
- `ViewContent` — vista real de contenido, vía `trackViewContent()`: el modal de la home ya cargado o la página propia de una nota. Se manda a Meta y TikTok con `content_name` y `content_category`.
- `SocialClick` — clic saliente a una red del pie, vía `trackSocialClick()`, que lo llama el `Link` de [social-links.tsx](file:///c:/Users/dante/Documents/trae_projects/ldn/src/components/layout/social-links.tsx). Mismo evento para las dos redes y `content_name` igual al id (`instagram`, `facebook`), para comparar cuál manda tráfico. Es personalizado —ninguna plataforma tiene un estándar de «clic saliente» y el `ClickButton` de TikTok ya lo usa el CTA— y cualquier red que se añada a `socialLinks` lo emite sin tocar el evento.

Al añadir un evento, respetar el candado `getConsent() !== "granted"` y usar la llamada opcional (`window.fbq?.` / `window.ttq?.`) para no romper si el pixel no está montado.

## Procedimiento

### Activar Meta (o cualquier pixel nuevo)
1. Pedir el ID y anotarlo en `.env.local` (`NEXT_PUBLIC_META_PIXEL_ID`). Actualizar `.env.example` si el comentario quedó obsoleto.
2. Si el proveedor audita el documento, mover su base code al `<head>` server-rendered (patrón `metaBaseCode` o `tiktokBaseCode`), con consentimiento gobernado por la API de la plataforma (`fbq('consent', ...)`, `holdConsent`) o por montaje condicionado.
3. Declarar los dominios del proveedor en la CSP (`CSP` en [next.config.ts](file:///c:/Users/dante/Documents/trae_projects/ldn/next.config.ts)): aunque está en Report-Only, su regla es listar exactamente los terceros que el sitio carga. Meta necesita `connect.facebook.net` en `script-src` y `connect-src`, y `www.facebook.com` en `img-src`.
4. Actualizar el aviso de privacidad para incluir el servicio.
5. Verificar en local con el ID puesto, crear el commit y desplegar con la skill `deploy` (rebuild obligatorio porque es `NEXT_PUBLIC_*`).

### Depurar
1. `npx eslint src` y `npm run build` sin errores nuevos.
2. Levantar `npm run dev` con el ID en `.env.local` y revisar el Network del navegador:
   - Aceptar → debe salir el request a `connect.facebook.net/.../fbevents.js` (Meta) y/o `analytics.tiktok.com/i18n/pixel/events.js` (TikTok), más el `PageView` de cada pixel **solo si estás en `/`**. Fuera del landing no debe salir ningún `PageView`.
   - Rechazar → el SDK puede cargar (el base code viene del `<head>`), pero **no** debe salir ningún evento: ni el beacon `/tr` de Meta ni el POST de eventos de TikTok, y no debe escribirse la cookie `_fbp` ni `_ttp`.
   - Clic en un icono del pie → debe salir un `SocialClick` por pixel con `content_name` igual a la red (`instagram` o `facebook`).
3. Confirmar que Meta deja `_fbp` y TikTok `_ttp` tras aceptar.
4. Para volver a ver el muro, borrar `ldn:consent` de `localStorage`.
5. Si el evento no aparece en el reporte: revisar que el nombre sea el estándar, que el `content_name` coincida y que el pixel esté liberado (ID presente + consentimiento `granted`).

## Diagnóstico rápido

| Síntoma | Causa probable |
|---|---|
| El pixel no aparece en el validador de la red | El base code no está en el HTML de origen, o el ID está vacío en build |
| Cambié el ID y no surte efecto en producción | Es `NEXT_PUBLIC_*`: falta rebuild + `pm2 restart` |
| Llegan eventos de conversión aun rechazando | Falta `holdConsent`/`fbq('consent','revoke')`, o la decisión no se aplica con `syncMetaConsent`/`syncTikTokConsent` |
| Error de tipo en `window.fbq` / `window.ttq` | Falta declarar el método en el bloque `declare global` de `analytics.ts` |
| `PageView` en todas las rutas | Se volvió a meter el `PageView` dentro del base code; tiene que salir solo de `trackPageView` y solo en `/` |
| No llega ningún `PageView` | El efecto de `Analytics` no disparó: revisa el guardia (`pathname === "/"` y consentimiento `granted`) y el `useRef` que lo limita a una vez |
