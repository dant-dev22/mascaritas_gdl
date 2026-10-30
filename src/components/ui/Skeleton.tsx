import { cn } from '@/__lib__/utils';

interface SkeletonProps {
  readonly className?: string;
  readonly rounded?: string;
}

export function Skeleton({ className, rounded = 'rounded-2xl' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse bg-surface-hover', rounded, className)}
    />
  );
}
