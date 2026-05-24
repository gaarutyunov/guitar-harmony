import { describe, it, expect } from 'vitest';
import { getChordQuality, getQualityColor } from '@/lib/theory';

describe('getChordQuality', () => {
  it('returns major for major chords', () => {
    expect(getChordQuality('C')).toBe('major');
    expect(getChordQuality('D')).toBe('major');
    expect(getChordQuality('F#')).toBe('major');
    expect(getChordQuality('Bb')).toBe('major');
  });

  it('returns minor for minor chords', () => {
    expect(getChordQuality('Am')).toBe('minor');
    expect(getChordQuality('F#m')).toBe('minor');
    expect(getChordQuality('Cm')).toBe('minor');
  });

  it('returns diminished for dim chords', () => {
    expect(getChordQuality('Bdim')).toBe('diminished');
    expect(getChordQuality('C#dim')).toBe('diminished');
    expect(getChordQuality('F#dim')).toBe('diminished');
  });
});

describe('getQualityColor', () => {
  it('returns amber classes for major', () => {
    const result = getQualityColor('major');
    expect(result).toContain('amber');
  });

  it('returns teal classes for minor', () => {
    const result = getQualityColor('minor');
    expect(result).toContain('teal');
  });

  it('returns rose classes for diminished', () => {
    const result = getQualityColor('diminished');
    expect(result).toContain('rose');
  });
});
