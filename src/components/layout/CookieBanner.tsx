'use client';

import { useEffect, useState } from 'react';
import { Cookie, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { cn } from '@/__lib__/utils';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { useConsent } from '@/__hooks__/useConsent';
import { readConsent, saveConsent } from '@/__lib__/consent';
import {
  CONSENT_BANNER_DELAY_MS,
  CONSENT_CATEGORIES,
  CONSENT_OPEN_EVENT,
  DEFAULT_CONSENT_CATEGORIES,
} from '@/__data__/consent';
import type { ConsentCategories, ConsentCategoryId } from '@/__types__';

/**
 * Aviso de cookies conforme a GDPR/ePrivacy: aceptar y rechazar con el mismo
 * peso visual, preferencias granulares por categoría (sin casillas premarcadas)
 * y persistencia de la decisión con versión y fecha.
 */
export function CookieBanner() {
  const t = useTranslations('CookieBanner');
  const consent = useConsent();

  const [ready, setReady] = useState(false);
  const [reopened, setReopened] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [draft, setDraft] = useState<ConsentCategories>(DEFAULT_CONSENT_CATEGORIES);

  // Aparición con retraso para no competir con la carga inicial de la página.
  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), CONSENT_BANNER_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  // Permite reabrir el panel (retirar o revisar la decisión) desde cualquier punto.
  useEffect(() => {
    const handleOpen = (): void => {
      setDraft(readConsent()?.categories ?? DEFAULT_CONSENT_CATEGORIES);
      setShowPreferences(true);
      setReopened(true);
    };

    window.addEventListener(CONSENT_OPEN_EVENT, handleOpen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, handleOpen);
  }, []);

  const visible = reopened || (ready && consent === null);

  if (!visible) return null;

  const finish = (): void => {
    setReopened(false);
    setShowPreferences(false);
  };

  const acceptAll = (): void => {
    saveConsent('accepted', { necessary: true, analytics: true, marketing: true });
    finish();
  };

  const rejectAll = (): void => {
    saveConsent('rejected', DEFAULT_CONSENT_CATEGORIES);
    finish();
  };

  const saveCustom = (): void => {
    saveConsent('custom', draft);
    finish();
  };

  const toggleCategory = (id: ConsentCategoryId, value: boolean): void => {
    setDraft((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
      className={cn(
        'fixed inset-x-0 bottom-0 z-[95] p-3',
        'sm:inset-x-auto sm:left-6 sm:bottom-6 sm:p-0 sm:max-w-md',
        'cookie-banner-enter',
      )}
    >
      <div
        className={cn(
          'rounded-2xl border border-border-subtle bg-surface/95 backdrop-blur-xl',
          'shadow-[0_24px_70px_-24px_rgba(0,0,0,0.9)]',
          'p-5 sm:p-6',
        )}
      >
        <div className="flex items-start gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border-subtle bg-canvas">
            <Cookie width={22} height={22} strokeWidth={2} aria-hidden="true" className="text-accent-green" />
          </span>
          <div className="pt-0.5">
            <h2 id="cookie-banner-title" className="font-display text-2xl leading-none text-white">
              {t('title')}
            </h2>
          </div>
        </div>

        <p
          id="cookie-banner-description"
          className="mt-3 text-sm leading-relaxed text-text-muted"
        >
          {t('description')}
        </p>

        <Link
          href="/aviso-de-privacidad"
          className="mt-2 inline-flex text-xs font-semibold text-accent-green underline underline-offset-2 transition-colors hover:text-accent-green-hover"
        >
          {t('privacyLink')}
        </Link>

        {showPreferences ? (
          <div className="mt-5 border-t border-border-subtle pt-5">
            <div className="space-y-1">
              {CONSENT_CATEGORIES.map((category) => (
                <Switch
                  key={category.id}
                  label={t(category.labelKey)}
                  hint={t(category.descriptionKey)}
                  checked={draft[category.id]}
                  disabled={category.required}
                  statusLabel={category.required ? t('alwaysActive') : undefined}
                  onChange={(value) => toggleCategory(category.id, value)}
                />
              ))}
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <Button variant="primary" size="lg" fullWidth onClick={saveCustom}>
                {t('savePreferences')}
              </Button>
              <Button variant="ghost" size="md" fullWidth onClick={() => setShowPreferences(false)}>
                {t('back')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-5 flex flex-col gap-3">
            {/* Aceptar y rechazar comparten tamaño y jerarquía (sin dark patterns). */}
            <Button variant="primary" size="lg" fullWidth onClick={acceptAll}>
              {t('acceptAll')}
            </Button>
            <Button variant="secondary" size="lg" fullWidth onClick={rejectAll}>
              {t('rejectAll')}
            </Button>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onClick={() => setShowPreferences(true)}
              leftIcon={<ShieldCheck width={18} height={18} strokeWidth={2} aria-hidden="true" />}
            >
              {t('customize')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
