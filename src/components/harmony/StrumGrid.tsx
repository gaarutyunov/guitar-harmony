'use client';

import { useTranslations } from 'next-intl';
import { StrumCell, BeatType, TimeSignature } from '@/types';
import {
  getPresetsForTimeSignature,
  getDefaultBeatTypes,
  cycleStrumCell,
  cycleBeatType,
  cleanPatternForBeatType,
  getDisplayCells,
} from '@/lib/strum/presets';
import { useState } from 'react';

interface StrumGridProps {
  pattern: StrumCell[];
  beatTypes: BeatType[];
  timeSignature: TimeSignature;
  onChange: (pattern: StrumCell[]) => void;
  onBeatTypesChange: (beatTypes: BeatType[]) => void;
  activeBeat?: number;
  activeCell?: number;
}

const BEAT_TYPE_LABEL: Record<BeatType, string> = {
  negra: '•',
  corchea: '••',
  semicorchea: '••••',
};

const COL_SPAN: Record<BeatType, string> = {
  negra: 'col-span-4',
  corchea: 'col-span-2',
  semicorchea: 'col-span-1',
};

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

export function StrumGrid({
  pattern,
  beatTypes,
  timeSignature,
  onChange,
  onBeatTypesChange,
  activeBeat = -1,
  activeCell = -1,
}: StrumGridProps) {
  const t = useTranslations('strum_presets');
  const tCard = useTranslations('chord_card');
  const presets = getPresetsForTimeSignature(timeSignature);
  const [showPresets, setShowPresets] = useState(false);

  const numBeats = timeSignature === '4/4' ? 4 : 3;

  function handleCellTap(flatIdx: number) {
    const newPattern = [...pattern];
    newPattern[flatIdx] = cycleStrumCell(newPattern[flatIdx]);
    onChange(newPattern);
  }

  function handleBeatTypeChange(beatIdx: number) {
    const newBeatTypes = [...beatTypes];
    newBeatTypes[beatIdx] = cycleBeatType(newBeatTypes[beatIdx]);
    const cleaned = cleanPatternForBeatType(pattern, beatIdx, newBeatTypes[beatIdx]);
    onBeatTypesChange(newBeatTypes);
    onChange(cleaned);
  }

  function applyPreset(preset: { pattern: StrumCell[]; beatTypes: BeatType[] }) {
    onChange([...preset.pattern]);
    onBeatTypesChange([...preset.beatTypes]);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-1">
        {Array.from({ length: numBeats }, (_, bi) => {
          const bt = beatTypes[bi] || 'negra';
          const cells = getDisplayCells(pattern, bi, bt);

          return (
            <div key={bi} className="flex flex-col items-center gap-0.5">
              <div
                className={`grid grid-cols-4 gap-px rounded-lg p-0.5 transition-colors ${
                  activeBeat === bi
                    ? 'bg-amber-500/20 ring-1 ring-amber-400/40'
                    : 'bg-mahogany-900/40'
                }`}
              >
                {cells.map(({ cell, flatIdx }, ci) => (
                  <button
                    key={flatIdx}
                    onClick={() => handleCellTap(flatIdx)}
                    className={`${COL_SPAN[bt]} h-7 flex items-center justify-center rounded text-sm font-mono font-bold transition-colors border active:scale-95 ${
                      activeBeat === bi && activeCell === ci
                        ? 'bg-amber-500/30 border-amber-500/60 ring-1 ring-amber-400/40'
                        : 'bg-mahogany-900/60 border-mahogany-800/40 hover:bg-mahogany-800/60'
                    } ${getCellColor(cell)}`}
                  >
                    {getCellDisplay(cell)}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleBeatTypeChange(bi)}
                className="text-[8px] leading-none font-mono text-mahogany-500 hover:text-mahogany-300 transition-colors px-1 tracking-wider"
                title={bt}
              >
                {BEAT_TYPE_LABEL[bt]}
              </button>
            </div>
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
                onClick={() => applyPreset(preset)}
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
