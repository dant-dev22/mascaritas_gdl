import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ToastProvider } from '@/components/admin/ToastProvider';

interface AdminLayoutProps {
  readonly children: React.ReactNode;
  readonly params: Promise<{ readonly locale: string }>;
}

export async function generateMetadata({ params }: AdminLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Admin.meta' });

  return {
    title: t('title'),
    robots: { index: false, follow: false },
  };
}

/** Envuelve el panel con el proveedor de avisos flotantes. */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return <ToastProvider>{children}</ToastProvider>;
}
