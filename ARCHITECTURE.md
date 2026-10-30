# Mascaritas GDL — Guía de arquitectura para agentes IA

> Documento de orientación para corridas automáticas de IA. Explica **dónde vive cada cosa**,
> **cómo fluyen los datos** y **las convenciones obligatorias** del proyecto.
> Antes de crear, mover o borrar archivos, lee las secciones "Rutas", "Capas" y "Convenciones".

---

## 1. Resumen del proyecto

E-commerce de máscaras de lucha libre semi-profesionales hechas a mano en Guadalajara.

El proyecto vive en **dos carpetas hermanas** dentro de `trae_projects/`:

- **UI (este repo):** `mascaritas_gdl/` — Next.js. Sus API Routes (`/api/productos*`) actúan como
  **proxy** hacia el backend; el navegador nunca habla con el backend directamente.
- **Backend:** `../mascaritas_gdl-api/` — FastAPI + MySQL 8.4. Es la **fuente de verdad del catálogo**
  navegable (base de datos `mascaritas`, 18 productos sembrados).

- **Nombre del paquete:** `mascaritas-gdl`
- **Idioma de UI y copy:** Español (`es-MX`)
- **Fuente de verdad del catálogo:** backend `mascaritas_gdl-api` (MySQL). Aparte, la home usa datos
  estáticos en memoria (`src/__data__/catalog.ts` → `__data__/products.ts`).
- **Estado del carrito:** cliente (React Context + `useReducer`), no persistido.

## 2. Stack técnico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js `16.4.0` (App Router, React Server Components) |
| UI | React `19.3.0` |
| Lenguaje | TypeScript `^5` (modo `strict`) |
| Estilos | Tailwind CSS `^4` (config via `@theme inline` en CSS, sin `tailwind.config.js`) |
| Bundler dev | Turbopack (`@tailwindcss/turbopack`) |
| Iconos | `lucide-react` |
| Utilidades CSS | `clsx` + `tailwind-merge` (helper `cn`) |
| Variantes | `class-variance-authority` (cva) |
| Lint | ESLint `^9` (`eslint-config-next`) |

**Comandos** (ver [package.json](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/package.json)):

```bash
npm run dev        # next dev (Turbopack)
npm run build      # next build
npm run start      # next start
npm run lint       # eslint
npm run typecheck  # tsc --noEmit  ← usar para validar cambios de tipos
```

### Backend (`../mascaritas_gdl-api/`)

| Capa | Tecnología |
|------|-----------|
| Framework | FastAPI (`uvicorn`) |
| ORM | SQLAlchemy `2.0` + `pymysql` |
| Schemas | Pydantic `v2` (serializa en camelCase vía `alias_generator=to_camel`) |
| Base de datos | MySQL `8.4` en Docker Compose (contenedor `mascaritas-mysql`, puerto host **3309**) |

```bash
cd ../mascaritas_gdl-api
docker compose up -d                                 # levanta MySQL
.\.venv\Scripts\python.exe -m app.seed --reset       # re-siembra los 18 productos
.\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

## 3. Configuración clave

- **Path alias:** `@/*` → `./src/*` (definido en [tsconfig.json](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/tsconfig.json)).
  Usa siempre imports absolutos `@/...`, nunca rutas relativas largas entre capas.
- **Next config** ([next.config.ts](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/next.config.ts)):
  `cacheComponents: true`, `partialPrefetching: true` y regla de Turbopack que aplica `@tailwindcss/turbopack` a `*.css`.
- **`.env.local`** (raíz UI): `BACKEND_URL=http://127.0.0.1:8000` — URL del backend FastAPI. La usa
  [server/catalogRepository.ts](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/src/server/catalogRepository.ts) para el fetch server-side.
- **`index.html`** en la raíz es un mock de diseño **legacy, no se usa en el build**. No editarlo como si fuera la app; la app real es `src/app/`.
- **Docs existentes:** [DESIGN_SYSTEM.md](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/DESIGN_SYSTEM.md) (spec de tokens) y [ds-uiuxpm.md](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/ds-uiuxpm.md) (diales de diseño). Este archivo NO los reemplaza.

## 4. Mapa de directorios

```
src/
├── app/                      # App Router: rutas, layouts y API
│   ├── layout.tsx            # Layout raíz (metadata SEO, <html lang="es-MX">, CartProvider)
│   ├── page.tsx              # Home "/"
│   ├── globals.css           # Tailwind + @theme (tokens) + utilidades globales
│   ├── catalogo/             # Ruta "/catalogo"
│   │   ├── page.tsx
│   │   └── loading.tsx
│   ├── producto/[slug]/      # Ruta "/producto/:slug"
│   │   ├── page.tsx
│   │   └── not-found.tsx
│   └── api/                  # API Routes (proxy al backend)
│       └── productos/
│           ├── route.ts              # GET /api/productos
│           ├── [slug]/route.ts       # GET /api/productos/:slug
│           └── facetas/route.ts      # GET /api/productos/facetas
├── __types__/                # Tipos e interfaces (SIN runtime)
│   ├── index.ts              # Barrel: re-exporta ui, product, catalog, cart
│   ├── product.ts            # Product, MaskPalette, categorías, tallas, enums
│   ├── catalog.ts            # ProductQuery, facets, paginación, respuestas API
│   ├── cart.ts               # CartLine, CartState, CartAction, CartContextValue
│   └── ui.ts                 # Badge/Button variants, NavLink, SocialLink, IconName
├── __data__/                 # Datos y constantes estáticos (fuente de verdad)
│   ├── catalog.ts            # PRODUCT_CATALOG (18 productos) + FEATURED_PRODUCT_IDS
│   ├── masks.ts              # MASK_PALETTES, PRODUCT_CATEGORIES, PRODUCT_SIZES
│   ├── catalogOptions.ts     # CATALOG_PER_PAGE, PRICE_BUCKETS, SORT_OPTIONS, debounce
│   ├── navLinks.ts           # BRAND, HEADER_LINKS, FOOTER_*, HERO_CTAS, SOCIAL_PROOF
│   ├── products.ts           # Helpers de productos + FEATURED_PRODUCTS
│   ├── socials.ts            # SOCIAL_LINKS
│   ├── contact.ts            # CONTACT (teléfono, email, dirección)
│   └── trustProps.ts         # TRUST_PROPS (beneficios de la home)
├── __hooks__/                # Custom hooks (todos 'use client')
│   ├── useCatalogQuery.ts    # Sincroniza filtros con la URL (router.replace)
│   ├── useCatalogProducts.ts # Fetch a /api/productos con AbortController y estados
│   ├── useSearchField.ts     # Input de búsqueda con debounce + resync desde URL
│   ├── useDebouncedValue.ts  # Debounce genérico
│   ├── useScrollReveal.ts    # IntersectionObserver para animaciones reveal
│   ├── useCart.ts            # useReducer del carrito
│   ├── useCartContext.ts     # Contexto del carrito + guard <CartProvider>
│   └── useAddToCart.ts       # Mapea Product -> línea del carrito
├── __lib__/                  # Funciones puras / utilidades (sin React)
│   ├── catalogEngine.ts      # Filtrado, orden, facetas, paginación, búsqueda
│   ├── catalogUrl.ts         # Serialización/parseo de search params del catálogo
│   ├── utils.ts              # cn(), formatMXN(), formatCompactMXN(), NOOP
│   └── whatsapp.ts           # buildWhatsAppHref(message)
├── server/                   # Capa de acceso a datos (server-only)
│   └── catalogRepository.ts  # Proxy: hace fetch al backend FastAPI (BACKEND_URL)
└── components/
    ├── layout/               # AnnouncementBar, Header, Footer
    ├── sections/             # Hero, ProductGrid, TrustGrid (bloques de la home)
    ├── catalog/              # UI del catálogo (ver abajo)
    ├── product/              # UI de producto (card, detalle, galería, specs…)
    ├── graphics/             # MaskArt, MaskPlaceholders (SVG de máscaras)
    ├── providers/            # CartProvider
    └── ui/                   # Átomos reutilizables (Button, Badge, Input…)
```

> El backend **no** vive dentro de `src/`: está en la carpeta hermana `../mascaritas_gdl-api/` (ver §2).

## 5. Rutas

### Páginas (App Router)

| URL | Archivo | Tipo | Notas |
|-----|---------|------|-------|
| `/` | [page.tsx](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/src/app/page.tsx) | Server | Compone `AnnouncementBar`, `Header`, `Hero`, `ProductGrid`, `TrustGrid`, `Footer` |
| `/catalogo` | [catalogo/page.tsx](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/src/app/catalogo/page.tsx) | Server + Client | Renderiza `CatalogView` dentro de `<Suspense>`. Filtros viven en la URL |
| `/producto/[slug]` | [producto/[slug]/page.tsx](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/src/app/producto/[slug]/page.tsx) | Server | `generateStaticParams()` + `generateMetadata()`; usa `notFound()` |

### API Routes (proxy hacia el backend)

| Endpoint | Archivo | Respuesta |
|----------|---------|-----------|
| `GET /api/productos` | [api/productos/route.ts](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/src/app/api/productos/route.ts) | `CatalogListResponse` = `{ result: { items, meta }, facets }` |
| `GET /api/productos/:slug` | [api/productos/[slug]/route.ts](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/src/app/api/productos/[slug]/route.ts) | `{ product, related }` o `404` |
| `GET /api/productos/facetas` | [api/productos/facetas/route.ts](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/src/app/api/productos/facetas/route.ts) | `{ facets }` |

> Cada handler delega en `server/catalogRepository.ts`, que hace `fetch` al backend FastAPI
> (`BACKEND_URL`). Todas las respuestas usan `cache-control: no-store`.

### Parámetros de query del catálogo

Definidos en [catalogUrl.ts](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/src/__lib__/catalogUrl.ts#L19-L28) (`CATALOG_PARAM`).
Los valores de lista se separan por comas.

| Param | Significado | Ejemplo |
|-------|-------------|---------|
| `q` | Búsqueda de texto | `?q=diablo` |
| `cat` | Categorías (`clasicas`, `semi-pro`, `coleccion`, `personalizadas`) | `?cat=clasicas,coleccion` |
| `talla` | Tallas (`infantil`, `adulto`, `adulto-xl`) | `?talla=adulto` |
| `color` | Colores (`gold`, `green`, `red`, `blue`, `purple`, `silver`) | `?color=gold` |
| `precio` | Buckets de precio (`under-1000`, `1000-1299`, `over-1300`) | `?precio=under-1000` |
| `stock` | Solo disponibles (`1`) | `?stock=1` |
| `orden` | Orden (`featured`, `price-asc`, `price-desc`, `newest`, `rating`) | `?orden=rating` |
| `pagina` | Número de página | `?pagina=2` |

## 6. Flujo de datos

```
Backend (`../mascaritas_gdl-api`):
MySQL 8.4 (tabla `products`) ──► FastAPI `GET /api/productos*`
                                        │
UI (Next):                              ▼
server/catalogRepository.ts  ──fetch───┘   ← única capa que consulta el backend
        │
        ├── app/api/productos/route.ts ──► JSON ──► cliente
        └── app/producto/[slug]/page.tsx (RSC directo)

Cliente:
URL (search params) ──useCatalogQuery──► ProductQuery
        │
        ▼
useCatalogProducts ──fetch──► /api/productos?<params> ──► { result, facets }
        │
        ▼
CatalogView ──► CatalogToolbar / ActiveFilters / CatalogResults / FilterPanel / Pagination
```

**Regla de oro del catálogo:** la **URL es la única fuente de verdad** de filtros, búsqueda, orden y
página. No agregar estado local paralelo para filtros; todo se deriva de `searchParams`.

**Carrito:** `CartProvider` (en el layout raíz) envuelve toda la app. Cualquier componente que necesite
el carrito usa `useCartContext()`; para agregar un producto usa `useAddToCart()`.

## 7. Capas y convenciones obligatorias

1. **Separación estricta de responsabilidades** (no mezclar):
   - Tipos → `src/__types__/` (barrel en `index.ts`).
   - Datos/constantes → `src/__data__/`.
   - Lógica con React → `src/__hooks__/`.
   - Funciones puras → `src/__lib__/`.
   - Acceso a datos server → `src/server/` (proxy al backend FastAPI).
   - Átomos de UI → `src/components/ui/`.
2. **Imports absolutos** con alias `@/...`.
3. **`'use client'` explícito** en cualquier archivo con hooks, contexto o eventos. Los hooks ya lo declaran.
4. **Componentes atómicos** usan `cva` para variantes (`Button`, `Badge`) y el helper `cn()` para clases.
5. **Archivos concisos**: los componentes principales deben mantenerse legibles; extrae subcomponentes a su carpeta.
6. **Sin scroll horizontal**, layout responsivo de 375px a 1440px.
7. **Touch targets ≥ 48px** (utilidad `.touch-target` en `globals.css`); botones con `active:scale-[0.96]`.
8. **Accesibilidad**: `aria-*`, `sr-only` para el skip link, `prefers-reduced-motion` respetado.

### Componentes destacados

- **catalog/**: `CatalogView` (orquestador cliente), `CatalogToolbar` (buscador + orden), `FilterPanel`/`FilterDrawer`
  (filtros desktop/móvil), `ActiveFilters` (chips), `CatalogResults`, `CatalogSkeleton`.
- **product/**: `ProductCard`, `ProductDetail`, `ProductGallery`, `ProductSpecs`, `PurchasePanel` (precio, stock, CTA carrito + WhatsApp), `RelatedProducts`.
- **graphics/**: `MaskArt` genera máscaras SVG a partir de `maskStyle` + `accentColor` (sin imágenes externas).

## 8. Modelo de datos (tipos clave)

Todo en [src/__types__](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/src/__types__).

- **`Product`** ([product.ts](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/src/__types__/product.ts#L52-L79)):
  `id`, `slug`, `sku`, `title`, `subtitle`, `description`, `longDescription`, `priceMXN`, `oldPriceMXN?`,
  `badge?`, `accentColor`, `categoryId`, `sizeId`, `maskStyle`, `finish`, `material`, `lining`,
  `inStock`, `stockCount`, `rating`, `reviewsCount`, `tags[]`, `createdAt`.
- **`ProductQuery`** ([catalog.ts](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/src/__types__/catalog.ts#L27-L37)):
  representa el estado completo del catálogo (search, filtros, sort, paginación).
- **`CatalogFacets`**: conteos por categoría, talla, color y bucket de precio.
- **`CartLine` / `CartState` / `CartAction`** ([cart.ts](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/src/__types__/cart.ts)).

Enums de dominio:
- Categorías: `clasicas | semi-pro | coleccion | personalizadas`
- Tallas: `infantil | adulto | adulto-xl`
- Estilos: `tiburon | diablo | galactico | aguila | serpiente | pantera`
- Colores: `gold | green | red | blue | purple | silver`

## 9. Design system (resumen)

Detalle completo en [DESIGN_SYSTEM.md](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/DESIGN_SYSTEM.md).
Los tokens viven en [globals.css](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/src/app/globals.css#L3-L29) con `@theme inline` (Tailwind v4). **No hay `tailwind.config.js`.**

- Fondo canvas `#0A0A0A`; superficie `#161616`; superficie hover `#1F1F1F`.
- Acento verde `#00A86B` (CTA/éxito), rojo `#E63946` (urgencia/alertas).
- Texto `#FFFFFF`; muted `#A0A0A5`; faint `#6B6B70`.
- Tipografías: `Bangers` (display, clase `.font-display`) e `Inter` (body). Definidas por `@font-face` con fallback a `Impact`/`system-ui`.
- Clases utilitarias propias: `.touch-target`, `.text-balance`, `.content-auto`, `.font-display`, `.text-display-xl/lg/md`, `.hero-pattern`, `.product-ph`, `.reveal-enter`.

> Si Google Fonts (`gstatic`) falla en desarrollo, los fallbacks (`Impact`, `sans-serif`) evitan el layout roto.

## 10. Guía rápida: ¿dónde toco qué?

| Quiero… | Ir a |
|---------|------|
| Cambiar un producto o precio | [__data__/catalog.ts](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/src/__data__/catalog.ts) |
| Añadir una categoría / talla / color | [__data__/masks.ts](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/src/__data__/masks.ts) + tipos en `__types__/product.ts` |
| Cambiar lógica de filtrado/orden/paginación | [__lib__/catalogEngine.ts](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/src/__lib__/catalogEngine.ts) |
| Agregar/cambiar un param de URL | [__lib__/catalogUrl.ts](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/src/__lib__/catalogUrl.ts) |
| Cambiar el look de un botón/badge | [components/ui/](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/src/components/ui) |
| Modificar el detalle de producto | [components/product/ProductDetail.tsx](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/src/components/product/ProductDetail.tsx) |
| Cambiar la URL/puerto del backend | [.env.local](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/.env.local) (`BACKEND_URL`) |
| Cambiar cómo se consulta el backend | [server/catalogRepository.ts](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/src/server/catalogRepository.ts) (mantener firmas) |
| Tocar el backend (endpoints, modelo, seed) | carpeta hermana `../mascaritas_gdl-api/app/` |
| Ajustar colores/tipografía global | [app/globals.css](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/src/app/globals.css) (`@theme inline`) |
| Cambiar metadata SEO | [app/layout.tsx](file:///c:/Users/dante/Documents/trae_projects/mascaritas_gdl/src/app/layout.tsx) y los `generateMetadata` por ruta |

## 11. Notas / deuda técnica conocida

- El backend es **real** (`../mascaritas_gdl-api`: FastAPI + MySQL). `catalogRepository.ts` ya solo hace
  `fetch`; el mock en memoria fue eliminado.
- `src/__data__/catalog.ts` (`PRODUCT_CATALOG`) ya **no alimenta** el catálogo navegable; sobrevive como
  semilla de los datos estáticos de la home (`FEATURED_PRODUCTS`, precio "desde"). El catálogo real lo
  sirve MySQL.
- El carrito **no persiste** (se pierde al recargar) y no hay checkout; el flujo de compra es por WhatsApp.
- `maskPlaceholders` / `MaskArt` generan máscaras **SVG procedurales**: no hay imágenes de producto reales todavía.
- `index.html` en la raíz es un **mock legacy** ajeno al build de Next.
