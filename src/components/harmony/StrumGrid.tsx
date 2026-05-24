'use client';

import { useTranslations } from 'next-intl';
import { StrumCell, TimeSignature } from '@/types';
import { getPresetsForTimeSignature, cycleStrumCell } from '@/lib/strum/presets';
import { useState } from 'react';

interface StrumGridProps {
  pattern: StrumCell[];
  timeSignature: TimeSignature;
  onChange: (pattern: StrumCell[]) => void;
}

export function StrumGrid({ pattern, timeSignature, onChange }: StrumGridProps) {
  const t = useTranslations('strum_presets');
  const tCard = useTranslations('chord_card');
  const presets = getPresetsForTimeSignature(timeSignature);
  const [showPresets, setShowPresets] = useState(false);

  function handleCellTap(idx: number) {
    const newPattern = [...pattern];
    newPattern[idx] = cycleStrumCell(newPattern[idx]);
    onChange(newPattern);
  }

  function getCellDisplay(cell: StrumCell): string {
    return cell || '·';
  }

  function getCellColor(cell: StrumCell): string {
    switch (cell) {
      case '↓': return 'text-amber-400';
      case '↑': return 'text-teal-400';
      case '✕': return 'text-rose-400';
      default: return 'text-mahogany-600';
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-0.5">
        {pattern.map((cell, i) => (
          <div key={i} className="flex items-center">
            <button
              onClick={() => handleCellTap(i)}
              className={`w-7 h-8 flex items-center justify-center rounded text-base font-mono font-bold transition-colors bg-mahogany-900/60 border border-mahogany-800/40 hover:bg-mahogany-800/60 active:scale-95 ${getCellColor(cell)}`}
            >
              {getCellDisplay(cell)}
            </button>
            {i % 2 === 1 && i < pattern.length - 1 && (
              <div className="w-px h-6 bg-mahogany-700/40 mx-0.5" />
            )}
          </div>
        ))}
      </div>

      <div>
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="text-[10px] font-mono text-mahogany-500 hover:text-mahogany-300 transition-colors"
        >
          {showPresets ? tCard('hide_patterns') : tCard('patterns')}
        </button>
        {showPresets && (
          <div className="flex flex-wrap gap-1 mt-1">
            {presets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onChange([...preset.pattern])}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-mahogany-800/60 border border-mahogany-700/30 text-mahogany-300 hover:bg-mahogany-700/60 transition-colors"
              >
                {t(preset.nameKey)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
