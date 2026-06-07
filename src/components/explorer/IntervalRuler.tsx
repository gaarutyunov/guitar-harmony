'use client';

import { useTranslations } from 'next-intl';
import {
  ChordQuality7,
  IntervalLabel,
  getChordDegrees,
  getSeventhRule,
} from '@/lib/theory/explorer';

function chipColor(label: IntervalLabel): string {
  if (label === '1') return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  if (label.includes('3')) return 'bg-teal-500/20 text-teal-300 border-teal-500/40';
  if (label === '5' || label === 'b5')
    return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
  return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
}

function pretty(label: IntervalLabel): string {
  return label.replace('b', '♭');
}

export function IntervalRuler({ quality }: { quality: ChordQuality7 }) {
  const t = useTranslations('explorer.ruler');
  const degrees = getChordDegrees(quality);
  const seventh = getSeventhRule(quality);

  return (
    <div className="rounded-lg border border-mahogany-800/50 bg-mahogany-900/30 p-3">
      <div className="text-[11px] font-mono uppercase tracking-wide text-mahogany-400 mb-2">
        {t('title')}
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {degrees.map((d, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <span
              className={`px-2 py-1 rounded-md border font-mono text-sm font-bold ${chipColor(d)}`}
            >
              {pretty(d)}
            </span>
            {i < degrees.length - 1 && (
              <span className="text-mahogany-600 text-xs">·</span>
            )}
          </span>
        ))}

        {seventh && (
          <span className="flex items-center gap-1.5 ml-1">
            <span className="text-rose-300/70 text-base leading-none">↓</span>
            <span className="px-2 py-1 rounded-md border border-mahogany-700/40 bg-mahogany-800/30 font-mono text-sm text-mahogany-300">
              8
            </span>
          </span>
        )}
      </div>

      <p className="mt-2 text-xs text-mahogany-300 leading-snug">
        {seventh ? (
          <>
            <span className="text-rose-300 font-semibold">
              {t('seventh_intro')}
            </span>{' '}
            {t(`rule_${seventh.rule}`)}
          </>
        ) : (
          t('triad')
        )}
      </p>
    </div>
  );
}
