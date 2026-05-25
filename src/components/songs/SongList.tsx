"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useSongsStore } from "@/stores/useSongsStore";
import { SongCard } from "./SongCard";
import { SongFilters } from "./SongFilters";
import { HarmonySearchBar } from "./HarmonySearchBar";

export function SongList() {
  const t = useTranslations("songs");
  const textSearch = useSongsStore((s) => s.textSearch);
  const setTextSearch = useSongsStore((s) => s.setTextSearch);
  const selectSong = useSongsStore((s) => s.selectSong);
  const results = useSongsStore((s) => s.results);
  const query = useSongsStore((s) => s.query);
  const isSearchMode = useSongsStore((s) => s.isSearchMode);
  const setSearchMode = useSongsStore((s) => s.setSearchMode);
  const getFilteredSongs = useSongsStore((s) => s.getFilteredSongs);
  const [showFilters, setShowFilters] = useState(false);

  const filteredSongs = useMemo(() => getFilteredSongs(), [getFilteredSongs]);

  const matchMap = useMemo(() => {
    const map = new Map<string, (typeof results)[0]>();
    for (const r of results) {
      map.set(r.song.id, r);
    }
    return map;
  }, [results]);

  const displaySongs =
    isSearchMode && query.length >= 2
      ? results.map((r) => r.song)
      : filteredSongs;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg text-mahogany-100">{t("title")}</h2>
        <button
          onClick={() => setSearchMode(!isSearchMode)}
          className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
            isSearchMode
              ? "bg-amber-500 text-mahogany-950"
              : "bg-mahogany-800/60 text-mahogany-400 hover:text-mahogany-200"
          }`}
        >
          {isSearchMode ? t("browse_mode") : t("search_by_harmony")}
        </button>
      </div>

      {/* Harmony search mode */}
      {isSearchMode && <HarmonySearchBar />}

      {/* Text search */}
      {!isSearchMode && (
        <input
          type="text"
          value={textSearch}
          onChange={(e) => setTextSearch(e.target.value)}
          placeholder={t("search_placeholder")}
          className="w-full px-3 py-2 rounded-lg bg-mahogany-900/60 border border-mahogany-700/30 text-mahogany-100 text-sm font-mono placeholder:text-mahogany-600 focus:outline-none focus:border-amber-500/50"
        />
      )}

      {/* Filters toggle */}
      {!isSearchMode && (
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="text-[10px] font-mono text-mahogany-500 hover:text-mahogany-300 transition-colors"
        >
          {showFilters ? t("hide_filters") : t("show_filters")}
        </button>
      )}

      {showFilters && !isSearchMode && <SongFilters />}

      {/* Results count */}
      <p className="text-[10px] font-mono text-mahogany-600">
        {displaySongs.length} {t("songs_count")}
      </p>

      {/* Song list */}
      <div className="space-y-2 pb-4">
        {displaySongs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm font-heading text-mahogany-400">
              {t("no_results")}
            </p>
            {isSearchMode && (
              <p className="text-xs font-mono text-mahogany-600 mt-1">
                {t("no_results_hint")}
              </p>
            )}
          </div>
        ) : (
          displaySongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              match={matchMap.get(song.id)}
              onSelect={selectSong}
            />
          ))
        )}
      </div>
    </div>
  );
}
