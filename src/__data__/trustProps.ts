import type { TrustProp } from '@/__types__';

export const TRUST_PROPS: ReadonlyArray<TrustProp> = [
  {
    id: 'ship-gdl',
    icon: 'truck',
    title: 'Envío desde GDL',
    description:
      'Salen desde Guadalajara con paquetería certificada. Entrega a todo México en 24 a 72 horas con rastreo en tiempo real.',
    highlight: '24 a 72 horas',
  },
  {
    id: 'comfort-fit',
    icon: 'hand',
    title: 'Ajuste cómodo',
    description:
      'Doble forro de spandex suave al rostro. Cordones ajustables en la nuca para que se adapte a cualquier talla sin lastimar.',
    highlight: 'cualquier talla',
  },
  {
    id: 'ring-materials',
    icon: 'shield-check',
    title: 'Materiales de arena',
    description:
      'Lona de alta densidad y vinilo de 3mm. Costuras dobles reforzadas. Diseñadas para el ring, no sólo para la foto.',
    highlight: 'Diseñadas para el ring',
  },
] as const;
