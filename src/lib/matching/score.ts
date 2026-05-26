import { Song, SongSection, SongMatch } from "@/types";
import { longestCommonContiguous } from "./lcs";
import { jaccardMultiset } from "./jaccard";
import { normalizedLevenshtein } from "./levenshtein";
import { computeIdf, idfBoost } from "./idf";

function flattenSection(section: SongSection): string[] {
  return section.bars.flatMap((b) => b.chords);
}

export function scoreSection(
  query: string[],
  section: SongSection,
  idf: Map<string, number>,
): number {
  const sectionChords = flattenSection(section);
  if (query.length === 0 || sectionChords.length === 0) return 0;

  const lcs = longestCommonContiguous(query, sectionChords) / query.length;
  const jacc = jaccardMultiset(query, sectionChords);
  const edit = normalizedLevenshtein(query, sectionChords);

  const base = lcs * 0.55 + jacc * 0.25 + edit * 0.2;
  const boost = idfBoost(query, sectionChords, idf);

  return Math.min(1, base + boost);
}

export function rankSongs(
  query: string[],
  corpus: Song[],
  idf?: Map<string, number>,
): SongMatch[] {
  if (query.length === 0) return [];

  const idfMap = idf ?? computeIdf(corpus);

  return corpus
    .flatMap((song) =>
      song.sections.map((s) => ({
        song,
        section: s,
        score: scoreSection(query, s, idfMap),
      })),
    )
    .filter((m) => m.score > 0.25)
    .sort((a, b) => b.score - a.score)
    .reduce<SongMatch[]>((acc, m) => {
      if (!acc.find((x) => x.song.id === m.song.id)) acc.push(m);
      return acc;
    }, []);
}
