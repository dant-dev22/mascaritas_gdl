'use client';

import { Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { routing, type Locale } from '@/i18n/routing';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/__lib__/utils';
import { writeLocaleCookie } from '@/__lib__/localeCookie';
import { getLocaleFreeHref } from '@/__lib__/localeUrl';

interface LocaleSwitcherProps {
  readonly className?: string;
}

/**
 * Botón que alterna entre los idiomas disponibles manteniendo la página actual.
 * Solo hay dos idiomas, por lo que un toggle es suficiente y ocupa poco espacio.
 */
export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const t = useTranslations('LanguageSwitcher');
  const currentLocale = useLocale() as Locale;
  const router = useRouter();

  const nextLocale =
    (routing.locales as ReadonlyArray<Locale>).find((item) => item !== currentLocale) ??
    routing.defaultLocale;

  const handleSwitch = (): void => {
    const { pathname, query } = getLocaleFreeHref();

    // Navegamos a la misma página en el otro idioma.
    router.replace({ pathname, query }, { locale: nextLocale });

    // `next-intl` escribe la cookie como cookie de sesión; la reescribimos
    // con caducidad de un año para recordar la elección.
    writeLocaleCookie(nextLocale);
  };

  return (
    <button
      type="button"
      onClick={handleSwitch}
      aria-label={t('aria')}
      title={t('label')}
      className={cn(
        'touch-target inline-flex items-center justify-center gap-1.5',
        'h-12 min-w-12 px-3 rounded-2xl',
        'bg-surface border border-border-subtle',
        'text-text-muted hover:text-white hover:border-border-emphasis hover:bg-surface-hover',
        'active:scale-95',
        'focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(0,168,107,0.25)]',
        'transition-all duration-200 ease-out',
        'cursor-pointer',
        className,
      )}
    >
      <Globe width={18} height={18} strokeWidth={2} aria-hidden="true" />
      <span className="text-sm font-semibold uppercase tracking-wide">{currentLocale}</span>
    </button>
  );
}
