'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Link, useRouter } from '@/i18n/navigation';
import { useAdminSession } from '@/__hooks__/useAdminSession';
import { cn } from '@/__lib__/utils';

type LoginErrorCode = 'invalid' | 'missing' | 'throttled' | 'unexpected';

/** Pantalla de acceso al panel. */
export function AdminLoginForm() {
  const t = useTranslations('Admin');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const { status, login, isSubmitting } = useAdminSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<LoginErrorCode | null>(null);

  // Si ya hay sesión, no tiene sentido quedarse en el login.
  useEffect(() => {
    if (status === 'authenticated') router.replace('/admin');
  }, [status, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (email.trim().length === 0 || password.length === 0) {
      setError('missing');
      return;
    }

    setError(null);
    const outcome = await login(email.trim(), password);

    if (outcome.ok) {
      router.replace('/admin');
      router.refresh();
      return;
    }

    setError(outcome.code);
  };

  const errorMessage =
    error === 'invalid'
      ? t('login.errorInvalid')
      : error === 'missing'
        ? t('login.errorMissing')
        : error === 'throttled'
          ? t('login.errorThrottled')
          : error === 'unexpected'
            ? t('login.errorUnexpected')
            : null;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className={cn(
            'mb-8 inline-flex items-center gap-3 text-text-muted',
            'transition-colors duration-200 hover:text-white',
            'focus-visible:outline-none focus-visible:text-white',
          )}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-green font-display text-lg leading-none text-white">
            {tCommon('brandShortCode')}
          </span>
          <span className="text-sm font-semibold">{t('login.backToSite')}</span>
        </Link>

        <div className="rounded-[1.5rem] border border-border-subtle bg-surface p-6 sm:p-8">
          <h1 className="font-display text-2xl leading-none text-white">{t('login.title')}</h1>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">{t('login.subtitle')}</p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5">
            <Input
              name="email"
              type="email"
              autoComplete="email"
              label={t('login.email')}
              placeholder={t('login.emailPlaceholder')}
              leftIcon={<Mail width={18} height={18} strokeWidth={2} aria-hidden="true" />}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <Input
              name="password"
              type="password"
              autoComplete="current-password"
              label={t('login.password')}
              placeholder={t('login.passwordPlaceholder')}
              leftIcon={<Lock width={18} height={18} strokeWidth={2} aria-hidden="true" />}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            {errorMessage !== null ? (
              <p
                role="alert"
                className="rounded-xl border border-accent-red/40 bg-accent-red/10 px-4 py-3 text-sm text-accent-red"
              >
                {errorMessage}
              </p>
            ) : null}

            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? t('login.submitting') : t('login.submit')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
