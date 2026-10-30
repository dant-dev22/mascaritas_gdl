import { Check } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/__lib__/utils';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  readonly label: string;
  readonly hint?: string;
  readonly count?: number;
  readonly swatch?: string;
}

export function Checkbox({
  label,
  hint,
  count,
  swatch,
  className,
  id,
  ...rest
}: CheckboxProps) {
  const inputId = id ?? `checkbox-${rest.name ?? 'field'}-${label}`;

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'group flex items-center gap-3 cursor-pointer select-none',
        'min-h-[48px] py-1.5 rounded-xl px-2 -mx-2',
        'hover:bg-surface-hover transition-colors duration-200',
        'has-[:focus-visible]:shadow-glow-green',
        className,
      )}
    >
      <input id={inputId} type="checkbox" className="peer sr-only" {...rest} />

      <span
        aria-hidden="true"
        className={cn(
          'shrink-0 inline-flex items-center justify-center',
          'w-5 h-5 rounded-md border transition-all duration-200',
          'border-border-emphasis bg-canvas text-transparent',
          'peer-checked:bg-accent-green peer-checked:border-accent-green peer-checked:text-white',
        )}
      >
        <Check width={14} height={14} strokeWidth={3} />
      </span>

      {swatch ? (
        <span
          aria-hidden="true"
          style={{ backgroundColor: swatch }}
          className="shrink-0 w-4 h-4 rounded-full border border-white/20"
        />
      ) : null}

      <span className="flex-1 text-sm text-text-muted group-hover:text-white transition-colors">
        {label}
        {hint ? <span className="block text-xs text-text-faint">{hint}</span> : null}
      </span>

      {typeof count === 'number' ? (
        <span className="text-xs font-medium text-text-faint tabular-nums">{count}</span>
      ) : null}
    </label>
  );
}
