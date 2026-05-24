'use client';

import { useTranslations } from 'next-intl';
import { useSettingsStore } from '@/stores/useSettingsStore';

const KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export function KeyFilter() {
  const t = useTranslations('table');
  const selectedKey = useSettingsStore((s) => s.selectedKey);
  const setSelectedKey = useSettingsStore((s) => s.setSelectedKey);

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1">
      <button
        onClick={() => setSelectedKey(null)}
        className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-colors ${
          selectedKey === null
            ? 'bg-amber-500 text-mahogany-950'
            : 'bg-mahogany-800 text-mahogany-300 hover:bg-mahogany-700'
        }`}
      >
        {t('all_keys')}
      </button>
      {KEYS.map((key) => (
        <button
          key={key}
          onClick={() => setSelectedKey(selectedKey === key ? null : key)}
          className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-colors ${
            selectedKey === key
              ? 'bg-amber-500 text-mahogany-950'
              : 'bg-mahogany-800 text-mahogany-300 hover:bg-mahogany-700'
          }`}
        >
          {key}
        </button>
      ))}
    </div>
  );
}
