'use client';

import { useTranslations } from 'next-intl';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { useHarmonyStore } from '@/stores/useHarmonyStore';
import { getRowsForMode } from '@/data/curriculum';
import { getQualityColor } from '@/lib/theory';
import { DiatonicChord } from '@/types';
import { useState } from 'react';

export function ProgressionTable() {
  const t = useTranslations('table');
  const mode = useSettingsStore((s) => s.mode);
  const selectedKey = useSettingsStore((s) => s.selectedKey);
  const addChord = useHarmonyStore((s) => s.addChord);
  const currentChords = useHarmonyStore((s) => s.current.chords);
  const [toast, setToast] = useState<string | null>(null);

  const rows = getRowsForMode(mode);
  const filteredRows = selectedKey
    ? rows.filter((r) => r.key === selectedKey)
    : rows;

  const degreeHeaders = mode === 'major'
    ? t('degree_headers_major').split(',')
    : t('degree_headers_minor').split(',');

  function handleChordTap(chord: DiatonicChord, rowKey: string) {
    addChord({
      name: chord.name,
      degree: chord.degree,
      key: rowKey,
      mode,
    });
    setToast(chord.name);
    setTimeout(() => setToast(null), 1500);
  }

  function isSelected(chordName: string, rowKey: string): boolean {
    return currentChords.some((c) => c.name === chordName && c.key === rowKey);
  }

  return (
    <div className="relative">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-500/90 text-mahogany-950 px-4 py-2 rounded-lg font-mono text-sm font-bold animate-pulse">
          + {toast}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 bg-mahogany-950 px-3 py-2 text-left text-xs font-mono text-mahogany-400 border-b border-mahogany-800">
                {t('key_label')}
              </th>
              {degreeHeaders.map((header, i) => (
                <th
                  key={i}
                  className="px-2 py-2 text-center text-xs font-mono text-mahogany-400 border-b border-mahogany-800 whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.key} className="hover:bg-mahogany-900/30">
                <td className="sticky left-0 z-10 bg-mahogany-950 px-3 py-2 font-heading font-bold text-mahogany-200 border-b border-mahogany-900/50">
                  {row.key}
                </td>
                {row.chords.map((chord, i) => (
                  <td
                    key={`${row.key}-${i}`}
                    className="px-1 py-1.5 border-b border-mahogany-900/50"
                  >
                    <button
                      onClick={() => handleChordTap(chord, row.key)}
                      className={`w-full px-2 py-1.5 rounded-md text-sm font-mono font-medium border transition-all active:scale-95 ${getQualityColor(chord.quality)} ${
                        isSelected(chord.name, row.key)
                          ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-mahogany-950'
                          : ''
                      } hover:brightness-125`}
                    >
                      {chord.name}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
