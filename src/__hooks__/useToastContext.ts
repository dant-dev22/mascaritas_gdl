'use client';

import { createContext, useContext } from 'react';
import type { ToastContextValue } from '@/__types__';

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToastContext(): ToastContextValue {
  const context = useContext(ToastContext);

  if (context === null) {
    throw new Error('useToastContext debe usarse dentro de <ToastProvider>');
  }

  return context;
}
