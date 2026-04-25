import './globals.css';
import type { Metadata } from 'next';
import { SidebarShell } from '@/components/sidebar';

export const metadata: Metadata = {
  title: 'Furvo · Mundial 2026',
  description: 'La porra del Mundial con tus amigos',
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
