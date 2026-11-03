import type { SocialLink } from '@/__types__';

export const SOCIAL_LINKS: ReadonlyArray<SocialLink> = [
  {
    id: 'ig',
    platform: 'instagram',
    ariaLabelKey: 'socialInstagram',
    href: '#',
  },
  {
    id: 'fb',
    platform: 'facebook',
    ariaLabelKey: 'socialFacebook',
    href: '#',
  },
  {
    id: 'tt',
    platform: 'tiktok',
    ariaLabelKey: 'socialTiktok',
    href: '#',
  },
  {
    id: 'wa',
    platform: 'whatsapp',
    ariaLabelKey: 'socialWhatsapp',
    href: '#',
  },
] as const;
