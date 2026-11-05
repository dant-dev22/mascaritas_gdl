import { forwardRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/__lib__/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  readonly label?: string;
  readonly hint?: string;
  readonly error?: string;
  readonly containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, containerClassName, className, id, rows = 4, ...rest },
  ref,
) {
  const textareaId = id ?? `textarea-${rest.name ?? 'field'}`;
  const describedBy = error
    ? `${textareaId}-error`
    : hint
      ? `${textareaId}-hint`
      : undefined;

  return (
    <div className={cn('w-full flex flex-col gap-2', containerClassName)}>
      {label ? (
        <label
          htmlFor={textareaId}
          className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted"
        >
          {label}
        </label>
      ) : null}

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          'w-full rounded-2xl resize-y',
          'bg-surface border border-border-subtle',
          'text-[15px] leading-relaxed text-white placeholder:text-text-faint',
          'px-4 py-3 transition-all duration-200 ease-out',
          'hover:border-border-emphasis',
          'focus:outline-none focus:border-accent-green focus:shadow-glow-green',
          error ? 'border-accent-red focus:border-accent-red' : '',
          className,
        )}
        {...rest}
      />

      {error ? (
        <p id={`${textareaId}-error`} role="alert" className="text-xs text-accent-red">
          {error}
        </p>
      ) : hint ? (
        <p id={`${textareaId}-hint`} className="text-xs text-text-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
