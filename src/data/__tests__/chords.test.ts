import { describe, it, expect } from 'vitest';
import { chordDatabase, getChordData } from '@/data/chords';
import { majorRows, minorRows } from '@/data/curriculum';

describe('chordDatabase', () => {
  it('has data for all chords in major table', () => {
    majorRows.forEach((row) => {
      row.chords.forEach((chord) => {
        expect(chordDatabase[chord.name], `Missing chord: ${chord.name}`).toBeDefined();
      });
    });
  });

  it('has data for all chords in minor table', () => {
    minorRows.forEach((row) => {
      row.chords.forEach((chord) => {
        expect(chordDatabase[chord.name], `Missing chord: ${chord.name}`).toBeDefined();
      });
    });
  });

  it('each chord has valid position data', () => {
    Object.entries(chordDatabase).forEach(([name, data]) => {
      expect(data.positions.length, `${name} has no positions`).toBeGreaterThan(0);
      const pos = data.positions[0];
      expect(pos.frets, `${name} frets`).toHaveLength(6);
      expect(pos.fingers, `${name} fingers`).toHaveLength(6);
      expect(pos.baseFret, `${name} baseFret`).toBeGreaterThanOrEqual(1);
    });
  });
});

describe('getChordData', () => {
  it('returns data for known chord', () => {
    const data = getChordData('Am');
    expect(data).toBeDefined();
    expect(data!.name).toBe('Am');
  });

  it('returns undefined for unknown chord', () => {
    expect(getChordData('Xm7b13')).toBeUndefined();
  });
});
