import type { Announcement, HeroCta, NavLink, SocialProofAggregate } from '@/__types__';

export const ANNOUNCEMENT: Announcement = {
  id: 'free-shipping-2026',
  messageKey: 'message',
  icon: 'truck',
} as const;

export const HEADER_LINKS: ReadonlyArray<NavLink> = [
  { id: 'catalog', labelKey: 'catalog', href: '/catalogo' },
  { id: 'benefits', labelKey: 'benefits', href: '/#beneficios' },
  { id: 'contact', labelKey: 'contact', href: '/#contacto' },
] as const;

export const FOOTER_STORE_LINKS: ReadonlyArray<NavLink> = [
  { id: 'catalog', labelKey: 'catalog', href: '/catalogo' },
  { id: 'best', labelKey: 'bestSellers', href: '/catalogo?orden=rating' },
  { id: 'offers', labelKey: 'offers', href: '/catalogo?precio=under-1000' },
  { id: 'professional', labelKey: 'professional', href: '/catalogo?cat=profesional' },
] as const;

export const FOOTER_SUPPORT_LINKS: ReadonlyArray<NavLink> = [
  { id: 'shipping', labelKey: 'supportShipping', href: '#' },
  { id: 'returns', labelKey: 'supportReturns', href: '#' },
  { id: 'sizes', labelKey: 'supportSizes', href: '#' },
  { id: 'contact', labelKey: 'contact', href: '/#contacto' },
] as const;

export const LEGAL_LINKS: ReadonlyArray<NavLink> = [
  { id: 'privacy', labelKey: 'legalPrivacy', href: '/aviso-de-privacidad' },
  { id: 'cookies', labelKey: 'legalCookies', href: '/politica-de-cookies' },
  { id: 'terms', labelKey: 'legalTerms', href: '/terminos-y-condiciones' },
] as const;

export const HERO_CTAS: ReadonlyArray<HeroCta> = [
  {
    id: 'catalog',
    labelKey: 'ctaCatalog',
    href: '/catalogo',
    variant: 'primary',
    icon: 'shopping-bag',
  },
  {
    id: 'why-us',
    labelKey: 'ctaWhyUs',
    href: '/#beneficios',
    variant: 'secondary',
    icon: 'play',
  },
] as const;

export const SOCIAL_PROOF: SocialProofAggregate = {
  happyCustomersCount: 2400,
  happyCustomersLabelKey: 'customersLabel',
} as const;

/**
 * Claves del catálogo de mensajes (namespace `common`) con los textos de marca.
 * Los valores los resuelve cada componente con `t(...)`.
 */
export const BRAND = {
  nameKey: 'brandName',
  shortCodeKey: 'brandShortCode',
  descriptionKey: 'brandDescription',
  copyrightKey: 'copyright',
  whatsappScheduleKey: 'whatsappSchedule',
  whatsappScheduleTitleKey: 'whatsappScheduleTitle',
} as const;
