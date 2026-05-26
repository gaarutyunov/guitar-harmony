"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useHarmonyStore } from "@/stores/useHarmonyStore";
import { usePlaybackStore } from "@/stores/usePlaybackStore";
import { useSongsStore } from "@/stores/useSongsStore";
import { ChordCard } from "./ChordCard";
import { PlaybackControls } from "./PlaybackControls";
import { useState, useRef, useEffect } from "react";

export function HarmonyBuilder() {
  const t = useTranslations("harmony");
  const tSongs = useTranslations("songs");
  const router = useRouter();
  const current = useHarmonyStore((s) => s.current);
  const setName = useHarmonyStore((s) => s.setName);
  const setTimeSignature = useHarmonyStore((s) => s.setTimeSignature);
  const clearCurrent = useHarmonyStore((s) => s.clearCurrent);
  const saveHarmony = useHarmonyStore((s) => s.saveHarmony);
  const removeChord = useHarmonyStore((s) => s.removeChord);
  const moveChord = useHarmonyStore((s) => s.moveChord);
  const updatePattern = useHarmonyStore((s) => s.updatePattern);
  const updateVoicing = useHarmonyStore((s) => s.updateVoicing);
  const setQuery = useSongsStore((s) => s.setQuery);
  const setSearchMode = useSongsStore((s) => s.setSearchMode);
  const currentChordIndex = usePlaybackStore((s) => s.currentChordIndex);
  const currentBeat = usePlaybackStore((s) => s.currentBeat);
  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const [toast, setToast] = useState<string | null>(null);
  const chordRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (!isPlaying || currentChordIndex < 0) return;
    const chord = current.chords[currentChordIndex];
    if (!chord) return;
    const el = chordRefs.current.get(chord.id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentChordIndex, isPlaying, current.chords]);

  function handleSave() {
    const success = saveHarmony();
    if (success) {
      setToast(t("save") + " ✓");
    } else {
      setToast(t("save") + " ⚠");
    }
    setTimeout(() => setToast(null), 1500);
  }

  function handleFindSongs() {
    const chordNames = current.chords.map((c) => c.name);
    setQuery(chordNames);
    setSearchMode(true);
    router.push("/songs");
  }

  return (
    <div className="space-y-4">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-500/90 text-mahogany-950 px-4 py-2 rounded-lg font-mono text-sm font-bold">
          {toast}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={current.name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("name_placeholder")}
          className="flex-1 min-w-[150px] px-3 py-1.5 rounded-lg bg-mahogany-900/60 border border-mahogany-700/30 text-mahogany-100 text-sm font-mono placeholder:text-mahogany-600 focus:outline-none focus:border-amber-500/50"
        />

        <div className="flex rounded-lg bg-mahogany-900/80 border border-mahogany-700/30 p-0.5">
          <button
            onClick={() => setTimeSignature("4/4")}
            className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
              current.timeSignature === "4/4"
                ? "bg-amber-500 text-mahogany-950"
                : "text-mahogany-400 hover:text-mahogany-200"
            }`}
          >
            4/4
          </button>
          <button
            onClick={() => setTimeSignature("3/4")}
            className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
              current.timeSignature === "3/4"
                ? "bg-amber-500 text-mahogany-950"
                : "text-mahogany-400 hover:text-mahogany-200"
            }`}
          >
            3/4
          </button>
        </div>

        <button
          onClick={clearCurrent}
          className="px-3 py-1.5 rounded-lg text-xs font-mono text-mahogany-400 border border-mahogany-700/30 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
        >
          {t("clear")}
        </button>

        <button
          onClick={handleSave}
          className="px-4 py-1.5 rounded-lg text-xs font-mono font-bold bg-amber-500 text-mahogany-950 hover:bg-amber-400 transition-colors active:scale-95"
        >
          {t("save")}
        </button>

        {current.chords.length >= 2 && (
          <button
            onClick={handleFindSongs}
            className="px-3 py-1.5 rounded-lg text-xs font-mono text-teal-400 border border-teal-500/30 hover:bg-teal-500/10 transition-colors active:scale-95"
          >
            {tSongs("find_songs")}
          </button>
        )}
      </div>

      {/* Playback controls */}
      <PlaybackControls />

      {/* Chord cards */}
      {current.chords.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-heading text-mahogany-400">
            {t("empty_title")}
          </p>
          <p className="text-sm font-mono text-mahogany-600 mt-1">
            {t("empty_hint")}
          </p>
        </div>
      ) : (
        <div className="space-y-3 pb-4">
          {current.chords.map((chord, idx) => (
            <div
              key={chord.id}
              ref={(el) => {
                if (el) chordRefs.current.set(chord.id, el);
                else chordRefs.current.delete(chord.id);
              }}
            >
              <ChordCard
                chord={chord}
                timeSignature={current.timeSignature}
                isFirst={idx === 0}
                isLast={idx === current.chords.length - 1}
                onMove={(dir) => moveChord(chord.id, dir)}
                onRemove={() => removeChord(chord.id)}
                onUpdatePattern={(pattern) => updatePattern(chord.id, pattern)}
                onUpdateVoicing={(v) => updateVoicing(chord.id, v.id, v.symbol, v.inversion, v.hasBarre, v.position)}
                isActive={isPlaying && currentChordIndex === idx}
                activeBeat={
                  isPlaying && currentChordIndex === idx ? currentBeat : -1
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
