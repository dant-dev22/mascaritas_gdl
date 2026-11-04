'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { parseConsent, readConsentRaw, subscribeConsent } from '@/__lib__/consent';
import type { ConsentRecord } from '@/__types__';

/** En servidor no hay cookies accesibles: renderizamos sin decisión (evita desajustes). */
function getServerSnapshot(): string | null {
  return null;
}

/**
 * Devuelve el registro de consentimiento vigente y se re-renderiza cuando cambia.
 * `null` significa que todavía no hay una decisión válida (banner visible).
 */
export function useConsent(): ConsentRecord | null {
  const raw = useSyncExternalStore(subscribeConsent, readConsentRaw, getServerSnapshot);

  return useMemo(() => parseConsent(raw), [raw]);
}
