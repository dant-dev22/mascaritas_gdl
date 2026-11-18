'use client';

import { ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CATALOG_PATH } from '@/__lib__/catalogUrl';
import { cn } from '@/__lib__/utils';
import { Button, BUTTON_LARGE_ICON_PROPS } from '@/components/ui/Button';

interface CartEmptyStateProps {
  readonly className?: string;
  /** Se ejecuta al ir al catálogo (por ejemplo, cerrar el drawer). */
  readonly onNavigate?: () => void;
}

/** Estado vacío compartido por el drawer y la página del carrito. */
export function CartEmptyState({ className, onNavigate }: CartEmptyStateProps) {
  const t = useTranslations('cart');

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 text-center',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-surface border border-border-subtle text-text-muted"
      >
        <ShoppingCart {...BUTTON_LARGE_ICON_PROPS} />
      </span>
      <p className="font-display text-2xl text-white">{t('emptyTitle')}</p>
      <p className="max-w-sm text-sm leading-relaxed text-text-muted">{t('emptyDescription')}</p>
      <Button
        as="link"
        href={CATALOG_PATH}
        variant="secondary"
        size="md"
        className="mt-2"
        onClick={onNavigate}
      >
        {t('emptyCta')}
      </Button>
    </div>
  );
}
