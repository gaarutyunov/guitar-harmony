'use client';

import { useTranslations } from 'next-intl';
import { StrumCell, TimeSignature } from '@/types';
import {
  getPresetsForTimeSignature,
  cycleBeat,
  deriveBeatType,
  getBeatSymbols,
} from '@/lib/strum/presets';
import { useState } from 'react';

interface StrumGridProps {
  pattern: StrumCell[];
  timeSignature: TimeSignature;
  onChange: (pattern: StrumCell[]) => void;
  activeBeat?: number;
  activeCell?: number;
}

const SIZE_CLASS = {
  negra: 'text-base',
  corchea: 'text-sm',
  semicorchea: 'text-xs',
};

function getCellColor(cell: StrumCell): string {
  switch (cell) {
    case '↓': return 'text-amber-400';
    case '↑': return 'text-teal-400';
    case '✕': return 'text-rose-400';
    default: return 'text-mahogany-600';
  }
}

export function StrumGrid({
  pattern,
  timeSignature,
  onChange,
  activeBeat = -1,
  activeCell = -1,
}: StrumGridProps) {
  const t = useTranslations('strum_presets');
  const tCard = useTranslations('chord_card');
  const presets = getPresetsForTimeSignature(timeSignature);
  const [showPresets, setShowPresets] = useState(false);

  const numBeats = timeSignature === '4/4' ? 4 : 3;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: numBeats }, (_, bi) => {
          const symbols = getBeatSymbols(pattern, bi);
          const beatType = deriveBeatType(pattern, bi);

          return (
            <button
              key={bi}
              onClick={() => onChange(cycleBeat(pattern, bi))}
              className={`w-14 h-9 flex items-center justify-center rounded-lg font-mono font-bold transition-colors border active:scale-95 ${
                activeBeat === bi
                  ? 'bg-amber-500/30 border-amber-500/60 ring-1 ring-amber-400/40'
                  : 'bg-mahogany-900/60 border-mahogany-800/40 hover:bg-mahogany-800/60'
              }`}
            >
              <span className={`flex items-center gap-px ${SIZE_CLASS[beatType]}`}>
                {symbols.map((sym, si) => (
                  <span
                    key={si}
                    className={
                      activeBeat === bi && activeCell === si
                        ? 'text-amber-300 drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]'
                        : getCellColor(sym)
                    }
                  >
                    {sym || '·'}
                  </span>
                ))}
              </span>
            </button>
          );
        })}
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
