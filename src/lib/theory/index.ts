import { ChordQuality } from '@/types';

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
