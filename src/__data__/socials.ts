import type { SocialLink } from '@/__types__';

export const SOCIAL_LINKS: ReadonlyArray<SocialLink> = [
  {
    id: 'ig',
    platform: 'instagram',
    ariaLabel: 'Abrir Instagram de Mascaritas GDL',
    href: '#',
  },
  {
    id: 'fb',
    platform: 'facebook',
    ariaLabel: 'Abrir Facebook de Mascaritas GDL',
    href: '#',
  },
  {
    id: 'tt',
    platform: 'tiktok',
    ariaLabel: 'Abrir TikTok de Mascaritas GDL',
    href: '#',
  },
  {
    id: 'wa',
    platform: 'whatsapp',
    ariaLabel: 'Chatear por WhatsApp con Mascaritas GDL',
    href: '#',
  },
] as const;
