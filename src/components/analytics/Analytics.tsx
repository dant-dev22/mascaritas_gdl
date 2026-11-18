'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from '@/i18n/navigation';
import { useConsent } from '@/__hooks__/useConsent';
import { syncMetaConsent, trackPageView } from '@/__lib__/analytics';

/**
 * Medición del sitio: aplica el consentimiento al píxel de Meta y emite el
 * `PageView`.
 *
 * El píxel no se monta desde aquí: su base code va en el HTML de todas las
 * páginas (ver `metaBaseCode`), porque Meta solo lo reconoce si el código viene
 * en el documento. El snippet nace revocado y lo que se hace aquí es aplicar la
 * decisión de la persona: liberar la pausa con la categoría de marketing o
 * dejarla cerrada.
 *
 * El `PageView` tampoco lo emite el snippet: se dispara aquí, en cada cambio de
 * ruta pública y una sola vez por ruta. Se salta el panel admin, que no es
 * tráfico de tienda.
 */
export function Analytics() {
  const consent = useConsent();
  const pathname = usePathname();
  const lastPageView = useRef<string | null>(null);

  // `null` = todavía sin decisión: ni se libera ni se cierra el píxel.
  const marketingGranted = consent === null ? null : consent.categories.marketing;

  useEffect(() => {
    syncMetaConsent(marketingGranted);
  }, [marketingGranted]);

  // Va después del efecto de arriba: el `PageView` solo se manda con la pausa
  // ya liberada.
  useEffect(() => {
    if (marketingGranted !== true) return;
    if (pathname.startsWith('/admin')) return;
    if (lastPageView.current === pathname) return;

    lastPageView.current = pathname;
    trackPageView();
  }, [marketingGranted, pathname]);

  return null;
}
