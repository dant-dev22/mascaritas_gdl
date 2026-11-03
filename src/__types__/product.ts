import type { IconName } from './ui';

export type ProductCategoryId = 'semi-pro' | 'profesional';

export type ProductSizeId = 'infantil' | 'adulto' | 'adulto-xl';

export type MaskStyle =
  | 'tiburon'
  | 'diablo'
  | 'galactico'
  | 'aguila'
  | 'serpiente'
  | 'pantera';

export type AccentColor =
  | 'gold'
  | 'green'
  | 'red'
  | 'blue'
  | 'purple'
  | 'silver';

export type ProductBadgeVariant = 'semi-pro' | 'last-units' | 'new';

export interface MaskPalette {
  readonly id: AccentColor;
  readonly label: string;
  readonly base: string;
  readonly baseDark: string;
  readonly accent: string;
  readonly accentDark: string;
  readonly contrast: string;
  readonly swatch: string;
}

export interface ProductCategory {
  readonly id: ProductCategoryId;
  readonly label: string;
  readonly description: string;
}

export interface ProductSize {
  readonly id: ProductSizeId;
  readonly label: string;
  readonly hint: string;
}

export interface Product {
  readonly id: string;
  readonly slug: string;
  readonly sku: string;
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly longDescription: string;
  readonly priceMXN: number;
  readonly oldPriceMXN?: number;
  readonly badge?: {
    readonly variant: ProductBadgeVariant;
    readonly label: string;
  };
  readonly accentColor: AccentColor;
  readonly categoryId: ProductCategoryId;
  readonly sizeId: ProductSizeId;
  readonly maskStyle: MaskStyle;
  readonly finish: string;
  readonly material: string;
  readonly lining: string;
  readonly inStock: boolean;
  readonly stockCount: number;
  readonly rating: number;
  readonly reviewsCount: number;
  readonly tags: ReadonlyArray<string>;
  readonly createdAt: string;
}

export interface TrustProp {
  readonly id: string;
  readonly icon: IconName;
  readonly title: string;
  readonly description: string;
  readonly highlight: string;
}
