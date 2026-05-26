import { StrumCell, BeatType, TimeSignature } from '@/types';

export interface StrumPreset {
  id: string;
  nameKey: string;
  pattern: StrumCell[];
  beatTypes: BeatType[];
  timeSignature: TimeSignature;
}

// prettier-ignore
export const strumPresets: StrumPreset[] = [
  {
    id: 'quarter-notes-44',
    nameKey: 'quarter_notes',
    beatTypes: ['negra', 'negra', 'negra', 'negra'],
    pattern: ['↓','','','', '↓','','','', '↓','','','', '↓','','',''],
    timeSignature: '4/4',
  },
  {
    id: 'eighth-notes-44',
    nameKey: 'eighth_notes',
    beatTypes: ['corchea', 'corchea', 'corchea', 'corchea'],
    pattern: ['↓','','↑','', '↓','','↑','', '↓','','↑','', '↓','','↑',''],
    timeSignature: '4/4',
  },
  {
    id: 'sixteenth-notes-44',
    nameKey: 'sixteenth_notes',
    beatTypes: ['semicorchea', 'semicorchea', 'semicorchea', 'semicorchea'],
    pattern: ['↓','↑','↓','↑', '↓','↑','↓','↑', '↓','↑','↓','↑', '↓','↑','↓','↑'],
    timeSignature: '4/4',
  },
  {
    id: 'pop-basic',
    nameKey: 'pop_basic',
    beatTypes: ['corchea', 'corchea', 'corchea', 'corchea'],
    pattern: ['↓','','','', '↓','','↑','', '','','↑','', '↓','','↑',''],
    timeSignature: '4/4',
  },
  {
    id: 'chuck-down',
    nameKey: 'chuck_down',
    beatTypes: ['corchea', 'corchea', 'corchea', 'corchea'],
    pattern: ['✕','','↓','', '✕','','↓','', '✕','','↓','', '✕','','↓',''],
    timeSignature: '4/4',
  },
  {
    id: 'rasgueado',
    nameKey: 'rasgueado',
    beatTypes: ['corchea', 'corchea', 'corchea', 'corchea'],
    pattern: ['↓','','↓','', '↑','','↑','', '↓','','↑','', '','','',''],
    timeSignature: '4/4',
  },
  {
    id: 'waltz',
    nameKey: 'waltz',
    beatTypes: ['corchea', 'corchea', 'corchea'],
    pattern: ['↓','','','', '','','↑','', '↑','','',''],
    timeSignature: '3/4',
  },
  {
    id: 'quarter-notes-34',
    nameKey: 'quarter_notes',
    beatTypes: ['negra', 'negra', 'negra'],
    pattern: ['↓','','','', '↓','','','', '↓','','',''],
    timeSignature: '3/4',
  },
  {
    id: 'eighth-notes-34',
    nameKey: 'eighth_notes',
    beatTypes: ['corchea', 'corchea', 'corchea'],
    pattern: ['↓','','↑','', '↓','','↑','', '↓','','↑',''],
    timeSignature: '3/4',
  },
  {
    id: 'sixteenth-notes-34',
    nameKey: 'sixteenth_notes',
    beatTypes: ['semicorchea', 'semicorchea', 'semicorchea'],
    pattern: ['↓','↑','↓','↑', '↓','↑','↓','↑', '↓','↑','↓','↑'],
    timeSignature: '3/4',
  },
  {
    id: 'chuck-34',
    nameKey: 'chuck_34',
    beatTypes: ['corchea', 'corchea', 'corchea'],
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

export function getDefaultBeatTypes(ts: TimeSignature): BeatType[] {
  return new Array(ts === '4/4' ? 4 : 3).fill('negra') as BeatType[];
}

export function cellCountForType(type: BeatType): number {
  switch (type) {
    case 'negra': return 1;
    case 'corchea': return 2;
    case 'semicorchea': return 4;
  }
}

export function cycleStrumCell(cell: StrumCell): StrumCell {
  const order: StrumCell[] = ['', '↓', '↑', '✕'];
  const idx = order.indexOf(cell);
  return order[(idx + 1) % order.length];
}

export function cycleBeatType(type: BeatType): BeatType {
  const order: BeatType[] = ['negra', 'corchea', 'semicorchea'];
  const idx = order.indexOf(type);
  return order[(idx + 1) % order.length];
}

export function cellToOffset(beatType: BeatType, cellIdx: number): number {
  switch (beatType) {
    case 'negra': return 0;
    case 'corchea': return cellIdx * 2;
    case 'semicorchea': return cellIdx;
  }
}

export function getDisplayCells(
  pattern: StrumCell[],
  beatIdx: number,
  beatType: BeatType,
): { cell: StrumCell; flatIdx: number }[] {
  const base = beatIdx * 4;
  switch (beatType) {
    case 'negra':
      return [{ cell: pattern[base], flatIdx: base }];
    case 'corchea':
      return [
        { cell: pattern[base], flatIdx: base },
        { cell: pattern[base + 2], flatIdx: base + 2 },
      ];
    case 'semicorchea':
      return [
        { cell: pattern[base], flatIdx: base },
        { cell: pattern[base + 1], flatIdx: base + 1 },
        { cell: pattern[base + 2], flatIdx: base + 2 },
        { cell: pattern[base + 3], flatIdx: base + 3 },
      ];
  }
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

export function cleanPatternForBeatType(
  pattern: StrumCell[],
  beatIdx: number,
  newType: BeatType,
): StrumCell[] {
  const newPattern = [...pattern];
  const base = beatIdx * 4;
  if (newType === 'negra') {
    newPattern[base + 1] = '';
    newPattern[base + 2] = '';
    newPattern[base + 3] = '';
  } else if (newType === 'corchea') {
    newPattern[base + 1] = '';
    newPattern[base + 3] = '';
  }
  return newPattern;
}
