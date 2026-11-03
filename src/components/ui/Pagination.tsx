'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/__lib__/utils';
import type { PaginationMeta } from '@/__types__';

interface PaginationProps {
  readonly meta: PaginationMeta;
  readonly onPageChange: (page: number) => void;
  readonly className?: string;
}

const ELLIPSIS_LEFT = 'ellipsis-left' as const;
const ELLIPSIS_RIGHT = 'ellipsis-right' as const;

type PageToken = number | typeof ELLIPSIS_LEFT | typeof ELLIPSIS_RIGHT;

function buildPageTokens(page: number, totalPages: number): ReadonlyArray<PageToken> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const tokens: PageToken[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) tokens.push(ELLIPSIS_LEFT);
  for (let current = start; current <= end; current += 1) tokens.push(current);
  if (end < totalPages - 1) tokens.push(ELLIPSIS_RIGHT);
  tokens.push(totalPages);

  return tokens;
}

const NAV_BUTTON_CLASS = cn(
  'touch-target inline-flex items-center justify-center',
  'h-12 w-12 rounded-2xl',
  'bg-surface border border-border-subtle text-white',
  'hover:border-border-emphasis hover:bg-surface-hover',
  'active:scale-[0.96]',
  'focus-visible:outline-none focus-visible:shadow-glow-green',
  'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
  'transition-all duration-200 ease-out',
);

export function Pagination({ meta, onPageChange, className }: PaginationProps) {
  const t = useTranslations('a11y');

  if (meta.totalPages <= 1) return null;

  const tokens = buildPageTokens(meta.page, meta.totalPages);

  return (
    <nav
      aria-label={t('pagination')}
      className={cn('w-full flex items-center justify-between gap-3', className)}
    >
      <button
        type="button"
        onClick={() => onPageChange(meta.page - 1)}
        disabled={!meta.hasPrevPage}
        aria-label={t('paginationPrev')}
        className={NAV_BUTTON_CLASS}
      >
        <ChevronLeft width={20} height={20} strokeWidth={2} aria-hidden="true" />
      </button>

      {/* Compacto en móvil */}
      <p className="sm:hidden text-sm text-text-muted" aria-live="polite">
        {t.rich('paginationPage', {
          page: meta.page,
          total: meta.totalPages,
          b: (chunks) => <span className="font-semibold text-white">{chunks}</span>,
        })}
      </p>

      {/* Numerada con elipsis en escritorio */}
      <ul className="hidden sm:flex items-center gap-2">
        {tokens.map((token) =>
          typeof token === 'number' ? (
            <li key={token}>
              <button
                type="button"
                onClick={() => onPageChange(token)}
                aria-label={t('paginationGoTo', { page: token })}
                aria-current={token === meta.page ? 'page' : undefined}
                className={cn(
                  NAV_BUTTON_CLASS,
                  'font-semibold tabular-nums',
                  token === meta.page
                    ? 'bg-accent-green border-accent-green text-white hover:bg-accent-green-hover'
                    : '',
                )}
              >
                {token}
              </button>
            </li>
          ) : (
            <li
              key={token}
              aria-hidden="true"
              className="w-8 text-center text-text-faint select-none"
            >
              …
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        onClick={() => onPageChange(meta.page + 1)}
        disabled={!meta.hasNextPage}
        aria-label={t('paginationNext')}
        className={NAV_BUTTON_CLASS}
      >
        <ChevronRight width={20} height={20} strokeWidth={2} aria-hidden="true" />
      </button>
    </nav>
  );
}
