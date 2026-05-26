export type StrumCell = "" | "↓" | "↑" | "✕";
export type BeatType = "negra" | "corchea" | "semicorchea";

export interface Beat {
  type: BeatType;
  cells: StrumCell[];
}

export interface HarmonyChord {
  id: string;
  name: string;
  degree: string;
  key: string;
  mode: "major" | "minor";
  strumPattern: Beat[];
}

export interface Harmony {
  id: string;
  name: string;
  timeSignature: "4/4" | "3/4";
  bpm: number;
  chords: HarmonyChord[];
  createdAt: number;
}

export type ChordQuality = "major" | "minor" | "diminished";

export interface DiatonicChord {
  name: string;
  degree: string;
  quality: ChordQuality;
}

export interface ChordPosition {
  frets: number[];
  fingers: number[];
  barres: number[];
  baseFret: number;
}

export interface ChordData {
  name: string;
  positions: ChordPosition[];
}

export type Locale = "es" | "en" | "ru";
export type Mode = "major" | "minor";
export type TimeSignature = "4/4" | "3/4";

export interface SongBar {
  chords: string[];
}

export interface SongSection {
  id: string;
  label:
    | "Intro"
    | "Verse"
    | "Pre-Chorus"
    | "Chorus"
    | "Bridge"
    | "Solo"
    | "Outro"
    | "Instrumental";
  index: number;
  bars: SongBar[];
  repeatCount?: number;
  romanNumerals: string[];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  year?: number;
  genres: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  key: { tonic: string; mode: "major" | "minor" };
  bpm?: number;
  timeSignature: [number, number];
  capo?: number;
  source: "curated" | "hooktheory" | "user";
  sections: SongSection[];
}

export interface SongMatch {
  song: Song;
  section: SongSection;
  score: number;
}

export type SongDifficulty = 1 | 2 | 3 | 4 | 5;

export type SongSectionLabel = SongSection["label"];
