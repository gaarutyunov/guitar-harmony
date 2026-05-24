'use client';

import { useTranslations } from 'next-intl';
import { useSettingsStore } from '@/stores/useSettingsStore';

export function FingeringToggle() {
  const t = useTranslations('settings');
  const showFingering = useSettingsStore((s) => s.showFingering);
  const toggleFingering = useSettingsStore((s) => s.toggleFingering);

  return (
    <button
      onClick={toggleFingering}
      className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-medium border transition-colors ${
        showFingering
          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
          : 'bg-mahogany-800 text-mahogany-400 border-mahogany-700/30'
      }`}
    >
      {showFingering ? t('show_fingering') : t('hide_fingering')}
    </button>
  );
}
