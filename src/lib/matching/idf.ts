import { Song } from "@/types";

export function computeIdf(corpus: Song[]): Map<string, number> {
  const docCount = new Map<string, number>();
  const totalDocs = corpus.length;

  for (const song of corpus) {
    const chordsInSong = new Set<string>();
    for (const section of song.sections) {
      for (const bar of section.bars) {
        for (const chord of bar.chords) {
          chordsInSong.add(chord);
        }
      }
    }
    chordsInSong.forEach((chord) => {
      docCount.set(chord, (docCount.get(chord) ?? 0) + 1);
    });
  }

  const idf = new Map<string, number>();
  docCount.forEach((count, chord) => {
    idf.set(chord, Math.log(totalDocs / count));
  });

  return idf;
}

export function idfBoost(
  query: string[],
  sectionChords: string[],
  idf: Map<string, number>,
): number {
  const sectionSet = new Set(sectionChords);
  const matchingChords = query.filter((c) => sectionSet.has(c));
  if (matchingChords.length === 0) return 0;

  let totalIdf = 0;
  for (const chord of matchingChords) {
    totalIdf += idf.get(chord) ?? 0;
  }

  const avgIdf = totalIdf / matchingChords.length;
  let maxIdf = 1;
  idf.forEach((v) => {
    if (v > maxIdf) maxIdf = v;
  });
  const normalized = avgIdf / maxIdf;

  return Math.min(0.1, normalized * 0.1);
}
