import { describe, it, expect } from 'vitest';
import {
  SHAPE_FAMILIES,
  getBarreVoicing,
  getExplorerChord,
  resolveChord,
  resolveChordId,
} from '@/data/explorer';
import { buildFormaVoicing } from '@/lib/theory/explorer';

describe('resolveChordId', () => {
  it('maps triads', () => {
    expect(resolveChordId('E', 'major')).toBe('E');
    expect(resolveChordId('C', 'minor')).toBe('Cm');
  });

  it('maps diatonic sevenths of A minor', () => {
    expect(resolveChordId('A', 'seventh')).toBe('Am7');
    expect(resolveChordId('C', 'seventh')).toBe('Cmaj7');
    expect(resolveChordId('G', 'seventh')).toBe('G7');
  });

  it('chooses between Bm7(b5) and Bdim7 for the ii of Am', () => {
    expect(resolveChordId('B', 'seventh', false)).toBe('Bm7b5');
    expect(resolveChordId('B', 'seventh', true)).toBe('Bdim7');
  });
});

describe('chord data integrity', () => {
  it('every chord has a valid open or forma voicing', () => {
    const ids = SHAPE_FAMILIES.flatMap((f) => f.members.map((m) => m.chordId));
    Array.from(new Set(ids)).forEach((id) => {
      const chord = getExplorerChord(id);
      expect(chord, `missing ${id}`).toBeDefined();
      const hasVoicing = chord!.open || chord!.formaId;
      expect(hasVoicing, `${id} has no voicing`).toBeTruthy();
    });
  });

  it('open voicings have 6 strings', () => {
    resolveChordsAll().forEach((chord) => {
      if (chord.open) {
        expect(chord.open.frets).toHaveLength(6);
        expect(chord.open.fingers).toHaveLength(6);
      }
    });
  });
});

describe('shape families slide correctly', () => {
  it('each member resolves to the forma placed at its root fret', () => {
    SHAPE_FAMILIES.forEach((family) => {
      family.members.forEach((member) => {
        const chord = getExplorerChord(member.chordId)!;
        const built = getBarreVoicing(chord, member.rootFret);
        const expected = buildFormaVoicing(family.formaId, member.rootFret);
        expect(built?.frets, `${member.chordId}`).toEqual(expected.frets);
      });
    });
  });

  it('Cmaj7 and Fmaj7 share the maj7 A-shape one slide apart', () => {
    const c = resolveChord('C', 'seventh');
    const f = resolveChord('F', 'seventh');
    expect(c.formaId).toBe('7-maj-A');
    expect(f.formaId).toBe('7-maj-A');
  });
});

function resolveChordsAll() {
  const roots = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
  const qualities = ['major', 'minor', 'seventh'] as const;
  return roots.flatMap((r) => qualities.map((q) => resolveChord(r, q)));
}
