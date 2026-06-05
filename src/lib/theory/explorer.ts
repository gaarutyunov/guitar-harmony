import { ChordPosition } from '@/types';

// ---------------------------------------------------------------------------
// Chord Explorer theory
//
// Models the worksheet "Progresión de acordes de la escala Am": natural
// majors/minors C–B, the diatonic sevenths of A minor, plus the movable
// barre shapes that let a single fingering slide up and down the neck.
// ---------------------------------------------------------------------------

export const OPEN_STRINGS_MIDI = [40, 45, 50, 55, 59, 64]; // E2 A2 D3 G3 B3 E4

/** The seven natural roots, in the worksheet's order. */
export type RootLetter = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
export const ROOT_LETTERS: RootLetter[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

/** Quality the user toggles between. */
export type ToggleQuality = 'major' | 'minor' | 'seventh';

/** Concrete chord quality (drives interval colouring + the séptima rule). */
export type ChordQuality7 =
  | 'major'
  | 'minor'
  | 'maj7'
  | 'm7'
  | 'dom7'
  | 'm7b5'
  | 'dim7';

/** Interval (degree) label shown under each string, like the worksheet. */
export type IntervalLabel = '1' | 'b3' | '3' | '5' | 'b5' | 'b7' | '7' | 'bb7';

export const ROOT_PC: Record<RootLetter, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

/** semitone-from-root -> degree label, per quality. */
const QUALITY_INTERVALS: Record<ChordQuality7, Record<number, IntervalLabel>> = {
  major: { 0: '1', 4: '3', 7: '5' },
  minor: { 0: '1', 3: 'b3', 7: '5' },
  maj7: { 0: '1', 4: '3', 7: '5', 11: '7' },
  m7: { 0: '1', 3: 'b3', 7: '5', 10: 'b7' },
  dom7: { 0: '1', 4: '3', 7: '5', 10: 'b7' },
  m7b5: { 0: '1', 3: 'b3', 6: 'b5', 10: 'b7' },
  dim7: { 0: '1', 3: 'b3', 6: 'b5', 9: 'bb7' },
};

/** Is the chord a triad (3 notes) or a seventh (4 notes)? */
export function isSeventh(quality: ChordQuality7): boolean {
  return quality !== 'major' && quality !== 'minor';
}

/** Pitch class sounding on each string, or null if muted. */
export function getStringPCs(position: ChordPosition): (number | null)[] {
  return position.frets.map((fret, i) => {
    if (fret < 0) return null;
    const actualFret = fret === 0 ? 0 : position.baseFret - 1 + fret;
    return (OPEN_STRINGS_MIDI[i] + actualFret) % 12;
  });
}

/** Degree label sounding on each string, or null if muted / not a chord tone. */
export function getIntervalLabels(
  position: ChordPosition,
  rootPc: number,
  quality: ChordQuality7,
): (IntervalLabel | null)[] {
  const map = QUALITY_INTERVALS[quality];
  return getStringPCs(position).map((pc) => {
    if (pc === null) return null;
    const semitones = (pc - rootPc + 12) % 12;
    return map[semitones] ?? null;
  });
}

// ---------------------------------------------------------------------------
// Movable barre shapes ("formas")
//
// Each shape is written at its lowest position (root fret 0). To place the
// shape so its root sits on fret f, every fretted note shifts up by f.
// ---------------------------------------------------------------------------

export type ShapeRootString = 6 | 5;

export interface ShapeForma {
  id: string;
  /** which string carries the root (6th = low E, 5th = A). */
  rootString: ShapeRootString;
  /** fret pattern at root-fret 0 (-1 = muted, 0 = open / barre). */
  frets: number[];
  /** finger pattern when played open (root fret 0). */
  openFingers: number[];
  /** finger pattern when barred (root fret > 0). */
  barreFingers: number[];
}

export const FORMAS: Record<string, ShapeForma> = {
  'maj-E': {
    id: 'maj-E',
    rootString: 6,
    frets: [0, 2, 2, 1, 0, 0],
    openFingers: [0, 2, 3, 1, 0, 0],
    barreFingers: [1, 3, 4, 2, 1, 1],
  },
  'maj-A': {
    id: 'maj-A',
    rootString: 5,
    frets: [-1, 0, 2, 2, 2, 0],
    openFingers: [0, 0, 1, 2, 3, 0],
    barreFingers: [0, 1, 2, 3, 4, 1],
  },
  'min-E': {
    id: 'min-E',
    rootString: 6,
    frets: [0, 2, 2, 0, 0, 0],
    openFingers: [0, 2, 3, 0, 0, 0],
    barreFingers: [1, 3, 4, 1, 1, 1],
  },
  'min-A': {
    id: 'min-A',
    rootString: 5,
    frets: [-1, 0, 2, 2, 1, 0],
    openFingers: [0, 0, 2, 3, 1, 0],
    barreFingers: [0, 1, 3, 4, 2, 1],
  },
  // maj7 A-shape (Amaj7): lets Cmaj7 -> Fmaj7 slide
  '7-maj-A': {
    id: '7-maj-A',
    rootString: 5,
    frets: [-1, 0, 2, 1, 2, 0],
    openFingers: [0, 0, 3, 1, 2, 0],
    barreFingers: [0, 1, 3, 2, 4, 1],
  },
  // m7 A-shape (Am7): lets Am7 -> Dm7 -> Em7 slide
  '7-m-A': {
    id: '7-m-A',
    rootString: 5,
    frets: [-1, 0, 2, 0, 1, 0],
    openFingers: [0, 0, 2, 0, 1, 0],
    barreFingers: [0, 1, 3, 1, 2, 1],
  },
  // dominant-7 A-shape (A7): G7 movable form
  '7-dom-A': {
    id: '7-dom-A',
    rootString: 5,
    frets: [-1, 0, 2, 0, 2, 0],
    openFingers: [0, 0, 2, 0, 3, 0],
    barreFingers: [0, 1, 3, 1, 4, 1],
  },
};

const NOTE_NAMES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const QUALITY_SUFFIX: Record<ChordQuality7, string> = {
  major: '',
  minor: 'm',
  maj7: 'maj7',
  m7: 'm7',
  dom7: '7',
  m7b5: 'm7♭5',
  dim7: 'dim7',
};

/** Note name of a forma's root when its root sits on `rootFret`. */
export function formaRootNote(formaId: string, rootFret: number): string {
  const forma = FORMAS[formaId];
  const openMidi = forma.rootString === 6 ? OPEN_STRINGS_MIDI[0] : OPEN_STRINGS_MIDI[1];
  return NOTE_NAMES_SHARP[(openMidi + rootFret) % 12];
}

/** Pitch class of a forma's root at `rootFret`. */
export function formaRootPc(formaId: string, rootFret: number): number {
  const forma = FORMAS[formaId];
  const openMidi = forma.rootString === 6 ? OPEN_STRINGS_MIDI[0] : OPEN_STRINGS_MIDI[1];
  return (openMidi + rootFret) % 12;
}

/** Display symbol of a forma transposed to `rootFret`, keeping its quality. */
export function transposedSymbol(
  formaId: string,
  rootFret: number,
  quality: ChordQuality7,
): string {
  return formaRootNote(formaId, rootFret) + QUALITY_SUFFIX[quality];
}

/** Build a barre voicing for a forma with its root on fret `rootFret`. */
export function buildFormaVoicing(formaId: string, rootFret: number): ChordPosition {
  const forma = FORMAS[formaId];
  const frets = forma.frets.map((p) => (p < 0 ? -1 : p + rootFret));
  const fingers = rootFret === 0 ? forma.openFingers : forma.barreFingers;
  // A barre exists once the shape leaves the nut and >= 2 strings share the
  // lowest fret.
  const lowestCount = frets.filter((f) => f === rootFret).length;
  const barres = rootFret > 0 && lowestCount >= 2 ? [rootFret] : [];
  return { frets, fingers, barres, baseFret: 1 };
}

// ---------------------------------------------------------------------------
// The séptima rule: where the 7th lands relative to the octave.
// ---------------------------------------------------------------------------

export interface SeventhRule {
  /** the degree being explained. */
  degree: '7' | 'b7' | 'bb7';
  /** distance below the octave, in semitones (1 = ½, 2 = whole tone). */
  semitonesBelowOctave: 1 | 2 | 3;
  /** i18n key describing the rule. */
  rule: 'maj7' | 'flat7' | 'dim7';
}

export function getSeventhRule(quality: ChordQuality7): SeventhRule | null {
  switch (quality) {
    case 'maj7':
      return { degree: '7', semitonesBelowOctave: 1, rule: 'maj7' };
    case 'm7':
    case 'dom7':
    case 'm7b5':
      return { degree: 'b7', semitonesBelowOctave: 2, rule: 'flat7' };
    case 'dim7':
      return { degree: 'bb7', semitonesBelowOctave: 3, rule: 'dim7' };
    default:
      return null;
  }
}

/** Ordered degrees of the chord, for the interval ruler. */
export function getChordDegrees(quality: ChordQuality7): IntervalLabel[] {
  const map = QUALITY_INTERVALS[quality];
  return Object.keys(map)
    .map(Number)
    .sort((a, b) => a - b)
    .map((semi) => map[semi]);
}
