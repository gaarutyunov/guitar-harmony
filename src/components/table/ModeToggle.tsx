'use client';

import { useTranslations } from 'next-intl';
import { useSettingsStore } from '@/stores/useSettingsStore';

export function ModeToggle() {
  const t = useTranslations('table');
  const mode = useSettingsStore((s) => s.mode);
  const setMode = useSettingsStore((s) => s.setMode);

  return (
    <div className="flex rounded-lg bg-mahogany-900/80 border border-mahogany-700/30 p-0.5">
      <button
        onClick={() => setMode('major')}
        className={`px-4 py-1.5 rounded-md text-sm font-mono font-medium transition-colors ${
          mode === 'major'
            ? 'bg-amber-500 text-mahogany-950'
            : 'text-mahogany-400 hover:text-mahogany-200'
        }`}
      >
        {t('mode_major')}
      </button>
      <button
        onClick={() => setMode('minor')}
        className={`px-4 py-1.5 rounded-md text-sm font-mono font-medium transition-colors ${
          mode === 'minor'
            ? 'bg-teal-500 text-mahogany-950'
            : 'text-mahogany-400 hover:text-mahogany-200'
        }`}
      >
        {t('mode_minor')}
      </button>
    </div>
  );
}
