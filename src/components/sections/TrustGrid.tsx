'use client';

import { Truck, Hand, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TRUST_PROPS } from '@/__data__/trustProps';
import type { TrustProp } from '@/__types__';
import { useScrollReveal } from '@/__hooks__/useScrollReveal';
import { cn } from '@/__lib__/utils';
import { SectionHeading } from '@/components/ui/SectionHeading';

const ICON_MAP: Record<TrustProp['icon'], LucideIcon> = {
  truck: Truck,
  hand: Hand,
  'shield-check': ShieldCheck,
};

const TRUST_ICON_PROPS = {
  width: 26,
  height: 26,
  strokeWidth: 2,
} as const;

export function TrustGrid() {
  const t = useTranslations('trust');
  const tA11y = useTranslations('a11y');
  const { ref, isVisible } = useScrollReveal({ threshold: 0.12 });

  return (
    <section
      id="beneficios"
      ref={ref as React.RefObject<HTMLElement>}
      className="content-auto border-t border-border-subtle bg-surface/40"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <SectionHeading
          eyebrow={t('eyebrow')}
          eyebrowColor="red"
          title={t('heading')}
          align="center"
          className="!max-w-2xl !mx-auto"
        />

        <div
          role="list"
          aria-label={tA11y('benefitsList')}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {TRUST_PROPS.map((prop, idx) => {
            const Icon = ICON_MAP[prop.icon];
            const description = t(prop.descriptionKey);
            const highlight = t(prop.highlightKey);
            return (
              <div
                key={prop.id}
                role="listitem"
                className={cn(
                  'reveal-enter',
                  isVisible ? 'is-visible' : '',
                  'relative bg-surface border border-border-subtle rounded-2xl p-6 sm:p-8',
                  'hover:border-border-emphasis hover:bg-surface-hover transition-colors duration-200',
                )}
                style={{ transitionDelay: `${idx * 80}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-accent-green/10 border border-accent-green/20 text-accent-green flex items-center justify-center mb-6">
                  <Icon {...TRUST_ICON_PROPS} aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-xl text-white mb-2">
                  {t(prop.titleKey)}
                </h3>
                <p className="text-text-muted leading-relaxed">
                  {description
                    .split(highlight)
                    .map((segment, i, arr) => (
                      <span key={i}>
                        {segment}
                        {i < arr.length - 1 ? (
                          <span className="font-semibold text-white">
                            {highlight}
                          </span>
                        ) : null}
                      </span>
                    ))}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
