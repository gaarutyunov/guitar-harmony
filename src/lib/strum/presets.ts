import { StrumCell, Beat, BeatType, TimeSignature } from '@/types';

export interface StrumPreset {
  id: string;
  nameKey: string;
  pattern: Beat[];
  timeSignature: TimeSignature;
}

function b(type: BeatType, ...cells: StrumCell[]): Beat {
  return { type, cells };
}

export const strumPresets: StrumPreset[] = [
  {
    id: 'quarter-notes-44',
    nameKey: 'quarter_notes',
    pattern: [b('negra', '↓'), b('negra', '↓'), b('negra', '↓'), b('negra', '↓')],
    timeSignature: '4/4',
  },
  {
    id: 'eighth-notes-44',
    nameKey: 'eighth_notes',
    pattern: [b('corchea', '↓', '↑'), b('corchea', '↓', '↑'), b('corchea', '↓', '↑'), b('corchea', '↓', '↑')],
    timeSignature: '4/4',
  },
  {
    id: 'sixteenth-notes-44',
    nameKey: 'sixteenth_notes',
    pattern: [
      b('semicorchea', '↓', '↑', '↓', '↑'),
      b('semicorchea', '↓', '↑', '↓', '↑'),
      b('semicorchea', '↓', '↑', '↓', '↑'),
      b('semicorchea', '↓', '↑', '↓', '↑'),
    ],
    timeSignature: '4/4',
  },
  {
    id: 'pop-basic',
    nameKey: 'pop_basic',
    pattern: [b('corchea', '↓', ''), b('corchea', '↓', '↑'), b('corchea', '', '↑'), b('corchea', '↓', '↑')],
    timeSignature: '4/4',
  },
  {
    id: 'chuck-down',
    nameKey: 'chuck_down',
    pattern: [b('corchea', '✕', '↓'), b('corchea', '✕', '↓'), b('corchea', '✕', '↓'), b('corchea', '✕', '↓')],
    timeSignature: '4/4',
  },
  {
    id: 'rasgueado',
    nameKey: 'rasgueado',
    pattern: [b('corchea', '↓', '↓'), b('corchea', '↑', '↑'), b('corchea', '↓', '↑'), b('corchea', '', '')],
    timeSignature: '4/4',
  },
  {
    id: 'waltz',
    nameKey: 'waltz',
    pattern: [b('corchea', '↓', ''), b('corchea', '', '↑'), b('corchea', '↑', '')],
    timeSignature: '3/4',
  },
  {
    id: 'quarter-notes-34',
    nameKey: 'quarter_notes',
    pattern: [b('negra', '↓'), b('negra', '↓'), b('negra', '↓')],
    timeSignature: '3/4',
  },
  {
    id: 'eighth-notes-34',
    nameKey: 'eighth_notes',
    pattern: [b('corchea', '↓', '↑'), b('corchea', '↓', '↑'), b('corchea', '↓', '↑')],
    timeSignature: '3/4',
  },
  {
    id: 'sixteenth-notes-34',
    nameKey: 'sixteenth_notes',
    pattern: [
      b('semicorchea', '↓', '↑', '↓', '↑'),
      b('semicorchea', '↓', '↑', '↓', '↑'),
      b('semicorchea', '↓', '↑', '↓', '↑'),
    ],
    timeSignature: '3/4',
  },
  {
    id: 'chuck-34',
    nameKey: 'chuck_34',
    pattern: [b('corchea', '✕', '↓'), b('corchea', '', '↑'), b('corchea', '↓', '↑')],
    timeSignature: '3/4',
  },
];

export function getPresetsForTimeSignature(ts: TimeSignature): StrumPreset[] {
  return strumPresets.filter((p) => p.timeSignature === ts);
}

export function cellCountForType(type: BeatType): number {
  switch (type) {
    case 'negra': return 1;
    case 'corchea': return 2;
    case 'semicorchea': return 4;
  }
}

export function createEmptyBeat(type: BeatType = 'negra'): Beat {
  return { type, cells: new Array(cellCountForType(type)).fill('') as StrumCell[] };
}

export function getEmptyPattern(ts: TimeSignature): Beat[] {
  const numBeats = ts === '4/4' ? 4 : 3;
  return Array.from({ length: numBeats }, () => createEmptyBeat());
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

export function changeBeatType(beat: Beat, newType: BeatType): Beat {
  if (beat.type === newType) return beat;
  const newCount = cellCountForType(newType);
  const newCells: StrumCell[] = new Array(newCount).fill('');

  if (beat.type === 'negra' && newType === 'corchea') {
    newCells[0] = beat.cells[0];
  } else if (beat.type === 'negra' && newType === 'semicorchea') {
    newCells[0] = beat.cells[0];
  } else if (beat.type === 'corchea' && newType === 'semicorchea') {
    newCells[0] = beat.cells[0];
    newCells[2] = beat.cells[1];
  } else if (beat.type === 'semicorchea' && newType === 'corchea') {
    newCells[0] = beat.cells[0];
    newCells[1] = beat.cells[2];
  } else if (beat.type === 'semicorchea' && newType === 'negra') {
    newCells[0] = beat.cells[0];
  } else if (beat.type === 'corchea' && newType === 'negra') {
    newCells[0] = beat.cells[0];
  }

  return { type: newType, cells: newCells };
}

export function getActiveCellIndex(beat: Beat, subBeat: number): number | null {
  switch (beat.type) {
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

export function migrateOldPattern(old: string[]): Beat[] {
  const beats: Beat[] = [];
  for (let i = 0; i < old.length; i += 2) {
    beats.push({
      type: 'corchea',
      cells: [(old[i] || '') as StrumCell, (old[i + 1] || '') as StrumCell],
    });
  }
  return beats;
}
