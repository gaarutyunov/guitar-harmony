import { DiatonicChord, ChordQuality } from '@/types';

export interface DiatonicRow {
  key: string;
  chords: DiatonicChord[];
}

const MAJOR_DEGREES = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'];
const MAJOR_QUALITIES: ChordQuality[] = ['major', 'minor', 'minor', 'major', 'major', 'minor', 'diminished'];

const MINOR_DEGREES = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];
const MINOR_QUALITIES: ChordQuality[] = ['minor', 'diminished', 'major', 'minor', 'minor', 'major', 'major'];

const majorTable: [string, string[]][] = [
  ['C', ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim']],
  ['D', ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#dim']],
  ['E', ['E', 'F#m', 'G#m', 'A', 'B', 'C#m', 'D#dim']],
  ['F', ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'Edim']],
  ['G', ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim']],
  ['A', ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#dim']],
  ['B', ['B', 'C#m', 'D#m', 'E', 'F#', 'G#m', 'A#dim']],
];

const minorTable: [string, string[]][] = [
  ['Am', ['Am', 'Bdim', 'C', 'Dm', 'Em', 'F', 'G']],
  ['Bm', ['Bm', 'C#dim', 'D', 'Em', 'F#m', 'G', 'A']],
  ['Cm', ['Cm', 'Ddim', 'Eb', 'Fm', 'Gm', 'Ab', 'Bb']],
  ['Dm', ['Dm', 'Edim', 'F', 'Gm', 'Am', 'Bb', 'C']],
  ['Em', ['Em', 'F#dim', 'G', 'Am', 'Bm', 'C', 'D']],
  ['Fm', ['Fm', 'Gdim', 'Ab', 'Bbm', 'Cm', 'Db', 'Eb']],
  ['Gm', ['Gm', 'Adim', 'Bb', 'Cm', 'Dm', 'Eb', 'F']],
];

function buildRows(table: [string, string[]][], degrees: string[], qualities: ChordQuality[]): DiatonicRow[] {
  return table.map(([key, chordNames]) => ({
    key,
    chords: chordNames.map((name, i) => ({
      name,
      degree: degrees[i],
      quality: qualities[i],
    })),
  }));
}

export const majorRows: DiatonicRow[] = buildRows(majorTable, MAJOR_DEGREES, MAJOR_QUALITIES);
export const minorRows: DiatonicRow[] = buildRows(minorTable, MINOR_DEGREES, MINOR_QUALITIES);

export interface ProgressionTemplate {
  name: string;
  degrees: string[];
  mode: 'major' | 'minor';
}

export const commonProgressions: ProgressionTemplate[] = [
  { name: 'I-IV-V', degrees: ['I', 'IV', 'V'], mode: 'major' },
  { name: 'I-V-vi-IV', degrees: ['I', 'V', 'vi', 'IV'], mode: 'major' },
  { name: 'I-vi-IV-V', degrees: ['I', 'vi', 'IV', 'V'], mode: 'major' },
  { name: 'ii-V-I', degrees: ['ii', 'V', 'I'], mode: 'major' },
  { name: 'I-IV-vii°-V', degrees: ['I', 'IV', 'vii°', 'V'], mode: 'major' },
  { name: 'i-VII-VI', degrees: ['i', 'VII', 'VI'], mode: 'minor' },
  { name: 'i-iv-v', degrees: ['i', 'iv', 'v'], mode: 'minor' },
  { name: 'i-VII-III-VI', degrees: ['i', 'VII', 'III', 'VI'], mode: 'minor' },
  { name: 'i-VI-III-VII', degrees: ['i', 'VI', 'III', 'VII'], mode: 'minor' },
  { name: 'i-ii°-V-i', degrees: ['i', 'ii°', 'V', 'i'], mode: 'minor' },
];

export function getRowsForMode(mode: 'major' | 'minor'): DiatonicRow[] {
  return mode === 'major' ? majorRows : minorRows;
}

export function getProgressionsForMode(mode: 'major' | 'minor'): ProgressionTemplate[] {
  return commonProgressions.filter((p) => p.mode === mode);
}

export function resolveProgression(template: ProgressionTemplate, keyRow: DiatonicRow): DiatonicChord[] {
  const degrees = template.mode === 'major'
    ? ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']
    : ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'];

  return template.degrees.map((degree) => {
    const idx = degrees.indexOf(degree);
    return keyRow.chords[idx];
  });
}
