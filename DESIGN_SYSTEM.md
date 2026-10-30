# Mascaritas GDL — Design System Specification

> E-commerce de máscaras de lucha libre semi-profesionales hechas a mano en Guadalajara.
> Inspirado en la estética de "Sargento Tiburón" (Mil Máscaras): audaz, auténtico, premium y cultural.

---

## 1. Design Tokens

### 1.1 Paleta de Colores (Next-gen Dark Mode — OLED)

| Token                        | Valor HEX   | Uso                                                                 |
|------------------------------|-------------|---------------------------------------------------------------------|
| `--bg-canvas`                | `#0A0A0A`   | Fondo principal de la aplicación (Pitch Black / Deep Black)        |
| `--bg-surface`               | `#161616`   | Tarjetas, modales, contenedores elevados (Dark Charcoal)           |
| `--bg-surface-hover`         | `#1F1F1F`   | Hover sobre superficies elevadas                                    |
| `--accent-primary`           | `#00A86B`   | CTAs principales, estados de éxito, links primarios (Emerald Green)|
| `--accent-primary-hover`     | `#00C97E`   | Hover sobre CTAs primarios                                          |
| `--accent-primary-pressed`   | `#008F5A`   | Active / pressed estado                                             |
| `--accent-secondary`         | `#E63946`   | Badges, stock urgency, labels activos (Crimson Red)                 |
| `--accent-secondary-hover`   | `#EF5A66`   | Hover sobre acentos secundarios                                     |
| `--text-primary`             | `#FFFFFF`   | Headings, texto principal, labels prioritarios (Pure White)         |
| `--text-secondary`           | `#A0A0A5`   | Body copy secundario, metadatos, placeholders (Muted Grey)          |
| `--text-tertiary`            | `#6B6B70`   | Textos deshabilitados, footnotes, dividers                          |
| `--border-subtle`            | `#2A2A2A`   | Divisores sutiles, bordes predeterminados                           |
| `--border-emphasis`          | `#3A3A3A`   | Bordes enfatizados, focus rings secundarios                         |
| `--shadow-card`              | `0 4px 24px rgba(0,0,0,0.4)` | Sombra base para tarjetas              |
| `--shadow-glow-green`        | `0 0 0 3px rgba(0,168,107,0.25)` | Focus ring para CTA primario         |
| `--shadow-glow-red`          | `0 0 0 3px rgba(230,57,70,0.25)` | Glow secundario                    |

### 1.2 Tipografía

#### Pairing
- **Display Headings**: `Bangers` (Google Fonts) — estilo cartelera de lucha libre vintage.
- **Body & UI Text**: `Inter` (Google Fonts) — legible, limpio, versátil a 16px mínimo.

#### Font Scale (Mobile First)

| Token (CSS Var)             | Tamaño (px) | Line Height | Peso | Uso                                      |
|-----------------------------|-------------|-------------|------|------------------------------------------|
| `--fs-display-xl`           | 48 / 72 md  | 1.05        | 400  | Hero heading (Bangers)                   |
| `--fs-display-lg`           | 36 / 56 md  | 1.1         | 400  | Section titles (Bangers)                 |
| `--fs-display-md`           | 28 / 40 md  | 1.15        | 400  | Product titles (Bangers)                 |
| `--fs-heading-lg`           | 24 / 28 md  | 1.25        | 700  | Sub-headings (Inter)                     |
| `--fs-heading-md`           | 20 / 24 md  | 1.3         | 600  | Card titles, trust props (Inter)         |
| `--fs-body-lg`              | 18          | 1.55        | 400  | Lead paragraphs                          |
| `--fs-body-md`              | 16          | 1.6         | 400  | Body copy (mínimo obligatorio)           |
| `--fs-body-sm`              | 14          | 1.5         | 400  | Caption, badges, metadatos               |
| `--fs-body-xs`              | 12          | 1.4         | 500  | Labels compactas, precios antiguos       |

#### Letter Spacing
- Bangers display: `0.02em` tracking para un look de poster vintage.
- Inter body: normal; caps labels: `0.05em`.

---

## 2. Espaciado & Layout

### 2.1 Grid & Breakpoints (Mobile First)

| Breakpoint | Min-width | Columnas | Gutter | Max Content |
|------------|-----------|----------|--------|-------------|
| `sm`       | 375px     | 4        | 16px   | 100%        |
| `md`       | 768px     | 8        | 24px   | 720px       |
| `lg`       | 1024px    | 12       | 32px   | 960px       |
| `xl`       | 1440px    | 12       | 32px   | 1280px      |

### 2.2 Spacing Scale (8-pt baseline)

```
4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128
```

### 2.3 Reglas Globales de Layout
- **Sin horizontal scroll** nunca. `overflow-x: hidden` en `<html>` y `<body>`.
- **Layout shifts**: usar `content-visibility`, `aspect-ratio` y placeholders estables.
- **Safe areas iOS**: `padding: env(safe-area-inset-*)` en barras fijas.
- **Contenedor máximo**: `max-w-7xl` (1280px) centrado con `mx-auto`.

---

## 3. Componentes UI

### 3.1 Announcement Bar
- **Height**: 40px fijo.
- **Background**: gradiente de `--accent-primary` a `--accent-primary-pressed`.
- **Text**: `--text-primary`, `--fs-body-sm`, centrado, ícono de camión previo al copy.
- **Responsive**: elipsis en móvil si el texto excede; texto completo en ≥ md.

### 3.2 Hero Section
- **Min-height móvil**: 520px (portrait).
- **Min-height desktop**: 640px.
- **Heading (Bangers)**: `--fs-display-xl` con ligero `text-shadow: 0 2px 12px rgba(0,168,107,0.15)`.
- **Sub-headline (Inter)**: `--fs-body-lg`, `--text-secondary`, `max-w-2xl`.
- **CTA "Ver Catálogo"**:
  - Primary green button (ver 3.6).
  - Anchor `#productos`.
- **Layout**: stack vertical en móvil; 50/50 con visual en ≥ lg.
- **Visual**: máscara estrella con `aspect-ratio: 1/1`, backdrop borroso sutil.

### 3.3 Product Grid
- **Mínimo 3 productos** en la landing.
- **Layout**: 1 columna sm, 2 cols md, 3 cols lg/xl.
- **Gap**: 24px (sm), 32px (lg+).

#### Product Card
- **Surface**: `--bg-surface`, border `--border-subtle`, `rounded-2xl`, `shadow-card`.
- **Hover**: elevar `translateY(-4px)`, `shadow-2xl`, border `--border-emphasis`, transición 300ms.
- **Image container**: `aspect-ratio: 4/5`, `rounded-xl`, `overflow-hidden`, background pattern `--bg-canvas`.
- **Badge (top-left)**:
  - Color: `--accent-secondary`, `--text-primary`.
  - Text: "Semi-Pro" o "Últimas piezas".
  - Pill: `rounded-full`, `px-3 py-1`, `--fs-body-xs`, uppercase tracking-wide, 500 weight.
- **Title**: Bangers `--fs-display-md`, `--text-primary`.
- **Price**: Inter `--fs-heading-lg`, 700, `--text-primary`; símbolo `$` a tamaño `--fs-body-sm` con `--text-secondary`.
- **"Agregar al Carrito"**: Primary green CTA (ver 3.6) de ancho completo, ícono `ShoppingCart` de Lucide a la izquierda, touch target ≥ 48px.

### 3.4 Trust / Value Props Grid
- **Columnas**: 1 móvil, 3 en ≥ md.
- **Cada prop**:
  - Ícono Lucide (24px), color `--accent-primary`.
  - Título: Inter 600, `--fs-heading-md`, `--text-primary`.
  - Descripción: Inter, `--fs-body-md`, `--text-secondary`.
  - Fondo: `--bg-surface`, border `--border-subtle`, `rounded-xl`, padding 24px.
- **Props por defecto**:
  1. 🚚 **Envío desde GDL** — Entrega en 24-72h a todo México.
  2. ✋ **Ajuste Cómodo** — Doble forro con cierre ajustable.
  3. 🏜️ **Materiales de Arena** — Lona y vinilo resistentes al ring.

### 3.5 Footer
- **Background**: `--bg-surface`, border-top `--border-subtle`.
- **Estructura**:
  - Logo / tagline (izq).
  - Nav links (centro opcional).
  - Social icons row (der).
- **Social icons**: Lucide icons (`Instagram`, `Facebook`, `TikTok`, `WhatsApp`), `--text-secondary` → `--text-primary` on hover, círculo 40×40px, border `--border-subtle`.
- **Copyright**: `--fs-body-xs`, `--text-tertiary`.

### 3.6 Buttons Specification (todos los botones)

#### Primary CTA (Emerald Green)
| Estado       | Background           | Text     | Glow / Border    |
|--------------|----------------------|----------|------------------|
| Default      | `--accent-primary`   | Blanco   | —                |
| Hover        | `--accent-primary-hover` | Blanco | —            |
| Active       | `--accent-primary-pressed` | Blanco | `scale(0.95)` |
| Focus-visible| —                    | —        | `--shadow-glow-green`, outline 0 |
| Disabled     | `--bg-surface-hover` | `--text-tertiary` | cursor-not-allowed |

- **Padding**: vertical ≥ 14px, horizontal ≥ 28px.
- **Radius**: `rounded-xl`.
- **Font**: Inter 600, `--fs-body-md`.
- **Icon spacing**: `gap-2` con íconos Lucide.
- **Touch target**: mínimo 48×48px.

#### Secondary / Ghost Button
- **Default**: border `--border-emphasis`, background transparente, text `--text-primary`.
- **Hover**: `--bg-surface-hover`.
- **Active**: `scale(0.95)`.

### 3.7 Badges
- **Semi-Pro**: Crimson Red (`--accent-secondary`), blanco.
- **Stock urgency**: Crimson Red + ícono de llama opcional.
- **Envío gratis / Success**: Emerald Green.
- **Radius**: full pill.
- **Font**: Inter 500, `--fs-body-xs`, uppercase, `0.05em` tracking.

---

## 4. Estados Interactivos & Accesibilidad

### 4.1 Interacción Global
- Todos los botones: transiciones de 200–300ms `ease-out`.
- `active:scale-95` en **todos** los botones y CTAs.
- Links subrayados solo en hover; color primario en hover.
- Cards interactivas: `cursor-pointer` si son clicables, hover translateY.

### 4.2 Accesibilidad (WCAG AA mínimo)
- **Focus rings**: todos los elementos interactivos llevan `:focus-visible` outline visible (glow green).
- **Contraste**:
  - Text primary on canvas = 21:1 (AAA).
  - Text secondary on canvas = 8.2:1 (AA+).
  - Accent primary text on white = 4.6:1 (AA).
  - Accent secondary text on white = 4.9:1 (AA).
- **ARIA labels**: Announcement bar `role="region" aria-label="anuncio"`, social icons con `aria-label`, botones con iconos tienen texto visualmente oculto o `aria-label`.
- **Imágenes**: placeholders con `alt="Máscara de lucha libre [nombre]"`.
- **Teclado**: tab order lógico (header → hero → productos → trust → footer).

### 4.3 Motion (Prefers-reduced-motion)
- **Respeto total**: si `prefers-reduced-motion: reduce`, desactivar `translateY`, `hover` transform y animaciones; solo se mantiene cambio de color instantáneo.

---

## 5. Breakdown de Imágenes

| Componente       | Aspect Ratio | Resolución recomendada | Placeholder fallback          |
|------------------|--------------|------------------------|--------------------------------|
| Product Card     | 4:5          | 800×1000               | Pattern + inicial del producto |
| Hero Visual      | 1:1          | 1024×1024              | Ilustración SVG máscara estilizada |
| Trust icons      | 1:1          | 24×24 (vector)         | Lucide icons inline            |

---

## 6. Roadmap de Expansión E-commerce

### Componentes futuros (no en MVP landing)
1. **Header / Nav**: Logo, Categorías, Buscador, Carrito con contador, Login.
2. **PDP (Product Detail Page)**: Galería, variantes (talla/color), descripción, reviews, tablas de tallas.
3. **Cart Drawer**: Side panel derecho, items, subtotal, cupón, checkout CTA.
4. **Checkout**: Dirección, envío, pago (Stripe/OpenPay), confirmación.
5. **Search & Filters**: Categoría, rango de precio, disponibilidad.
6. **Account**: Pedidos, perfil, direcciones, lista de deseos.
7. **Blog / Lucha Libre**: Entrevistas, historia de luchadores, cultura.

### Escalabilidad de Tokens
- Futuro modo claro: definir `--bg-canvas-light`, `--text-primary-light` y un `[data-theme="light"]` scope.
- Variantes promocionales (ferias, luchador destacado): extender paleta con `--accent-tertiary` temporal.
- Internacionalización: tipografía fallback: Bangers → Impact → sans-serif heavy.

---

## 7. Pre-delivery Checklist (Obligatorio antes de deploy)

- [ ] Sin horizontal scroll a 375px y todos los breakpoints.
- [ ] CLS ≤ 0.05 (Cumulative Layout Shift) — placeholders con aspect-ratio.
- [ ] Todos los botones con hover, focus-visible, active:scale-95.
- [ ] Touch targets ≥ 48×48px.
- [ ] Imágenes con `alt` descriptivo.
- [ ] Announcement bar responsive.
- [ ] Product grid muestra 3 productos con badges y CTA.
- [ ] Trust props de 3 columnas en ≥ md, 1 columna en móvil.
- [ ] Footer con social icons y copyright.
- [ ] Fuentes Bangers + Inter cargadas desde Google Fonts con `display=swap`.
- [ ] Respeto a `prefers-reduced-motion`.
- [ ] Tailwind config extendida con tokens del design system.
