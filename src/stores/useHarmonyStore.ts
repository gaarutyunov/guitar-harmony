import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { ChordPosition, Harmony, HarmonyChord, Inversion, StrumCell, BeatType, TimeSignature } from "@/types";
import { getEmptyPattern, getDefaultBeatTypes } from "@/lib/strum/presets";
import { usePlaybackStore } from "@/stores/usePlaybackStore";

const DEFAULT_BPM = 80;

function createEmptyHarmony(): Harmony {
  return {
    id: uuidv4(),
    name: "",
    timeSignature: "4/4",
    bpm: DEFAULT_BPM,
    chords: [],
    createdAt: Date.now(),
  };
}

function migrateChordPattern(chord: Record<string, unknown>): Record<string, unknown> {
  const pattern = chord.strumPattern;
  if (!pattern || !Array.isArray(pattern)) return chord;

  if (typeof pattern[0] === "string" && (pattern.length === 16 || pattern.length === 12) && chord.beatTypes) {
    return chord;
  }

  if (typeof pattern[0] === "object" && pattern[0] !== null) {
    const beats = pattern as { type: string; cells: string[] }[];
    const flat: string[] = [];
    const types: string[] = [];
    for (const beat of beats) {
      types.push(beat.type);
      if (beat.type === "corchea") {
        flat.push(beat.cells[0] || "", "", beat.cells[1] || "", "");
      } else if (beat.type === "semicorchea") {
        flat.push(beat.cells[0] || "", beat.cells[1] || "", beat.cells[2] || "", beat.cells[3] || "");
      } else {
        flat.push(beat.cells[0] || "", "", "", "");
      }
    }
    return { ...chord, strumPattern: flat, beatTypes: types };
  }

  if (typeof pattern[0] === "string" && (pattern.length === 8 || pattern.length === 6)) {
    const expanded: string[] = [];
    for (let i = 0; i < pattern.length; i += 2) {
      expanded.push(pattern[i] || "", "", pattern[i + 1] || "", "");
    }
    const numBeats = pattern.length === 8 ? 4 : 3;
    return { ...chord, strumPattern: expanded, beatTypes: new Array(numBeats).fill("corchea") };
  }

  return chord;
}

interface HarmonyState {
  current: Harmony;
  saved: Harmony[];
  addChord: (chord: Omit<HarmonyChord, "id" | "strumPattern" | "beatTypes">) => void;
  removeChord: (id: string) => void;
  moveChord: (id: string, dir: -1 | 1) => void;
  updatePattern: (id: string, pattern: StrumCell[]) => void;
  updateBeatTypes: (id: string, beatTypes: BeatType[]) => void;
  updateVoicing: (id: string, voicingId: string, voicingSymbol: string, voicingInversion: Inversion, voicingHasBarre: boolean, voicingPosition: ChordPosition) => void;
  setName: (name: string) => void;
  setBpm: (bpm: number) => void;
  setTimeSignature: (ts: TimeSignature) => void;
  clearCurrent: () => void;
  saveHarmony: () => boolean;
  loadHarmony: (id: string) => void;
  deleteHarmony: (id: string) => void;
  setCurrent: (harmony: Harmony) => void;
}

export const useHarmonyStore = create<HarmonyState>()(
  persist(
    (set, get) => ({
      current: createEmptyHarmony(),
      saved: [],

      addChord: (chord) =>
        set((state) => ({
          current: {
            ...state.current,
            chords: [
              ...state.current.chords,
              {
                ...chord,
                id: uuidv4(),
                strumPattern: getEmptyPattern(state.current.timeSignature),
                beatTypes: getDefaultBeatTypes(state.current.timeSignature),
              },
            ],
          },
        })),

      removeChord: (id) =>
        set((state) => ({
          current: {
            ...state.current,
            chords: state.current.chords.filter((c) => c.id !== id),
          },
        })),

      moveChord: (id, dir) =>
        set((state) => {
          const chords = [...state.current.chords];
          const idx = chords.findIndex((c) => c.id === id);
          if (idx < 0) return state;
          const newIdx = idx + dir;
          if (newIdx < 0 || newIdx >= chords.length) return state;
          [chords[idx], chords[newIdx]] = [chords[newIdx], chords[idx]];
          return { current: { ...state.current, chords } };
        }),

      updatePattern: (id, pattern) =>
        set((state) => ({
          current: {
            ...state.current,
            chords: state.current.chords.map((c) =>
              c.id === id ? { ...c, strumPattern: pattern } : c,
            ),
          },
        })),

      updateBeatTypes: (id, beatTypes) =>
        set((state) => ({
          current: {
            ...state.current,
            chords: state.current.chords.map((c) =>
              c.id === id ? { ...c, beatTypes } : c,
            ),
          },
        })),

      updateVoicing: (id, voicingId, voicingSymbol, voicingInversion, voicingHasBarre, voicingPosition) =>
        set((state) => ({
          current: {
            ...state.current,
            chords: state.current.chords.map((c) =>
              c.id === id
                ? { ...c, voicingId, voicingSymbol, voicingInversion, voicingHasBarre, voicingPosition }
                : c,
            ),
          },
        })),

      setName: (name) =>
        set((state) => ({ current: { ...state.current, name } })),

      setBpm: (bpm) =>
        set((state) => ({
          current: { ...state.current, bpm: Math.max(40, Math.min(220, bpm)) },
        })),

      setTimeSignature: (ts) =>
        set((state) => ({
          current: {
            ...state.current,
            timeSignature: ts,
            chords: state.current.chords.map((c) => ({
              ...c,
              strumPattern: getEmptyPattern(ts),
              beatTypes: getDefaultBeatTypes(ts),
            })),
          },
        })),

      clearCurrent: () => set({ current: createEmptyHarmony() }),

      saveHarmony: () => {
        const { current } = get();
        if (!current.name.trim() || current.chords.length === 0) return false;
        const playbackBpm = usePlaybackStore.getState().bpm;
        const snapshot: Harmony = {
          ...current,
          bpm: playbackBpm,
          id: uuidv4(),
          createdAt: Date.now(),
        };
        set((state) => ({ saved: [...state.saved, snapshot] }));
        return true;
      },

      loadHarmony: (id) => {
        const { saved } = get();
        const found = saved.find((h) => h.id === id);
        if (found) {
          set({ current: { ...found, id: uuidv4() } });
          if (found.bpm) {
            usePlaybackStore.getState().setBpm(found.bpm);
          }
        }
      },

      deleteHarmony: (id) =>
        set((state) => ({
          saved: state.saved.filter((h) => h.id !== id),
        })),

      setCurrent: (harmony) => set({ current: harmony }),
    }),
    {
      name: "guitar-harmony-data",
      version: 2,
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as Record<string, unknown>;
        if (version < 2) {
          const current = state.current as Record<string, unknown> | undefined;
          if (current?.chords && Array.isArray(current.chords)) {
            current.chords = current.chords.map(migrateChordPattern);
          }
          const saved = state.saved as Array<Record<string, unknown>> | undefined;
          if (saved) {
            state.saved = saved.map((h) => ({
              ...h,
              chords: Array.isArray(h.chords) ? h.chords.map(migrateChordPattern) : [],
            }));
          }
        }
        return state;
      },
    },
  ),
);
