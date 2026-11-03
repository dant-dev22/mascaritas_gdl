'use client';

import { Link } from '@/i18n/navigation';
import { ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { BRAND, HEADER_LINKS } from '@/__data__/navLinks';
import { CATALOG_PATH } from '@/__lib__/catalogUrl';
import { cn } from '@/__lib__/utils';
import { useCartContext } from '@/__hooks__/useCartContext';
import { Button, BUTTON_ICON_PROPS } from '@/components/ui/Button';
import { LocaleSwitcher } from './LocaleSwitcher';

interface HeaderProps {
  readonly className?: string;
}

export function Header({ className }: HeaderProps) {
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tA11y = useTranslations('a11y');
  const { state } = useCartContext();
  const cartCount = state.count;

  const brandName = tCommon(BRAND.nameKey);

  return (
    <header
      className={cn(
        'sticky top-0 z-40',
        'bg-canvas/80 backdrop-blur',
        'border-b border-border-subtle',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          aria-label={tA11y('homeLink', { brand: brandName })}
          className="flex items-center gap-2 group touch-target"
        >
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-surface border border-border-subtle group-hover:border-border-emphasis transition-colors">
            <span className="font-display text-2xl text-accent-green leading-none">
              {tCommon(BRAND.shortCodeKey)}
            </span>
          </span>
          <span className="hidden sm:inline font-display text-xl md:text-2xl tracking-wide leading-none text-white group-hover:text-accent-green-hover transition-colors">
            {brandName}
          </span>
        </Link>

        <nav
          aria-label={tA11y('mainNav')}
          className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted"
        >
          {HEADER_LINKS.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="touch-target inline-flex items-center hover:text-white transition-colors"
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LocaleSwitcher />

          <Button
            as="link"
            href={CATALOG_PATH}
            variant="primary"
            size="sm"
            leftIcon={<ShoppingCart {...BUTTON_ICON_PROPS} aria-hidden="true" />}
            aria-label={
              cartCount > 0
                ? tA11y('catalogLinkWithCount', { count: cartCount })
                : tA11y('catalogLink')
            }
          >
            <span className="hidden sm:inline">{t('viewCatalog')}</span>
            <span className="sm:hidden">{t('catalogShort')}</span>
            {cartCount > 0 ? (
              <span
                aria-hidden="true"
                className="ml-0.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-white/15 text-[11px] font-bold text-white"
              >
                {cartCount}
              </span>
            ) : null}
          </Button>
        </div>
      </div>
    </header>
  );
}
