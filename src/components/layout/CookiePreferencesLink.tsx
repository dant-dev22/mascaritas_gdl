'use client';

import { useTranslations } from 'next-intl';
import { CONSENT_OPEN_EVENT } from '@/__data__/consent';

/** Enlace para reabrir el panel de cookies (retirar o revisar el consentimiento). */
export function CookiePreferencesLink() {
  const t = useTranslations('CookieBanner');

  const open = (): void => {
    window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
  };

  return (
    <button
      type="button"
      onClick={open}
      className="touch-target inline-flex cursor-pointer items-center py-1 transition-colors hover:text-text-muted"
    >
      {t('preferencesLink')}
    </button>
  );
}
