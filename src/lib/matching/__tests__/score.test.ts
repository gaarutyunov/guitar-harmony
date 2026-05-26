import { describe, it, expect } from "vitest";
import { longestCommonContiguous } from "../lcs";
import { jaccardMultiset } from "../jaccard";
import { levenshteinTokens, normalizedLevenshtein } from "../levenshtein";
import { scoreSection, rankSongs } from "../score";
import { Song, SongSection } from "@/types";

describe("longestCommonContiguous", () => {
  it("returns 0 for empty arrays", () => {
    expect(longestCommonContiguous([], [])).toBe(0);
    expect(longestCommonContiguous(["Am"], [])).toBe(0);
  });

  it("finds exact match", () => {
    expect(
      longestCommonContiguous(["Am", "F", "C", "G"], ["Am", "F", "C", "G"]),
    ).toBe(4);
  });

  it("finds partial match", () => {
    expect(
      longestCommonContiguous(
        ["Am", "F", "C", "G"],
        ["Am", "F", "G", "C", "D"],
      ),
    ).toBe(2);
  });

  it("handles repeated patterns", () => {
    expect(
      longestCommonContiguous(
        ["Am", "F", "C", "G"],
        ["Am", "F", "C", "G", "Am", "F", "C", "G"],
      ),
    ).toBe(4);
  });

  it("finds match starting in the middle of b", () => {
    expect(
      longestCommonContiguous(
        ["Am", "F", "C", "G"],
        ["C", "G", "Am", "F", "C", "G", "Am"],
      ),
    ).toBe(4);
  });
});

describe("jaccardMultiset", () => {
  it("returns 0 for empty arrays", () => {
    expect(jaccardMultiset([], [])).toBe(0);
  });

  it("returns 1 for identical sets", () => {
    expect(jaccardMultiset(["Am", "C", "G"], ["Am", "C", "G"])).toBe(1);
  });

  it("handles different multisets", () => {
    const result = jaccardMultiset(
      ["Am", "F", "C", "G"],
      ["Am", "F", "C", "G", "G", "G"],
    );
    expect(result).toBeCloseTo(4 / 6);
  });

  it("handles partial overlap", () => {
    const result = jaccardMultiset(
      ["Am", "F", "C", "G"],
      ["Am", "C", "G", "D"],
    );
    expect(result).toBeCloseTo(3 / 5);
  });

  it("returns 0 for disjoint sets", () => {
    expect(jaccardMultiset(["Am", "C"], ["G", "D"])).toBe(0);
  });
});

describe("levenshtein", () => {
  it("returns 0 for identical sequences", () => {
    expect(levenshteinTokens(["Am", "C", "G"], ["Am", "C", "G"])).toBe(0);
  });

  it("counts single substitution", () => {
    expect(levenshteinTokens(["Am", "C", "G"], ["Am", "D", "G"])).toBe(1);
  });

  it("counts insertion", () => {
    expect(levenshteinTokens(["Am", "G"], ["Am", "C", "G"])).toBe(1);
  });

  it("normalizes correctly", () => {
    expect(normalizedLevenshtein(["Am", "C", "G"], ["Am", "C", "G"])).toBe(1);
    expect(normalizedLevenshtein(["Am"], ["G"])).toBe(0);
  });
});

describe("scoreSection", () => {
  const idf = new Map<string, number>();
  idf.set("Am", 0.5);
  idf.set("C", 0.5);
  idf.set("G", 0.5);
  idf.set("F", 0.5);
  idf.set("Bdim", 2.0);

  function makeSection(chords: string[]): SongSection {
    return {
      id: "test",
      label: "Verse",
      index: 0,
      bars: chords.map((c) => ({ chords: [c] })),
      romanNumerals: chords.map(() => "I"),
    };
  }

  it("returns 0 for empty query", () => {
    expect(scoreSection([], makeSection(["Am", "C"]), idf)).toBe(0);
  });

  it("returns high score for exact match", () => {
    const score = scoreSection(
      ["Am", "F", "C", "G"],
      makeSection(["Am", "F", "C", "G"]),
      idf,
    );
    expect(score).toBeGreaterThan(0.9);
  });

  it("returns moderate score for partial match", () => {
    const score = scoreSection(
      ["Am", "F", "C", "G"],
      makeSection(["Am", "F", "G", "D"]),
      idf,
    );
    expect(score).toBeGreaterThan(0.4);
    expect(score).toBeLessThan(0.9);
  });

  it("returns low score for distant match", () => {
    const score = scoreSection(
      ["Am", "F", "C", "G"],
      makeSection(["Bm", "E", "D", "A"]),
      idf,
    );
    expect(score).toBeLessThan(0.3);
  });
});

describe("rankSongs", () => {
  const testSongs: Song[] = [
    {
      id: "song-1",
      title: "Test Song 1",
      artist: "Test",
      genres: ["rock"],
      difficulty: 1,
      key: { tonic: "C", mode: "major" },
      timeSignature: [4, 4],
      source: "curated",
      sections: [
        {
          id: "s1-v",
          label: "Verse",
          index: 0,
          bars: [
            { chords: ["Am"] },
            { chords: ["F"] },
            { chords: ["C"] },
            { chords: ["G"] },
          ],
          romanNumerals: ["vi", "IV", "I", "V"],
        },
      ],
    },
    {
      id: "song-2",
      title: "Test Song 2",
      artist: "Test",
      genres: ["pop"],
      difficulty: 2,
      key: { tonic: "D", mode: "major" },
      timeSignature: [4, 4],
      source: "curated",
      sections: [
        {
          id: "s2-v",
          label: "Verse",
          index: 0,
          bars: [
            { chords: ["D"] },
            { chords: ["A"] },
            { chords: ["Bm"] },
            { chords: ["G"] },
          ],
          romanNumerals: ["I", "V", "vi", "IV"],
        },
      ],
    },
  ];

  it("returns empty for empty query", () => {
    expect(rankSongs([], testSongs)).toEqual([]);
  });

  it("ranks exact match highest", () => {
    const results = rankSongs(["Am", "F", "C", "G"], testSongs);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].song.id).toBe("song-1");
  });

  it("keeps only best section per song", () => {
    const songsWithMultipleSections: Song[] = [
      {
        id: "multi",
        title: "Multi",
        artist: "Test",
        genres: ["rock"],
        difficulty: 1,
        key: { tonic: "C", mode: "major" },
        timeSignature: [4, 4],
        source: "curated",
        sections: [
          {
            id: "m-v",
            label: "Verse",
            index: 0,
            bars: [{ chords: ["D"] }, { chords: ["E"] }],
            romanNumerals: ["I", "II"],
          },
          {
            id: "m-c",
            label: "Chorus",
            index: 1,
            bars: [
              { chords: ["Am"] },
              { chords: ["F"] },
              { chords: ["C"] },
              { chords: ["G"] },
            ],
            romanNumerals: ["vi", "IV", "I", "V"],
          },
        ],
      },
    ];
    const results = rankSongs(["Am", "F", "C", "G"], songsWithMultipleSections);
    expect(results.length).toBe(1);
    expect(results[0].section.label).toBe("Chorus");
  });
});
