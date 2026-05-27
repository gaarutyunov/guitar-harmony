import { describe, it, expect } from 'vitest';
import {
  getPresetsForTimeSignature,
  getEmptyPattern,
  cycleStrumCell,
  deriveBeatType,
  getBeatSymbols,
  cycleBeat,
  getActiveCellIndex,
} from '@/lib/strum/presets';
import type { StrumCell } from '@/types';

describe('getPresetsForTimeSignature', () => {
  it('returns 4/4 presets with 16 cells each', () => {
    const presets = getPresetsForTimeSignature('4/4');
    expect(presets.length).toBeGreaterThan(0);
    presets.forEach((p) => {
      expect(p.pattern).toHaveLength(16);
      expect(p.timeSignature).toBe('4/4');
    });
  });

  it('returns 3/4 presets with 12 cells each', () => {
    const presets = getPresetsForTimeSignature('3/4');
    expect(presets.length).toBeGreaterThan(0);
    presets.forEach((p) => {
      expect(p.pattern).toHaveLength(12);
      expect(p.timeSignature).toBe('3/4');
    });
  });
});

describe('getEmptyPattern', () => {
  it('returns 16 empty cells for 4/4', () => {
    const pattern = getEmptyPattern('4/4');
    expect(pattern).toHaveLength(16);
    pattern.forEach((cell) => expect(cell).toBe(''));
  });

  it('returns 12 empty cells for 3/4', () => {
    const pattern = getEmptyPattern('3/4');
    expect(pattern).toHaveLength(12);
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

describe('deriveBeatType', () => {
  it('returns negra when only first cell has content', () => {
    const p: StrumCell[] = ['↓', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    expect(deriveBeatType(p, 0)).toBe('negra');
  });

  it('returns corchea when position 2 has content', () => {
    const p: StrumCell[] = ['↓', '', '↑', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    expect(deriveBeatType(p, 0)).toBe('corchea');
  });

  it('returns semicorchea when odd positions have content', () => {
    const p: StrumCell[] = ['↓', '↑', '↓', '↑', '', '', '', '', '', '', '', '', '', '', '', ''];
    expect(deriveBeatType(p, 0)).toBe('semicorchea');
  });

  it('reads correct beat index', () => {
    const p: StrumCell[] = ['', '', '', '', '↓', '↑', '↓', '↑', '', '', '', '', '', '', '', ''];
    expect(deriveBeatType(p, 0)).toBe('negra');
    expect(deriveBeatType(p, 1)).toBe('semicorchea');
  });
});

describe('getBeatSymbols', () => {
  it('returns 1 symbol for negra', () => {
    const p: StrumCell[] = ['↓', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    expect(getBeatSymbols(p, 0)).toEqual(['↓']);
  });

  it('returns 2 symbols for corchea', () => {
    const p: StrumCell[] = ['↓', '', '↑', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    expect(getBeatSymbols(p, 0)).toEqual(['↓', '↑']);
  });

  it('returns 4 symbols for semicorchea', () => {
    const p: StrumCell[] = ['↓', '↑', '↓', '↑', '', '', '', '', '', '', '', '', '', '', '', ''];
    expect(getBeatSymbols(p, 0)).toEqual(['↓', '↑', '↓', '↑']);
  });
});

describe('cycleBeat', () => {
  const empty16: StrumCell[] = new Array(16).fill('');

  it('cycles empty to ↓', () => {
    const result = cycleBeat(empty16, 0);
    expect(result.slice(0, 4)).toEqual(['↓', '', '', '']);
  });

  it('cycles ↓ to ↑', () => {
    const p = [...empty16] as StrumCell[];
    p[0] = '↓';
    const result = cycleBeat(p, 0);
    expect(result.slice(0, 4)).toEqual(['↑', '', '', '']);
  });

  it('cycles ↑ to ✕', () => {
    const p = [...empty16] as StrumCell[];
    p[0] = '↑';
    const result = cycleBeat(p, 0);
    expect(result.slice(0, 4)).toEqual(['✕', '', '', '']);
  });

  it('cycles ✕ to ↓↑ (corchea)', () => {
    const p = [...empty16] as StrumCell[];
    p[0] = '✕';
    const result = cycleBeat(p, 0);
    expect(result.slice(0, 4)).toEqual(['↓', '', '↑', '']);
  });

  it('cycles ↓↑ to ↓↑↓↑ (semicorchea)', () => {
    const p = [...empty16] as StrumCell[];
    p[0] = '↓'; p[2] = '↑';
    const result = cycleBeat(p, 0);
    expect(result.slice(0, 4)).toEqual(['↓', '↑', '↓', '↑']);
  });

  it('cycles ↓↑↓↑ to empty', () => {
    const p = [...empty16] as StrumCell[];
    p[0] = '↓'; p[1] = '↑'; p[2] = '↓'; p[3] = '↑';
    const result = cycleBeat(p, 0);
    expect(result.slice(0, 4)).toEqual(['', '', '', '']);
  });

  it('does not affect other beats', () => {
    const p = [...empty16] as StrumCell[];
    p[4] = '✕';
    const result = cycleBeat(p, 0);
    expect(result[4]).toBe('✕');
  });
});

describe('getActiveCellIndex', () => {
  it('returns 0 for negra on subBeat 0', () => {
    expect(getActiveCellIndex('negra', 0)).toBe(0);
    expect(getActiveCellIndex('negra', 1)).toBeNull();
  });

  it('returns correct indices for corchea', () => {
    expect(getActiveCellIndex('corchea', 0)).toBe(0);
    expect(getActiveCellIndex('corchea', 1)).toBeNull();
    expect(getActiveCellIndex('corchea', 2)).toBe(1);
    expect(getActiveCellIndex('corchea', 3)).toBeNull();
  });

  it('returns subBeat index for semicorchea', () => {
    expect(getActiveCellIndex('semicorchea', 0)).toBe(0);
    expect(getActiveCellIndex('semicorchea', 1)).toBe(1);
    expect(getActiveCellIndex('semicorchea', 2)).toBe(2);
    expect(getActiveCellIndex('semicorchea', 3)).toBe(3);
  });
});
