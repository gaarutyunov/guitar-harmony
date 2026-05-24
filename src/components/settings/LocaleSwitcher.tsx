'use client';

import { useSettingsStore } from '@/stores/useSettingsStore';
import { Locale } from '@/types';

const LOCALES: { value: Locale; label: string }[] = [
  { value: 'es', label: 'ES' },
  { value: 'en', label: 'EN' },
  { value: 'ru', label: 'RU' },
];

export function LocaleSwitcher() {
  const locale = useSettingsStore((s) => s.locale);
  const setLocale = useSettingsStore((s) => s.setLocale);

  return (
    <div className="flex rounded-md bg-mahogany-900/80 border border-mahogany-700/30 p-0.5">
      {LOCALES.map((l) => (
        <button
          key={l.value}
          onClick={() => setLocale(l.value)}
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
            locale === l.value
              ? 'bg-mahogany-600 text-mahogany-100'
              : 'text-mahogany-500 hover:text-mahogany-300'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
