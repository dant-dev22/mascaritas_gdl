import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/__lib__/utils';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  readonly label?: string;
  readonly hint?: string;
  readonly error?: string;
  readonly leftIcon?: ReactNode;
  readonly containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, leftIcon, containerClassName, className, id, ...rest },
  ref,
) {
  const inputId = id ?? `input-${rest.name ?? 'field'}`;
  const describedBy = error
    ? `${inputId}-error`
    : hint
      ? `${inputId}-hint`
      : undefined;

  return (
    <div className={cn('w-full flex flex-col gap-2', containerClassName)}>
      {label ? (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted"
        >
          {label}
        </label>
      ) : null}

      <div className="relative w-full">
        {leftIcon ? (
          <span
            aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-faint pointer-events-none"
          >
            {leftIcon}
          </span>
        ) : null}

        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            'touch-target w-full h-12 rounded-2xl',
            'bg-surface border border-border-subtle',
            'text-[15px] text-white placeholder:text-text-faint',
            'px-4 transition-all duration-200 ease-out',
            leftIcon ? 'pl-11' : 'pl-4',
            'hover:border-border-emphasis',
            'focus:outline-none focus:border-accent-green focus:shadow-glow-green',
            error ? 'border-accent-red focus:border-accent-red' : '',
            className,
          )}
          {...rest}
        />
      </div>

      {error ? (
        <p id={`${inputId}-error`} role="alert" className="text-xs text-accent-red">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-xs text-text-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
