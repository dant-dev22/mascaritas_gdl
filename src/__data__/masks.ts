import type {
  AccentColor,
  MaskPalette,
  ProductCategory,
  ProductSize,
} from '@/__types__';

/**
 * Los campos de texto (`label`, `description`, `hint`) ya NO contienen texto visible:
 * ahora son CLAVES del catálogo de mensajes (namespaces `specs.colors`,
 * `specs.categories` y `specs.sizes`) que resuelve `ProductSpecs` con `t(...)`.
 * Se conservan los nombres de campo porque `catalogEngine.ts` (fuera de este bloque)
 * lee `.label`; sus usos viven en código que ya no renderiza la ficha.
 */
export const MASK_PALETTES: Record<AccentColor, MaskPalette> = {
  gold: {
    id: 'gold',
    label: 'gold',
    base: '#2a2000',
    baseDark: '#120c00',
    accent: '#f4c542',
    accentDark: '#d99b2c',
    contrast: '#e63946',
    swatch: '#f4c542',
  },
  green: {
    id: 'green',
    label: 'green',
    base: '#003322',
    baseDark: '#001810',
    accent: '#00a86b',
    accentDark: '#008f5a',
    contrast: '#e63946',
    swatch: '#00a86b',
  },
  red: {
    id: 'red',
    label: 'red',
    base: '#33080c',
    baseDark: '#1a0406',
    accent: '#e63946',
    accentDark: '#b82833',
    contrast: '#f4c542',
    swatch: '#e63946',
  },
  blue: {
    id: 'blue',
    label: 'blue',
    base: '#041a33',
    baseDark: '#020d1a',
    accent: '#2f80ed',
    accentDark: '#1f5fb3',
    contrast: '#f4c542',
    swatch: '#2f80ed',
  },
  purple: {
    id: 'purple',
    label: 'purple',
    base: '#1e0633',
    baseDark: '#0f031a',
    accent: '#9b51e0',
    accentDark: '#7439ad',
    contrast: '#00a86b',
    swatch: '#9b51e0',
  },
  silver: {
    id: 'silver',
    label: 'silver',
    base: '#1f2226',
    baseDark: '#0f1114',
    accent: '#c9ced6',
    accentDark: '#9aa1ab',
    contrast: '#e63946',
    swatch: '#c9ced6',
  },
};

export const PRODUCT_CATEGORIES: ReadonlyArray<ProductCategory> = [
  {
    id: 'semi-pro',
    label: 'semiPro',
    description: 'semiProDescription',
  },
  {
    id: 'profesional',
    label: 'profesional',
    description: 'profesionalDescription',
  },
] as const;

export const PRODUCT_SIZES: ReadonlyArray<ProductSize> = [
  { id: 'infantil', label: 'infantil', hint: 'infantilHint' },
  { id: 'adulto', label: 'adulto', hint: 'adultoHint' },
  { id: 'adulto-xl', label: 'adultoXl', hint: 'adultoXlHint' },
] as const;
