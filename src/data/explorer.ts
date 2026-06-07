import { ChordPosition } from '@/types';
import {
  ChordQuality7,
  RootLetter,
  ROOT_PC,
  ToggleQuality,
  buildFormaVoicing,
} from '@/lib/theory/explorer';

// ---------------------------------------------------------------------------
// The worksheet chord set: natural majors/minors + the diatonic sevenths of
// the A-minor scale, each tied to a movable barre shape ("forma") where one
// exists.
// ---------------------------------------------------------------------------

export interface ExplorerChord {
  id: string; // e.g. 'C', 'Cm', 'Cmaj7', 'Bm7b5'
  symbol: string; // display label
  rootLetter: RootLetter;
  rootPc: number;
  quality: ChordQuality7;
  /** static reference voicing (open / non-movable), if the chord has one. */
  open?: ChordPosition;
  /** movable barre shape id + the fret its root sits on naturally. */
  formaId?: string;
  rootFret?: number;
}

function pos(frets: number[], fingers: number[], barres: number[] = []): ChordPosition {
  return { frets, fingers, barres, baseFret: 1 };
}

const CHORDS: Record<string, ExplorerChord> = {
  // ---- Majors ----
  C: {
    id: 'C', symbol: 'C', rootLetter: 'C', rootPc: ROOT_PC.C, quality: 'major',
    open: pos([-1, 3, 2, 0, 1, 0], [0, 3, 2, 0, 1, 0]),
    formaId: 'maj-A', rootFret: 3,
  },
  D: {
    id: 'D', symbol: 'D', rootLetter: 'D', rootPc: ROOT_PC.D, quality: 'major',
    open: pos([-1, -1, 0, 2, 3, 2], [0, 0, 0, 1, 3, 2]),
    formaId: 'maj-A', rootFret: 5,
  },
  E: {
    id: 'E', symbol: 'E', rootLetter: 'E', rootPc: ROOT_PC.E, quality: 'major',
    open: pos([0, 2, 2, 1, 0, 0], [0, 2, 3, 1, 0, 0]),
    formaId: 'maj-E', rootFret: 0,
  },
  F: {
    id: 'F', symbol: 'F', rootLetter: 'F', rootPc: ROOT_PC.F, quality: 'major',
    formaId: 'maj-E', rootFret: 1,
  },
  G: {
    id: 'G', symbol: 'G', rootLetter: 'G', rootPc: ROOT_PC.G, quality: 'major',
    open: pos([3, 2, 0, 0, 0, 3], [2, 1, 0, 0, 0, 3]),
    formaId: 'maj-E', rootFret: 3,
  },
  A: {
    id: 'A', symbol: 'A', rootLetter: 'A', rootPc: ROOT_PC.A, quality: 'major',
    open: pos([-1, 0, 2, 2, 2, 0], [0, 0, 1, 2, 3, 0]),
    formaId: 'maj-A', rootFret: 0,
  },
  B: {
    id: 'B', symbol: 'B', rootLetter: 'B', rootPc: ROOT_PC.B, quality: 'major',
    formaId: 'maj-A', rootFret: 2,
  },

  // ---- Minors ----
  Cm: {
    id: 'Cm', symbol: 'Cm', rootLetter: 'C', rootPc: ROOT_PC.C, quality: 'minor',
    formaId: 'min-A', rootFret: 3,
  },
  Dm: {
    id: 'Dm', symbol: 'Dm', rootLetter: 'D', rootPc: ROOT_PC.D, quality: 'minor',
    open: pos([-1, -1, 0, 2, 3, 1], [0, 0, 0, 2, 3, 1]),
    formaId: 'min-A', rootFret: 5,
  },
  Em: {
    id: 'Em', symbol: 'Em', rootLetter: 'E', rootPc: ROOT_PC.E, quality: 'minor',
    open: pos([0, 2, 2, 0, 0, 0], [0, 2, 3, 0, 0, 0]),
    formaId: 'min-E', rootFret: 0,
  },
  Fm: {
    id: 'Fm', symbol: 'Fm', rootLetter: 'F', rootPc: ROOT_PC.F, quality: 'minor',
    formaId: 'min-E', rootFret: 1,
  },
  Gm: {
    id: 'Gm', symbol: 'Gm', rootLetter: 'G', rootPc: ROOT_PC.G, quality: 'minor',
    formaId: 'min-E', rootFret: 3,
  },
  Am: {
    id: 'Am', symbol: 'Am', rootLetter: 'A', rootPc: ROOT_PC.A, quality: 'minor',
    open: pos([-1, 0, 2, 2, 1, 0], [0, 0, 2, 3, 1, 0]),
    formaId: 'min-A', rootFret: 0,
  },
  Bm: {
    id: 'Bm', symbol: 'Bm', rootLetter: 'B', rootPc: ROOT_PC.B, quality: 'minor',
    formaId: 'min-A', rootFret: 2,
  },

  // ---- Sevenths (diatonic to A minor) ----
  Am7: {
    id: 'Am7', symbol: 'Am7', rootLetter: 'A', rootPc: ROOT_PC.A, quality: 'm7',
    open: pos([-1, 0, 2, 0, 1, 0], [0, 0, 2, 0, 1, 0]),
    formaId: '7-m-A', rootFret: 0,
  },
  Bm7b5: {
    id: 'Bm7b5', symbol: 'Bm7(♭5)', rootLetter: 'B', rootPc: ROOT_PC.B, quality: 'm7b5',
    open: pos([-1, 2, 3, 2, 3, -1], [0, 1, 3, 2, 4, 0]),
  },
  Bdim7: {
    id: 'Bdim7', symbol: 'Bdim7', rootLetter: 'B', rootPc: ROOT_PC.B, quality: 'dim7',
    open: pos([-1, 2, 3, 1, 3, -1], [0, 2, 3, 1, 4, 0]),
  },
  Cmaj7: {
    id: 'Cmaj7', symbol: 'Cmaj7', rootLetter: 'C', rootPc: ROOT_PC.C, quality: 'maj7',
    open: pos([-1, 3, 2, 0, 0, 0], [0, 3, 2, 0, 0, 0]),
    formaId: '7-maj-A', rootFret: 3,
  },
  Dm7: {
    id: 'Dm7', symbol: 'Dm7', rootLetter: 'D', rootPc: ROOT_PC.D, quality: 'm7',
    open: pos([-1, -1, 0, 2, 1, 1], [0, 0, 0, 2, 1, 1], [1]),
    formaId: '7-m-A', rootFret: 5,
  },
  Em7: {
    id: 'Em7', symbol: 'Em7', rootLetter: 'E', rootPc: ROOT_PC.E, quality: 'm7',
    open: pos([0, 2, 0, 0, 0, 0], [0, 2, 0, 0, 0, 0]),
    formaId: '7-m-A', rootFret: 7,
  },
  Fmaj7: {
    id: 'Fmaj7', symbol: 'Fmaj7', rootLetter: 'F', rootPc: ROOT_PC.F, quality: 'maj7',
    open: pos([-1, -1, 3, 2, 1, 0], [0, 0, 3, 2, 1, 0]),
    formaId: '7-maj-A', rootFret: 8,
  },
  G7: {
    id: 'G7', symbol: 'G7', rootLetter: 'G', rootPc: ROOT_PC.G, quality: 'dom7',
    open: pos([3, 2, 0, 0, 0, 1], [3, 2, 0, 0, 0, 1]),
    formaId: '7-dom-A', rootFret: 10,
  },
};

export function getExplorerChord(id: string): ExplorerChord | undefined {
  return CHORDS[id];
}

// ---------------------------------------------------------------------------
// Resolve a (root, quality) selection to a chord. For root B + seventh the
// caller chooses between Bm7(♭5) and Bdim7.
// ---------------------------------------------------------------------------

const SEVENTH_BY_ROOT: Record<RootLetter, string> = {
  A: 'Am7',
  B: 'Bm7b5', // overridden by altB
  C: 'Cmaj7',
  D: 'Dm7',
  E: 'Em7',
  F: 'Fmaj7',
  G: 'G7',
};

export function resolveChordId(
  root: RootLetter,
  quality: ToggleQuality,
  altB = false,
): string {
  if (quality === 'major') return root;
  if (quality === 'minor') return `${root}m`;
  if (root === 'B') return altB ? 'Bdim7' : 'Bm7b5';
  return SEVENTH_BY_ROOT[root];
}

export function resolveChord(
  root: RootLetter,
  quality: ToggleQuality,
  altB = false,
): ExplorerChord {
  return CHORDS[resolveChordId(root, quality, altB)];
}

/** Does root B + seventh have an alternate voicing toggle? */
export function hasSeventhAlt(root: RootLetter, quality: ToggleQuality): boolean {
  return root === 'B' && quality === 'seventh';
}

// ---------------------------------------------------------------------------
// Shape families: members of one forma that slide up and down the neck.
// ---------------------------------------------------------------------------

export interface ShapeFamily {
  formaId: string;
  labelKey: string; // i18n key under explorer.families
  members: { chordId: string; rootFret: number }[];
}

export const SHAPE_FAMILIES: ShapeFamily[] = [
  {
    formaId: 'min-E',
    labelKey: 'min_E',
    members: [
      { chordId: 'Em', rootFret: 0 },
      { chordId: 'Fm', rootFret: 1 },
      { chordId: 'Gm', rootFret: 3 },
    ],
  },
  {
    formaId: 'min-A',
    labelKey: 'min_A',
    members: [
      { chordId: 'Am', rootFret: 0 },
      { chordId: 'Bm', rootFret: 2 },
      { chordId: 'Cm', rootFret: 3 },
    ],
  },
  {
    formaId: 'maj-E',
    labelKey: 'maj_E',
    members: [
      { chordId: 'E', rootFret: 0 },
      { chordId: 'F', rootFret: 1 },
      { chordId: 'G', rootFret: 3 },
    ],
  },
  {
    formaId: 'maj-A',
    labelKey: 'maj_A',
    members: [
      { chordId: 'A', rootFret: 0 },
      { chordId: 'B', rootFret: 2 },
      { chordId: 'C', rootFret: 3 },
    ],
  },
  {
    formaId: '7-maj-A',
    labelKey: 'maj7_A',
    members: [
      { chordId: 'Cmaj7', rootFret: 3 },
      { chordId: 'Fmaj7', rootFret: 8 },
    ],
  },
  {
    formaId: '7-m-A',
    labelKey: 'm7_A',
    members: [
      { chordId: 'Am7', rootFret: 0 },
      { chordId: 'Dm7', rootFret: 5 },
      { chordId: 'Em7', rootFret: 7 },
    ],
  },
];

export function getFamily(formaId?: string): ShapeFamily | undefined {
  if (!formaId) return undefined;
  return SHAPE_FAMILIES.find((f) => f.formaId === formaId);
}

/** A barre voicing for the active chord's forma at a given root fret. */
export function getBarreVoicing(chord: ExplorerChord, rootFret: number): ChordPosition | null {
  if (!chord.formaId) return null;
  return buildFormaVoicing(chord.formaId, rootFret);
}
