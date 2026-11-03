export type BadgeVariant = 'semi-pro' | 'last-units' | 'new' | 'success';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface SocialLink {
  readonly id: string;
  readonly platform: 'instagram' | 'facebook' | 'tiktok' | 'whatsapp';
  /** Clave del catálogo de mensajes (namespace `a11y`) con el texto de accesibilidad. */
  readonly ariaLabelKey: string;
  readonly href: string;
}

export interface NavLink {
  readonly id: string;
  readonly labelKey: string;
  readonly href: string;
}

export interface Announcement {
  readonly id: string;
  /** Clave del catálogo de mensajes (namespace `announcement`) con el texto visible. */
  readonly messageKey: string;
  readonly icon: 'truck' | 'flame' | 'sparkles';
}

export type HeroCtaId = 'catalog' | 'why-us';

export interface HeroCta {
  readonly id: HeroCtaId;
  /** Clave del catálogo de mensajes (namespace `hero`) con el texto visible. */
  readonly labelKey: string;
  readonly href: string;
  readonly variant: ButtonVariant;
  readonly icon: 'shopping-bag' | 'play';
}

export type SocialProofAggregate = Readonly<{
  /** Clave del catálogo de mensajes (namespace `hero`) con el texto visible. */
  happyCustomersLabelKey: string;
  happyCustomersCount: number;
}>;

export type IconName = 'truck' | 'hand' | 'shield-check';
