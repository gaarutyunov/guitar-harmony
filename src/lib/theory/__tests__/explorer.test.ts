import { describe, it, expect } from 'vitest';
import {
  buildFormaVoicing,
  formaRootPc,
  getChordDegrees,
  getIntervalLabels,
  getSeventhRule,
  isSeventh,
  transposedSymbol,
} from '@/lib/theory/explorer';
import { ChordPosition } from '@/types';

function pos(frets: number[]): ChordPosition {
  return { frets, fingers: [0, 0, 0, 0, 0, 0], barres: [], baseFret: 1 };
}

describe('buildFormaVoicing', () => {
  it('places the E-shape minor forma to make Fm at fret 1', () => {
    expect(buildFormaVoicing('min-E', 1).frets).toEqual([1, 3, 3, 1, 1, 1]);
  });

  it('places the E-shape minor forma to make Gm at fret 3', () => {
    expect(buildFormaVoicing('min-E', 3).frets).toEqual([3, 5, 5, 3, 3, 3]);
  });

  it('places the A-shape minor forma to make Bm at fret 2', () => {
    expect(buildFormaVoicing('min-A', 2).frets).toEqual([-1, 2, 4, 4, 3, 2]);
  });

  it('slides the maj7 A-shape from Cmaj7 (fret 3) to Fmaj7 (fret 8)', () => {
    expect(buildFormaVoicing('7-maj-A', 3).frets).toEqual([-1, 3, 5, 4, 5, 3]);
    expect(buildFormaVoicing('7-maj-A', 8).frets).toEqual([-1, 8, 10, 9, 10, 8]);
  });

  it('adds a barre once the shape leaves the nut', () => {
    expect(buildFormaVoicing('min-E', 0).barres).toEqual([]);
    expect(buildFormaVoicing('min-E', 1).barres).toEqual([1]);
  });
});

describe('getIntervalLabels', () => {
  it('labels the degrees of an open Am7', () => {
    const labels = getIntervalLabels(pos([-1, 0, 2, 0, 1, 0]), 9, 'm7');
    expect(labels).toEqual([null, '1', '5', 'b7', 'b3', '5']);
  });

  it('labels a major triad with 1/3/5', () => {
    // open E major: E B E G# B E
    const labels = getIntervalLabels(pos([0, 2, 2, 1, 0, 0]), 4, 'major');
    expect(labels).toEqual(['1', '5', '1', '3', '5', '1']);
  });
});

describe('getSeventhRule', () => {
  it('maj7 lowers a semitone from the octave', () => {
    expect(getSeventhRule('maj7')?.semitonesBelowOctave).toBe(1);
  });

  it('m7 and dom7 lower a whole tone', () => {
    expect(getSeventhRule('m7')?.semitonesBelowOctave).toBe(2);
    expect(getSeventhRule('dom7')?.semitonesBelowOctave).toBe(2);
  });

  it('dim7 lowers a tone and a half', () => {
    expect(getSeventhRule('dim7')?.semitonesBelowOctave).toBe(3);
  });

  it('triads have no seventh rule', () => {
    expect(getSeventhRule('major')).toBeNull();
    expect(getSeventhRule('minor')).toBeNull();
  });
});

describe('getChordDegrees', () => {
  it('returns ordered degrees per quality', () => {
    expect(getChordDegrees('maj7')).toEqual(['1', '3', '5', '7']);
    expect(getChordDegrees('m7')).toEqual(['1', 'b3', '5', 'b7']);
    expect(getChordDegrees('dim7')).toEqual(['1', 'b3', 'b5', 'bb7']);
    expect(getChordDegrees('major')).toEqual(['1', '3', '5']);
  });
});

describe('transposition helpers', () => {
  it('names a forma at a given fret', () => {
    expect(transposedSymbol('min-E', 3, 'minor')).toBe('Gm');
    expect(transposedSymbol('7-maj-A', 8, 'maj7')).toBe('Fmaj7');
    expect(transposedSymbol('maj-A', 3, 'major')).toBe('C');
  });

  it('computes the forma root pitch class', () => {
    expect(formaRootPc('min-A', 2)).toBe(11); // B
    expect(formaRootPc('min-E', 0)).toBe(4); // E
  });
});

describe('isSeventh', () => {
  it('distinguishes triads from sevenths', () => {
    expect(isSeventh('major')).toBe(false);
    expect(isSeventh('minor')).toBe(false);
    expect(isSeventh('maj7')).toBe(true);
    expect(isSeventh('m7b5')).toBe(true);
  });
});
