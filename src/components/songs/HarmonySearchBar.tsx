"use client";

import { useTranslations } from "next-intl";
import { useSongsStore } from "@/stores/useSongsStore";

interface HarmonySearchBarProps {
  initialChords?: string[];
}

export function HarmonySearchBar({ initialChords }: HarmonySearchBarProps) {
  const t = useTranslations("songs");
  const query = useSongsStore((s) => s.query);
  const setQuery = useSongsStore((s) => s.setQuery);

  const commonChords = [
    "C",
    "D",
    "E",
    "F",
    "G",
    "A",
    "B",
    "Am",
    "Bm",
    "Cm",
    "Dm",
    "Em",
    "Fm",
    "Gm",
    "F#m",
    "C#m",
    "Bb",
    "Eb",
    "Ab",
  ];

  function addChord(chord: string) {
    setQuery([...query, chord]);
  }

  function removeChord(index: number) {
    setQuery(query.filter((_, i) => i !== index));
  }

  function clearAll() {
    setQuery([]);
  }

  return (
    <div className="space-y-2">
      {/* Selected chords */}
      <div className="flex items-center gap-1 flex-wrap min-h-[32px]">
        {query.length === 0 ? (
          <span className="text-xs font-mono text-mahogany-600">
            {t("pick_chords")}
          </span>
        ) : (
          <>
            {query.map((chord, i) => (
              <button
                key={`${chord}-${i}`}
                onClick={() => removeChord(i)}
                className="px-2 py-0.5 rounded-lg text-xs font-mono bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
              >
                {chord} ×
              </button>
            ))}
            <button
              onClick={clearAll}
              className="px-2 py-0.5 rounded-lg text-[10px] font-mono text-mahogany-500 hover:text-rose-400 transition-colors"
            >
              {t("clear")}
            </button>
          </>
        )}
      </div>

      {/* Chord picker */}
      <div className="flex flex-wrap gap-1">
        {commonChords.map((chord) => (
          <button
            key={chord}
            onClick={() => addChord(chord)}
            className="px-2 py-1 rounded-lg text-[11px] font-mono bg-mahogany-800/60 text-mahogany-300 border border-mahogany-700/30 hover:border-amber-500/30 hover:text-amber-400 transition-colors active:scale-95"
          >
            {chord}
          </button>
        ))}
      </div>
    </div>
  );
}
