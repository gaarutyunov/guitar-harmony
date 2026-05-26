import { ChordPosition, GuitarVoicing, Inversion, StringIndex } from '@/types';
import { chordDatabase } from '@/data/chords';
import { getChordQuality } from './index';

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const OPEN_STRINGS_MIDI = [40, 45, 50, 55, 59, 64]; // E2 A2 D3 G3 B3 E4
const MAX_FRET = 12;
const MAX_FRET_SPAN = 4;

function noteNameToPC(name: string): number {
  const normalized = name.replace('b', '').replace('#', '');
  let idx = NOTE_NAMES.indexOf(normalized);
  if (idx === -1) return -1;
  if (name.includes('#')) idx = (idx + 1) % 12;
  if (name.includes('b')) idx = (idx + 11) % 12;
  return idx;
}

function midiToNoteName(midi: number): string {
  return NOTE_NAMES[midi % 12];
}

function midiToScientific(midi: number): string {
  const octave = Math.floor(midi / 12) - 1;
  return `${NOTE_NAMES[midi % 12]}${octave}`;
}

function parseChordRoot(chordName: string): string {
  if (chordName.length >= 2 && (chordName[1] === '#' || chordName[1] === 'b')) {
    return chordName.slice(0, 2);
  }
  return chordName[0];
}

export function getChordTones(chordName: string): { root: number; third: number; fifth: number } {
  const quality = getChordQuality(chordName);
  const root = noteNameToPC(parseChordRoot(chordName));
  let third: number;
  let fifth: number;

  switch (quality) {
    case 'major':
      third = (root + 4) % 12;
      fifth = (root + 7) % 12;
      break;
    case 'minor':
      third = (root + 3) % 12;
      fifth = (root + 7) % 12;
      break;
    case 'diminished':
      third = (root + 3) % 12;
      fifth = (root + 6) % 12;
      break;
  }

  return { root, third, fifth };
}

function getNoteRole(pc: number, tones: { root: number; third: number; fifth: number }): 'root' | '3rd' | '5th' | null {
  if (pc === tones.root) return 'root';
  if (pc === tones.third) return '3rd';
  if (pc === tones.fifth) return '5th';
  return null;
}

export function detectBarre(position: ChordPosition): { hasBarre: boolean; isPartialBarre: boolean; barreAt?: number } {
  if (position.barres.length > 0) {
    const barreFret = position.barres[0];
    const barredStrings = position.frets
      .map((f, i) => (f === barreFret ? i : -1))
      .filter((i) => i >= 0);

    const allHigh = barredStrings.every((s) => s >= 3);
    const allLow = barredStrings.every((s) => s <= 2);
    const isPartial = allHigh || allLow;

    return { hasBarre: true, isPartialBarre: isPartial, barreAt: barreFret };
  }

  const fretCounts = new Map<number, number[]>();
  position.frets.forEach((f, i) => {
    if (f > 0) {
      const arr = fretCounts.get(f) || [];
      arr.push(i);
      fretCounts.set(f, arr);
    }
  });

  let result: { hasBarre: boolean; isPartialBarre: boolean; barreAt?: number } | null = null;
  fretCounts.forEach((strings, fret) => {
    if (result) return;
    if (strings.length >= 3) {
      const minS = Math.min(...strings);
      const maxS = Math.max(...strings);
      if (maxS - minS > strings.length - 1) {
        const allHigh = strings.every((s: number) => s >= 3);
        const allLow = strings.every((s: number) => s <= 2);
        result = { hasBarre: true, isPartialBarre: allHigh || allLow, barreAt: fret };
      }
    }
  });

  return result ?? { hasBarre: false, isPartialBarre: false };
}

export function calculateDifficultyScore(position: ChordPosition, barreInfo: ReturnType<typeof detectBarre>): number {
  const frettedFrets = position.frets.filter((f) => f > 0);
  const minFret = frettedFrets.length > 0 ? Math.min(...frettedFrets) : 0;
  const maxFret = frettedFrets.length > 0 ? Math.max(...frettedFrets) : 0;
  const fretSpan = maxFret - minFret;
  const fingerCount = frettedFrets.length;

  let hasStringSkip = false;
  const soundedStrings: number[] = [];
  position.frets.forEach((f, i) => {
    if (f >= 0) soundedStrings.push(i);
  });
  for (let i = 1; i < soundedStrings.length; i++) {
    if (soundedStrings[i] - soundedStrings[i - 1] > 1) {
      hasStringSkip = true;
      break;
    }
  }

  const barreAt = barreInfo.barreAt ?? 0;

  return (
    (barreInfo.hasBarre ? 35 : 0) +
    (barreInfo.isPartialBarre ? 15 : 0) +
    fretSpan * 8 +
    fingerCount * 5 +
    (hasStringSkip ? 5 : 0) +
    Math.min(Math.max(barreAt - 1, 0), 5) * 3
  );
}

function getFretSpan(position: ChordPosition): number {
  const frettedFrets = position.frets.filter((f) => f > 0);
  if (frettedFrets.length === 0) return 0;
  return Math.max(...frettedFrets) - Math.min(...frettedFrets);
}

function positionToMidi(stringIdx: number, fret: number): number {
  return OPEN_STRINGS_MIDI[stringIdx] + fret;
}

function buildVoicingFromPosition(
  chordName: string,
  position: ChordPosition,
  tones: { root: number; third: number; fifth: number },
  id: string,
): GuitarVoicing | null {
  const lowestSounded = position.frets.findIndex((f) => f >= 0);
  if (lowestSounded === -1) return null;

  const bassMidi = positionToMidi(lowestSounded, position.frets[lowestSounded]);
  const bassPC = bassMidi % 12;
  const bassRole = getNoteRole(bassPC, tones);
  if (!bassRole) return null;

  let inversion: Inversion;
  let symbol: string;
  const bassNoteName = midiToNoteName(bassMidi);

  if (bassRole === 'root') {
    inversion = 'root';
    symbol = chordName;
  } else if (bassRole === '3rd') {
    inversion = '1st';
    symbol = `${chordName}/${bassNoteName}`;
  } else if (bassRole === '5th') {
    inversion = '2nd';
    symbol = `${chordName}/${bassNoteName}`;
  } else {
    inversion = '3rd';
    symbol = `${chordName}/${bassNoteName}`;
  }

  const barreInfo = detectBarre(position);
  const difficultyScore = calculateDifficultyScore(position, barreInfo);
  const mutedStrings: StringIndex[] = [];
  position.frets.forEach((f, i) => {
    if (f === -1) mutedStrings.push(i as StringIndex);
  });

  return {
    id,
    chord: chordName,
    symbol,
    bass: midiToScientific(bassMidi),
    inversion,
    position,
    mutedStrings,
    ...barreInfo,
    fretSpan: getFretSpan(position),
    difficultyScore,
  };
}

function generateInversionCandidates(
  chordName: string,
  tones: { root: number; third: number; fifth: number },
  targetBassPC: number,
  inversion: Inversion,
): GuitarVoicing[] {
  const results: GuitarVoicing[] = [];
  const chordPCs = [tones.root, tones.third, tones.fifth];
  const bassNoteName = NOTE_NAMES[targetBassPC];
  const symbol = inversion === 'root' ? chordName : `${chordName}/${bassNoteName}`;

  for (let bassString = 0; bassString <= 3; bassString++) {
    const openMidi = OPEN_STRINGS_MIDI[bassString];
    const openPC = openMidi % 12;

    const possibleBassFrets: number[] = [];
    for (let f = 0; f <= MAX_FRET; f++) {
      if ((openPC + f) % 12 === targetBassPC) {
        possibleBassFrets.push(f);
      }
    }

    for (const bassFret of possibleBassFrets) {
      const stringOptions: number[][] = [];
      stringOptions.length = 6;

      for (let s = 0; s < 6; s++) {
        if (s < bassString) {
          stringOptions[s] = [-1];
          continue;
        }
        if (s === bassString) {
          stringOptions[s] = [bassFret];
          continue;
        }

        const opts: number[] = [-1];
        const sOpenMidi = OPEN_STRINGS_MIDI[s];
        const sOpenPC = sOpenMidi % 12;

        if (chordPCs.includes(sOpenPC)) {
          opts.push(0);
        }

        const minFret = bassFret === 0 ? 1 : Math.max(1, bassFret - 1);
        const maxFret = bassFret === 0 ? MAX_FRET_SPAN : bassFret + MAX_FRET_SPAN - 1;
        for (let f = minFret; f <= Math.min(maxFret, MAX_FRET); f++) {
          const pc = (sOpenPC + f) % 12;
          if (chordPCs.includes(pc)) {
            opts.push(f);
          }
        }

        stringOptions[s] = opts;
      }

      const combos = generateCombinations(stringOptions, bassString);

      for (const frets of combos) {
        const soundedPCs = new Set<number>();
        for (let s = 0; s < 6; s++) {
          if (frets[s] >= 0) {
            soundedPCs.add((OPEN_STRINGS_MIDI[s] + frets[s]) % 12);
          }
        }

        if (!chordPCs.every((pc) => soundedPCs.has(pc))) continue;

        const soundedCount = frets.filter((f) => f >= 0).length;
        if (soundedCount < 3) continue;

        const frettedNonZero = frets.filter((f) => f > 0);
        if (frettedNonZero.length > 0) {
          const span = Math.max(...frettedNonZero) - Math.min(...frettedNonZero);
          if (span > MAX_FRET_SPAN - 1) continue;
        }

        if (frettedNonZero.length > 4) continue;

        const mutedInMiddle = hasMutedInMiddle(frets);
        if (mutedInMiddle > 1) continue;

        const fingers = assignFingers(frets);
        const barres: number[] = [];
        const position: ChordPosition = {
          frets,
          fingers,
          barres,
          baseFret: 1,
        };

        const barreInfo = detectBarre(position);
        const difficultyScore = calculateDifficultyScore(position, barreInfo);

        const bassMidi = OPEN_STRINGS_MIDI[bassString] + bassFret;
        const id = `${chordName}-${inversion}-${frets.join('')}`;

        results.push({
          id,
          chord: chordName,
          symbol,
          bass: midiToScientific(bassMidi),
          inversion,
          position,
          mutedStrings: frets.map((f, i) => (f === -1 ? i : -1)).filter((i) => i >= 0) as StringIndex[],
          ...barreInfo,
          fretSpan: getFretSpan(position),
          difficultyScore,
        });
      }
    }
  }

  return deduplicateVoicings(results);
}

function hasMutedInMiddle(frets: number[]): number {
  const first = frets.findIndex((f) => f >= 0);
  const last = frets.length - 1 - [...frets].reverse().findIndex((f) => f >= 0);
  if (first === -1) return 0;
  let count = 0;
  for (let i = first + 1; i < last; i++) {
    if (frets[i] === -1) count++;
  }
  return count;
}

function generateCombinations(options: number[][], bassString: number): number[][] {
  const results: number[][] = [];
  const current = new Array(6).fill(0);
  const MAX_RESULTS = 200;

  function recurse(stringIdx: number) {
    if (results.length >= MAX_RESULTS) return;
    if (stringIdx === 6) {
      results.push([...current]);
      return;
    }
    for (const opt of options[stringIdx]) {
      current[stringIdx] = opt;
      recurse(stringIdx + 1);
    }
  }

  recurse(0);
  return results;
}

function assignFingers(frets: number[]): number[] {
  const fingers = [0, 0, 0, 0, 0, 0];
  const frettedPositions: { string: number; fret: number }[] = [];

  for (let s = 0; s < 6; s++) {
    if (frets[s] > 0) {
      frettedPositions.push({ string: s, fret: frets[s] });
    }
  }

  frettedPositions.sort((a, b) => a.fret - b.fret || a.string - b.string);

  let fingerNum = 1;
  for (const pos of frettedPositions) {
    if (fingerNum <= 4) {
      fingers[pos.string] = fingerNum;
      fingerNum++;
    }
  }

  return fingers;
}

function deduplicateVoicings(voicings: GuitarVoicing[]): GuitarVoicing[] {
  const seen = new Set<string>();
  return voicings.filter((v) => {
    const key = v.position.frets.join(',');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function generateVoicingsForChord(chordName: string): GuitarVoicing[] {
  const tones = getChordTones(chordName);
  const voicings: GuitarVoicing[] = [];

  const chordData = chordDatabase[chordName];
  if (chordData) {
    for (let i = 0; i < chordData.positions.length; i++) {
      const v = buildVoicingFromPosition(chordName, chordData.positions[i], tones, `${chordName}-db-${i}`);
      if (v) voicings.push(v);
    }
  }

  const inv1 = generateInversionCandidates(chordName, tones, tones.third, '1st');
  const inv2 = generateInversionCandidates(chordName, tones, tones.fifth, '2nd');

  voicings.push(...inv1, ...inv2);

  const deduplicated = deduplicateVoicings(voicings);
  deduplicated.sort((a, b) => a.difficultyScore - b.difficultyScore);

  const dbIds = new Set(
    chordData ? chordData.positions.map((_, i) => `${chordName}-db-${i}`) : [],
  );
  const dbVoicings = deduplicated.filter((v) => dbIds.has(v.id));
  const generated = deduplicated.filter((v) => !dbIds.has(v.id));
  const maxGenerated = 30 - dbVoicings.length;

  return [...dbVoicings, ...generated.slice(0, maxGenerated)].sort(
    (a, b) => a.difficultyScore - b.difficultyScore,
  );
}

export function getBarreLabel(voicing: GuitarVoicing): 'no_barre' | 'partial_barre' | 'full_barre' {
  if (!voicing.hasBarre) return 'no_barre';
  if (voicing.isPartialBarre) return 'partial_barre';
  return 'full_barre';
}

export function getDifficultyDots(score: number): number {
  if (score <= 15) return 1;
  if (score <= 35) return 2;
  if (score <= 55) return 3;
  if (score <= 75) return 4;
  return 5;
}

export function getInversionLabel(inversion: Inversion): string {
  switch (inversion) {
    case 'root': return 'Root';
    case '1st': return '1st inv';
    case '2nd': return '2nd inv';
    case '3rd': return '3rd inv';
  }
}
