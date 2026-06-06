'use client';

import { useTranslations } from 'next-intl';
import { ExplorerChord, ShapeFamily } from '@/data/explorer';
import { transposedSymbol } from '@/lib/theory/explorer';

interface ShapeFamilyRailProps {
  chord: ExplorerChord;
  family?: ShapeFamily;
  useBarre: boolean;
  barreFret: number;
  onSelectFret: (fret: number) => void;
  onSlide: (delta: number) => void;
  onUseOpen: () => void;
}

/** Every position the forma can take in one octave up the neck. */
const FRET_RANGE = Array.from({ length: 12 }, (_, f) => f);

export function ShapeFamilyRail({
  chord,
  family,
  useBarre,
  barreFret,
  onSelectFret,
  onSlide,
  onUseOpen,
}: ShapeFamilyRailProps) {
  const t = useTranslations('explorer.family');

  // Open-only chord (no movable forma): make the non-movable nature explicit.
  if (!chord.formaId || !family) {
    return (
      <div className="rounded-lg border border-mahogany-800/50 bg-mahogany-900/30 p-3">
        <p className="text-xs text-mahogany-400">{t('not_movable')}</p>
      </div>
    );
  }

  const formaId = chord.formaId;
  const activeFret = useBarre ? barreFret : chord.rootFret ?? -1;
  const currentSymbol = useBarre
    ? transposedSymbol(formaId, barreFret, chord.quality)
    : chord.symbol;

  return (
    <div className="rounded-lg border border-mahogany-800/50 bg-mahogany-900/30 p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-mono uppercase tracking-wide text-mahogany-400">
          {t('title')} · {t(`forma.${family.labelKey}`)}
        </div>
        {chord.open && useBarre && (
          <button
            onClick={onUseOpen}
            className="text-[11px] font-mono text-amber-400 hover:text-amber-300"
          >
            {t('use_open')}
          </button>
        )}
      </div>

      {/* The same shape at every position up the neck */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {FRET_RANGE.map((fret) => {
          const active = fret === activeFret;
          return (
            <button
              key={fret}
              onClick={() => onSelectFret(fret)}
              className={`px-2 py-1 rounded-md font-mono text-xs font-medium border transition-all active:scale-95 ${
                active
                  ? 'bg-amber-500 text-mahogany-950 border-amber-500'
                  : 'bg-mahogany-800/30 text-mahogany-200 border-mahogany-700/40 hover:bg-mahogany-800/50'
              }`}
            >
              {transposedSymbol(formaId, fret, chord.quality)}
            </button>
          );
        })}
      </div>

      {/* Slide the riff up/down the neck */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-mahogany-400">{t('slide_hint')}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSlide(-1)}
            disabled={useBarre && barreFret <= 0}
            className="w-8 h-8 rounded-lg bg-mahogany-800/40 text-mahogany-200 font-bold disabled:opacity-30 hover:bg-mahogany-700/50 active:scale-95"
            aria-label="slide toward the nut"
          >
            ▲
          </button>
          <span className="min-w-[64px] text-center font-mono text-sm font-bold text-amber-300">
            {currentSymbol}
          </span>
          <button
            onClick={() => onSlide(1)}
            disabled={useBarre && barreFret >= 11}
            className="w-8 h-8 rounded-lg bg-mahogany-800/40 text-mahogany-200 font-bold disabled:opacity-30 hover:bg-mahogany-700/50 active:scale-95"
            aria-label="slide up the neck"
          >
            ▼
          </button>
        </div>
      </div>
    </div>
  );
}
