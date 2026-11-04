import type { Locale } from '@/i18n/routing';

/** Bloque de un documento legal (un subtítulo con párrafos y/o viñetas). */
export interface LegalSection {
  /** Subtítulo de la sección; se renderiza como `h2`. */
  readonly heading: string;
  /** Párrafos de texto plano, en orden. */
  readonly paragraphs?: ReadonlyArray<string>;
  /** Lista con viñetas opcional. */
  readonly bullets?: ReadonlyArray<string>;
}

/** Documento legal completo en un idioma. */
export interface LegalDocument {
  /** Título principal; se renderiza como `h1`. */
  readonly title: string;
  /** Resumen breve bajo el título (opcional). */
  readonly intro?: string;
  /** Fecha de última actualización en formato ISO `YYYY-MM-DD`. */
  readonly updatedAt: string;
  /** Secciones en orden de aparición. */
  readonly sections: ReadonlyArray<LegalSection>;
}

/** Documento legal disponible en todos los idiomas soportados. */
export type LocalizedLegalDocument = Record<Locale, LegalDocument>;
