'use client';

import { ReactNode, useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { getMessages } from './messages';

export function I18nProvider({ children }: { children: ReactNode }) {
  const locale = useSettingsStore((s) => s.locale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <NextIntlClientProvider locale="es" messages={getMessages('es')}>
        {children}
      </NextIntlClientProvider>
    );
  }

  return (
    <NextIntlClientProvider locale={locale} messages={getMessages(locale)}>
      {children}
    </NextIntlClientProvider>
  );
}
