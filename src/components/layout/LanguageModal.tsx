'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/__lib__/utils';
import { Button } from '@/components/ui/Button';
import { writeLocaleCookie } from '@/__lib__/localeCookie';
import { getLocaleFreeHref } from '@/__lib__/localeUrl';

interface LanguageModalProps {
  /** Se invoca cuando la persona confirma o cierra el popup. */
  readonly onDone: () => void;
}

/** Popup de primer ingreso: pregunta el idioma preferido. */
export function LanguageModal({ onDone }: LanguageModalProps) {
  const t = useTranslations('LanguageModal');
  const router = useRouter();
  const activeLocale = useLocale() as Locale;
  const [selected, setSelected] = useState<Locale>(activeLocale);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  const confirm = (locale: Locale): void => {
    const needsNavigation = locale !== activeLocale;

    onDone();

    if (needsNavigation) {
      const { pathname, query } = getLocaleFreeHref();
      router.replace({ pathname, query }, { locale });
    }

    // Reescribimos la cookie con caducidad de un año (next-intl usa sesión).
    writeLocaleCookie(locale);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Escape') confirm(selected);
  };

  const options: ReadonlyArray<{ value: Locale; label: string }> = [
    { value: 'es', label: t('optionEs') },
    { value: 'en', label: t('optionEn') },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-modal-title"
      aria-describedby="language-modal-description"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-full max-w-md mx-auto outline-none',
          'bg-surface border border-border-subtle rounded-3xl',
          'p-6 sm:p-8',
          'shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)]',
        )}
      >
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-canvas border border-border-subtle mb-5">
          <Globe
            width={22}
            height={22}
            strokeWidth={2}
            aria-hidden="true"
            className="text-accent-green"
          />
        </span>

        <h2
          id="language-modal-title"
          className="font-display text-display-md text-white leading-tight"
        >
          {t('title')}
        </h2>
        <p
          id="language-modal-description"
          className="text-text-muted text-sm sm:text-base leading-relaxed mt-2"
        >
          {t('description')}
        </p>

        <div role="radiogroup" aria-label={t('title')} className="mt-6 grid grid-cols-1 gap-3">
          {options.map((option) => {
            const isSelected = selected === option.value;

            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelected(option.value)}
                className={cn(
                  'touch-target w-full inline-flex items-center justify-between gap-3',
                  'h-14 px-4 rounded-2xl border text-left',
                  'text-[15px] font-semibold',
                  'active:scale-[0.98]',
                  'focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(0,168,107,0.25)]',
                  'transition-all duration-200 ease-out cursor-pointer',
                  isSelected
                    ? 'border-accent-green bg-accent-green/10 text-white'
                    : 'border-border-subtle bg-canvas text-text-muted hover:border-border-emphasis hover:text-white',
                )}
              >
                <span>{option.label}</span>
                <Check
                  width={20}
                  height={20}
                  strokeWidth={2.5}
                  aria-hidden="true"
                  className={cn(
                    'text-accent-green transition-opacity',
                    isSelected ? 'opacity-100' : 'opacity-0',
                  )}
                />
              </button>
            );
          })}
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          className="mt-6"
          onClick={() => confirm(selected)}
        >
          {t('continue')}
        </Button>
      </div>
    </div>
  );
}
