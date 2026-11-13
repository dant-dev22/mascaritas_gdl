'use client';

import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { Hash, Search } from 'lucide-react';
import { Button, BUTTON_ICON_PROPS } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/__lib__/utils';

interface OrderTrackerFormProps {
  /** Código con el que arranca el campo; el padre lo remonta al cambiar la URL. */
  readonly initialCode: string;
  readonly onSubmit: (code: string) => void;
  readonly isSubmitting: boolean;
  readonly error: string | null;
}

export function OrderTrackerForm({
  initialCode,
  onSubmit,
  isSubmitting,
  error,
}: OrderTrackerFormProps) {
  const t = useTranslations('tracking.form');
  const fieldId = useId();
  const [value, setValue] = useState(initialCode);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const code = value.trim();
    if (code.length === 0) return;
    onSubmit(code);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <label
        htmlFor={fieldId}
        className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-text-muted"
      >
        {t('label')}
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          id={fieldId}
          name="code"
          aria-label={t('label')}
          placeholder={t('placeholder')}
          leftIcon={<Hash width={18} height={18} strokeWidth={2} aria-hidden="true" />}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          containerClassName="flex-1"
          className="uppercase tracking-[0.1em]"
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          rightIcon={<Search {...BUTTON_ICON_PROPS} />}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? t('submitting') : t('submit')}
        </Button>
      </div>

      <p
        role={error ? 'alert' : undefined}
        className={cn('mt-2 text-xs', error ? 'text-accent-red' : 'text-text-faint')}
      >
        {error ?? t('hint')}
      </p>
    </form>
  );
}
