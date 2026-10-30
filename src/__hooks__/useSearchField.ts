'use client';

import { useEffect, useRef, useState } from 'react';
import { SEARCH_DEBOUNCE_MS, SEARCH_MIN_LENGTH } from '@/__data__/catalogOptions';
import { useDebouncedValue } from './useDebouncedValue';

interface UseSearchFieldReturn {
  readonly term: string;
  readonly setTerm: (next: string) => void;
}

/**
 * Campo de búsqueda con debounce sobre una fuente de verdad externa (la URL).
 * Si el valor externo cambia (limpiar filtros, botón atrás) el input se resincroniza.
 */
export function useSearchField(
  value: string,
  onCommit: (next: string) => void,
): UseSearchFieldReturn {
  const [term, setTerm] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);
  const commitRef = useRef(onCommit);

  useEffect(() => {
    commitRef.current = onCommit;
  }, [onCommit]);

  if (syncedValue !== value) {
    setSyncedValue(value);
    setTerm(value);
  }

  const debounced = useDebouncedValue(term, SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    if (debounced !== term) return;
    if (debounced === value) return;
    if (debounced.length > 0 && debounced.length < SEARCH_MIN_LENGTH) return;
    commitRef.current(debounced);
  }, [debounced, term, value]);

  return { term, setTerm };
}
