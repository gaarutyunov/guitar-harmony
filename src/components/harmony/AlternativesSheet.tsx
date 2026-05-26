'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { GuitarVoicing } from '@/types';
import { ChordDiagram } from '@/components/chord-diagram/ChordDiagram';
import {
  generateVoicingsForChord,
  getBarreLabel,
  getDifficultyDots,
  getInversionLabel,
} from '@/lib/theory/voicings';
import { motion, AnimatePresence } from 'framer-motion';

interface AlternativesSheetProps {
  chordName: string;
  currentVoicingId?: string;
  onSelect: (voicing: GuitarVoicing) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function AlternativesSheet({
  chordName,
  currentVoicingId,
  onSelect,
  onClose,
  isOpen,
}: AlternativesSheetProps) {
  const t = useTranslations('alternatives');
  const [voicings, setVoicings] = useState<GuitarVoicing[]>([]);

  useEffect(() => {
    if (isOpen) {
      setVoicings(generateVoicingsForChord(chordName));
    }
  }, [chordName, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-mahogany-950 border-t border-mahogany-700/40 rounded-t-2xl max-h-[80vh] flex flex-col"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-mahogany-800/30">
              <h3 className="font-heading text-lg text-mahogany-100">
                {t('title')} — {chordName}
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-mahogany-400 hover:text-mahogany-200 hover:bg-mahogany-800/40 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-4 py-2 space-y-2">
              {voicings.map((v) => {
                const isCurrent = v.id === currentVoicingId || (!currentVoicingId && v.id.includes('-db-'));
                const dots = getDifficultyDots(v.difficultyScore);
                const barreLabel = getBarreLabel(v);

                return (
                  <button
                    key={v.id}
                    onClick={() => {
                      onSelect(v);
                      onClose();
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors text-left ${
                      isCurrent
                        ? 'bg-amber-500/10 border-amber-500/30'
                        : 'bg-mahogany-900/40 border-mahogany-800/30 hover:bg-mahogany-900/60'
                    }`}
                  >
                    <ChordDiagram
                      chordName={v.chord}
                      position={v.position}
                      showFingering={true}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-mahogany-100">
                          {v.symbol}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-mono text-amber-400">
                            {t('current')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-mono text-mahogany-400">
                          {getInversionLabel(v.inversion)}
                        </span>
                        <span className="text-[10px] text-mahogany-600">·</span>
                        <span className={`text-[11px] font-mono ${
                          barreLabel === 'no_barre'
                            ? 'text-emerald-400'
                            : barreLabel === 'partial_barre'
                              ? 'text-amber-400'
                              : 'text-rose-400'
                        }`}>
                          {t(barreLabel)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs tracking-wider">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            className={i < dots ? 'text-amber-400' : 'text-mahogany-700'}
                          >
                            ●
                          </span>
                        ))}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
