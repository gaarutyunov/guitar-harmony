"use client";

function chordQualityColor(chord: string): string {
  if (chord.includes("dim")) return "text-rose-400 border-rose-500/30";
  if (chord.includes("m") && !chord.includes("maj"))
    return "text-teal-400 border-teal-500/30";
  return "text-amber-400 border-amber-500/30";
}

interface BarCellProps {
  chords: string[];
  romanNumeral?: string;
  index: number;
  isSelected: boolean;
  onSelect?: (index: number) => void;
}

export function BarCell({
  chords,
  romanNumeral,
  index,
  isSelected,
  onSelect,
}: BarCellProps) {
  const mainChord = chords[0] ?? "";
  const colorClass = chordQualityColor(mainChord);

  return (
    <button
      onClick={() => onSelect?.(index)}
      className={`flex flex-col items-center justify-center min-w-[56px] h-16 rounded-lg border transition-colors ${
        isSelected
          ? "bg-amber-500/20 border-amber-500/50"
          : `bg-mahogany-900/60 ${colorClass.split(" ")[1]} hover:border-amber-500/40`
      }`}
    >
      <span
        className={`text-sm font-mono font-bold ${colorClass.split(" ")[0]}`}
      >
        {chords.join(" ")}
      </span>
      {romanNumeral && (
        <span className="text-[9px] font-mono text-mahogany-500 mt-0.5">
          {romanNumeral}
        </span>
      )}
    </button>
  );
}
