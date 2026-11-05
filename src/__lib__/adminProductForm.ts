import type {
  AccentColor,
  AdminFormErrors,
  AdminProductFormValues,
  AdminProductInput,
  MaskStyle,
  Product,
  ProductBadgeVariant,
  ProductCategoryId,
  ProductSizeId,
} from '@/__types__';

/** Formato de slug que exige el backend (kebab-case en minúsculas). */
export const ADMIN_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function createEmptyValues(): AdminProductFormValues {
  return {
    slug: '',
    sku: '',
    title: '',
    subtitle: '',
    description: '',
    longDescription: '',
    priceMXN: '',
    oldPriceMXN: '',
    badgeVariant: '',
    badgeLabel: '',
    accentColor: 'gold',
    categoryId: 'semi-pro',
    sizeId: 'adulto',
    maskStyle: 'tiburon',
    finish: '',
    material: '',
    lining: '',
    inStock: true,
    stockCount: '0',
    rating: '0',
    reviewsCount: '0',
    tags: '',
    subtitleEn: '',
    descriptionEn: '',
    longDescriptionEn: '',
    badgeLabelEn: '',
    finishEn: '',
    materialEn: '',
    liningEn: '',
  };
}

/** Convierte un producto existente en valores de formulario (editables). */
export function toFormValues(product: Product): AdminProductFormValues {
  return {
    slug: product.slug,
    sku: product.sku,
    title: product.title,
    subtitle: product.subtitle,
    description: product.description,
    longDescription: product.longDescription,
    priceMXN: String(product.priceMXN),
    oldPriceMXN: product.oldPriceMXN === undefined ? '' : String(product.oldPriceMXN),
    badgeVariant: product.badge?.variant ?? '',
    badgeLabel: product.badge?.label ?? '',
    accentColor: product.accentColor,
    categoryId: product.categoryId,
    sizeId: product.sizeId,
    maskStyle: product.maskStyle,
    finish: product.finish,
    material: product.material,
    lining: product.lining,
    inStock: product.inStock,
    stockCount: String(product.stockCount),
    rating: String(product.rating),
    reviewsCount: String(product.reviewsCount),
    tags: product.tags.join(', '),
    subtitleEn: product.subtitleEn ?? '',
    descriptionEn: product.descriptionEn ?? '',
    longDescriptionEn: product.longDescriptionEn ?? '',
    badgeLabelEn: product.badgeLabelEn ?? '',
    finishEn: product.finishEn ?? '',
    materialEn: product.materialEn ?? '',
    liningEn: product.liningEn ?? '',
  };
}

function parseNumber(value: string): number {
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

/**
 * Valida el formulario con las mismas reglas que el backend.
 * Devuelve un mapa de códigos de error; el componente los traduce.
 */
export function validateForm(values: AdminProductFormValues): AdminFormErrors {
  const errors: AdminFormErrors = {};

  if (isBlank(values.slug)) {
    errors.slug = 'required';
  } else if (!ADMIN_SLUG_PATTERN.test(values.slug.trim())) {
    errors.slug = 'slugFormat';
  }

  if (isBlank(values.sku)) errors.sku = 'required';
  if (isBlank(values.title)) errors.title = 'required';
  if (isBlank(values.subtitle)) errors.subtitle = 'required';
  if (isBlank(values.description)) errors.description = 'required';
  if (isBlank(values.longDescription)) errors.longDescription = 'required';
  if (isBlank(values.finish)) errors.finish = 'required';
  if (isBlank(values.material)) errors.material = 'required';
  if (isBlank(values.lining)) errors.lining = 'required';

  const price = parseNumber(values.priceMXN);
  if (isBlank(values.priceMXN)) {
    errors.priceMXN = 'required';
  } else if (!Number.isInteger(price) || price <= 0) {
    errors.priceMXN = 'positive';
  }

  if (!isBlank(values.oldPriceMXN)) {
    const oldPrice = parseNumber(values.oldPriceMXN);
    if (!Number.isInteger(oldPrice) || oldPrice < 0) {
      errors.oldPriceMXN = 'nonNegative';
    } else if (Number.isInteger(price) && oldPrice < price) {
      errors.oldPriceMXN = 'oldPriceLower';
    }
  }

  const stockCount = parseNumber(values.stockCount);
  if (isBlank(values.stockCount)) {
    errors.stockCount = 'required';
  } else if (!Number.isInteger(stockCount) || stockCount < 0) {
    errors.stockCount = 'nonNegative';
  }

  const rating = parseNumber(values.rating);
  if (isBlank(values.rating)) {
    errors.rating = 'required';
  } else if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
    errors.rating = 'ratingRange';
  }

  const reviewsCount = parseNumber(values.reviewsCount);
  if (isBlank(values.reviewsCount)) {
    errors.reviewsCount = 'required';
  } else if (!Number.isInteger(reviewsCount) || reviewsCount < 0) {
    errors.reviewsCount = 'nonNegative';
  }

  // La etiqueta se compone de variante + texto: o van las dos o ninguna.
  if (isBlank(values.badgeVariant) !== isBlank(values.badgeLabel)) {
    errors.badgeLabel = 'badgeIncomplete';
  }

  return errors;
}

/** Separa las etiquetas escritas como lista con comas. */
export function parseTags(value: string): string[] {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

/** Texto opcional: `null` cuando el campo viene vacío. */
function optional(value: string): string | null {
  return isBlank(value) ? null : value.trim();
}

/** Traduce los valores del formulario al cuerpo que espera el backend. */
export function toProductInput(values: AdminProductFormValues): AdminProductInput {
  return {
    slug: values.slug.trim(),
    sku: values.sku.trim(),
    title: values.title.trim(),
    subtitle: values.subtitle.trim(),
    description: values.description.trim(),
    longDescription: values.longDescription.trim(),
    priceMXN: Math.trunc(parseNumber(values.priceMXN)),
    oldPriceMXN: isBlank(values.oldPriceMXN)
      ? null
      : Math.trunc(parseNumber(values.oldPriceMXN)),
    badgeVariant: isBlank(values.badgeVariant)
      ? null
      : (values.badgeVariant as ProductBadgeVariant),
    badgeLabel: optional(values.badgeLabel),
    accentColor: values.accentColor as AccentColor,
    categoryId: values.categoryId as ProductCategoryId,
    sizeId: values.sizeId as ProductSizeId,
    maskStyle: values.maskStyle as MaskStyle,
    finish: values.finish.trim(),
    material: values.material.trim(),
    lining: values.lining.trim(),
    inStock: values.inStock,
    stockCount: Math.trunc(parseNumber(values.stockCount)),
    rating: parseNumber(values.rating),
    reviewsCount: Math.trunc(parseNumber(values.reviewsCount)),
    tags: parseTags(values.tags),
    subtitleEn: optional(values.subtitleEn),
    descriptionEn: optional(values.descriptionEn),
    longDescriptionEn: optional(values.longDescriptionEn),
    badgeLabelEn: optional(values.badgeLabelEn),
    finishEn: optional(values.finishEn),
    materialEn: optional(values.materialEn),
    liningEn: optional(values.liningEn),
  };
}
