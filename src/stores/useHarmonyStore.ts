import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { Harmony, HarmonyChord, Inversion, StrumCell, TimeSignature } from "@/types";
import { getEmptyPattern } from "@/lib/strum/presets";
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

interface HarmonyState {
  current: Harmony;
  saved: Harmony[];
  addChord: (chord: Omit<HarmonyChord, "id" | "strumPattern">) => void;
  removeChord: (id: string) => void;
  moveChord: (id: string, dir: -1 | 1) => void;
  updatePattern: (id: string, pattern: StrumCell[]) => void;
  updateVoicing: (id: string, voicingId: string, voicingSymbol: string, voicingInversion: Inversion, voicingHasBarre: boolean) => void;
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

      updateVoicing: (id, voicingId, voicingSymbol, voicingInversion, voicingHasBarre) =>
        set((state) => ({
          current: {
            ...state.current,
            chords: state.current.chords.map((c) =>
              c.id === id
                ? { ...c, voicingId, voicingSymbol, voicingInversion, voicingHasBarre }
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
    { name: "guitar-harmony-data" },
  ),
);
