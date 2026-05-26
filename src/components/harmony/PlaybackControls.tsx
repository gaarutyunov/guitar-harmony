'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { usePlaybackStore } from '@/stores/usePlaybackStore';
import { useHarmonyStore } from '@/stores/useHarmonyStore';
import { chordDatabase } from '@/data/chords';
import { getActiveCellIndex, getDefaultBeatTypes } from '@/lib/strum/presets';
import {
  ensureAudioReady,
  getChordFrequencies,
  playMetronomeClick,
  playChordStrum,
} from '@/lib/audio/audio';

export function PlaybackControls() {
  const t = useTranslations('playback');
  const chords = useHarmonyStore((s) => s.current.chords);
  const timeSignature = useHarmonyStore((s) => s.current.timeSignature);

  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const bpm = usePlaybackStore((s) => s.bpm);
  const metronomeEnabled = usePlaybackStore((s) => s.metronomeEnabled);
  const audioEnabled = usePlaybackStore((s) => s.audioEnabled);
  const loopEnabled = usePlaybackStore((s) => s.loopEnabled);
  const repetitionsPerChord = usePlaybackStore(
    (s) => s.repetitionsPerChord
  );

  const setBpm = usePlaybackStore((s) => s.setBpm);
  const toggleMetronome = usePlaybackStore((s) => s.toggleMetronome);
  const toggleAudio = usePlaybackStore((s) => s.toggleAudio);
  const toggleLoop = usePlaybackStore((s) => s.toggleLoop);
  const setRepetitions = usePlaybackStore((s) => s.setRepetitions);
  const setPlaying = usePlaybackStore((s) => s.setPlaying);
  const setPosition = usePlaybackStore((s) => s.setPosition);
  const resetPosition = usePlaybackStore((s) => s.resetPosition);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef({ chordIdx: 0, tick: 0, rep: 0 });

  const stop = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    resetPosition();
  }, [resetPosition]);

  const tick = useCallback(() => {
    const store = usePlaybackStore.getState();
    const harmony = useHarmonyStore.getState().current;
    const { chordIdx, tick: tickPos, rep } = stateRef.current;

    if (chordIdx >= harmony.chords.length) {
      stop();
      return;
    }

    const chord = harmony.chords[chordIdx];
    const beatTypes = chord.beatTypes || getDefaultBeatTypes(harmony.timeSignature);
    const numBeats = beatTypes.length;
    const totalTicks = numBeats * 4;

    const beatIdx = Math.floor(tickPos / 4);
    const subBeat = tickPos % 4;
    const beatType = beatTypes[beatIdx];

    if (beatType) {
      if (store.metronomeEnabled && subBeat === 0) {
        playMetronomeClick(beatIdx === 0);
      }

      const displayCellIdx = getActiveCellIndex(beatType, subBeat);

      if (displayCellIdx !== null) {
        setPosition(chordIdx, beatIdx, displayCellIdx, rep);

        if (store.audioEnabled) {
          const cell = chord.strumPattern[tickPos];
          if (cell && (cell as string) !== '') {
            const chordData = chordDatabase[chord.name];
            if (chordData?.positions[0]) {
              const freqs = getChordFrequencies(chordData.positions[0]);
              playChordStrum(freqs, cell, chord.name);
            }
          }
        }
      }
    }

    let nextTick = tickPos + 1;
    let nextChordIdx = chordIdx;
    let nextRep = rep;

    if (nextTick >= totalTicks) {
      nextTick = 0;
      nextRep += 1;
      if (nextRep >= store.repetitionsPerChord) {
        nextRep = 0;
        nextChordIdx += 1;
        if (nextChordIdx >= harmony.chords.length) {
          if (store.loopEnabled) {
            nextChordIdx = 0;
          } else {
            stateRef.current = {
              chordIdx: nextChordIdx,
              tick: 0,
              rep: 0,
            };
            timeoutRef.current = setTimeout(() => {
              stop();
            }, 60000 / (store.bpm * 4));
            return;
          }
        }
      }
    }

    stateRef.current = {
      chordIdx: nextChordIdx,
      tick: nextTick,
      rep: nextRep,
    };

    const sixteenthNoteDuration = 60000 / (store.bpm * 4);
    timeoutRef.current = setTimeout(tick, sixteenthNoteDuration);
  }, [setPosition, stop]);

  const play = useCallback(() => {
    if (chords.length === 0) return;
    ensureAudioReady();
    stateRef.current = { chordIdx: 0, tick: 0, rep: 0 };
    setPlaying(true);
    tick();
  }, [chords.length, setPlaying, tick]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying && chords.length === 0) {
      stop();
    }
  }, [chords.length, isPlaying, stop]);

  if (chords.length === 0) return null;

  return (
    <div className="bg-mahogany-900/60 rounded-xl border border-mahogany-800/40 p-3 space-y-2.5">
      {/* Transport row */}
      <div className="flex items-center gap-3">
        <button
          onClick={isPlaying ? stop : play}
          className={`w-10 h-10 flex items-center justify-center rounded-full font-mono text-lg transition-all active:scale-90 ${
            isPlaying
              ? 'bg-rose-500/80 text-white hover:bg-rose-500'
              : 'bg-amber-500 text-mahogany-950 hover:bg-amber-400'
          }`}
          aria-label={isPlaying ? t('stop') : t('play')}
        >
          {isPlaying ? '■' : '▶'}
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setBpm(bpm - 5)}
            disabled={bpm <= 40}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-xs font-mono text-mahogany-400 bg-mahogany-800/60 border border-mahogany-700/30 hover:text-mahogany-200 disabled:opacity-30 transition-colors"
          >
            -
          </button>
          <div className="flex items-baseline gap-1 min-w-[4rem] justify-center">
            <input
              type="number"
              min={40}
              max={220}
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value) || 80)}
              className="w-10 bg-transparent text-center text-sm font-mono font-bold text-mahogany-100 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-[10px] font-mono text-mahogany-500">
              BPM
            </span>
          </div>
          <button
            onClick={() => setBpm(bpm + 5)}
            disabled={bpm >= 220}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-xs font-mono text-mahogany-400 bg-mahogany-800/60 border border-mahogany-700/30 hover:text-mahogany-200 disabled:opacity-30 transition-colors"
          >
            +
          </button>
        </div>

        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() =>
              setRepetitions(
                repetitionsPerChord > 1 ? repetitionsPerChord - 1 : 1
              )
            }
            disabled={repetitionsPerChord <= 1}
            className="w-5 h-5 flex items-center justify-center rounded text-[10px] font-mono text-mahogany-500 hover:text-mahogany-300 disabled:opacity-30 transition-colors"
          >
            -
          </button>
          <span className="text-xs font-mono text-mahogany-300 min-w-[2.5rem] text-center">
            {repetitionsPerChord}x {t('rep')}
          </span>
          <button
            onClick={() => setRepetitions(repetitionsPerChord + 1)}
            disabled={repetitionsPerChord >= 8}
            className="w-5 h-5 flex items-center justify-center rounded text-[10px] font-mono text-mahogany-500 hover:text-mahogany-300 disabled:opacity-30 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Settings row */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <ToggleButton
          active={audioEnabled}
          onClick={toggleAudio}
          label={t('audio')}
          icon="♪"
        />
        <ToggleButton
          active={metronomeEnabled}
          onClick={toggleMetronome}
          label={t('metronome')}
          icon="●"
        />
        <ToggleButton
          active={loopEnabled}
          onClick={toggleLoop}
          label={t('loop')}
          icon="↻"
        />
      </div>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
        active
          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
          : 'bg-mahogany-800/40 text-mahogany-500 border border-mahogany-700/20 hover:text-mahogany-400'
      }`}
    >
      <span className="text-xs">{icon}</span>
      {label}
    </button>
  );
}
