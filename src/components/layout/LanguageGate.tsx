'use client';

import { useState, useSyncExternalStore } from 'react';
import { LanguageModal } from './LanguageModal';
import { readLocaleCookie } from '@/__lib__/localeCookie';

/** No necesitamos reaccionar a cambios externos: solo importa el estado al montar. */
function subscribe(): () => void {
  return () => {};
}

/** En cliente el popup aparece mientras no exista la cookie de idioma. */
function getSnapshot(): boolean {
  return readLocaleCookie() === null;
}

/** En servidor no podemos leer cookies: renderizamos sin popup (evita desajustes de hidratación). */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * Muestra el popup de idioma únicamente cuando la persona todavía no ha elegido
 * (no existe la cookie `mascaritas_lang`). Leemos la cookie con
 * `useSyncExternalStore`: el servidor devuelve `false` y el cliente corrige tras
 * la hidratación, sin `setState` dentro de un efecto.
 */
export function LanguageGate() {
  const needsChoice = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [dismissed, setDismissed] = useState(false);

  if (!needsChoice || dismissed) return null;

  return <LanguageModal onDone={() => setDismissed(true)} />;
}
