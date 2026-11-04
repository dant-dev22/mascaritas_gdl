import type { TrustProp } from '@/__types__';

export const TRUST_PROPS: ReadonlyArray<TrustProp> = [
  {
    id: 'ship-gdl',
    icon: 'truck',
    titleKey: 'shipTitle',
    descriptionKey: 'shipDescription',
    highlightKey: 'shipHighlight',
  },
  {
    id: 'comfort-fit',
    icon: 'hand',
    titleKey: 'fitTitle',
    descriptionKey: 'fitDescription',
    highlightKey: 'fitHighlight',
  },
  {
    id: 'ring-materials',
    icon: 'shield-check',
    titleKey: 'materialsTitle',
    descriptionKey: 'materialsDescription',
    highlightKey: 'materialsHighlight',
    ctaLabelKey: 'expertCtaLabel',
    ctaMessageKey: 'expertCtaMessage',
  },
] as const;
