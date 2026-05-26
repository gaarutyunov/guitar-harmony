"use client";

import { useTranslations } from "next-intl";
import { Song, SongMatch } from "@/types";

interface SongCardProps {
  song: Song;
  match?: SongMatch;
  onSelect: (id: string) => void;
}

function DifficultyDots({ level }: { level: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`Difficulty ${level}/5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`inline-block w-1.5 h-1.5 rounded-full ${
            i < level ? "bg-amber-400" : "bg-mahogany-700"
          }`}
        />
      ))}
    </span>
  );
}

export function SongCard({ song, match, onSelect }: SongCardProps) {
  const t = useTranslations("songs");

  return (
    <button
      onClick={() => onSelect(song.id)}
      className="w-full text-left p-3 rounded-xl bg-mahogany-900/60 border border-mahogany-700/30 hover:border-amber-500/30 transition-colors active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-sm text-mahogany-100 truncate">
            {song.title}
          </h3>
          <p className="text-xs font-mono text-mahogany-400 truncate">
            {song.artist}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-mahogany-800/80 text-mahogany-300">
            {song.key.tonic} {song.key.mode === "minor" ? "m" : ""}
          </span>
          <DifficultyDots level={song.difficulty} />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {song.bpm && (
          <span className="text-[10px] font-mono text-mahogany-500">
            {song.bpm} {t("bpm")}
          </span>
        )}
        {song.capo !== undefined && song.capo > 0 && (
          <span className="text-[10px] font-mono text-mahogany-500">
            {t("capo")} {song.capo}
          </span>
        )}
        {song.genres.slice(0, 2).map((g) => (
          <span
            key={g}
            className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-mahogany-800/60 text-mahogany-400"
          >
            {g}
          </span>
        ))}
      </div>

      {match && match.score > 0 && (
        <div className="mt-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-mahogany-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-500 transition-all"
                style={{ width: `${Math.round(match.score * 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-amber-400 w-8 text-right">
              {Math.round(match.score * 100)}%
            </span>
          </div>
          <p className="text-[10px] font-mono text-mahogany-500 mt-0.5">
            {t("matched_section")}: {match.section.label}
          </p>
        </div>
      )}
    </button>
  );
}
