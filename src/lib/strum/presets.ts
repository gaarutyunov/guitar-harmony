import { StrumCell, BeatType, TimeSignature } from '@/types';

export interface StrumPreset {
  id: string;
  nameKey: string;
  pattern: StrumCell[];
  timeSignature: TimeSignature;
}

// prettier-ignore
export const strumPresets: StrumPreset[] = [
  {
    id: 'quarter-notes-44',
    nameKey: 'quarter_notes',
    pattern: ['↓','','','', '↓','','','', '↓','','','', '↓','','',''],
    timeSignature: '4/4',
  },
  {
    id: 'eighth-notes-44',
    nameKey: 'eighth_notes',
    pattern: ['↓','','↑','', '↓','','↑','', '↓','','↑','', '↓','','↑',''],
    timeSignature: '4/4',
  },
  {
    id: 'sixteenth-notes-44',
    nameKey: 'sixteenth_notes',
    pattern: ['↓','↑','↓','↑', '↓','↑','↓','↑', '↓','↑','↓','↑', '↓','↑','↓','↑'],
    timeSignature: '4/4',
  },
  {
    id: 'pop-basic',
    nameKey: 'pop_basic',
    pattern: ['↓','','','', '↓','','↑','', '','','↑','', '↓','','↑',''],
    timeSignature: '4/4',
  },
  {
    id: 'chuck-down',
    nameKey: 'chuck_down',
    pattern: ['✕','','↓','', '✕','','↓','', '✕','','↓','', '✕','','↓',''],
    timeSignature: '4/4',
  },
  {
    id: 'rasgueado',
    nameKey: 'rasgueado',
    pattern: ['↓','','↓','', '↑','','↑','', '↓','','↑','', '','','',''],
    timeSignature: '4/4',
  },
  {
    id: 'waltz',
    nameKey: 'waltz',
    pattern: ['↓','','','', '','','↑','', '↑','','',''],
    timeSignature: '3/4',
  },
  {
    id: 'quarter-notes-34',
    nameKey: 'quarter_notes',
    pattern: ['↓','','','', '↓','','','', '↓','','',''],
    timeSignature: '3/4',
  },
  {
    id: 'eighth-notes-34',
    nameKey: 'eighth_notes',
    pattern: ['↓','','↑','', '↓','','↑','', '↓','','↑',''],
    timeSignature: '3/4',
  },
  {
    id: 'sixteenth-notes-34',
    nameKey: 'sixteenth_notes',
    pattern: ['↓','↑','↓','↑', '↓','↑','↓','↑', '↓','↑','↓','↑'],
    timeSignature: '3/4',
  },
  {
    id: 'chuck-34',
    nameKey: 'chuck_34',
    pattern: ['✕','','↓','', '','','↑','', '↓','','↑',''],
    timeSignature: '3/4',
  },
];

export function getPresetsForTimeSignature(ts: TimeSignature): StrumPreset[] {
  return strumPresets.filter((p) => p.timeSignature === ts);
}

export function getEmptyPattern(ts: TimeSignature): StrumCell[] {
  return new Array(ts === '4/4' ? 16 : 12).fill('') as StrumCell[];
}

export function cycleStrumCell(cell: StrumCell): StrumCell {
  const order: StrumCell[] = ['', '↓', '↑', '✕'];
  const idx = order.indexOf(cell);
  return order[(idx + 1) % order.length];
}

export function deriveBeatType(pattern: StrumCell[], beatIdx: number): BeatType {
  const base = beatIdx * 4;
  if (pattern[base + 1] || pattern[base + 3]) return 'semicorchea';
  if (pattern[base + 2]) return 'corchea';
  return 'negra';
}

export function getBeatSymbols(
  pattern: StrumCell[],
  beatIdx: number,
): StrumCell[] {
  const base = beatIdx * 4;
  const type = deriveBeatType(pattern, beatIdx);
  switch (type) {
    case 'negra':
      return [pattern[base]];
    case 'corchea':
      return [pattern[base], pattern[base + 2]];
    case 'semicorchea':
      return [pattern[base], pattern[base + 1], pattern[base + 2], pattern[base + 3]];
  }
}

type BeatValue = '' | '↓' | '↑' | '✕' | '↓↑' | '↓↑↓↑';

const BEAT_CYCLE: BeatValue[] = ['', '↓', '↑', '✕', '↓↑', '↓↑↓↑'];

function canonicalBeatValue(pattern: StrumCell[], beatIdx: number): BeatValue {
  const base = beatIdx * 4;
  const [a, b, c, d] = [pattern[base], pattern[base + 1], pattern[base + 2], pattern[base + 3]];
  if (b || d) return '↓↑↓↑';
  if (c) return '↓↑';
  if (a === '↓') return '↓';
  if (a === '↑') return '↑';
  if (a === '✕') return '✕';
  return '';
}

function beatValueToCells(value: BeatValue): [StrumCell, StrumCell, StrumCell, StrumCell] {
  switch (value) {
    case '':       return ['', '', '', ''];
    case '↓':      return ['↓', '', '', ''];
    case '↑':      return ['↑', '', '', ''];
    case '✕':      return ['✕', '', '', ''];
    case '↓↑':     return ['↓', '', '↑', ''];
    case '↓↑↓↑':   return ['↓', '↑', '↓', '↑'];
  }
}

export function cycleBeat(pattern: StrumCell[], beatIdx: number): StrumCell[] {
  const current = canonicalBeatValue(pattern, beatIdx);
  const idx = BEAT_CYCLE.indexOf(current);
  const next = BEAT_CYCLE[(idx + 1) % BEAT_CYCLE.length];
  const cells = beatValueToCells(next);
  const newPattern = [...pattern];
  const base = beatIdx * 4;
  newPattern[base] = cells[0];
  newPattern[base + 1] = cells[1];
  newPattern[base + 2] = cells[2];
  newPattern[base + 3] = cells[3];
  return newPattern;
}

export function getActiveCellIndex(beatType: BeatType, subBeat: number): number | null {
  switch (beatType) {
    case 'negra':
      return subBeat === 0 ? 0 : null;
    case 'corchea':
      if (subBeat === 0) return 0;
      if (subBeat === 2) return 1;
      return null;
    case 'semicorchea':
      return subBeat;
  }
}
