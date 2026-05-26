'use client';

import { useState } from 'react';
import { HarmonyChord, TimeSignature, Beat } from '@/types';
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
  onUpdatePattern: (pattern: Beat[]) => void;
  isActive?: boolean;
  activeBeat?: number;
  activeCell?: number;
}

export function ChordCard({
  chord,
  timeSignature,
  isFirst,
  isLast,
  onMove,
  onRemove,
  onUpdatePattern,
  isActive = false,
  activeBeat = -1,
  activeCell = -1,
}: ChordCardProps) {
  const showFingering = useSettingsStore((s) => s.showFingering);
  const [showNotes, setShowNotes] = useState(false);
  const quality = getChordQuality(chord.name);

  return (
    <div className={`rounded-xl border overflow-hidden transition-colors ${
      isActive
        ? 'bg-mahogany-900/60 border-amber-500/40 ring-1 ring-amber-500/20'
        : 'bg-mahogany-900/40 border-mahogany-800/40'
    }`}>
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
        <button
          onClick={() => setShowNotes((v) => !v)}
          className="cursor-pointer rounded-lg transition-colors hover:bg-mahogany-800/30"
          aria-label={showNotes ? 'Show fingering' : 'Show notes'}
        >
          <ChordDiagram chordName={chord.name} showFingering={showFingering} showNotes={showNotes} size="md" />
        </button>
        <div className="flex-1 min-w-0">
          <StrumGrid
            pattern={chord.strumPattern}
            timeSignature={timeSignature}
            onChange={onUpdatePattern}
            activeBeat={isActive ? activeBeat : -1}
            activeCell={isActive ? activeCell : -1}
          />
        </div>
      </div>
    </div>
  );
}
