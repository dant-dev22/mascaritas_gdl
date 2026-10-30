import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/__lib__/utils';

export interface BreadcrumbItem {
  readonly label: string;
  readonly href?: string;
}

interface BreadcrumbsProps {
  readonly items: ReadonlyArray<BreadcrumbItem>;
  readonly className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Ruta de navegación" className={cn('w-full', className)}>
      <ol className="flex flex-wrap items-center gap-1 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="inline-flex items-center min-h-[48px] py-2 text-text-muted hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className="inline-flex items-center min-h-[48px] py-2 text-white font-medium"
                >
                  {item.label}
                </span>
              )}

              {!isLast ? (
                <ChevronRight
                  width={16}
                  height={16}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="text-text-faint shrink-0"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
