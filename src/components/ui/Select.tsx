import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import type { SelectHTMLAttributes } from 'react';
import { cn } from '@/__lib__/utils';

export interface SelectOption {
  readonly value: string;
  readonly label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  readonly label?: string;
  readonly options: ReadonlyArray<SelectOption>;
  readonly containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, containerClassName, className, id, ...rest },
  ref,
) {
  const selectId = id ?? `select-${rest.name ?? 'field'}`;

  return (
    <div className={cn('w-full flex flex-col gap-2', containerClassName)}>
      {label ? (
        <label
          htmlFor={selectId}
          className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted"
        >
          {label}
        </label>
      ) : null}

      <div className="relative w-full">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'touch-target w-full h-12 rounded-2xl appearance-none cursor-pointer',
            'bg-surface border border-border-subtle',
            'text-[15px] font-medium text-white',
            'pl-4 pr-11',
            'hover:border-border-emphasis',
            'focus:outline-none focus:border-accent-green focus:shadow-glow-green',
            'transition-all duration-200 ease-out',
            className,
          )}
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-surface text-white">
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown
          width={18}
          height={18}
          strokeWidth={2}
          aria-hidden="true"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        />
      </div>
    </div>
  );
});
