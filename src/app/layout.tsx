import type { Metadata, Viewport } from 'next';
import { BRAND } from '@/__data__/navLinks';
import { CartProvider } from '@/components/providers/CartProvider';
import './globals.css';

const siteName = BRAND.name;
const description =
  'Máscaras semi-profesionales y profesionales de lucha libre, hechas 100% a mano. Excelente calidad al mejor precio. Envíos gratis a todo México.';

export const metadata: Metadata = {
  metadataBase: new URL('https://mascaritas-gdl.example.com'),
  title: {
    default: `${siteName} — Máscaras Semi-Profesionales de Lucha Libre`,
    template: `%s · ${siteName}`,
  },
  description,
  applicationName: siteName,
  keywords: [
    'mascaras lucha libre',
    'mascaras semi profesionales',
    'lucha libre guadalajara',
    'mascaras hechas a mano',
    'coleccionista lucha libre',
  ],
  authors: [{ name: 'Mascaritas GDL' }],
  creator: 'Mascaritas GDL',
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://mascaritas-gdl.example.com',
    title: siteName,
    description,
    siteName,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es-MX" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-canvas text-white font-sans">
        <a
          href="#contenido-principal"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100]
                     focus:touch-target focus:px-4 focus:rounded-xl
                     focus:bg-accent-green focus:text-white focus:shadow-glow-green"
        >
          Saltar al contenido
        </a>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
