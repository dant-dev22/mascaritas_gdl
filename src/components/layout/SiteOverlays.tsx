'use client';

import { usePathname } from '@/i18n/navigation';
import { LanguageGate } from './LanguageGate';
import { CookieBanner } from './CookieBanner';

/**
 * Capas flotantes del sitio público (popup de idioma y aviso de cookies).
 * Se omiten dentro del panel admin, donde no aplican.
 */
export function SiteOverlays() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      <LanguageGate />
      <CookieBanner />
    </>
  );
}
