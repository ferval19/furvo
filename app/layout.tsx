import './globals.css';
import type { Metadata, Viewport } from 'next';
import { SidebarShell } from '@/components/sidebar';

const BASE_URL = 'https://furvo.com';
const TITLE    = 'Furvo · La porra del Mundial 2026';
const DESC     = 'Crea tu liga privada, pon tus predicciones y sufre en directo. La quiniela del Mundial 2026 con tus amigos.';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  title: {
    default: TITLE,
    template: '%s · Furvo',
  },
  description: DESC,

  keywords: [
    'porra', 'quiniela', 'mundial 2026', 'fútbol', 'liga privada',
    'predicciones', 'world cup', 'quiniela gratis', 'porra amigos',
  ],

  authors:   [{ name: 'Furvo', url: BASE_URL }],
  creator:   'Furvo',
  publisher: 'Furvo',

  openGraph: {
    type:        'website',
    locale:      'es_ES',
    url:         BASE_URL,
    siteName:    'Furvo',
    title:       TITLE,
    description: DESC,
    images: [
      {
        url:    '/opengraph-image',
        width:  1200,
        height: 630,
        alt:    'Furvo · La porra del Mundial 2026',
      },
    ],
  },

  twitter: {
    card:        'summary_large_image',
    title:       TITLE,
    description: DESC,
    images:      ['/opengraph-image'],
  },

  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:                   true,
      follow:                  true,
      'max-video-preview':     -1,
      'max-image-preview':     'large',
      'max-snippet':           -1,
    },
  },

  manifest: '/manifest.json',

  alternates: {
    canonical: BASE_URL,
  },
};

export const viewport: Viewport = {
  themeColor:   '#0b1710',
  width:        'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:ital,wght@0,400;0,500;0,600;0,700;0,800;1,700;1,800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SidebarShell />
        {children}
      </body>
    </html>
  );
}
