import { StrumCell, TimeSignature } from '@/types';

export interface StrumPreset {
  id: string;
  nameKey: string;
  pattern: StrumCell[];
  timeSignature: TimeSignature;
}

export const strumPresets: StrumPreset[] = [
  {
    id: 'quarter-notes-44',
    nameKey: 'quarter_notes',
    pattern: ['↓', '', '↓', '', '↓', '', '↓', ''],
    timeSignature: '4/4',
  },
  {
    id: 'eighth-notes-44',
    nameKey: 'eighth_notes',
    pattern: ['↓', '↑', '↓', '↑', '↓', '↑', '↓', '↑'],
    timeSignature: '4/4',
  },
  {
    id: 'pop-basic',
    nameKey: 'pop_basic',
    pattern: ['↓', '', '↓', '↑', '', '↑', '↓', '↑'],
    timeSignature: '4/4',
  },
  {
    id: 'chuck-down',
    nameKey: 'chuck_down',
    pattern: ['✕', '↓', '✕', '↓', '✕', '↓', '✕', '↓'],
    timeSignature: '4/4',
  },
  {
    id: 'rasgueado',
    nameKey: 'rasgueado',
    pattern: ['↓', '↓', '↑', '↑', '↓', '↑', '', ''],
    timeSignature: '4/4',
  },
  {
    id: 'waltz',
    nameKey: 'waltz',
    pattern: ['↓', '', '', '↑', '↑', ''],
    timeSignature: '3/4',
  },
  {
    id: 'quarter-notes-34',
    nameKey: 'quarter_notes',
    pattern: ['↓', '', '↓', '', '↓', ''],
    timeSignature: '3/4',
  },
  {
    id: 'eighth-notes-34',
    nameKey: 'eighth_notes',
    pattern: ['↓', '↑', '↓', '↑', '↓', '↑'],
    timeSignature: '3/4',
  },
  {
    id: 'chuck-34',
    nameKey: 'chuck_34',
    pattern: ['✕', '↓', '', '↑', '↓', '↑'],
    timeSignature: '3/4',
  },
];

export function getPresetsForTimeSignature(ts: TimeSignature): StrumPreset[] {
  return strumPresets.filter((p) => p.timeSignature === ts);
}

export function getEmptyPattern(ts: TimeSignature): StrumCell[] {
  return new Array(ts === '4/4' ? 8 : 6).fill('');
}

export function cycleStrumCell(cell: StrumCell): StrumCell {
  const order: StrumCell[] = ['', '↓', '↑', '✕'];
  const idx = order.indexOf(cell);
  return order[(idx + 1) % order.length];
}
