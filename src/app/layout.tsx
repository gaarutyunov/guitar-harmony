'use client';

import './globals.css';
import { I18nProvider } from '@/lib/i18n/provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <title>GuitarHarmony</title>
        <meta name="description" content="Classical guitar harmony builder" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="antialiased min-h-screen">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
