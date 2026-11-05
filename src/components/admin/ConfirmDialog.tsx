'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/__lib__/utils';

/** Elementos que pueden recibir el foco dentro del diálogo. */
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

interface ConfirmDialogProps {
  readonly title: string;
  readonly description: string;
  readonly confirmLabel: string;
  readonly busyLabel: string;
  readonly cancelLabel: string;
  readonly isBusy: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

/** Diálogo de confirmación para acciones destructivas (p. ej. eliminar). */
export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  busyLabel,
  cancelLabel,
  isBusy,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  // El callback se guarda en un ref para que el efecto de montaje corra una
  // sola vez aunque el padre pase una función nueva en cada render.
  const onCancelRef = useRef(onCancel);

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onCancelRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const container = dialogRef.current;
      if (container === null) return;

      const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      // Ciclo cerrado: el foco nunca escapa hacia la página de fondo.
      if (event.shiftKey) {
        if (active === first || !container.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !container.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    cancelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, []);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label={cancelLabel}
        onClick={onCancel}
        className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-md rounded-[1.5rem] border border-border-subtle bg-surface p-6 shadow-card">
        <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-accent-red/40 bg-accent-red/10">
          <AlertTriangle
            width={22}
            height={22}
            strokeWidth={2}
            aria-hidden="true"
            className="text-accent-red"
          />
        </span>

        <h2 className="font-display text-xl leading-tight text-white">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">{description}</p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button ref={cancelRef} type="button" variant="secondary" onClick={onCancel} disabled={isBusy}>
            {cancelLabel}
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            disabled={isBusy}
            className={cn(
              'bg-accent-red hover:bg-accent-red-hover',
              'shadow-[0_10px_40px_-12px_rgba(230,57,70,0.55)]',
            )}
          >
            {isBusy ? busyLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
