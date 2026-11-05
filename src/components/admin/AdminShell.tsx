'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { ExternalLink, LogOut, Package } from 'lucide-react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { ADMIN_NAV_ITEMS } from '@/__data__/adminNav';
import { useAdminSession } from '@/__hooks__/useAdminSession';
import { cn } from '@/__lib__/utils';
import type { AdminNavIcon } from '@/__types__';

const NAV_ICONS: Record<AdminNavIcon, ReactNode> = {
  products: <Package width={20} height={20} strokeWidth={2} aria-hidden="true" />,
  site: <ExternalLink width={20} height={20} strokeWidth={2} aria-hidden="true" />,
};

const ITEM_CLASS = cn(
  'group relative flex h-12 w-12 items-center justify-center rounded-2xl',
  'text-text-muted transition-all duration-200 ease-out',
  'hover:bg-canvas hover:text-white',
  'active:scale-[0.96]',
  'focus-visible:outline-none focus-visible:shadow-glow-green',
);

function Tooltip({ label }: { readonly label: string }) {
  return (
    <span
      role="tooltip"
      className={cn(
        'pointer-events-none absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap',
        'rounded-lg border border-border-subtle bg-surface px-3 py-1.5',
        'text-xs font-semibold text-white shadow-card',
        'opacity-0 transition-opacity duration-150',
        'group-hover:opacity-100 group-focus-visible:opacity-100',
      )}
    >
      {label}
    </span>
  );
}

function isActiveItem(href: string, pathname: string): boolean {
  if (href === '/admin') return pathname === '/admin' || pathname.startsWith('/admin/');
  return pathname === href;
}

/** Marco del panel: barra lateral estrecha de solo iconos + área de contenido. */
export function AdminShell({ children }: { readonly children: ReactNode }) {
  const t = useTranslations('Admin');
  const tCommon = useTranslations('common');
  const pathname = usePathname();
  const router = useRouter();
  const { status, logout } = useAdminSession();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (status === 'anonymous') router.replace('/admin/login');
  }, [status, router]);

  const handleLogout = async (): Promise<void> => {
    setIsLoggingOut(true);
    await logout();
    router.replace('/admin/login');
  };

  if (status !== 'authenticated') {
    if (status === 'loading') {
      return (
        <div className="flex min-h-dvh items-center justify-center bg-canvas">
          <p className="text-sm text-text-muted">{t('session.checking')}</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="flex min-h-dvh bg-canvas">
      <aside
        className={cn(
          'sticky top-0 z-30 flex h-dvh w-[68px] shrink-0 flex-col items-center gap-4',
          'border-r border-border-subtle bg-surface/70 py-4 backdrop-blur',
        )}
      >
        <Link
          href="/admin"
          aria-label={tCommon('brandName')}
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-2xl',
            'bg-accent-green font-display text-lg leading-none text-white',
            'transition-transform duration-200 active:scale-[0.96]',
            'focus-visible:outline-none focus-visible:shadow-glow-green',
          )}
        >
          {tCommon('brandShortCode')}
        </Link>

        <nav
          aria-label={t('nav.ariaLabel')}
          className="flex flex-1 flex-col items-center gap-2 pt-2"
        >
          {ADMIN_NAV_ITEMS.map((item) => {
            const active = isActiveItem(item.href, pathname);

            return (
              <Link
                key={item.id}
                href={item.href}
                aria-label={t(item.labelKey)}
                aria-current={active ? 'page' : undefined}
                className={cn(ITEM_CLASS, active ? 'bg-canvas text-white' : '')}
              >
                {NAV_ICONS[item.icon]}
                <Tooltip label={t(item.labelKey)} />
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          aria-label={t('nav.logoutAria')}
          className={cn(ITEM_CLASS, 'disabled:cursor-not-allowed disabled:opacity-60')}
        >
          <LogOut width={20} height={20} strokeWidth={2} aria-hidden="true" />
          <Tooltip label={t('nav.logout')} />
        </button>
      </aside>

      <main id="contenido-principal" className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">
        {children}
      </main>
    </div>
  );
}
