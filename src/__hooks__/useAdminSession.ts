'use client';

import { useCallback, useEffect, useState } from 'react';
import type { AdminSessionStatus, AdminUser } from '@/__types__';

/** Resultado de un intento de inicio de sesión. */
export type AdminLoginOutcome =
  | { readonly ok: true }
  | { readonly ok: false; readonly code: 'invalid' | 'throttled' | 'unexpected' };

export interface UseAdminSessionReturn {
  readonly status: AdminSessionStatus;
  readonly user: AdminUser | null;
  readonly isSubmitting: boolean;
  readonly login: (email: string, password: string) => Promise<AdminLoginOutcome>;
  readonly logout: () => Promise<void>;
}

interface SessionState {
  readonly status: AdminSessionStatus;
  readonly user: AdminUser | null;
}

/**
 * Resuelve la sesión del panel contra la API Route `/api/admin/session`,
 * que a su vez valida el token contra el backend FastAPI.
 */
export function useAdminSession(): UseAdminSessionReturn {
  const [state, setState] = useState<SessionState>({ status: 'loading', user: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/admin/session', {
      signal: controller.signal,
      headers: { accept: 'application/json' },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('no-session');
        return response.json() as Promise<{ user: AdminUser }>;
      })
      .then((payload) => {
        setState({ status: 'authenticated', user: payload.user });
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setState({ status: 'anonymous', user: null });
      });

    return () => controller.abort();
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<AdminLoginOutcome> => {
      setIsSubmitting(true);

      try {
        const response = await fetch('/api/admin/session', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (response.status === 429) {
          return { ok: false, code: 'throttled' };
        }
        if (response.status === 400 || response.status === 401) {
          return { ok: false, code: 'invalid' };
        }
        if (!response.ok) return { ok: false, code: 'unexpected' };

        const payload = (await response.json()) as { user: AdminUser };
        setState({ status: 'authenticated', user: payload.user });
        return { ok: true };
      } catch {
        return { ok: false, code: 'unexpected' };
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await fetch('/api/admin/session', { method: 'DELETE' });
    } catch {
      // Aunque falle la petición, cerramos la sesión en el cliente.
    }
    setState({ status: 'anonymous', user: null });
  }, []);

  return { status: state.status, user: state.user, isSubmitting, login, logout };
}
