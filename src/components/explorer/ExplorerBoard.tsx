'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChordPosition } from '@/types';
import {
  ChordQuality7,
  IntervalLabel,
  getIntervalLabels,
} from '@/lib/theory/explorer';

interface ExplorerBoardProps {
  position: ChordPosition;
  rootPc: number;
  quality: ChordQuality7;
  showFingering: boolean;
}

const W = 280;
const PAD = { top: 38, left: 34, right: 16, bottom: 18 };
const VISIBLE_FRETS = 5;
const FRET_SPACING = 34;
const MAX_FRET = 13;
const STRING_SPACING = (W - PAD.left - PAD.right) / 5;
const SVG_H = PAD.top + VISIBLE_FRETS * FRET_SPACING + PAD.bottom;
const DOT_R = 10;

const SPRING = { type: 'spring', stiffness: 260, damping: 26 } as const;

function intervalColor(label: IntervalLabel | null): string {
  if (!label) return '#8b4513';
  if (label === '1') return '#f59e0b'; // root — amber
  if (label.includes('3')) return '#2dd4bf'; // 3rd — teal
  if (label === '5' || label === 'b5') return '#38bdf8'; // 5th — sky
  return '#fb7185'; // 7th — rose (the added séptima pops)
}

export function ExplorerBoard({
  position,
  rootPc,
  quality,
  showFingering,
}: ExplorerBoardProps) {
  const intervals = getIntervalLabels(position, rootPc, quality);

  const fretted = position.frets.filter((f) => f > 0);
  const minFret = fretted.length > 0 ? Math.min(...fretted) : 0;
  const hasOpen = position.frets.includes(0);
  // Top fret of the scrolling viewport: frame the shape, but keep the nut in
  // view for open chords.
  const windowTopFret = hasOpen || minFret <= 1 ? 0 : minFret - 1;
  const scrollY = -windowTopFret * FRET_SPACING;

  const stringX = (s: number) => PAD.left + s * STRING_SPACING;
  const fretLineY = (fret: number) => PAD.top + fret * FRET_SPACING;
  const dotY = (fret: number) => PAD.top + (fret - 0.5) * FRET_SPACING;

  // Barre runs across the strings sharing the lowest fret.
  const barreFret = position.barres[0];
  const barreStrings = barreFret
    ? position.frets
        .map((f, i) => (f === barreFret ? i : -1))
        .filter((i) => i >= 0)
    : [];

  return (
    <div className="flex flex-col items-center">
      <svg
        width={W}
        height={SVG_H}
        viewBox={`0 0 ${W} ${SVG_H}`}
        className="overflow-hidden"
      >
        <defs>
          <clipPath id="board-clip">
            <rect x={0} y={PAD.top - 20} width={W} height={SVG_H - PAD.top + 20} />
          </clipPath>
        </defs>

        <g clipPath="url(#board-clip)">
          <motion.g animate={{ y: scrollY }} transition={SPRING}>
            {/* Fret lines + position numbers */}
            {Array.from({ length: MAX_FRET + 1 }, (_, fret) => (
              <g key={`fret-${fret}`}>
                <line
                  x1={PAD.left}
                  y1={fretLineY(fret)}
                  x2={W - PAD.right}
                  y2={fretLineY(fret)}
                  stroke={fret === 0 ? '#f5e6dc' : '#6b3410'}
                  strokeWidth={fret === 0 ? 3 : 1}
                />
                {fret >= 1 && (
                  <text
                    x={PAD.left - 10}
                    y={dotY(fret) + 3}
                    fill="#d4a574"
                    fontSize={9}
                    fontFamily="JetBrains Mono"
                    textAnchor="middle"
                  >
                    {fret}
                  </text>
                )}
              </g>
            ))}

            {/* Strings */}
            {[0, 1, 2, 3, 4, 5].map((s) => (
              <line
                key={`str-${s}`}
                x1={stringX(s)}
                y1={PAD.top}
                x2={stringX(s)}
                y2={fretLineY(MAX_FRET)}
                stroke="#8b4513"
                strokeWidth={1}
              />
            ))}

            {/* Open / muted markers above the nut */}
            {position.frets.map((fret, s) => {
              if (fret > 0) return null;
              return (
                <text
                  key={`mark-${s}`}
                  x={stringX(s)}
                  y={PAD.top - 9}
                  fill={fret === -1 ? '#f43f5e' : '#f5e6dc'}
                  fontSize={11}
                  fontFamily="JetBrains Mono"
                  textAnchor="middle"
                >
                  {fret === -1 ? '✕' : '○'}
                </text>
              );
            })}

            {/* Barre */}
            <AnimatePresence>
              {barreFret && barreStrings.length >= 2 && (
                <motion.rect
                  key="barre"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 0.85,
                    x: stringX(Math.min(...barreStrings)) - DOT_R,
                    y: dotY(barreFret) - DOT_R,
                  }}
                  exit={{ opacity: 0 }}
                  transition={SPRING}
                  width={
                    (Math.max(...barreStrings) - Math.min(...barreStrings)) *
                      STRING_SPACING +
                    DOT_R * 2
                  }
                  height={DOT_R * 2}
                  rx={DOT_R}
                  fill="#f59e0b"
                />
              )}
            </AnimatePresence>

            {/* Fretted dots — keyed by string so they slide between chords */}
            <AnimatePresence>
              {position.frets.map((fret, s) => {
                if (fret <= 0) return null;
                const label = intervals[s];
                const isBarreDot = fret === barreFret && barreStrings.length >= 2;
                return (
                  <motion.g
                    key={`dot-${s}`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: stringX(s),
                      y: dotY(fret),
                    }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={SPRING}
                  >
                    {!isBarreDot && (
                      <circle r={DOT_R} fill={intervalColor(label)} />
                    )}
                    {showFingering && position.fingers[s] > 0 && (
                      <text
                        y={3.5}
                        fill="#1a0d04"
                        fontSize={10}
                        fontFamily="JetBrains Mono"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {position.fingers[s]}
                      </text>
                    )}
                  </motion.g>
                );
              })}
            </AnimatePresence>
          </motion.g>
        </g>
      </svg>

      {/* Interval (degree) row under the strings — like the worksheet */}
      <svg width={W} height={26} viewBox={`0 0 ${W} 26`}>
        {[0, 1, 2, 3, 4, 5].map((s) => {
          const label = intervals[s];
          if (!label) return null;
          return (
            <text
              key={`int-${s}`}
              x={stringX(s)}
              y={16}
              fill={intervalColor(label)}
              fontSize={12}
              fontFamily="JetBrains Mono"
              fontWeight="bold"
              textAnchor="middle"
            >
              {label.replace('b', '♭')}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
