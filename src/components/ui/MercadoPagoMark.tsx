import { cn } from '@/__lib__/utils';

interface MercadoPagoMarkProps {
  readonly className?: string;
}

/**
 * Marca de Mercado Pago para los botones de pago: el nombre de la pasarela en
 * su azul corporativo sobre una pastilla blanca. El nombre es una marca y no se
 * traduce.
 */
export function MercadoPagoMark({ className }: MercadoPagoMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex items-center justify-center rounded-md bg-white px-2 py-[3px] text-[15px] leading-none font-bold text-[#009ee3]',
        className,
      )}
    >
      Mercado Pago
    </span>
  );
}
