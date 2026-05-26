import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PlaybackState {
  bpm: number;
  metronomeEnabled: boolean;
  audioEnabled: boolean;
  loopEnabled: boolean;
  repetitionsPerChord: number;

  isPlaying: boolean;
  currentChordIndex: number;
  currentBeat: number;
  currentCell: number;
  currentRepetition: number;

  setBpm: (bpm: number) => void;
  toggleMetronome: () => void;
  toggleAudio: () => void;
  toggleLoop: () => void;
  setRepetitions: (n: number) => void;
  setPlaying: (playing: boolean) => void;
  setPosition: (
    chordIndex: number,
    beat: number,
    cell: number,
    rep: number
  ) => void;
  resetPosition: () => void;
}

export const usePlaybackStore = create<PlaybackState>()(
  persist(
    (set) => ({
      bpm: 80,
      metronomeEnabled: true,
      audioEnabled: true,
      loopEnabled: false,
      repetitionsPerChord: 1,

      isPlaying: false,
      currentChordIndex: -1,
      currentBeat: -1,
      currentCell: -1,
      currentRepetition: 0,

      setBpm: (bpm) =>
        set({ bpm: Math.max(40, Math.min(220, bpm)) }),
      toggleMetronome: () =>
        set((s) => ({ metronomeEnabled: !s.metronomeEnabled })),
      toggleAudio: () =>
        set((s) => ({ audioEnabled: !s.audioEnabled })),
      toggleLoop: () =>
        set((s) => ({ loopEnabled: !s.loopEnabled })),
      setRepetitions: (n) =>
        set({ repetitionsPerChord: Math.max(1, Math.min(8, n)) }),
      setPlaying: (playing) => set({ isPlaying: playing }),
      setPosition: (chordIndex, beat, cell, rep) =>
        set({
          currentChordIndex: chordIndex,
          currentBeat: beat,
          currentCell: cell,
          currentRepetition: rep,
        }),
      resetPosition: () =>
        set({
          isPlaying: false,
          currentChordIndex: -1,
          currentBeat: -1,
          currentCell: -1,
          currentRepetition: 0,
        }),
    }),
    {
      name: 'guitar-harmony-playback',
      partialize: (state) => ({
        bpm: state.bpm,
        metronomeEnabled: state.metronomeEnabled,
        audioEnabled: state.audioEnabled,
        loopEnabled: state.loopEnabled,
        repetitionsPerChord: state.repetitionsPerChord,
      }),
    }
  )
);
