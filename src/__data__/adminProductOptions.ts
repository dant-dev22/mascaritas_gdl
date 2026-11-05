import type { AdminSelectOption } from '@/__types__';

/**
 * Catálogos del formulario de producto. Los valores son los enums que espera
 * el backend; las etiquetas se resuelven con las claves del namespace `Admin`.
 */

export const ADMIN_ACCENT_OPTIONS: ReadonlyArray<AdminSelectOption> = [
  { value: 'gold', labelKey: 'options.colorGold' },
  { value: 'green', labelKey: 'options.colorGreen' },
  { value: 'red', labelKey: 'options.colorRed' },
  { value: 'blue', labelKey: 'options.colorBlue' },
  { value: 'purple', labelKey: 'options.colorPurple' },
  { value: 'silver', labelKey: 'options.colorSilver' },
] as const;

export const ADMIN_CATEGORY_OPTIONS: ReadonlyArray<AdminSelectOption> = [
  { value: 'semi-pro', labelKey: 'options.categorySemiPro' },
  { value: 'profesional', labelKey: 'options.categoryProfesional' },
] as const;

export const ADMIN_SIZE_OPTIONS: ReadonlyArray<AdminSelectOption> = [
  { value: 'infantil', labelKey: 'options.sizeInfantil' },
  { value: 'adulto', labelKey: 'options.sizeAdulto' },
  { value: 'adulto-xl', labelKey: 'options.sizeAdultoXl' },
] as const;

export const ADMIN_STYLE_OPTIONS: ReadonlyArray<AdminSelectOption> = [
  { value: 'tiburon', labelKey: 'options.styleTiburon' },
  { value: 'diablo', labelKey: 'options.styleDiablo' },
  { value: 'galactico', labelKey: 'options.styleGalactico' },
  { value: 'aguila', labelKey: 'options.styleAguila' },
  { value: 'serpiente', labelKey: 'options.styleSerpiente' },
  { value: 'pantera', labelKey: 'options.stylePantera' },
] as const;

/** La opción vacía representa "sin etiqueta" (el badge es opcional). */
export const ADMIN_BADGE_OPTIONS: ReadonlyArray<AdminSelectOption> = [
  { value: '', labelKey: 'options.badgeNone' },
  { value: 'semi-pro', labelKey: 'options.badgeSemiPro' },
  { value: 'last-units', labelKey: 'options.badgeLastUnits' },
  { value: 'new', labelKey: 'options.badgeNew' },
] as const;
