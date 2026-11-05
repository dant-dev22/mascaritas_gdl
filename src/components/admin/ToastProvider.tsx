'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ADMIN_TOAST_DURATION_MS } from '@/__data__/adminNav';
import { ToastContext } from '@/__hooks__/useToastContext';
import type { AdminToast, AdminToastVariant, ToastContextValue } from '@/__types__';
import { ToastViewport } from './ToastViewport';

let toastSequence = 0;

function nextToastId(): string {
  toastSequence += 1;
  return `admin-toast-${toastSequence}`;
}

/** Provee los avisos flotantes del panel y los renderiza en un contenedor fijo. */
export function ToastProvider({ children }: { readonly children: ReactNode }) {
  const [toasts, setToasts] = useState<ReadonlyArray<AdminToast>>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismissToast = useCallback((id: string): void => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const pushToast = useCallback(
    (variant: AdminToastVariant, message: string): void => {
      const id = nextToastId();
      setToasts((current) => [...current, { id, variant, message }]);

      const timer = setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
        timers.current.delete(id);
      }, ADMIN_TOAST_DURATION_MS);

      timers.current.set(id, timer);
    },
    [],
  );

  useEffect(() => {
    const activeTimers = timers.current;

    return () => {
      activeTimers.forEach((timer) => clearTimeout(timer));
      activeTimers.clear();
    };
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({ toasts, pushToast, dismissToast }),
    [dismissToast, pushToast, toasts],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}
