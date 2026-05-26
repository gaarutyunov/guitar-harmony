import { ChordPosition, ChordQuality } from '@/types';

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const OPEN_STRINGS_MIDI = [40, 45, 50, 55, 59, 64]; // E2 A2 D3 G3 B3 E4

export function getChordNoteNames(position: ChordPosition): (string | null)[] {
  return position.frets.map((fret, i) => {
    if (fret < 0) return null;
    const actualFret = fret === 0 ? 0 : position.baseFret - 1 + fret;
    return NOTE_NAMES[(OPEN_STRINGS_MIDI[i] + actualFret) % 12];
  });
}

export function getChordQuality(chordName: string): ChordQuality {
  if (chordName.includes('dim')) return 'diminished';
  if (chordName.endsWith('m') && !chordName.endsWith('dim')) return 'minor';
  return 'major';
}

export function getQualityColor(quality: ChordQuality): string {
  switch (quality) {
    case 'major':
      return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    case 'minor':
      return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
    case 'diminished':
      return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
  }
}

export function getQualityDotColor(quality: ChordQuality): string {
  switch (quality) {
    case 'major':
      return '#f59e0b';
    case 'minor':
      return '#14b8a6';
    case 'diminished':
      return '#f43f5e';
  }
}
