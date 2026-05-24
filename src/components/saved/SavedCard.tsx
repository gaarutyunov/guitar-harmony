'use client';

import { useTranslations } from 'next-intl';
import { Harmony } from '@/types';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { ChordDiagram } from '@/components/chord-diagram/ChordDiagram';

interface SavedCardProps {
  harmony: Harmony;
  onLoad: () => void;
  onDelete: () => void;
}

export function SavedCard({ harmony, onLoad, onDelete }: SavedCardProps) {
  const t = useTranslations('saved');
  const showFingering = useSettingsStore((s) => s.showFingering);

  return (
    <div className="bg-mahogany-900/40 rounded-xl border border-mahogany-800/40 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-mahogany-800/30">
        <div>
          <h3 className="font-heading font-bold text-mahogany-100">{harmony.name}</h3>
          <p className="text-[10px] font-mono text-mahogany-500">
            {harmony.timeSignature} · {t('chords_count', { count: harmony.chords.length })}
          </p>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={onLoad}
            className="px-3 py-1 rounded-md text-xs font-mono font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
          >
            {t('load')}
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 rounded-md text-xs font-mono font-medium bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-colors"
          >
            {t('delete')}
          </button>
        </div>
      </div>

      {/* Mini chord strip */}
      <div className="flex gap-2 p-3 overflow-x-auto">
        {harmony.chords.map((chord) => (
          <div key={chord.id} className="flex-shrink-0">
            <ChordDiagram chordName={chord.name} showFingering={showFingering} size="sm" />
            <p className="text-center text-[10px] font-mono text-mahogany-400 mt-0.5">{chord.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
