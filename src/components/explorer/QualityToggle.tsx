'use client';

import { useTranslations } from 'next-intl';
import { ToggleQuality } from '@/lib/theory/explorer';

interface QualityToggleProps {
  value: ToggleQuality;
  onChange: (q: ToggleQuality) => void;
  /** B + seventh: choose between Bm7(♭5) and Bdim7. */
  showAlt?: boolean;
  alt?: boolean;
  onAltChange?: (alt: boolean) => void;
}

const QUALITIES: { key: ToggleQuality; labelKey: string }[] = [
  { key: 'major', labelKey: 'major' },
  { key: 'minor', labelKey: 'minor' },
  { key: 'seventh', labelKey: 'seventh' },
];

export function QualityToggle({
  value,
  onChange,
  showAlt,
  alt,
  onAltChange,
}: QualityToggleProps) {
  const t = useTranslations('explorer.quality');

  return (
    <div className="space-y-2">
      <div className="flex gap-1.5 p-1 rounded-xl bg-mahogany-900/40">
        {QUALITIES.map((q) => (
          <button
            key={q.key}
            onClick={() => onChange(q.key)}
            className={`flex-1 py-2 rounded-lg font-mono text-sm font-medium transition-all active:scale-95 ${
              value === q.key
                ? 'bg-amber-500 text-mahogany-950'
                : 'text-mahogany-300 hover:bg-mahogany-800/40'
            }`}
          >
            {t(q.labelKey)}
          </button>
        ))}
      </div>

      {showAlt && (
        <div className="flex gap-1.5 p-1 rounded-xl bg-mahogany-900/40">
          {[
            { v: false, label: 'Bm7(♭5)' },
            { v: true, label: 'Bdim7' },
          ].map((opt) => (
            <button
              key={opt.label}
              onClick={() => onAltChange?.(opt.v)}
              className={`flex-1 py-1.5 rounded-lg font-mono text-xs transition-all active:scale-95 ${
                alt === opt.v
                  ? 'bg-rose-500/30 text-rose-200 border border-rose-500/40'
                  : 'text-mahogany-400 hover:bg-mahogany-800/40'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
