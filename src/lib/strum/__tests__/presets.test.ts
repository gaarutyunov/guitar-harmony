import { describe, it, expect } from 'vitest';
import { getPresetsForTimeSignature, getEmptyPattern, cycleStrumCell } from '@/lib/strum/presets';

describe('getPresetsForTimeSignature', () => {
  it('returns 4/4 presets with 8 cells each', () => {
    const presets = getPresetsForTimeSignature('4/4');
    expect(presets.length).toBeGreaterThan(0);
    presets.forEach((p) => {
      expect(p.pattern).toHaveLength(8);
      expect(p.timeSignature).toBe('4/4');
    });
  });

  it('returns 3/4 presets with 6 cells each', () => {
    const presets = getPresetsForTimeSignature('3/4');
    expect(presets.length).toBeGreaterThan(0);
    presets.forEach((p) => {
      expect(p.pattern).toHaveLength(6);
      expect(p.timeSignature).toBe('3/4');
    });
  });
});

describe('getEmptyPattern', () => {
  it('returns 8 empty cells for 4/4', () => {
    const pattern = getEmptyPattern('4/4');
    expect(pattern).toHaveLength(8);
    pattern.forEach((cell) => expect(cell).toBe(''));
  });

  it('returns 6 empty cells for 3/4', () => {
    const pattern = getEmptyPattern('3/4');
    expect(pattern).toHaveLength(6);
    pattern.forEach((cell) => expect(cell).toBe(''));
  });
});

describe('cycleStrumCell', () => {
  it('cycles through all states', () => {
    expect(cycleStrumCell('')).toBe('↓');
    expect(cycleStrumCell('↓')).toBe('↑');
    expect(cycleStrumCell('↑')).toBe('✕');
    expect(cycleStrumCell('✕')).toBe('');
  });
});
