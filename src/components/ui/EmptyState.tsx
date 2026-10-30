import { SearchX } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/__lib__/utils';

interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
  readonly action?: ReactNode;
  readonly className?: string;
}

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        'w-full flex flex-col items-center text-center',
        'bg-surface border border-border-subtle rounded-[1.5rem]',
        'px-6 py-14 sm:py-20',
        className,
      )}
    >
      <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-canvas border border-border-subtle mb-6">
        <SearchX
          width={28}
          height={28}
          strokeWidth={1.8}
          aria-hidden="true"
          className="text-text-faint"
        />
      </span>

      <h3 className="font-display text-display-md text-white mb-3">{title}</h3>
      <p className="text-text-muted max-w-md leading-relaxed mb-8">{description}</p>

      {action ? <div className="w-full sm:w-auto">{action}</div> : null}
    </div>
  );
}
