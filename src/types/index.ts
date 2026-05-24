export type StrumCell = '' | '↓' | '↑' | '✕';

export interface HarmonyChord {
  id: string;
  name: string;
  degree: string;
  key: string;
  mode: 'major' | 'minor';
  strumPattern: StrumCell[];
}

export interface Harmony {
  id: string;
  name: string;
  timeSignature: '4/4' | '3/4';
  chords: HarmonyChord[];
  createdAt: number;
}

export type ChordQuality = 'major' | 'minor' | 'diminished';

export interface DiatonicChord {
  name: string;
  degree: string;
  quality: ChordQuality;
}

export interface ChordPosition {
  frets: number[];
  fingers: number[];
  barres: number[];
  baseFret: number;
}

export interface ChordData {
  name: string;
  positions: ChordPosition[];
}

export type Locale = 'es' | 'en' | 'ru';
export type Mode = 'major' | 'minor';
export type TimeSignature = '4/4' | '3/4';
