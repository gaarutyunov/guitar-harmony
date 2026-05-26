"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useSongsStore } from "@/stores/useSongsStore";
import { useHarmonyStore } from "@/stores/useHarmonyStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { SectionTimeline } from "./SectionTimeline";
import { SongSection } from "@/types";

function DifficultyDots({ level }: { level: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`inline-block w-2 h-2 rounded-full ${
            i < level ? "bg-amber-400" : "bg-mahogany-700"
          }`}
        />
      ))}
    </span>
  );
}

export function SongDetail() {
  const t = useTranslations("songs");
  const router = useRouter();
  const selectedSongId = useSongsStore((s) => s.selectedSongId);
  const selectSong = useSongsStore((s) => s.selectSong);
  const getSong = useSongsStore((s) => s.getSong);
  const setQuery = useSongsStore((s) => s.setQuery);
  const setSearchMode = useSongsStore((s) => s.setSearchMode);
  const addChord = useHarmonyStore((s) => s.addChord);
  const setName = useHarmonyStore((s) => s.setName);
  const clearCurrent = useHarmonyStore((s) => s.clearCurrent);
  const mode = useSettingsStore((s) => s.mode);

  const song = selectedSongId ? getSong(selectedSongId) : undefined;
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [selectedBars, setSelectedBars] = useState<[number, number] | null>(
    null,
  );
  const [selectionStart, setSelectionStart] = useState<number | null>(null);

  const handleBarSelect = useCallback(
    (index: number) => {
      if (selectionStart === null) {
        setSelectionStart(index);
        setSelectedBars([index, index]);
      } else {
        setSelectedBars([selectionStart, index]);
        setSelectionStart(null);
      }
    },
    [selectionStart],
  );

  if (!song) {
    selectSong(null);
    return null;
  }

  const activeSection: SongSection | undefined =
    song.sections[activeSectionIndex];

  function extractAsHarmony() {
    if (!activeSection) return;

    let bars = activeSection.bars;
    if (selectedBars) {
      const [start, end] = selectedBars;
      const lo = Math.min(start, end);
      const hi = Math.max(start, end);
      bars = bars.slice(lo, hi + 1);
    }

    if (!song) return;
    clearCurrent();
    setName(`${song.artist} - ${song.title}`);
    for (const bar of bars) {
      for (const chordName of bar.chords) {
        addChord({
          name: chordName,
          degree: "",
          key: song.key.tonic,
          mode: song.key.mode,
        });
      }
    }
    router.push("/harmony");
  }

  function findSimilarSongs() {
    if (!activeSection) return;
    const chords = activeSection.bars.flatMap((b) => b.chords);
    setQuery(chords);
    setSearchMode(true);
    selectSong(null);
  }

  return (
    <div className="space-y-4">
      {/* Back button */}
      <button
        onClick={() => {
          selectSong(null);
          setSelectedBars(null);
          setSelectionStart(null);
        }}
        className="text-xs font-mono text-mahogany-400 hover:text-amber-400 transition-colors"
      >
        ← {t("back_to_list")}
      </button>

      {/* Header */}
      <div className="space-y-2">
        <h2 className="font-heading text-xl text-mahogany-100">{song.title}</h2>
        <p className="text-sm font-mono text-mahogany-400">{song.artist}</p>

        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-0.5 rounded text-xs font-mono bg-mahogany-800/80 text-mahogany-300">
            {song.key.tonic} {song.key.mode === "minor" ? "min" : "maj"}
          </span>
          {song.bpm && (
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-mahogany-800/80 text-mahogany-300">
              {song.bpm} {t("bpm")}
            </span>
          )}
          <span className="px-2 py-0.5 rounded text-xs font-mono bg-mahogany-800/80 text-mahogany-300">
            {song.timeSignature[0]}/{song.timeSignature[1]}
          </span>
          {song.capo !== undefined && song.capo > 0 && (
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-mahogany-800/80 text-mahogany-300">
              {t("capo")} {song.capo}
            </span>
          )}
          <DifficultyDots level={song.difficulty} />
        </div>

        <div className="flex flex-wrap gap-1">
          {song.genres.map((g) => (
            <span
              key={g}
              className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-mahogany-800/60 text-mahogany-400"
            >
              {g}
            </span>
          ))}
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {song.sections.map((section, i) => (
          <button
            key={section.id}
            onClick={() => {
              setActiveSectionIndex(i);
              setSelectedBars(null);
              setSelectionStart(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
              activeSectionIndex === i
                ? "bg-amber-500 text-mahogany-950 font-bold"
                : "bg-mahogany-800/60 text-mahogany-400 hover:text-mahogany-200"
            }`}
          >
            {section.label}
            {section.repeatCount &&
              section.repeatCount > 1 &&
              ` ×${section.repeatCount}`}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {activeSection && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-heading text-mahogany-200">
              {activeSection.label}
            </h3>
            {selectedBars && (
              <button
                onClick={() => {
                  setSelectedBars(null);
                  setSelectionStart(null);
                }}
                className="text-[10px] font-mono text-mahogany-500 hover:text-rose-400 transition-colors"
              >
                {t("clear_selection")}
              </button>
            )}
          </div>

          <p className="text-[10px] font-mono text-mahogany-600">
            {t("tap_bars")}
          </p>

          <SectionTimeline
            section={activeSection}
            selectedBars={selectedBars}
            onBarSelect={handleBarSelect}
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={extractAsHarmony}
          className="flex-1 px-4 py-2 rounded-lg text-xs font-mono font-bold bg-amber-500 text-mahogany-950 hover:bg-amber-400 transition-colors active:scale-[0.98]"
        >
          {selectedBars ? t("extract_selected") : t("extract_section")}
        </button>
        <button
          onClick={findSimilarSongs}
          className="px-4 py-2 rounded-lg text-xs font-mono bg-mahogany-800/60 text-mahogany-300 border border-mahogany-700/30 hover:border-amber-500/30 hover:text-amber-400 transition-colors"
        >
          {t("find_similar")}
        </button>
      </div>
    </div>
  );
}
