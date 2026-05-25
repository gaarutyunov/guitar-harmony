"use client";

import { useTranslations } from "next-intl";
import {
  useSongsStore,
  getAllGenres,
  getAllKeys,
} from "@/stores/useSongsStore";
import { SongDifficulty } from "@/types";

const difficulties: SongDifficulty[] = [1, 2, 3, 4, 5];

export function SongFilters() {
  const t = useTranslations("songs");
  const difficultyFilter = useSongsStore((s) => s.difficultyFilter);
  const genreFilter = useSongsStore((s) => s.genreFilter);
  const keyFilter = useSongsStore((s) => s.keyFilter);
  const setDifficultyFilter = useSongsStore((s) => s.setDifficultyFilter);
  const setGenreFilter = useSongsStore((s) => s.setGenreFilter);
  const setKeyFilter = useSongsStore((s) => s.setKeyFilter);

  const genres = getAllGenres();
  const keys = getAllKeys();

  return (
    <div className="space-y-2">
      {/* Difficulty */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        <span className="text-[10px] font-mono text-mahogany-500 shrink-0">
          {t("difficulty")}:
        </span>
        {difficulties.map((d) => (
          <button
            key={d}
            onClick={() =>
              setDifficultyFilter(difficultyFilter === d ? null : d)
            }
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition-colors shrink-0 ${
              difficultyFilter === d
                ? "bg-amber-500 text-mahogany-950"
                : "bg-mahogany-800/60 text-mahogany-400 hover:text-mahogany-200"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Genre */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        <span className="text-[10px] font-mono text-mahogany-500 shrink-0">
          {t("genre")}:
        </span>
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setGenreFilter(genreFilter === g ? null : g)}
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition-colors shrink-0 whitespace-nowrap ${
              genreFilter === g
                ? "bg-amber-500 text-mahogany-950"
                : "bg-mahogany-800/60 text-mahogany-400 hover:text-mahogany-200"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Key */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        <span className="text-[10px] font-mono text-mahogany-500 shrink-0">
          {t("key")}:
        </span>
        {keys.map((k) => (
          <button
            key={k}
            onClick={() => setKeyFilter(keyFilter === k ? null : k)}
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition-colors shrink-0 ${
              keyFilter === k
                ? "bg-amber-500 text-mahogany-950"
                : "bg-mahogany-800/60 text-mahogany-400 hover:text-mahogany-200"
            }`}
          >
            {k}
          </button>
        ))}
      </div>
    </div>
  );
}
