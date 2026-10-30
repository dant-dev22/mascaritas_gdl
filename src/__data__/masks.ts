import type {
  AccentColor,
  MaskPalette,
  ProductCategory,
  ProductSize,
} from '@/__types__';

export const MASK_PALETTES: Record<AccentColor, MaskPalette> = {
  gold: {
    id: 'gold',
    label: 'Dorado',
    base: '#2a2000',
    baseDark: '#120c00',
    accent: '#f4c542',
    accentDark: '#d99b2c',
    contrast: '#e63946',
    swatch: '#f4c542',
  },
  green: {
    id: 'green',
    label: 'Verde',
    base: '#003322',
    baseDark: '#001810',
    accent: '#00a86b',
    accentDark: '#008f5a',
    contrast: '#e63946',
    swatch: '#00a86b',
  },
  red: {
    id: 'red',
    label: 'Rojo',
    base: '#33080c',
    baseDark: '#1a0406',
    accent: '#e63946',
    accentDark: '#b82833',
    contrast: '#f4c542',
    swatch: '#e63946',
  },
  blue: {
    id: 'blue',
    label: 'Azul',
    base: '#041a33',
    baseDark: '#020d1a',
    accent: '#2f80ed',
    accentDark: '#1f5fb3',
    contrast: '#f4c542',
    swatch: '#2f80ed',
  },
  purple: {
    id: 'purple',
    label: 'Morado',
    base: '#1e0633',
    baseDark: '#0f031a',
    accent: '#9b51e0',
    accentDark: '#7439ad',
    contrast: '#00a86b',
    swatch: '#9b51e0',
  },
  silver: {
    id: 'silver',
    label: 'Plata',
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
    id: 'clasicas',
    label: 'Clásicas',
    description: 'Diseños tradicionales de la lucha libre mexicana.',
  },
  {
    id: 'semi-pro',
    label: 'Semi-Pro',
    description: 'Reforzadas para entrenamiento y funciones locales.',
  },
  {
    id: 'coleccion',
    label: 'Colección',
    description: 'Ediciones limitadas y homenajes a leyendas.',
  },
  {
    id: 'personalizadas',
    label: 'Personalizadas',
    description: 'Base lista para tu diseño, nombre o escudo.',
  },
] as const;

export const PRODUCT_SIZES: ReadonlyArray<ProductSize> = [
  { id: 'infantil', label: 'Infantil', hint: '6 a 12 años' },
  { id: 'adulto', label: 'Adulto', hint: 'Talla estándar ajustable' },
  { id: 'adulto-xl', label: 'Adulto XL', hint: 'Cabezas grandes / con cabello' },
] as const;
