import { cva, type VariantProps } from 'class-variance-authority';
import { Circle } from 'lucide-react';
import { cn } from '@/__lib__/utils';
import type { BadgeVariant } from '@/__types__';

const badgeVariants = cva(
  [
    'inline-flex items-center gap-1.5',
    'rounded-full px-3 py-1.5',
    'text-[11px] font-bold uppercase tracking-[0.12em]',
    'shadow-[0_0_0_3px_rgba(230,57,70,0.2)]',
  ].join(' '),
  {
    variants: {
      variant: {
        'semi-pro':
          'bg-accent-red text-white shadow-[0_0_0_3px_rgba(230,57,70,0.25)]',
        'last-units':
          'bg-accent-red text-white shadow-[0_0_0_3px_rgba(230,57,70,0.25)]',
        new: 'bg-accent-green text-white shadow-[0_0_0_3px_rgba(0,168,107,0.25)]',
        success:
          'bg-accent-green text-white shadow-[0_0_0_3px_rgba(0,168,107,0.25)]',
      } satisfies Record<BadgeVariant, string>,
    },
    defaultVariants: {
      variant: 'semi-pro',
    },
  },
);

export type BadgeVariantProps = VariantProps<typeof badgeVariants>;

interface BadgeProps extends BadgeVariantProps {
  readonly label: string;
  readonly showDot?: boolean;
  readonly className?: string;
}

export function Badge({ label, variant, showDot = false, className }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} aria-label={label}>
      {showDot ? (
        <Circle
          width={8}
          height={8}
          fill="currentColor"
          strokeWidth={0}
          aria-hidden="true"
        />
      ) : null}
      <span>{label}</span>
    </span>
  );
}
