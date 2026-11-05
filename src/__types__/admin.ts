import type {
  AccentColor,
  MaskStyle,
  ProductBadgeVariant,
  ProductCategoryId,
  ProductSizeId,
} from './product';

/** Cuenta que puede entrar al panel admin. */
export interface AdminUser {
  readonly id: number;
  readonly email: string;
  readonly name: string;
  readonly role: string;
}

/** Respuesta del backend al iniciar sesión. */
export interface AdminLoginResponse {
  readonly accessToken: string;
  readonly tokenType: string;
  readonly user: AdminUser;
}

export interface AdminProductListParams {
  readonly search?: string;
  readonly sort?: string;
  readonly page?: number;
  readonly perPage?: number;
}

/** Estado de la sesión del panel, resuelto en el cliente. */
export type AdminSessionStatus = 'loading' | 'authenticated' | 'anonymous';

/** Icono disponible para los enlaces de la barra lateral del panel. */
export type AdminNavIcon = 'products' | 'site';

export interface AdminNavItem {
  readonly id: string;
  /** Clave del catálogo de mensajes (namespace `Admin`) con la etiqueta visible. */
  readonly labelKey: string;
  readonly href: string;
  readonly icon: AdminNavIcon;
}

export interface AdminSelectOption {
  readonly value: string;
  /** Clave del catálogo de mensajes (namespace `Admin`) con la etiqueta visible. */
  readonly labelKey: string;
}

export type AdminToastVariant = 'success' | 'error' | 'info';

export interface AdminToast {
  readonly id: string;
  readonly variant: AdminToastVariant;
  readonly message: string;
}

export interface ToastContextValue {
  readonly toasts: ReadonlyArray<AdminToast>;
  readonly pushToast: (variant: AdminToastVariant, message: string) => void;
  readonly dismissToast: (id: string) => void;
}

/**
 * Valores del formulario. Los numéricos viven como texto para poder
 * representar el estado vacío; se convierten al enviar.
 */
export interface AdminProductFormValues {
  slug: string;
  sku: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  priceMXN: string;
  oldPriceMXN: string;
  badgeVariant: string;
  badgeLabel: string;
  accentColor: string;
  categoryId: string;
  sizeId: string;
  maskStyle: string;
  finish: string;
  material: string;
  lining: string;
  inStock: boolean;
  stockCount: string;
  rating: string;
  reviewsCount: string;
  tags: string;
  subtitleEn: string;
  descriptionEn: string;
  longDescriptionEn: string;
  badgeLabelEn: string;
  finishEn: string;
  materialEn: string;
  liningEn: string;
}

/** Códigos de error del formulario; el componente los traduce. */
export type AdminFormErrorCode =
  | 'required'
  | 'slugFormat'
  | 'positive'
  | 'nonNegative'
  | 'ratingRange'
  | 'oldPriceLower'
  | 'badgeIncomplete';

export type AdminFormErrors = Partial<
  Record<keyof AdminProductFormValues, AdminFormErrorCode>
>;

/**
 * Cuerpo de entrada para crear o editar un producto.
 * Los campos calculados por el backend (`id`, `position`, `createdAt`,
 * `searchBlob`) no se envían; las traducciones son opcionales.
 */
export interface AdminProductInput {
  slug: string;
  sku: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  priceMXN: number;
  oldPriceMXN?: number | null;
  badgeVariant?: ProductBadgeVariant | null;
  badgeLabel?: string | null;
  accentColor: AccentColor;
  categoryId: ProductCategoryId;
  sizeId: ProductSizeId;
  maskStyle: MaskStyle;
  finish: string;
  material: string;
  lining: string;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewsCount: number;
  tags: string[];
  subtitleEn?: string | null;
  descriptionEn?: string | null;
  longDescriptionEn?: string | null;
  badgeLabelEn?: string | null;
  finishEn?: string | null;
  materialEn?: string | null;
  liningEn?: string | null;
}
