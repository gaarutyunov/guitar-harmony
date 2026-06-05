'use client';

import { RootLetter, ROOT_LETTERS } from '@/lib/theory/explorer';

interface RootPickerProps {
  value: RootLetter;
  onChange: (root: RootLetter) => void;
}

export function RootPicker({ value, onChange }: RootPickerProps) {
  return (
    <div className="flex gap-1.5">
      {ROOT_LETTERS.map((root) => (
        <button
          key={root}
          onClick={() => onChange(root)}
          className={`flex-1 py-2 rounded-lg font-heading font-bold text-base transition-all active:scale-95 ${
            value === root
              ? 'bg-amber-500 text-mahogany-950'
              : 'bg-mahogany-900/40 text-mahogany-300 hover:bg-mahogany-800/50'
          }`}
        >
          {root}
        </button>
      ))}
    </div>
  );
}
