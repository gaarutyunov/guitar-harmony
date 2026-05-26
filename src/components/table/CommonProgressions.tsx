'use client';

import { useTranslations } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useHarmonyStore } from '@/stores/useHarmonyStore';
import { getProgressionsForMode, getRowsForMode, resolveProgression } from '@/data/curriculum';
import { getEmptyPattern, getDefaultBeatTypes } from '@/lib/strum/presets';
import { useState } from 'react';

export function CommonProgressions() {
  const t = useTranslations('table');
  const mode = useSettingsStore((s) => s.mode);
  const selectedKey = useSettingsStore((s) => s.selectedKey);
  const setCurrent = useHarmonyStore((s) => s.setCurrent);
  const current = useHarmonyStore((s) => s.current);
  const [toast, setToast] = useState<string | null>(null);

  const progressions = getProgressionsForMode(mode);
  const rows = getRowsForMode(mode);
  const targetRow = selectedKey
    ? rows.find((r) => r.key === selectedKey) || rows[0]
    : rows[0];

  function handleProgressionTap(progName: string, progIdx: number) {
    const prog = progressions[progIdx];
    const resolved = resolveProgression(prog, targetRow);

    const chords = resolved.map((c) => ({
      id: uuidv4(),
      name: c.name,
      degree: c.degree,
      key: targetRow.key,
      mode,
      strumPattern: getEmptyPattern(current.timeSignature),
      beatTypes: getDefaultBeatTypes(current.timeSignature),
    }));

    setCurrent({
      ...current,
      chords,
    });

    setToast(progName);
    setTimeout(() => setToast(null), 1500);
  }

  return (
    <div>
      <p className="text-xs font-mono text-mahogany-500 mb-2">{t('common_progressions')}</p>
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-teal-500/90 text-mahogany-950 px-4 py-2 rounded-lg font-mono text-sm font-bold">
          {toast} → {targetRow.key}
        </div>
      )}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {progressions.map((prog, idx) => (
          <button
            key={prog.name}
            onClick={() => handleProgressionTap(prog.name, idx)}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-mahogany-800/60 border border-mahogany-700/40 text-mahogany-200 text-xs font-mono hover:bg-mahogany-700/60 transition-colors active:scale-95"
          >
            {prog.name}
          </button>
        ))}
      </div>
    </div>
  );
}
