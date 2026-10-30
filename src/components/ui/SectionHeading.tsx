import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/__lib__/utils';
import { BUTTON_ICON_PROPS } from './Button';

interface SectionHeadingProps {
  readonly eyebrow: string;
  readonly eyebrowColor?: 'green' | 'red';
  readonly title: string;
  readonly description?: string;
  readonly ctaLabel?: string;
  readonly ctaHref?: string;
  readonly align?: 'left' | 'center';
  readonly className?: string;
}

export function SectionHeading({
  eyebrow,
  eyebrowColor = 'green',
  title,
  description,
  ctaLabel,
  ctaHref,
  align = 'left',
  className,
}: SectionHeadingProps) {
  const wrapperAlign =
    align === 'center'
      ? 'text-center items-center mx-auto'
      : 'text-left items-start';
  const rowLayout =
    align === 'center'
      ? 'flex-col items-center text-center'
      : 'flex-col sm:flex-row sm:items-end sm:justify-between';

  return (
    <div className={cn('w-full flex', rowLayout, 'gap-4 mb-10 sm:mb-12', className)}>
      <div className={cn('flex flex-col gap-3 max-w-2xl', wrapperAlign)}>
        <span
          className={cn(
            'text-xs font-semibold uppercase tracking-[0.18em] mb-1 block',
            eyebrowColor === 'green' ? 'text-accent-green' : 'text-accent-red',
          )}
        >
          {eyebrow}
        </span>
        <h2 className="font-display text-display-lg text-white text-balance">
          {title}
        </h2>
        {description ? (
          <p className="text-text-muted text-base sm:text-lg leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>

      {ctaLabel && ctaHref ? (
        <Link
          href={ctaHref}
          className={cn(
            'inline-flex items-center gap-1.5',
            'text-sm font-semibold text-text-muted hover:text-white',
            'transition-colors',
            'group',
            'touch-target',
          )}
        >
          <span>{ctaLabel}</span>
          <ArrowRight
            {...BUTTON_ICON_PROPS}
            className="transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      ) : null}
    </div>
  );
}
