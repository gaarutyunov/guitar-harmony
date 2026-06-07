'use client';

import { useState } from 'react';
import { useSettingsStore } from '@/stores/useSettingsStore';
import {
  RootLetter,
  ToggleQuality,
  formaRootPc,
  transposedSymbol,
} from '@/lib/theory/explorer';
import {
  getBarreVoicing,
  getFamily,
  hasSeventhAlt,
  resolveChord,
} from '@/data/explorer';
import { ChordPosition } from '@/types';
import { RootPicker } from './RootPicker';
import { QualityToggle } from './QualityToggle';
import { ExplorerBoard } from './ExplorerBoard';
import { IntervalRuler } from './IntervalRuler';
import { ShapeFamilyRail } from './ShapeFamilyRail';

export function ChordExplorer() {
  const showFingering = useSettingsStore((s) => s.showFingering);

  const [root, setRoot] = useState<RootLetter>('A');
  const [quality, setQuality] = useState<ToggleQuality>('minor');
  const [altB, setAltB] = useState(false);
  const [useBarre, setUseBarre] = useState(false);
  const [barreFret, setBarreFret] = useState(0);

  const chord = resolveChord(root, quality, altB);
  const family = getFamily(chord.formaId);

  // Resolve the position currently shown on the board.
  let position: ChordPosition;
  let displayRootPc: number;
  let displaySymbol: string;

  if (useBarre && chord.formaId) {
    position = getBarreVoicing(chord, barreFret)!;
    displayRootPc = formaRootPc(chord.formaId, barreFret);
    displaySymbol = transposedSymbol(chord.formaId, barreFret, chord.quality);
  } else if (chord.open) {
    position = chord.open;
    displayRootPc = chord.rootPc;
    displaySymbol = chord.symbol;
  } else {
    // Barre-only chord (F, B, Fm, Bm, Gm, Cm): use the forma at its home fret.
    position = getBarreVoicing(chord, chord.rootFret ?? 0)!;
    displayRootPc = chord.rootPc;
    displaySymbol = chord.symbol;
  }

  function changeRoot(r: RootLetter) {
    setRoot(r);
    setUseBarre(false);
  }

  function changeQuality(q: ToggleQuality) {
    setQuality(q);
    if (q !== 'seventh') setAltB(false);
    // Keep useBarre so major <-> minor at the same barre fret morphs cleanly.
  }

  function selectFret(fret: number) {
    setBarreFret(fret);
    setUseBarre(true);
  }

  function slide(delta: number) {
    const fromFret = useBarre ? barreFret : chord.rootFret ?? 0;
    const next = Math.max(0, Math.min(11, fromFret + delta));
    setBarreFret(next);
    setUseBarre(true);
  }

  return (
    <div className="space-y-4">
      <RootPicker value={root} onChange={changeRoot} />

      <QualityToggle
        value={quality}
        onChange={changeQuality}
        showAlt={hasSeventhAlt(root, quality)}
        alt={altB}
        onAltChange={setAltB}
      />

      <div className="flex flex-col items-center rounded-xl border border-mahogany-800/50 bg-mahogany-950/40 pt-3 pb-1">
        <div className="font-heading font-bold text-2xl text-amber-300 mb-1">
          {displaySymbol}
        </div>
        <ExplorerBoard
          position={position}
          rootPc={displayRootPc}
          quality={chord.quality}
          showFingering={showFingering}
        />
      </div>

      <IntervalRuler quality={chord.quality} />

      <ShapeFamilyRail
        chord={chord}
        family={family}
        useBarre={useBarre}
        barreFret={barreFret}
        onSelectFret={selectFret}
        onSlide={slide}
        onUseOpen={() => setUseBarre(false)}
      />
    </div>
  );
}
