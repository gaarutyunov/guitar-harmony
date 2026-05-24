import { ChordData } from '@/types';

export const chordDatabase: Record<string, ChordData> = {
  'C': {
    name: 'C',
    positions: [{
      frets: [-1, 3, 2, 0, 1, 0],
      fingers: [0, 3, 2, 0, 1, 0],
      barres: [],
      baseFret: 1,
    }],
  },
  'D': {
    name: 'D',
    positions: [{
      frets: [-1, -1, 0, 2, 3, 2],
      fingers: [0, 0, 0, 1, 3, 2],
      barres: [],
      baseFret: 1,
    }],
  },
  'E': {
    name: 'E',
    positions: [{
      frets: [0, 2, 2, 1, 0, 0],
      fingers: [0, 2, 3, 1, 0, 0],
      barres: [],
      baseFret: 1,
    }],
  },
  'F': {
    name: 'F',
    positions: [{
      frets: [1, 1, 2, 3, 3, 1],
      fingers: [1, 1, 2, 3, 4, 1],
      barres: [1],
      baseFret: 1,
    }],
  },
  'G': {
    name: 'G',
    positions: [{
      frets: [3, 2, 0, 0, 0, 3],
      fingers: [2, 1, 0, 0, 0, 3],
      barres: [],
      baseFret: 1,
    }],
  },
  'A': {
    name: 'A',
    positions: [{
      frets: [-1, 0, 2, 2, 2, 0],
      fingers: [0, 0, 1, 2, 3, 0],
      barres: [],
      baseFret: 1,
    }],
  },
  'B': {
    name: 'B',
    positions: [{
      frets: [-1, 2, 4, 4, 4, 2],
      fingers: [0, 1, 2, 3, 4, 1],
      barres: [2],
      baseFret: 1,
    }],
  },
  'Am': {
    name: 'Am',
    positions: [{
      frets: [-1, 0, 2, 2, 1, 0],
      fingers: [0, 0, 2, 3, 1, 0],
      barres: [],
      baseFret: 1,
    }],
  },
  'Bm': {
    name: 'Bm',
    positions: [{
      frets: [-1, 2, 4, 4, 3, 2],
      fingers: [0, 1, 3, 4, 2, 1],
      barres: [2],
      baseFret: 1,
    }],
  },
  'Cm': {
    name: 'Cm',
    positions: [{
      frets: [-1, 3, 5, 5, 4, 3],
      fingers: [0, 1, 3, 4, 2, 1],
      barres: [3],
      baseFret: 1,
    }],
  },
  'Dm': {
    name: 'Dm',
    positions: [{
      frets: [-1, -1, 0, 2, 3, 1],
      fingers: [0, 0, 0, 2, 3, 1],
      barres: [],
      baseFret: 1,
    }],
  },
  'Em': {
    name: 'Em',
    positions: [{
      frets: [0, 2, 2, 0, 0, 0],
      fingers: [0, 2, 3, 0, 0, 0],
      barres: [],
      baseFret: 1,
    }],
  },
  'Fm': {
    name: 'Fm',
    positions: [{
      frets: [1, 1, 3, 3, 1, 1],
      fingers: [1, 1, 3, 4, 1, 1],
      barres: [1],
      baseFret: 1,
    }],
  },
  'Gm': {
    name: 'Gm',
    positions: [{
      frets: [3, 3, 5, 5, 3, 3],
      fingers: [1, 1, 3, 4, 1, 1],
      barres: [3],
      baseFret: 1,
    }],
  },
  'F#m': {
    name: 'F#m',
    positions: [{
      frets: [2, 2, 4, 4, 2, 2],
      fingers: [1, 1, 3, 4, 1, 1],
      barres: [2],
      baseFret: 1,
    }],
  },
  'C#m': {
    name: 'C#m',
    positions: [{
      frets: [-1, 4, 6, 6, 5, 4],
      fingers: [0, 1, 3, 4, 2, 1],
      barres: [4],
      baseFret: 1,
    }],
  },
  'G#m': {
    name: 'G#m',
    positions: [{
      frets: [4, 4, 6, 6, 4, 4],
      fingers: [1, 1, 3, 4, 1, 1],
      barres: [4],
      baseFret: 1,
    }],
  },
  'D#m': {
    name: 'D#m',
    positions: [{
      frets: [-1, 6, 8, 8, 7, 6],
      fingers: [0, 1, 3, 4, 2, 1],
      barres: [6],
      baseFret: 1,
    }],
  },
  'Bb': {
    name: 'Bb',
    positions: [{
      frets: [-1, 1, 3, 3, 3, 1],
      fingers: [0, 1, 2, 3, 4, 1],
      barres: [1],
      baseFret: 1,
    }],
  },
  'Eb': {
    name: 'Eb',
    positions: [{
      frets: [-1, -1, 1, 3, 4, 3],
      fingers: [0, 0, 1, 2, 4, 3],
      barres: [],
      baseFret: 1,
    }],
  },
  'Ab': {
    name: 'Ab',
    positions: [{
      frets: [4, 4, 6, 5, 4, 4],
      fingers: [1, 1, 3, 2, 1, 1],
      barres: [4],
      baseFret: 1,
    }],
  },
  'Db': {
    name: 'Db',
    positions: [{
      frets: [-1, 4, 6, 6, 6, 4],
      fingers: [0, 1, 2, 3, 4, 1],
      barres: [4],
      baseFret: 1,
    }],
  },
  'F#': {
    name: 'F#',
    positions: [{
      frets: [2, 2, 3, 4, 4, 2],
      fingers: [1, 1, 2, 3, 4, 1],
      barres: [2],
      baseFret: 1,
    }],
  },
  'Bbm': {
    name: 'Bbm',
    positions: [{
      frets: [-1, 1, 3, 3, 2, 1],
      fingers: [0, 1, 3, 4, 2, 1],
      barres: [1],
      baseFret: 1,
    }],
  },
  'Bdim': {
    name: 'Bdim',
    positions: [{
      frets: [-1, 2, 3, 4, 3, -1],
      fingers: [0, 1, 2, 4, 3, 0],
      barres: [],
      baseFret: 1,
    }],
  },
  'C#dim': {
    name: 'C#dim',
    positions: [{
      frets: [-1, 4, 5, 6, 5, -1],
      fingers: [0, 1, 2, 4, 3, 0],
      barres: [],
      baseFret: 1,
    }],
  },
  'Ddim': {
    name: 'Ddim',
    positions: [{
      frets: [-1, -1, 0, 1, 3, 1],
      fingers: [0, 0, 0, 1, 3, 2],
      barres: [],
      baseFret: 1,
    }],
  },
  'Edim': {
    name: 'Edim',
    positions: [{
      frets: [0, 1, 2, 0, -1, -1],
      fingers: [0, 1, 2, 0, 0, 0],
      barres: [],
      baseFret: 1,
    }],
  },
  'F#dim': {
    name: 'F#dim',
    positions: [{
      frets: [-1, -1, 4, 5, 4, 2],
      fingers: [0, 0, 2, 3, 2, 1],
      barres: [],
      baseFret: 1,
    }],
  },
  'Gdim': {
    name: 'Gdim',
    positions: [{
      frets: [-1, -1, 5, 6, 5, 3],
      fingers: [0, 0, 2, 3, 2, 1],
      barres: [],
      baseFret: 1,
    }],
  },
  'Adim': {
    name: 'Adim',
    positions: [{
      frets: [-1, 0, 1, 2, 1, -1],
      fingers: [0, 0, 1, 3, 2, 0],
      barres: [],
      baseFret: 1,
    }],
  },
  'G#dim': {
    name: 'G#dim',
    positions: [{
      frets: [-1, -1, 6, 7, 6, 4],
      fingers: [0, 0, 2, 3, 2, 1],
      barres: [],
      baseFret: 1,
    }],
  },
  'A#dim': {
    name: 'A#dim',
    positions: [{
      frets: [-1, 1, 2, 3, 2, -1],
      fingers: [0, 1, 2, 4, 3, 0],
      barres: [],
      baseFret: 1,
    }],
  },
  'D#dim': {
    name: 'D#dim',
    positions: [{
      frets: [-1, -1, 1, 2, 1, -1],
      fingers: [0, 0, 1, 3, 2, 0],
      barres: [],
      baseFret: 1,
    }],
  },
};

export function getChordData(name: string): ChordData | undefined {
  return chordDatabase[name];
}
