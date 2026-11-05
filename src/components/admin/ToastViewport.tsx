'use client';

import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '@/__lib__/utils';
import type { AdminToast, AdminToastVariant } from '@/__types__';

interface ToastViewportProps {
  readonly toasts: ReadonlyArray<AdminToast>;
  readonly onDismiss: (id: string) => void;
}

const TOAST_STYLES: Record<AdminToastVariant, string> = {
  success: 'border-accent-green/40',
  error: 'border-accent-red/40',
  info: 'border-border-emphasis',
};

const ICON_STYLES: Record<AdminToastVariant, string> = {
  success: 'text-accent-green',
  error: 'text-accent-red',
  info: 'text-text-muted',
};

function ToastIcon({ variant }: { readonly variant: AdminToastVariant }) {
  const props = { width: 18, height: 18, strokeWidth: 2, 'aria-hidden': true } as const;

  if (variant === 'success') return <CheckCircle2 {...props} />;
  if (variant === 'error') return <AlertTriangle {...props} />;
  return <Info {...props} />;
}

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[80] flex flex-col gap-3 sm:left-auto sm:right-5 sm:w-[360px]"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'pointer-events-auto flex items-start gap-3 rounded-2xl',
            'border bg-surface px-4 py-3 shadow-card',
            'cookie-banner-enter',
            TOAST_STYLES[toast.variant],
          )}
        >
          <span className={cn('mt-0.5 shrink-0', ICON_STYLES[toast.variant])}>
            <ToastIcon variant={toast.variant} />
          </span>

          <p className="flex-1 text-sm leading-relaxed text-white">{toast.message}</p>

          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className={cn(
              'shrink-0 rounded-lg p-1 text-text-muted',
              'transition-colors duration-200 hover:text-white',
              'focus-visible:outline-none focus-visible:shadow-glow-green',
            )}
          >
            <X width={16} height={16} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
