'use client';

import { HarmonyChord, TimeSignature, StrumCell } from '@/types';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { ChordDiagram } from '@/components/chord-diagram/ChordDiagram';
import { StrumGrid } from './StrumGrid';
import { getChordQuality, getQualityColor } from '@/lib/theory';

interface ChordCardProps {
  chord: HarmonyChord;
  timeSignature: TimeSignature;
  isFirst: boolean;
  isLast: boolean;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
  onUpdatePattern: (pattern: StrumCell[]) => void;
}

export function ChordCard({
  chord,
  timeSignature,
  isFirst,
  isLast,
  onMove,
  onRemove,
  onUpdatePattern,
}: ChordCardProps) {
  const showFingering = useSettingsStore((s) => s.showFingering);
  const quality = getChordQuality(chord.name);

  return (
    <div className="bg-mahogany-900/40 rounded-xl border border-mahogany-800/40 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-mahogany-800/30">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-lg text-mahogany-100">{chord.name}</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono border ${getQualityColor(quality)}`}>
            {chord.degree} · {chord.key}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onMove(-1)}
            disabled={isFirst}
            className="w-6 h-6 flex items-center justify-center rounded text-xs text-mahogany-400 hover:text-mahogany-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ↑
          </button>
          <button
            onClick={() => onMove(1)}
            disabled={isLast}
            className="w-6 h-6 flex items-center justify-center rounded text-xs text-mahogany-400 hover:text-mahogany-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ↓
          </button>
          <button
            onClick={onRemove}
            className="w-6 h-6 flex items-center justify-center rounded text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            ×
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex gap-3 p-3">
        <ChordDiagram chordName={chord.name} showFingering={showFingering} size="md" />
        <div className="flex-1 min-w-0">
          <StrumGrid
            pattern={chord.strumPattern}
            timeSignature={timeSignature}
            onChange={onUpdatePattern}
          />
        </div>
      </div>
    </div>
  );
}
