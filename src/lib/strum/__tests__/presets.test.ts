import { describe, it, expect } from 'vitest';
import {
  getPresetsForTimeSignature,
  getEmptyPattern,
  cycleStrumCell,
  cycleBeatType,
  changeBeatType,
  cellCountForType,
  getActiveCellIndex,
  migrateOldPattern,
} from '@/lib/strum/presets';
import type { Beat, StrumCell } from '@/types';

describe('getPresetsForTimeSignature', () => {
  it('returns 4/4 presets with 4 beats each', () => {
    const presets = getPresetsForTimeSignature('4/4');
    expect(presets.length).toBeGreaterThan(0);
    presets.forEach((p) => {
      expect(p.pattern).toHaveLength(4);
      expect(p.timeSignature).toBe('4/4');
    });
  });

  it('returns 3/4 presets with 3 beats each', () => {
    const presets = getPresetsForTimeSignature('3/4');
    expect(presets.length).toBeGreaterThan(0);
    presets.forEach((p) => {
      expect(p.pattern).toHaveLength(3);
      expect(p.timeSignature).toBe('3/4');
    });
  });
});

describe('getEmptyPattern', () => {
  it('returns 4 empty negra beats for 4/4', () => {
    const pattern = getEmptyPattern('4/4');
    expect(pattern).toHaveLength(4);
    pattern.forEach((beat) => {
      expect(beat.type).toBe('negra');
      expect(beat.cells).toEqual(['']);
    });
  });

  it('returns 3 empty negra beats for 3/4', () => {
    const pattern = getEmptyPattern('3/4');
    expect(pattern).toHaveLength(3);
    pattern.forEach((beat) => {
      expect(beat.type).toBe('negra');
      expect(beat.cells).toEqual(['']);
    });
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

describe('cycleBeatType', () => {
  it('cycles negra → corchea → semicorchea → negra', () => {
    expect(cycleBeatType('negra')).toBe('corchea');
    expect(cycleBeatType('corchea')).toBe('semicorchea');
    expect(cycleBeatType('semicorchea')).toBe('negra');
  });
});

describe('cellCountForType', () => {
  it('returns correct counts', () => {
    expect(cellCountForType('negra')).toBe(1);
    expect(cellCountForType('corchea')).toBe(2);
    expect(cellCountForType('semicorchea')).toBe(4);
  });
});

describe('changeBeatType', () => {
  it('preserves first cell when shrinking', () => {
    const beat: Beat = { type: 'semicorchea', cells: ['↓', '↑', '↓', '↑'] };
    const negra = changeBeatType(beat, 'negra');
    expect(negra.cells).toEqual(['↓']);

    const corchea = changeBeatType(beat, 'corchea');
    expect(corchea.cells).toEqual(['↓', '↓']);
  });

  it('spreads cells when expanding', () => {
    const corchea: Beat = { type: 'corchea', cells: ['↓', '↑'] };
    const semi = changeBeatType(corchea, 'semicorchea');
    expect(semi.cells).toEqual(['↓', '', '↑', '']);
  });

  it('returns same beat if type unchanged', () => {
    const beat: Beat = { type: 'negra', cells: ['↓'] };
    expect(changeBeatType(beat, 'negra')).toBe(beat);
  });
});

describe('getActiveCellIndex', () => {
  it('returns 0 for negra on subBeat 0', () => {
    const beat: Beat = { type: 'negra', cells: ['↓'] };
    expect(getActiveCellIndex(beat, 0)).toBe(0);
    expect(getActiveCellIndex(beat, 1)).toBeNull();
    expect(getActiveCellIndex(beat, 2)).toBeNull();
    expect(getActiveCellIndex(beat, 3)).toBeNull();
  });

  it('returns correct indices for corchea', () => {
    const beat: Beat = { type: 'corchea', cells: ['↓', '↑'] };
    expect(getActiveCellIndex(beat, 0)).toBe(0);
    expect(getActiveCellIndex(beat, 1)).toBeNull();
    expect(getActiveCellIndex(beat, 2)).toBe(1);
    expect(getActiveCellIndex(beat, 3)).toBeNull();
  });

  it('returns subBeat index for semicorchea', () => {
    const beat: Beat = { type: 'semicorchea', cells: ['↓', '↑', '↓', '↑'] };
    expect(getActiveCellIndex(beat, 0)).toBe(0);
    expect(getActiveCellIndex(beat, 1)).toBe(1);
    expect(getActiveCellIndex(beat, 2)).toBe(2);
    expect(getActiveCellIndex(beat, 3)).toBe(3);
  });
});

describe('migrateOldPattern', () => {
  it('converts flat StrumCell[] to Beat[] with corchea beats', () => {
    const old: StrumCell[] = ['↓', '', '↓', '↑', '', '↑', '↓', '↑'];
    const beats = migrateOldPattern(old);
    expect(beats).toHaveLength(4);
    expect(beats[0]).toEqual({ type: 'corchea', cells: ['↓', ''] });
    expect(beats[1]).toEqual({ type: 'corchea', cells: ['↓', '↑'] });
    expect(beats[2]).toEqual({ type: 'corchea', cells: ['', '↑'] });
    expect(beats[3]).toEqual({ type: 'corchea', cells: ['↓', '↑'] });
  });

  it('handles 3/4 patterns (6 cells)', () => {
    const old: StrumCell[] = ['↓', '', '↓', '', '↓', ''];
    const beats = migrateOldPattern(old);
    expect(beats).toHaveLength(3);
    beats.forEach((beat) => {
      expect(beat.type).toBe('corchea');
      expect(beat.cells).toHaveLength(2);
    });
  });
});
