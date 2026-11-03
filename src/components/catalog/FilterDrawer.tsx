'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { cn } from '@/__lib__/utils';
import { BUTTON_ICON_PROPS } from '@/components/ui/Button';
import type { ReactNode } from 'react';

interface FilterDrawerProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly children: ReactNode;
  readonly title?: string;
}

export function FilterDrawer({
  isOpen,
  onClose,
  children,
  title,
}: FilterDrawerProps) {
  const t = useTranslations('filters');
  const resolvedTitle = title ?? t('drawerTitle');

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label={resolvedTitle}>
      <button
        type="button"
        aria-label={t('closeDrawer')}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-default"
      />

      <div
        className={cn(
          'absolute left-0 top-0 h-full w-[90%] max-w-sm',
          'bg-canvas border-r border-border-subtle',
          'p-5 overflow-y-auto',
          'flex flex-col gap-5',
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl text-white leading-none">{resolvedTitle}</h2>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            aria-label={t('closePanel')}
            className={cn(
              'touch-target inline-flex items-center justify-center',
              'w-12 h-12 rounded-2xl',
              'bg-surface border border-border-subtle text-white',
              'hover:border-border-emphasis hover:bg-surface-hover',
              'active:scale-[0.96]',
              'focus-visible:outline-none focus-visible:shadow-glow-green',
              'transition-all duration-200 ease-out',
            )}
          >
            <X {...BUTTON_ICON_PROPS} aria-hidden="true" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
