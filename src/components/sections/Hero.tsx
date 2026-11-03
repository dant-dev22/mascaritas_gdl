import { ShoppingBag, Play } from 'lucide-react';
import { HERO_CTAS, SOCIAL_PROOF } from '@/__data__/navLinks';
import { PRODUCT_PRICE_START_FROM_MXN } from '@/__data__/products';
import { formatCompactMXN, formatMXN } from '@/__lib__/utils';
import { Button, BUTTON_LARGE_ICON_PROPS } from '@/components/ui/Button';
import { HeroMaskPlaceholder } from '@/components/graphics/MaskPlaceholders';
import type { HeroCta } from '@/__types__';

const HERO_ICON: Record<HeroCta['icon'], React.ComponentType<{ width: number; height: number; strokeWidth?: number; 'aria-hidden'?: boolean | 'true' | 'false' }>> = {
  'shopping-bag': ShoppingBag,
  play: Play,
};

export function Hero() {
  return (
    <section className="relative content-auto overflow-hidden">
      <div
        className="absolute inset-0 hero-pattern pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative z-10 max-w-xl lg:max-w-none">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border-subtle text-xs font-medium uppercase tracking-[0.12em] text-text-muted mb-6">
              <span
                className="w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse"
                aria-hidden="true"
              />
              Excelente calidad, gran precio
            </span>

            <h1 className="font-display text-display-xl text-white text-balance mb-6 drop-shadow-[0_2px_12px_rgba(0,168,107,0.15)]">
              ¡Lucha con estilo,
              <br />
              <span className="text-accent-green">siente la arena!</span>
            </h1>

            <p className="text-lg sm:text-[19px] leading-relaxed text-text-muted mb-10 max-w-xl">
              Máscaras semi-profesionales y profesionales de la mejor calidad,
              hechas 100% a mano.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {HERO_CTAS.map((cta) => {
                const Icon = HERO_ICON[cta.icon];
                return (
                  <Button
                    key={cta.id}
                    as="link"
                    href={cta.href}
                    variant={cta.variant}
                    size="lg"
                    leftIcon={
                      <Icon {...BUTTON_LARGE_ICON_PROPS} aria-hidden="true" />
                    }
                  >
                    {cta.label}
                  </Button>
                );
              })}
            </div>

            <div className="mt-10 flex items-center gap-4 text-sm text-text-muted">
              <div className="flex -space-x-2" aria-hidden="true">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-green to-accent-green-pressed border-2 border-canvas" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-red to-accent-red-hover border-2 border-canvas" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F4C542] to-[#D99B2C] border-2 border-canvas" />
              </div>
              <div>
                <span className="font-semibold text-white">
                  +{formatCompactMXN(SOCIAL_PROOF.happyCustomersCount)}
                </span>{' '}
                {SOCIAL_PROOF.happyCustomersLabel}
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative lg:justify-self-end w-full max-w-[520px] mx-auto lg:mx-0">
            <div
              className="relative aspect-square w-full animate-float"
              aria-hidden="true"
            >
              <div className="absolute -inset-6 bg-gradient-to-br from-accent-green/20 via-accent-red/10 to-transparent rounded-[3rem] blur-3xl opacity-70" />

              <div className="relative w-full h-full hero-mask-ph rounded-[2.5rem] border border-border-subtle shadow-card overflow-hidden flex items-center justify-center">
                <HeroMaskPlaceholder className="w-[72%] h-[72%]" />

                <div className="absolute top-5 right-5 bg-canvas/90 backdrop-blur border border-border-subtle rounded-2xl px-4 py-3 shadow-card">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-text-muted mb-1">
                    Desde
                  </div>
                  <div className="font-display text-2xl text-accent-green leading-none">
                    {formatMXN(PRODUCT_PRICE_START_FROM_MXN).replace('$', '$')}
                    <span className="text-sm font-sans text-text-muted font-normal">
                      {' '}
                      MXN
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-5 left-5 inline-flex items-center gap-1.5 bg-accent-red/95 backdrop-blur text-white rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider shadow-[0_0_0_3px_rgba(230,57,70,0.25)]">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-white"
                    aria-hidden="true"
                  />
                  Stock limitado
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
