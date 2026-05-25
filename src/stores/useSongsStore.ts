import { create } from "zustand";
import { Song, SongMatch } from "@/types";
import { songs as corpus } from "@/data/songs/songs";
import { rankSongs, computeIdf } from "@/lib/matching";

type GenreFilter = string;
type DifficultyFilter = 1 | 2 | 3 | 4 | 5;

interface SongsState {
  query: string[];
  textSearch: string;
  selectedSongId: string | null;
  results: SongMatch[];
  difficultyFilter: DifficultyFilter | null;
  genreFilter: GenreFilter | null;
  keyFilter: string | null;
  isSearchMode: boolean;

  setQuery: (query: string[]) => void;
  setTextSearch: (text: string) => void;
  selectSong: (id: string | null) => void;
  setDifficultyFilter: (d: DifficultyFilter | null) => void;
  setGenreFilter: (g: GenreFilter | null) => void;
  setKeyFilter: (k: string | null) => void;
  setSearchMode: (on: boolean) => void;
  search: () => void;
  clearFilters: () => void;
  getFilteredSongs: () => Song[];
  getSong: (id: string) => Song | undefined;
}

const idfMap = computeIdf(corpus);

export const useSongsStore = create<SongsState>()((set, get) => ({
  query: [],
  textSearch: "",
  selectedSongId: null,
  results: [],
  difficultyFilter: null,
  genreFilter: null,
  keyFilter: null,
  isSearchMode: false,

  setQuery: (query) => {
    set({ query });
    if (query.length >= 2) {
      const results = rankSongs(query, corpus, idfMap);
      set({ results });
    } else {
      set({ results: [] });
    }
  },

  setTextSearch: (text) => set({ textSearch: text }),

  selectSong: (id) => set({ selectedSongId: id }),

  setDifficultyFilter: (d) => set({ difficultyFilter: d }),
  setGenreFilter: (g) => set({ genreFilter: g }),
  setKeyFilter: (k) => set({ keyFilter: k }),
  setSearchMode: (on) => set({ isSearchMode: on }),

  search: () => {
    const { query } = get();
    if (query.length >= 2) {
      const results = rankSongs(query, corpus, idfMap);
      set({ results });
    }
  },

  clearFilters: () =>
    set({
      difficultyFilter: null,
      genreFilter: null,
      keyFilter: null,
      textSearch: "",
    }),

  getFilteredSongs: () => {
    const { textSearch, difficultyFilter, genreFilter, keyFilter } = get();
    let filtered = [...corpus];

    if (textSearch.trim()) {
      const lower = textSearch.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(lower) ||
          s.artist.toLowerCase().includes(lower),
      );
    }

    if (difficultyFilter !== null) {
      filtered = filtered.filter((s) => s.difficulty === difficultyFilter);
    }

    if (genreFilter !== null) {
      filtered = filtered.filter((s) => s.genres.includes(genreFilter));
    }

    if (keyFilter !== null) {
      filtered = filtered.filter((s) => s.key.tonic === keyFilter);
    }

    return filtered;
  },

  getSong: (id) => corpus.find((s) => s.id === id),
}));

export function getAllGenres(): string[] {
  const genres = new Set<string>();
  for (const song of corpus) {
    for (const g of song.genres) genres.add(g);
  }
  return Array.from(genres).sort();
}

export function getAllKeys(): string[] {
  const keys = new Set<string>();
  for (const song of corpus) keys.add(song.key.tonic);
  return Array.from(keys).sort();
}
