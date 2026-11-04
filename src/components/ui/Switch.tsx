'use client';

import { cn } from '@/__lib__/utils';

interface SwitchProps {
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  readonly label: string;
  readonly hint?: string;
  readonly disabled?: boolean;
  /** Texto corto que sustituye al control cuando está bloqueado (p. ej. "Siempre activas"). */
  readonly statusLabel?: string;
}

/** Interruptor accesible (checkbox con `role="switch"`) con etiqueta y descripción. */
export function Switch({
  checked,
  onChange,
  label,
  hint,
  disabled = false,
  statusLabel,
}: SwitchProps) {
  return (
    <label
      className={cn(
        'flex min-h-[48px] items-start gap-3 select-none rounded-xl px-2 -mx-2 py-1.5',
        'transition-colors duration-200',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-surface-hover',
      )}
    >
      <input
        type="checkbox"
        role="switch"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />

      <span
        aria-hidden="true"
        className={cn(
          'relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full border',
          'transition-colors duration-200',
          'peer-focus-visible:shadow-glow-green',
          checked ? 'bg-accent-green border-accent-green' : 'bg-canvas border-border-emphasis',
          disabled && 'opacity-70',
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 rounded-full bg-white shadow-sm',
            'transition-transform duration-200 ease-out',
            checked ? 'translate-x-6' : 'translate-x-1',
          )}
        />
      </span>

      <span className="flex-1">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm font-semibold text-white">{label}</span>
          {disabled && statusLabel ? (
            <span className="text-[11px] font-semibold uppercase tracking-wide text-accent-green">
              {statusLabel}
            </span>
          ) : null}
        </span>
        {hint ? (
          <span className="mt-0.5 block text-xs leading-relaxed text-text-muted">{hint}</span>
        ) : null}
      </span>
    </label>
  );
}
