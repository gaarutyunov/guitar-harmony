import { describe, it, expect } from 'vitest';
import {
  getPresetsForTimeSignature,
  getEmptyPattern,
  getDefaultBeatTypes,
  cycleStrumCell,
  cycleBeatType,
  cellCountForType,
  cellToOffset,
  getDisplayCells,
  getActiveCellIndex,
  cleanPatternForBeatType,
} from '@/lib/strum/presets';
import type { StrumCell } from '@/types';

describe('getPresetsForTimeSignature', () => {
  it('returns 4/4 presets with 16 cells each', () => {
    const presets = getPresetsForTimeSignature('4/4');
    expect(presets.length).toBeGreaterThan(0);
    presets.forEach((p) => {
      expect(p.pattern).toHaveLength(16);
      expect(p.beatTypes).toHaveLength(4);
      expect(p.timeSignature).toBe('4/4');
    });
  });

  it('returns 3/4 presets with 12 cells each', () => {
    const presets = getPresetsForTimeSignature('3/4');
    expect(presets.length).toBeGreaterThan(0);
    presets.forEach((p) => {
      expect(p.pattern).toHaveLength(12);
      expect(p.beatTypes).toHaveLength(3);
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

describe('getDefaultBeatTypes', () => {
  it('returns 4 negra types for 4/4', () => {
    const bt = getDefaultBeatTypes('4/4');
    expect(bt).toEqual(['negra', 'negra', 'negra', 'negra']);
  });

  it('returns 3 negra types for 3/4', () => {
    const bt = getDefaultBeatTypes('3/4');
    expect(bt).toEqual(['negra', 'negra', 'negra']);
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

describe('cellToOffset', () => {
  it('returns 0 for negra', () => {
    expect(cellToOffset('negra', 0)).toBe(0);
  });

  it('maps corchea display cells to offsets 0 and 2', () => {
    expect(cellToOffset('corchea', 0)).toBe(0);
    expect(cellToOffset('corchea', 1)).toBe(2);
  });

  it('maps semicorchea display cells directly', () => {
    expect(cellToOffset('semicorchea', 0)).toBe(0);
    expect(cellToOffset('semicorchea', 1)).toBe(1);
    expect(cellToOffset('semicorchea', 2)).toBe(2);
    expect(cellToOffset('semicorchea', 3)).toBe(3);
  });
});

describe('getDisplayCells', () => {
  const pattern: StrumCell[] = ['↓', '↑', '↓', '↑', '', '', '', '', '', '', '', '', '', '', '', ''];

  it('returns 1 cell for negra', () => {
    const cells = getDisplayCells(pattern, 0, 'negra');
    expect(cells).toEqual([{ cell: '↓', flatIdx: 0 }]);
  });

  it('returns 2 cells for corchea', () => {
    const cells = getDisplayCells(pattern, 0, 'corchea');
    expect(cells).toEqual([
      { cell: '↓', flatIdx: 0 },
      { cell: '↓', flatIdx: 2 },
    ]);
  });

  it('returns 4 cells for semicorchea', () => {
    const cells = getDisplayCells(pattern, 0, 'semicorchea');
    expect(cells).toEqual([
      { cell: '↓', flatIdx: 0 },
      { cell: '↑', flatIdx: 1 },
      { cell: '↓', flatIdx: 2 },
      { cell: '↑', flatIdx: 3 },
    ]);
  });

  it('reads correct offsets for beat 1', () => {
    const p: StrumCell[] = ['', '', '', '', '✕', '', '↓', '', '', '', '', '', '', '', '', ''];
    const cells = getDisplayCells(p, 1, 'corchea');
    expect(cells).toEqual([
      { cell: '✕', flatIdx: 4 },
      { cell: '↓', flatIdx: 6 },
    ]);
  });
});

describe('getActiveCellIndex', () => {
  it('returns 0 for negra on subBeat 0', () => {
    expect(getActiveCellIndex('negra', 0)).toBe(0);
    expect(getActiveCellIndex('negra', 1)).toBeNull();
    expect(getActiveCellIndex('negra', 2)).toBeNull();
    expect(getActiveCellIndex('negra', 3)).toBeNull();
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

describe('cleanPatternForBeatType', () => {
  it('clears cells 1-3 for negra', () => {
    const pattern: StrumCell[] = ['↓', '↑', '↓', '↑', '', '', '', '', '', '', '', '', '', '', '', ''];
    const cleaned = cleanPatternForBeatType(pattern, 0, 'negra');
    expect(cleaned.slice(0, 4)).toEqual(['↓', '', '', '']);
  });

  it('clears cells 1 and 3 for corchea', () => {
    const pattern: StrumCell[] = ['↓', '↑', '↓', '↑', '', '', '', '', '', '', '', '', '', '', '', ''];
    const cleaned = cleanPatternForBeatType(pattern, 0, 'corchea');
    expect(cleaned.slice(0, 4)).toEqual(['↓', '', '↓', '']);
  });

  it('leaves all cells for semicorchea', () => {
    const pattern: StrumCell[] = ['↓', '↑', '↓', '↑', '', '', '', '', '', '', '', '', '', '', '', ''];
    const cleaned = cleanPatternForBeatType(pattern, 0, 'semicorchea');
    expect(cleaned.slice(0, 4)).toEqual(['↓', '↑', '↓', '↑']);
  });

  it('only affects the target beat', () => {
    const pattern: StrumCell[] = ['↓', '↑', '↓', '↑', '✕', '↓', '↑', '✕', '', '', '', '', '', '', '', ''];
    const cleaned = cleanPatternForBeatType(pattern, 0, 'negra');
    expect(cleaned.slice(4, 8)).toEqual(['✕', '↓', '↑', '✕']);
  });
});
