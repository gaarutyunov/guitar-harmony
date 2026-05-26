'use client';

import { ChordPosition } from '@/types';
import { getChordData } from '@/data/chords';
import { getChordNoteNames } from '@/lib/theory';

interface ChordDiagramProps {
  chordName: string;
  position?: ChordPosition;
  showFingering: boolean;
  showNotes?: boolean;
  size?: 'sm' | 'md';
}

export function ChordDiagram({ chordName, position, showFingering, showNotes = false, size = 'md' }: ChordDiagramProps) {
  const data = getChordData(chordName);
  const pos = position ?? data?.positions[0];
  const noteNames = pos ? getChordNoteNames(pos) : [];

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

  const frettedValues = pos.frets.filter((f) => f > 0);
  const startFret = frettedValues.length > 0 ? Math.min(...frettedValues) : 1;
  const isOpenPosition = startFret === 1;

  const padding = { top: 25, left: isOpenPosition ? 20 : 28, right: 15, bottom: 10 };
  const stringSpacing = (w - padding.left - padding.right) / 5;
  const fretSpacing = (h - padding.top - padding.bottom) / 4;
  const dotRadius = size === 'sm' ? 5 : 7;
  const fontSize = size === 'sm' ? 7 : 9;
  const labelFontSize = size === 'sm' ? 6 : 8;

  function fretToY(absoluteFret: number): number {
    const relative = absoluteFret - startFret + 1;
    return padding.top + (relative - 0.5) * fretSpacing;
  }

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="flex-shrink-0">
      {/* Nut (only at fret 1) or fret numbers on the left */}
      {isOpenPosition ? (
        <line
          x1={padding.left}
          y1={padding.top}
          x2={w - padding.right}
          y2={padding.top}
          stroke="#f5e6dc"
          strokeWidth={3}
        />
      ) : (
        [0, 1, 2, 3].map((i) => (
          <text
            key={`fret-label-${i}`}
            x={padding.left - 8}
            y={padding.top + (i + 0.5) * fretSpacing + labelFontSize / 3}
            fill="#d4a574"
            fontSize={labelFontSize}
            fontFamily="JetBrains Mono"
            textAnchor="middle"
          >
            {startFret + i}
          </text>
        ))
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
        const y = fretToY(barreFret);
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
          if (showNotes && noteNames[stringIdx]) {
            return (
              <g key={`marker-${stringIdx}`}>
                <circle
                  cx={x}
                  cy={padding.top - 10}
                  r={dotRadius}
                  fill="#f59e0b"
                />
                <text
                  x={x}
                  y={padding.top - 10 + (fontSize / 3)}
                  fill="#1a0d04"
                  fontSize={fontSize - 1}
                  fontFamily="JetBrains Mono"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {noteNames[stringIdx]}
                </text>
              </g>
            );
          }
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

        const y = fretToY(fret);
        const isBarre = pos.barres.includes(fret);

        return (
          <g key={`dot-${stringIdx}`}>
            {!isBarre && (
              <circle cx={x} cy={y} r={dotRadius} fill="#f59e0b" />
            )}
            {(showNotes ? noteNames[stringIdx] : pos.fingers[stringIdx] > 0) && (
              <text
                x={x}
                y={y + (fontSize / 3)}
                fill="#1a0d04"
                fontSize={showNotes ? fontSize - 1 : fontSize}
                fontFamily="JetBrains Mono"
                fontWeight="bold"
                textAnchor="middle"
              >
                {showNotes ? noteNames[stringIdx] : pos.fingers[stringIdx]}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
