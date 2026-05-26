import { describe, it, expect } from 'vitest';
import {
  getChordTones,
  detectBarre,
  calculateDifficultyScore,
  generateVoicingsForChord,
  getBarreLabel,
  getDifficultyDots,
} from '../voicings';
import { ChordPosition } from '@/types';

describe('getChordTones', () => {
  it('returns correct tones for C major', () => {
    const tones = getChordTones('C');
    expect(tones).toEqual({ root: 0, third: 4, fifth: 7 });
  });

  it('returns correct tones for Am', () => {
    const tones = getChordTones('Am');
    expect(tones).toEqual({ root: 9, third: 0, fifth: 4 });
  });

  it('returns correct tones for F major', () => {
    const tones = getChordTones('F');
    expect(tones).toEqual({ root: 5, third: 9, fifth: 0 });
  });

  it('returns correct tones for Bdim', () => {
    const tones = getChordTones('Bdim');
    expect(tones).toEqual({ root: 11, third: 2, fifth: 5 });
  });

  it('returns correct tones for F#m', () => {
    const tones = getChordTones('F#m');
    expect(tones).toEqual({ root: 6, third: 9, fifth: 1 });
  });

  it('returns correct tones for Bb', () => {
    const tones = getChordTones('Bb');
    expect(tones).toEqual({ root: 10, third: 2, fifth: 5 });
  });
});

describe('detectBarre', () => {
  it('detects barre from barres array', () => {
    const pos: ChordPosition = {
      frets: [1, 3, 3, 2, 1, 1],
      fingers: [1, 3, 4, 2, 1, 1],
      barres: [1],
      baseFret: 1,
    };
    const result = detectBarre(pos);
    expect(result.hasBarre).toBe(true);
    expect(result.barreAt).toBe(1);
  });

  it('reports no barre for open chords', () => {
    const pos: ChordPosition = {
      frets: [-1, 0, 2, 2, 1, 0],
      fingers: [0, 0, 2, 3, 1, 0],
      barres: [],
      baseFret: 1,
    };
    const result = detectBarre(pos);
    expect(result.hasBarre).toBe(false);
  });

  it('detects partial barre for high strings only', () => {
    const pos: ChordPosition = {
      frets: [-1, -1, -1, 2, 2, 2],
      fingers: [0, 0, 0, 1, 1, 1],
      barres: [2],
      baseFret: 1,
    };
    const result = detectBarre(pos);
    expect(result.hasBarre).toBe(true);
    expect(result.isPartialBarre).toBe(true);
  });
});

describe('calculateDifficultyScore', () => {
  it('scores open chords lower than barre chords', () => {
    const openC: ChordPosition = {
      frets: [-1, 3, 2, 0, 1, 0],
      fingers: [0, 3, 2, 0, 1, 0],
      barres: [],
      baseFret: 1,
    };
    const barreF: ChordPosition = {
      frets: [1, 3, 3, 2, 1, 1],
      fingers: [1, 3, 4, 2, 1, 1],
      barres: [1],
      baseFret: 1,
    };
    const openScore = calculateDifficultyScore(openC, detectBarre(openC));
    const barreScore = calculateDifficultyScore(barreF, detectBarre(barreF));
    expect(openScore).toBeLessThan(barreScore);
  });

  it('includes barre penalty in score', () => {
    const pos: ChordPosition = {
      frets: [1, 3, 3, 2, 1, 1],
      fingers: [1, 3, 4, 2, 1, 1],
      barres: [1],
      baseFret: 1,
    };
    const barreInfo = detectBarre(pos);
    const score = calculateDifficultyScore(pos, barreInfo);
    expect(score).toBeGreaterThanOrEqual(35);
  });
});

describe('generateVoicingsForChord', () => {
  it('generates voicings for F major', () => {
    const voicings = generateVoicingsForChord('F');
    expect(voicings.length).toBeGreaterThan(1);
    const rootPositions = voicings.filter((v) => v.inversion === 'root');
    expect(rootPositions.length).toBeGreaterThanOrEqual(1);
  });

  it('generates inversions for F major', () => {
    const voicings = generateVoicingsForChord('F');
    const inversions = voicings.filter((v) => v.inversion !== 'root');
    expect(inversions.length).toBeGreaterThan(0);
  });

  it('includes F/A (1st inversion) for F major', () => {
    const voicings = generateVoicingsForChord('F');
    const fOverA = voicings.find((v) => v.symbol === 'F/A');
    expect(fOverA).toBeDefined();
    expect(fOverA!.inversion).toBe('1st');
  });

  it('sorts by difficulty (easiest first)', () => {
    const voicings = generateVoicingsForChord('F');
    for (let i = 1; i < voicings.length; i++) {
      expect(voicings[i].difficultyScore).toBeGreaterThanOrEqual(voicings[i - 1].difficultyScore);
    }
  });

  it('generates voicings for Bm', () => {
    const voicings = generateVoicingsForChord('Bm');
    expect(voicings.length).toBeGreaterThan(1);
    const hasBmOverD = voicings.some((v) => v.symbol === 'Bm/D');
    expect(hasBmOverD).toBe(true);
  });

  it('generates voicings for open chords like C', () => {
    const voicings = generateVoicingsForChord('C');
    expect(voicings.length).toBeGreaterThan(0);
    const root = voicings.find((v) => v.inversion === 'root');
    expect(root).toBeDefined();
  });

  it('candidate count is manageable (<50 per chord)', () => {
    const chords = ['C', 'F', 'G', 'Am', 'Bm', 'Bb', 'F#m'];
    for (const chord of chords) {
      const voicings = generateVoicingsForChord(chord);
      expect(voicings.length).toBeLessThan(50);
    }
  });
});

describe('getBarreLabel', () => {
  it('returns no_barre for voicings without barre', () => {
    const voicings = generateVoicingsForChord('C');
    const root = voicings.find((v) => v.inversion === 'root');
    if (root && !root.hasBarre) {
      expect(getBarreLabel(root)).toBe('no_barre');
    }
  });

  it('returns full_barre for F barre chord', () => {
    const voicings = generateVoicingsForChord('F');
    const root = voicings.find((v) => v.inversion === 'root' && v.hasBarre && !v.isPartialBarre);
    if (root) {
      expect(getBarreLabel(root)).toBe('full_barre');
    }
  });
});

describe('getDifficultyDots', () => {
  it('returns 1 for very easy', () => {
    expect(getDifficultyDots(10)).toBe(1);
  });

  it('returns 5 for very hard', () => {
    expect(getDifficultyDots(80)).toBe(5);
  });

  it('returns values between 1 and 5', () => {
    for (let score = 0; score <= 100; score += 10) {
      const dots = getDifficultyDots(score);
      expect(dots).toBeGreaterThanOrEqual(1);
      expect(dots).toBeLessThanOrEqual(5);
    }
  });
});
