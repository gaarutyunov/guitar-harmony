import { describe, it, expect } from 'vitest';
import { majorRows, minorRows, getRowsForMode, getProgressionsForMode, resolveProgression, commonProgressions } from '@/data/curriculum';

describe('majorRows', () => {
  it('has 7 rows', () => {
    expect(majorRows).toHaveLength(7);
  });

  it('each row has 7 chords', () => {
    majorRows.forEach((row) => {
      expect(row.chords).toHaveLength(7);
    });
  });

  it('C major row has correct chords', () => {
    const cRow = majorRows.find((r) => r.key === 'C');
    expect(cRow).toBeDefined();
    expect(cRow!.chords.map((c) => c.name)).toEqual(['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim']);
  });

  it('assigns correct qualities', () => {
    const cRow = majorRows.find((r) => r.key === 'C')!;
    expect(cRow.chords[0].quality).toBe('major');
    expect(cRow.chords[1].quality).toBe('minor');
    expect(cRow.chords[6].quality).toBe('diminished');
  });
});

describe('minorRows', () => {
  it('has 7 rows', () => {
    expect(minorRows).toHaveLength(7);
  });

  it('Am row has correct chords', () => {
    const amRow = minorRows.find((r) => r.key === 'Am');
    expect(amRow).toBeDefined();
    expect(amRow!.chords.map((c) => c.name)).toEqual(['Am', 'Bdim', 'C', 'Dm', 'Em', 'F', 'G']);
  });
});

describe('getRowsForMode', () => {
  it('returns major rows for major mode', () => {
    expect(getRowsForMode('major')).toBe(majorRows);
  });

  it('returns minor rows for minor mode', () => {
    expect(getRowsForMode('minor')).toBe(minorRows);
  });
});

describe('getProgressionsForMode', () => {
  it('filters by mode', () => {
    const major = getProgressionsForMode('major');
    major.forEach((p) => expect(p.mode).toBe('major'));

    const minor = getProgressionsForMode('minor');
    minor.forEach((p) => expect(p.mode).toBe('minor'));
  });
});

describe('resolveProgression', () => {
  it('resolves I-IV-V in C major', () => {
    const prog = commonProgressions.find((p) => p.name === 'I-IV-V')!;
    const cRow = majorRows.find((r) => r.key === 'C')!;
    const resolved = resolveProgression(prog, cRow);
    expect(resolved.map((c) => c.name)).toEqual(['C', 'F', 'G']);
  });

  it('resolves i-iv-v in Am', () => {
    const prog = commonProgressions.find((p) => p.name === 'i-iv-v')!;
    const amRow = minorRows.find((r) => r.key === 'Am')!;
    const resolved = resolveProgression(prog, amRow);
    expect(resolved.map((c) => c.name)).toEqual(['Am', 'Dm', 'Em']);
  });
});
