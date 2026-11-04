import { Link } from '@/i18n/navigation';
import {
  CameraIcon,
  Share2Icon,
  MusicIcon,
  MessageSquareIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import {
  BRAND,
  FOOTER_STORE_LINKS,
  FOOTER_SUPPORT_LINKS,
  LEGAL_LINKS,
} from '@/__data__/navLinks';
import { SOCIAL_LINKS } from '@/__data__/socials';
import type { SocialLink } from '@/__types__';
import { cn } from '@/__lib__/utils';
import { Button, BUTTON_LARGE_ICON_PROPS } from '@/components/ui/Button';
import { CookiePreferencesLink } from './CookiePreferencesLink';

const SOCIAL_ICON_MAP: Record<SocialLink['platform'], LucideIcon> = {
  instagram: CameraIcon,
  facebook: Share2Icon,
  tiktok: MusicIcon,
  whatsapp: MessageSquareIcon,
};

const WHATSAPP_ICON = MessageSquareIcon;

export async function Footer() {
  const t = await getTranslations('nav');
  const tCommon = await getTranslations('common');
  const tA11y = await getTranslations('a11y');

  return (
    <footer
      id="contacto"
      className="border-t border-border-subtle bg-surface"
      role="contentinfo"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">
          {/* Brand + social */}
          <div className="md:col-span-5 lg:col-span-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-canvas border border-border-subtle">
                <span className="font-display text-2xl text-accent-green leading-none">
                  {tCommon(BRAND.shortCodeKey)}
                </span>
              </span>
              <span className="font-display text-2xl sm:text-3xl tracking-wide leading-none text-white">
                {tCommon(BRAND.nameKey)}
              </span>
            </div>
            <p className="text-text-muted max-w-sm leading-relaxed mb-6">
              {tCommon(BRAND.descriptionKey)}
            </p>

            <div
              aria-label={tA11y('socialLinks')}
              className="flex items-center gap-3"
            >
              {SOCIAL_LINKS.map((social) => {
                const Icon = SOCIAL_ICON_MAP[social.platform];
                return (
                  <a
                    key={social.id}
                    href={social.href}
                    aria-label={tA11y(social.ariaLabelKey)}
                    rel="noreferrer noopener"
                    target={social.platform === 'whatsapp' ? '_blank' : undefined}
                    className={cn(
                      'touch-target inline-flex items-center justify-center',
                      'w-12 h-12 rounded-2xl',
                      'bg-canvas border border-border-subtle',
                      'text-text-muted hover:text-white hover:border-border-emphasis hover:bg-surface-hover',
                      'active:scale-[0.96]',
                      'focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(0,168,107,0.25)]',
                      'transition-all duration-200 ease-out',
                      'cursor-pointer',
                    )}
                  >
                    <Icon {...BUTTON_LARGE_ICON_PROPS} aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          <div className="md:col-span-4 lg:col-span-5">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                  {t('storeHeading')}
                </h4>
                <ul className="space-y-3 text-sm text-text-muted">
                  {FOOTER_STORE_LINKS.map((l) => (
                    <li key={l.id}>
                      <Link
                        href={l.href}
                        className="touch-target inline-flex items-center py-1 hover:text-white transition-colors"
                      >
                        {t(l.labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
                  {t('supportHeading')}
                </h4>
                <ul className="space-y-3 text-sm text-text-muted">
                  {FOOTER_SUPPORT_LINKS.map((l) => (
                    <li key={l.id}>
                      <Link
                        href={l.href}
                        className="touch-target inline-flex items-center py-1 hover:text-white transition-colors"
                      >
                        {t(l.labelKey)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="md:col-span-3 lg:col-span-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              {t('questionsHeading')}
            </h4>
            <Button
              as="link"
              href="#"
              variant="primary"
              size="md"
              fullWidth
              leftIcon={
                <WHATSAPP_ICON {...BUTTON_LARGE_ICON_PROPS} aria-hidden="true" />
              }
              aria-label={tA11y('whatsappChat')}
            >
              {t('whatsappButton')}
            </Button>
            <p className="text-xs text-text-faint leading-relaxed mt-3">
              <span className="font-semibold text-text-muted block mb-1">
                {tCommon(BRAND.whatsappScheduleTitleKey)}:
              </span>
              {tCommon(BRAND.whatsappScheduleKey)}
            </p>
          </div>
        </div>

        {/* Divider + legal */}
        <div className="mt-12 pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-faint">
          <p>{tCommon(BRAND.copyrightKey)}</p>
          <div className="flex items-center gap-5">
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.id}
                href={l.href}
                className="touch-target inline-flex items-center py-1 hover:text-text-muted transition-colors"
              >
                {t(l.labelKey)}
              </Link>
            ))}
            <CookiePreferencesLink />
          </div>
        </div>
      </div>
    </footer>
  );
}
