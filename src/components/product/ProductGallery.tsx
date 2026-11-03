'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { PRODUCT_IMAGE_ASPECT_RATIO } from '@/__data__/products';
import { cn } from '@/__lib__/utils';
import { MaskArt } from '@/components/graphics/MaskArt';
import type { Product } from '@/__types__';

interface ProductGalleryProps {
  readonly product: Product;
  readonly className?: string;
}

const VIEWS = [
  { id: 'frontal', labelKey: 'frontal', transform: 'scale(1)' },
  { id: 'perfil', labelKey: 'profile', transform: 'scale(1.18) translateX(-6%)' },
  { id: 'detalle', labelKey: 'detail', transform: 'scale(1.75) translateY(-6%)' },
] as const;

type ViewId = (typeof VIEWS)[number]['id'];

export function ProductGallery({ product, className }: ProductGalleryProps) {
  const t = useTranslations('product');
  const [activeView, setActiveView] = useState<ViewId>('frontal');

  const currentView = VIEWS.find((view) => view.id === activeView) ?? VIEWS[0];

  return (
    <div className={cn('w-full flex flex-col gap-4', className)}>
      <div
        className="relative w-full rounded-[1.5rem] border border-border-subtle product-ph overflow-hidden flex items-center justify-center"
        style={{ aspectRatio: PRODUCT_IMAGE_ASPECT_RATIO }}
      >
        <MaskArt
          maskStyle={product.maskStyle}
          accentColor={product.accentColor}
          label={t('imageAlt', {
            title: product.title,
            subtitle: product.subtitle,
            view: t(`views.${currentView.labelKey}`).toLowerCase(),
          })}
          className="w-[78%] h-[78%] transition-transform duration-500 ease-out"
          key={currentView.id}
        />
      </div>

      <div role="group" aria-label={t('galleryAria')} className="flex items-center gap-3">
        {VIEWS.map((view) => {
          const isActive = view.id === activeView;

          return (
            <button
              key={view.id}
              type="button"
              onClick={() => setActiveView(view.id)}
              aria-pressed={isActive}
              className={cn(
                'touch-target flex-1 inline-flex flex-col items-center gap-2 rounded-2xl p-2',
                'bg-surface border transition-all duration-200 ease-out',
                'active:scale-[0.96]',
                'focus-visible:outline-none focus-visible:shadow-glow-green',
                isActive
                  ? 'border-accent-green shadow-glow-green'
                  : 'border-border-subtle hover:border-border-emphasis',
              )}
            >
              <span
                className="w-full overflow-hidden rounded-xl product-ph flex items-center justify-center"
                style={{ aspectRatio: '1 / 1' }}
                aria-hidden="true"
              >
                <MaskArt
                  maskStyle={product.maskStyle}
                  accentColor={product.accentColor}
                  className="w-[70%] h-[70%]"
                />
              </span>
              <span
                className={cn(
                  'text-[11px] font-semibold uppercase tracking-[0.12em]',
                  isActive ? 'text-accent-green' : 'text-text-muted',
                )}
              >
                {t(`views.${view.labelKey}`)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
