/** Categorías de cookies que gestiona el aviso de consentimiento. */
export type ConsentCategoryId = 'necessary' | 'analytics' | 'marketing';

/** Acción que eligió la persona en el aviso. */
export type ConsentDecision = 'accepted' | 'rejected' | 'custom';

/** Estado por categoría. `necessary` nunca puede desactivarse. */
export interface ConsentCategories {
  readonly necessary: true;
  readonly analytics: boolean;
  readonly marketing: boolean;
}

/** Registro persistido con la decisión, la versión del aviso y la fecha (evidencia). */
export interface ConsentRecord {
  readonly version: number;
  readonly decision: ConsentDecision;
  readonly categories: ConsentCategories;
  /** Fecha ISO 8601 de cuándo se otorgó o actualizó el consentimiento. */
  readonly updatedAt: string;
}

/** Definición de una categoría para pintar el panel de preferencias. */
export interface ConsentCategoryDefinition {
  readonly id: ConsentCategoryId;
  /** Clave i18n (namespace `CookieBanner`) con el nombre visible. */
  readonly labelKey: string;
  /** Clave i18n (namespace `CookieBanner`) con la explicación. */
  readonly descriptionKey: string;
  /** Si es obligatoria no puede desactivarse. */
  readonly required: boolean;
}
