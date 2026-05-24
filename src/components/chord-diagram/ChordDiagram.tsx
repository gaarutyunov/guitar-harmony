'use client';

import { getChordData } from '@/data/chords';

interface ChordDiagramProps {
  chordName: string;
  showFingering: boolean;
  size?: 'sm' | 'md';
}

export function ChordDiagram({ chordName, showFingering, size = 'md' }: ChordDiagramProps) {
  const data = getChordData(chordName);
  const pos = data?.positions[0];

  const w = size === 'sm' ? 80 : 120;
  const h = size === 'sm' ? 100 : 150;

  if (!showFingering) {
    return (
      <div className={`flex items-center justify-center bg-mahogany-900/50 rounded-lg border border-mahogany-700/30 ${size === 'sm' ? 'w-20 h-24' : 'w-[120px] h-[150px]'}`}>
        <span className={`font-mono font-bold text-mahogany-200 ${size === 'sm' ? 'text-lg' : 'text-2xl'}`}>
          {chordName}
        </span>
      </div>
    );
  }

  if (!pos) {
    return (
      <div className={`flex items-center justify-center bg-mahogany-900/50 rounded-lg border border-mahogany-700/30 ${size === 'sm' ? 'w-20 h-24' : 'w-[120px] h-[150px]'}`}>
        <span className="font-mono text-mahogany-400 text-sm">{chordName}</span>
      </div>
    );
  }

  const padding = { top: 25, left: 20, right: 15, bottom: 10 };
  const stringSpacing = (w - padding.left - padding.right) / 5;
  const fretSpacing = (h - padding.top - padding.bottom) / 4;
  const dotRadius = size === 'sm' ? 5 : 7;
  const fontSize = size === 'sm' ? 7 : 9;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="flex-shrink-0">
      {/* Nut or position indicator */}
      {pos.baseFret === 1 ? (
        <line
          x1={padding.left}
          y1={padding.top}
          x2={w - padding.right}
          y2={padding.top}
          stroke="#f5e6dc"
          strokeWidth={3}
        />
      ) : (
        <text
          x={padding.left - 12}
          y={padding.top + fretSpacing / 2 + 4}
          fill="#d4a574"
          fontSize={fontSize + 1}
          fontFamily="JetBrains Mono"
          textAnchor="middle"
        >
          {pos.baseFret}
        </text>
      )}

      {/* Fret lines */}
      {[0, 1, 2, 3, 4].map((fret) => (
        <line
          key={`fret-${fret}`}
          x1={padding.left}
          y1={padding.top + fret * fretSpacing}
          x2={w - padding.right}
          y2={padding.top + fret * fretSpacing}
          stroke="#6b3410"
          strokeWidth={1}
        />
      ))}

      {/* String lines */}
      {[0, 1, 2, 3, 4, 5].map((str) => (
        <line
          key={`str-${str}`}
          x1={padding.left + str * stringSpacing}
          y1={padding.top}
          x2={padding.left + str * stringSpacing}
          y2={padding.top + 4 * fretSpacing}
          stroke="#8b4513"
          strokeWidth={1}
        />
      ))}

      {/* Barre */}
      {pos.barres.map((barreFret) => {
        const barreStrings = pos.frets
          .map((f, i) => (f === barreFret ? i : -1))
          .filter((i) => i >= 0);
        if (barreStrings.length < 2) return null;
        const minStr = Math.min(...barreStrings);
        const maxStr = Math.max(...barreStrings);
        const y = padding.top + (barreFret - 0.5) * fretSpacing;
        return (
          <rect
            key={`barre-${barreFret}`}
            x={padding.left + minStr * stringSpacing - dotRadius}
            y={y - dotRadius}
            width={(maxStr - minStr) * stringSpacing + dotRadius * 2}
            height={dotRadius * 2}
            rx={dotRadius}
            fill="#f59e0b"
            opacity={0.8}
          />
        );
      })}

      {/* Dots and markers */}
      {pos.frets.map((fret, stringIdx) => {
        const x = padding.left + stringIdx * stringSpacing;

        if (fret === -1) {
          return (
            <text
              key={`marker-${stringIdx}`}
              x={x}
              y={padding.top - 8}
              fill="#f43f5e"
              fontSize={fontSize}
              fontFamily="JetBrains Mono"
              textAnchor="middle"
            >
              ×
            </text>
          );
        }

        if (fret === 0) {
          return (
            <circle
              key={`marker-${stringIdx}`}
              cx={x}
              cy={padding.top - 10}
              r={dotRadius - 2}
              fill="none"
              stroke="#f5e6dc"
              strokeWidth={1.5}
            />
          );
        }

        const y = padding.top + (fret - 0.5) * fretSpacing;
        const isBarre = pos.barres.includes(fret);

        return (
          <g key={`dot-${stringIdx}`}>
            {!isBarre && (
              <circle cx={x} cy={y} r={dotRadius} fill="#f59e0b" />
            )}
            {pos.fingers[stringIdx] > 0 && (
              <text
                x={x}
                y={y + (fontSize / 3)}
                fill={isBarre ? '#1a0d04' : '#1a0d04'}
                fontSize={fontSize}
                fontFamily="JetBrains Mono"
                fontWeight="bold"
                textAnchor="middle"
              >
                {pos.fingers[stringIdx]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
