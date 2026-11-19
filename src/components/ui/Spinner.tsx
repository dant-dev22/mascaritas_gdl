import { Loader2 } from 'lucide-react';
import { cn } from '@/__lib__/utils';

interface SpinnerProps {
  readonly size?: number;
  readonly strokeWidth?: number;
  readonly className?: string;
}

/**
 * Indicador de carga giratorio. Decorativo por defecto: el texto que lo
 * acompaña (o `aria-busy` en el contenedor) es quien anuncia el estado.
 */
export function Spinner({ size = 18, strokeWidth = 2, className }: SpinnerProps) {
  return (
    <Loader2
      width={size}
      height={size}
      strokeWidth={strokeWidth}
      aria-hidden="true"
      className={cn('animate-spin', className)}
    />
  );
}
