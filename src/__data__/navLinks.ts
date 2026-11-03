import type { Announcement, HeroCta, NavLink, SocialProofAggregate } from '@/__types__';

export const ANNOUNCEMENT: Announcement = {
  id: 'free-shipping-2026',
  message: 'Envíos gratis a todo México en pedidos +$999 MXN',
  icon: 'truck',
} as const;

export const HEADER_LINKS: ReadonlyArray<NavLink> = [
  { id: 'catalog', label: 'Catálogo', href: '/catalogo' },
  { id: 'benefits', label: 'Beneficios', href: '/#beneficios' },
  { id: 'contact', label: 'Contacto', href: '/#contacto' },
] as const;

export const FOOTER_STORE_LINKS: ReadonlyArray<NavLink> = [
  { id: 'catalog', label: 'Catálogo', href: '/catalogo' },
  { id: 'best', label: 'Más vendidas', href: '/catalogo?orden=rating' },
  { id: 'offers', label: 'Ofertas', href: '/catalogo?precio=under-1000' },
  { id: 'professional', label: 'Profesional', href: '/catalogo?cat=profesional' },
] as const;

export const FOOTER_SUPPORT_LINKS: ReadonlyArray<NavLink> = [
  { id: 'shipping', label: 'Envíos', href: '#' },
  { id: 'returns', label: 'Devoluciones', href: '#' },
  { id: 'sizes', label: 'Guía de tallas', href: '#' },
  { id: 'contact', label: 'Contacto', href: '/#contacto' },
] as const;

export const LEGAL_LINKS: ReadonlyArray<NavLink> = [
  { id: 'terms', label: 'Términos y condiciones', href: '#' },
  { id: 'privacy', label: 'Aviso de privacidad', href: '#' },
] as const;

export const HERO_CTAS: ReadonlyArray<HeroCta> = [
  {
    id: 'catalog',
    label: 'Ver catálogo',
    href: '/catalogo',
    variant: 'primary',
    icon: 'shopping-bag',
  },
  {
    id: 'why-us',
    label: '¿Por qué elegirnos?',
    href: '/#beneficios',
    variant: 'secondary',
    icon: 'play',
  },
] as const;

export const SOCIAL_PROOF: SocialProofAggregate = {
  happyCustomersCount: 2400,
  happyCustomersLabel: 'luchadores y coleccionistas confían en nosotros',
} as const;

export const BRAND = {
  name: 'Mascaritas GDL',
  shortCode: 'MG',
  description:
    'Máscaras de lucha libre de excelente calidad al mejor precio. Enviamos a todo México desde Guadalajara, Jalisco.',
  copyright: '© 2026 Mascaritas GDL · Todos los derechos reservados.',
  whatsappSchedule: 'Lun–Sáb · 10am – 7pm CST',
  whatsappScheduleTitle: 'Respuesta inmediata en horario comercial',
} as const;
