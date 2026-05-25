"use client";

import { SongSection } from "@/types";
import { BarCell } from "./BarCell";

interface SectionTimelineProps {
  section: SongSection;
  selectedBars?: [number, number] | null;
  onBarSelect?: (index: number) => void;
}

export function SectionTimeline({
  section,
  selectedBars,
  onBarSelect,
}: SectionTimelineProps) {
  function isSelected(index: number): boolean {
    if (!selectedBars) return false;
    const [start, end] = selectedBars;
    return index >= Math.min(start, end) && index <= Math.max(start, end);
  }

  return (
    <div className="overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex gap-1 min-w-min">
        {section.bars.map((bar, i) => (
          <BarCell
            key={i}
            chords={bar.chords}
            romanNumeral={section.romanNumerals[i]}
            index={i}
            isSelected={isSelected(i)}
            onSelect={onBarSelect}
          />
        ))}
      </div>
    </div>
  );
}
