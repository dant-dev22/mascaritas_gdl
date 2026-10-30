export type BadgeVariant = 'semi-pro' | 'last-units' | 'new' | 'success';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface SocialLink {
  readonly id: string;
  readonly platform: 'instagram' | 'facebook' | 'tiktok' | 'whatsapp';
  readonly ariaLabel: string;
  readonly href: string;
}

export interface NavLink {
  readonly id: string;
  readonly label: string;
  readonly href: string;
}

export interface Announcement {
  readonly id: string;
  readonly message: string;
  readonly icon: 'truck' | 'flame' | 'sparkles';
}

export type HeroCtaId = 'catalog' | 'why-us';

export interface HeroCta {
  readonly id: HeroCtaId;
  readonly label: string;
  readonly href: string;
  readonly variant: ButtonVariant;
  readonly icon: 'shopping-bag' | 'play';
}

export type SocialProofAggregate = Readonly<{
  happyCustomersLabel: string;
  happyCustomersCount: number;
}>;

export type IconName = 'truck' | 'hand' | 'shield-check';
