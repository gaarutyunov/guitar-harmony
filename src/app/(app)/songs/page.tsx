"use client";

import { useSongsStore } from "@/stores/useSongsStore";
import { SongList } from "@/components/songs/SongList";
import { SongDetail } from "@/components/songs/SongDetail";

export default function SongsPage() {
  const selectedSongId = useSongsStore((s) => s.selectedSongId);

  if (selectedSongId) {
    return <SongDetail />;
  }

  return <SongList />;
}
