# GuitarHarmony — Product Specification

**Target**: Classical guitar learner, complete beginner  
**Platform**: Mobile-first PWA (Next.js 14, React, TypeScript, Tailwind + shadcn/ui)  
**Aesthetic**: Warm mahogany — dark background, amber/teal/rose for chord qualities, Cormorant Garamond headings, JetBrains Mono for chord names and patterns

-----

## Stage 1 — MVP: Harmony Builder

### Core Concept

The user sees the same diatonic progression tables from the reference images, picks chords from them to assemble a harmony (an ordered chord sequence), notates a strumming pattern per chord, then saves it. Learning happens by reading the chord diagram, then hiding the finger positions and trying to recall from memory.

-----

### Feature 1: Diatonic Progression Tables

The central view of the app. Renders full-screen with horizontal scroll.

**Major table** (from reference image 4):

|Tonalidad|I (Mayor)|ii (menor)|iii (menor)|IV (Mayor)|V (Mayor)|vi (menor)|vii° (dim)|
|---------|---------|----------|-----------|----------|---------|----------|----------|
|C        |C        |Dm        |Em         |F         |G        |Am        |Bdim      |
|D        |D        |Em        |F#m        |G         |A        |Bm        |C#dim     |
|E        |E        |F#m       |G#m        |A         |B        |C#m       |D#dim     |
|F        |F        |Gm        |Am         |Bb        |C        |Dm        |Edim      |
|G        |G        |Am        |Bm         |C         |D        |Em        |F#dim     |
|A        |A        |Bm        |C#m        |D         |E        |F#m       |G#dim     |
|B        |B        |C#m       |D#m        |E         |F#       |G#m       |A#dim     |

**Minor table** (from reference image 5):

|Tonalidad|i (menor)|ii° (dim)|III (Mayor)|iv (menor)|v (menor)|VI (Mayor)|VII (Mayor)|
|---------|---------|---------|-----------|----------|---------|----------|-----------|
|Am       |Am       |Bdim     |C          |Dm        |Em       |F         |G          |
|Bm       |Bm       |C#dim    |D          |Em        |F#m      |G         |A          |
|Cm       |Cm       |Ddim     |Eb         |Fm        |Gm       |Ab        |Bb         |
|Dm       |Dm       |Edim     |F          |Gm        |Am       |Bb        |C          |
|Em       |Em       |F#dim    |G          |Am        |Bm       |C         |D          |
|Fm       |Fm       |Gdim     |Ab         |Bbm       |Cm       |Db        |Eb         |
|Gm       |Gm       |Adim     |Bb         |Cm        |Dm       |Eb        |F          |

**Table UI rules:**

- Key column (`Tonalidad`) is sticky on the left — always visible during horizontal scroll
- Degree column headers are sticky at the top
- Color coding matches the reference images:
  - **Amber** — Major chords (I, IV, V in major; III, VI, VII in minor)
  - **Teal** — Minor chords (ii, iii, vi in major; i, iv, v in minor)
  - **Rose/Crimson** — Diminished chords (vii° in major; ii° in minor)
- Toggle between Major and Minor table at the top of the view
- Key filter pills: tap any key (C, D, E, F, G, A, B) to collapse the table to that row only; “Todas” shows all rows
- **Each cell is tappable** — tapping adds the chord to the current harmony and highlights the cell to show it’s been selected

**Common progressions strip** (horizontal scroll, above the table):
Pre-built buttons that load a full progression into the harmony in one tap. Suggestions:

*Major:* I-IV-V · I-V-vi-IV · I-vi-IV-V · ii-V-I · I-IV-vii°-V  
*Minor:* i-VII-VI · i-iv-v · i-VII-III-VI · i-VI-III-VII · i-ii°-V-i

-----

### Feature 2: Harmony Builder

A named, ordered sequence of chords. Lives in its own tab.

**State per harmony:**

```
name: string
timeSignature: '4/4' | '3/4'
chords: Array<{
  name: string        // e.g. "Am"
  degree: string      // e.g. "vi"
  key: string         // e.g. "C"
  strumPattern: cell[]  // see Strumming
}>
```

**Chord card layout** (one per chord in the sequence):

- Header: chord name, degree/key label, ↑↓ reorder buttons, × remove
- Left: chord diagram (SVG, see Feature 3)
- Right: strumming pattern grid + preset picker

**Controls at top of view:**

- Text input for harmony name
- Time signature toggle: `4/4` / `3/4`
- Clear button

**Save button** (header bar): saves the current harmony to the Saved list. Requires a name and at least one chord.

-----

### Feature 3: Chord Diagrams

Standard 6-string chord box diagram rendered as inline SVG. One per chord card.

**Display elements:**

- 6 vertical lines = strings (E A D G B e, low to high, left to right)
- 4 horizontal fret rows + thick nut line (or position number if chord is above fret 4)
- Filled dots on pressed strings (amber/gold color)
- Barre chord: rounded rectangle spanning the barre strings
- × above muted strings, ○ above open strings
- Finger numbers (1=index, 2=middle, 3=ring, 4=pinky) inside the dots

**Show / Hide finger positions toggle** (global, in header):

- **Show**: full diagram with finger numbers — reference mode
- **Hide**: chord name displayed as large text, diagram replaced by a blank card — memory training mode

The user practices by looking at the chord name and trying to recall the fingering before revealing it.

**Chord data** covers all chords in both tables including barre chords:
C, D, E, F, G, A, B (major) · Am, Bm, Cm, Dm, Em, Fm, Gm (minor) · F#m, C#m, G#m, D#m (barre minors) · F#, Bb, Ab, Eb, Db (accidentals) · Bdim, C#dim, Ddim, Edim, F#dim, Gdim, Adim, G#dim (diminished)

-----

### Feature 4: Strumming Pattern Builder

Each chord in a harmony has an independent strumming pattern.

**Model:** a grid of 8 cells for 4/4, 6 cells for 3/4. Each cell = one **corchea** (♪, eighth note). Groups of two cells = one **negra** (♩, quarter note beat). Visual beat separators between every pair of cells.

**Cell states** (tap to cycle):

|Symbol|Name          |Meaning                       |
|------|--------------|------------------------------|
|`·`   |Silencio      |No strum                      |
|`↓`   |Rasgueo abajo |Downstroke                    |
|`↑`   |Rasgueo arriba|Upstroke                      |
|`✕`   |Chuck         |Muted percussive hit (apagado)|

**Preset patterns** (one tap to apply):

*4/4 presets:*

|Name      |Pattern          |
|----------|-----------------|
|4 Negras  |`↓ · ↓ · ↓ · ↓ ·`|
|8 Corcheas|`↓ ↑ ↓ ↑ ↓ ↑ ↓ ↑`|
|Pop básico|`↓ · ↓ ↑ · ↑ ↓ ↑`|
|Chuck-Down|`✕ ↓ ✕ ↓ ✕ ↓ ✕ ↓`|
|Rasgueo   |`↓ ↓ ↑ ↑ ↓ ↑ · ·`|

*3/4 presets:*

|Name      |Pattern      |
|----------|-------------|
|Vals      |`↓ · · ↑ ↑ ·`|
|3 Negras  |`↓ · ↓ · ↓ ·`|
|6 Corcheas|`↓ ↑ ↓ ↑ ↓ ↑`|
|Chuck 3/4 |`✕ ↓ · ↑ ↓ ↑`|

Note: this model uses **semicorcheas (♬, sixteenth notes)** as the minimum unit implicitly — the user can imply them by placing two consecutive corchea-slot strums without a gap.

-----

### Feature 5: Save & Load Harmonies

**Saved view** (third tab):

- List of saved harmonies, each showing: name, time signature, chord count
- Horizontal scroll preview strip with mini chord diagrams (respects show/hide fingering toggle)
- **Load** button: overwrites current harmony (no confirmation needed for MVP)
- **Delete** button: removes from list

**Persistence:** `localStorage` via Zustand `persist` middleware.

-----

### Navigation

Three-tab bottom navigation:

|Tab      |Icon|Content                    |
|---------|----|---------------------------|
|Tabla    |⊞   |Diatonic progression tables|
|Armonía  |𝄞   |Current harmony builder    |
|Guardadas|◫   |Saved harmonies list       |

Badge on Armonía tab shows current chord count.  
Badge on Guardadas tab shows saved harmony count.

-----

### Data Flow

```
User taps cell in Table
  → chord added to harmony.chords[]
  → tab badge +1
  → toast notification

User taps "Sugerir progresión"
  → harmony.chords[] replaced with suggested degrees in selected key
  → switch to Armonía tab

User builds strum pattern in ChordCard
  → harmony.chords[i].strumPattern updated

User taps Guardar
  → harmony snapshot pushed to savedHarmonies[]
  → persisted to localStorage

User taps Load from Saved
  → harmony state replaced with saved snapshot
  → switch to Armonía tab
```

-----

## Stage 2 — Harmonic Depth

### Feature 6: Chord Inversions & Positions (CAGED System)

**Goal:** the user learns that any chord can be played in multiple places on the neck.

Each chord card gets a position selector: `[ Root | 1st inv | 2nd inv | CAGED-C | CAGED-A | CAGED-G | CAGED-E | CAGED-D ]`

Switching position re-renders the chord diagram with a different voicing of the same chord. The app explains which strings are in the bass (root, 3rd, or 5th) and what changes harmonically.

**Theory explanation per voicing:**

- Root position: root note in bass (most stable)
- 1st inversion: 3rd in bass (lighter feel, good for inner voices)
- 2nd inversion: 5th in bass (unstable, typically a passing chord)

**UI addition:** neck diagram view — a horizontal fretboard (frets 0–12) showing where all positions of the selected chord live. Tapping a position jumps the chord card to that voicing.

-----

### Feature 7: Voice Leading — Efficient Finger Movement

**Goal:** minimize left-hand movement when transitioning between chords in a progression.

For any two adjacent chords in the harmony, the app shows:

- Which fingers stay on the same string (common tones — highlighted green)
- Which fingers move by one fret (step motion — highlighted amber)
- Which fingers jump (skip — highlighted red)
- A “Voice Leading Score” (0–100): higher = smoother transition

**Suggestion engine:** given the current chord sequence, the app suggests alternative voicings for each chord that minimize total finger movement across the whole progression.

**One-finger variations:** for any chord, a panel shows what chord you get by moving each finger up or down by one fret. Example: C → Csus2 (lift finger 1), C → Cadd9 (move finger 1 from B to A string). This teaches chord substitution through physical intuition.

-----

### Feature 8: Strumming Pedagogy — Classical Right Hand

**Goal:** teach right-hand technique specific to classical guitar.

**Fingering notation per strum:** instead of just ↓/↑, each cell can display right-hand finger:

- `p` (pulgar/thumb) — bass strings
- `i` (índice/index)
- `m` (medio/middle)
- `a` (anular/ring)
- `p-i-m-a` arpegio (all four in sequence)

**Arpeggio builder:** a separate mode where instead of a strum pattern, the user builds an arpeggio pattern — which string each finger plucks and in what order. Common classical patterns:

- p-i-m-a (standard)
- p-a-m-i (reverse)
- p-m-i-m (tremolo prep)
- p-i-p-i (alternating bass)

**Tremolo introduction:** p-a-m-i-a-m-i pattern explained step by step.

-----

### Feature 9: Time Signature Composition

**Goal:** understand how harmony shapes musical feel in 3/4 vs 4/4.

**3/4 vs 4/4 comparison view:** side by side, the same I-IV-V progression shown in both time signatures with different strum patterns. The user can hear (or imagine) how the same chords feel different.

**Chord duration within a bar:** each chord in a harmony can span N bars. The user sets duration per chord:

- 1 bar (default)
- 2 bars
- Half bar (shared bar between two chords)

This allows building full 8-bar or 12-bar song structures, not just 4-chord loops.

**Bar view:** the harmony is rendered as a bar-by-bar score (text-based, not notation). Example for 4/4, I-V-vi-IV, 2 bars each:

```
|  G   G   G   G  |  G   G   G   G  |  D   D   D   D  |  D   D   D   D  |
|  Em  Em  Em  Em |  Em  Em  Em  Em |  C   C   C   C  |  C   C   C   C  |
```

-----

-----

## Feature: Songs Library

A fourth navigation tab. Bidirectional: harmony → songs and song → harmony.

-----

### Flow 1 — Harmony → Songs

The user has a harmony (e.g. `Am · F · C · G`). The library finds and ranks all songs that contain those exact chord names, ordered by match score.

**Entry points:**

- From the Harmony tab: a “Find songs” button appears once 2+ chords are in the harmony.
- From the Songs tab: a “Search by harmony” mode where the user picks chords directly.

**What “match” means:**
The match is on **chord names as literal tokens** — `Am`, `F`, `C`, `G`. A song that uses `Am · F · C · G` in its chorus is a strong match. A song that uses `Em · C · G · D` (the same relative progression in a different key) does **not** match by default, because the user is learning specific fingering shapes, not abstract patterns. Roman numerals are shown as informational context (`vi–IV–I–V in C major`) but play no role in scoring.

**Scoring algorithm — three components, all operating on chord name strings:**

```
totalScore = (lcs * 0.55) + (jaccard * 0.25) + (levenshtein * 0.20)
```

1. **Longest Common Contiguous Substring (LCS) — weight 0.55**
   Find the longest contiguous run of matching chord names between the query and a song section sequence. Normalize by query length.
- `["Am","F","C","G"]` vs `["Am","F","C","G","Am","F","C","G"]` → 4/4 = **1.0**
- `["Am","F","C","G"]` vs `["C","G","Am","F","C","G","Am"]` → 4/4 = **1.0** (rotation)
- `["Am","F","C","G"]` vs `["Am","F","G","C","D"]` → 2/4 = **0.5**
1. **Bag-of-chords Jaccard — weight 0.25**
   Treat both sequences as multisets. Score = `|intersection| / |union|`. Captures songs that use the same chord names in a different order.
- `{Am,F,C,G}` vs `{Am,F,C,G,G,G}` → 4/5 = **0.8**
- `{Am,F,C,G}` vs `{Am,C,G,D}` → 3/5 = **0.6**
1. **Levenshtein edit distance — weight 0.20**
   Each chord name is one token. Normalized: `1 - editDistance / max(|query|, |section|)`. Penalizes insertions, deletions, substitutions.

**Rarity weighting:** multiply each matching chord’s contribution by its IDF across the corpus. Common chords (`G`, `C`, `Am`, `D`) contribute less; rare chords (`Bdim`, `G#m`, `Bbm`) contribute more. A match on a rare chord is stronger evidence.

**Per-section scoring:** score every section (Verse, Chorus, Bridge…) of every song independently. A song’s final score = its best-matching section score. The winning section label is shown on the result card so the user knows exactly where the progression appears.

**Optional toggle — “Include transpositions”:** off by default. When on, adds a second pass using Roman-numeral normalization to find songs with the same shape in a different key. Transposition matches receive a –0.15 penalty so exact-key matches always rank first.

-----

### Flow 2 — Song → Harmony

The user picks a song first and explores its structure.

**Song detail view:**

- Header: title, artist, key, BPM, difficulty, time signature, genre tags, capo
- Section tabs: Intro / Verse / Pre-Chorus / Chorus / Bridge / Outro
- **Timeline:** horizontal scrolling bar grid, one cell per bar
  - Large text: chord name (`Am`)
  - Small text below, faded: Roman numeral (`vi`)
  - Color coding matches the rest of the app (amber/teal/rose)
  - Tap a cell → chord diagram popover
- **“Extract as harmony” button:** pushes the current section’s chord list into the Harmony tab

**Bar range selection:** drag across any subset of bars to extract just those chords. Select bars 1–4 of the chorus → those four chords become the current harmony.

**After extraction:** the Harmony tab is pre-populated. The user can swap any chord. A “Find songs” button re-runs Flow 1 immediately — changing one chord surfaces a different set of matching songs. This is the core learning loop: understand why a substitution shifts the song landscape.

-----

### Song data model

```ts
interface Song {
  id: string;                         // "beatles-let-it-be"
  title: string;
  artist: string;
  album?: string;
  year?: number;
  genres: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  key: { tonic: string; mode: "major" | "minor" };
  bpm?: number;
  timeSignature: [number, number];
  capo?: number;
  source: "curated" | "hooktheory" | "user";
  sections: SongSection[];
}

interface SongSection {
  id: string;
  label: "Intro" | "Verse" | "Pre-Chorus" | "Chorus"
       | "Bridge" | "Solo" | "Outro" | "Instrumental";
  index: number;
  bars: SongBar[];
  repeatCount?: number;
  romanNumerals: string[];   // pre-computed at ingest — display only, not used for matching
}

interface SongBar {
  chords: string[];          // chord name strings per beat, e.g. ["Am"] or ["Am","F"]
}
```

`bars[n].chords` is the **sole source of truth for matching** — plain chord name strings. Roman numerals live in `romanNumerals`, are computed at ingest time, and are never touched by the scoring engine.

-----

### Matching engine — implementation sketch

```ts
// lib/matching/score.ts

function scoreSection(query: string[], section: SongSection): number {
  const sectionChords = section.bars.flatMap(b => b.chords);

  const lcs   = longestCommonContiguous(query, sectionChords) / query.length;
  const jacc  = jaccardMultiset(query, sectionChords);
  const edit  = 1 - levenshtein(query, sectionChords)
                    / Math.max(query.length, sectionChords.length);

  const base  = lcs * 0.55 + jacc * 0.25 + edit * 0.20;
  const boost = idfBoost(query, sectionChords);   // additive, capped at +0.10

  return Math.min(1, base + boost);
}

function rankSongs(query: string[], corpus: Song[]): SongMatch[] {
  return corpus
    .flatMap(song =>
      song.sections.map(s => ({ song, section: s, score: scoreSection(query, s) }))
    )
    .filter(m => m.score > 0.25)
    .sort((a, b) => b.score - a.score)
    .reduce<SongMatch[]>((acc, m) => {
      // keep only best-scoring section per song
      if (!acc.find(x => x.song.id === m.song.id)) acc.push(m);
      return acc;
    }, []);
}
```

Runs synchronously in-browser for ≤ 500 songs (< 10 ms). Move to a Web Worker for corpora > 2 000.

-----

### Songs tab UI

**List view:**

- Search bar — free-text by title or artist (`minisearch`, client-side fuzzy)
- Filter chips: Difficulty · Genre · Key · Time Signature · Capo Y/N
- Song cards (virtualized via `@tanstack/react-virtual`):
  - Title + artist · key badge · BPM · difficulty dots (●●○○○)
  - Genre tags
  - Match score bar + matched section label (shown when arriving from a harmony search)
  - Tap → song detail view

**“Search by harmony” mode:**

- Compact chord-picker strip using the same chord names from the progression tables
- Results update in real time as chords are added or removed
- Score shown prominently on each card

-----

### Stack additions for Songs Library

|Concern                      |Package                                |Notes                                                                                                                                      |
|-----------------------------|---------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
|**Matching engine**          |**Rust + `wasm-pack` + `wasm-bindgen`**|**Compiled to WASM, runs in a Web Worker. All algorithm code lives here — no TypeScript fallback for matching.**                           |
|**Worker RPC**               |**`comlink`**                          |**Ergonomic async proxy over `postMessage`. `Comlink.wrap<MatcherAPI>(worker)` turns every Rust export into a typed `Promise`.**           |
|Serde (Rust→JS boundary)     |`serde-wasm-bindgen` 0.6 + `serde_json`|Corpus sent once as JSON string, deserialized in Rust via `serde_json::from_str`. Results returned via `serde_wasm_bindgen::to_value`.     |
|TypeScript type generation   |`tsify` (or `tsify-next`)              |`#[derive(Tsify)]` on Rust structs auto-generates `.d.ts` — no hand-written TS interfaces for `Song`/`SongSection`/`SongBar`/`MatchResult`.|
|Music theory (Rust, optional)|`rust-music-theory` 0.3                |Roman-numeral normalization for the “include transpositions” second pass.                                                                  |
|String distance (Rust)       |`strsim` 0.11                          |`generic_levenshtein(&[T], &[T])` works on chord-name token slices. **Do not use `triple_accel` — it only accepts `&[u8]` bytes.**         |
|Hash maps (Rust)             |`ahash` 0.8                            |`AHashMap` for IDF counts and Jaccard multiset — ~1.5–2× faster than `std::HashMap` on non-adversarial string keys.                        |
|Chord-sheet parsing (ingest) |`chordsheetjs`                         |Parses `.cho` ChordPro files at build time only                                                                                            |
|Roman numerals (display)     |`tonal` — `@tonaljs/progression`       |`toRomanNumerals()` at ingest, stored in `SongSection.romanNumerals`. Never called at query time.                                          |
|Full-text search             |`minisearch`                           |Client-side title + artist fuzzy search, runs on the main thread                                                                           |
|List virtualization          |`@tanstack/react-virtual`              |Song list + bar timeline grid                                                                                                              |
|Live enrichment              |Hooktheory Trends API                  |“Songs containing this progression” fallback when local corpus has < 20 matches                                                            |

**Key decisions baked into this stack:**

- `--target web` (not `bundler`, not `no-modules`) — the only wasm-pack target that works reliably inside a Web Worker in Next.js 14 with Webpack 5.
- The corpus is loaded into the worker **once** via `loadCorpus(json)` and cached as a `Vec<Song>` in a `thread_local! OnceCell<Matcher>`. Each `match(query, topK)` call pays only the cost of the algorithm loop, not deserialization.
- `asyncWebAssembly: true` must be set in `next.config.mjs`’s `webpack()` callback or Webpack 5 throws a parse error on the `.wasm` binary.
- Workers must be created inside `useEffect` in a `"use client"` component — `Worker` is `undefined` during SSR.
- No `SharedArrayBuffer` / COOP / COEP headers needed for a single-threaded matcher.

### Project structure additions

```
# Rust WASM crate — lives outside the Next.js app as a workspace package
/packages/matcher-wasm/
  Cargo.toml                           ← crate-type = ["cdylib","rlib"]; wasm-pack metadata
  src/
    lib.rs                             ← #[wasm_bindgen] exports: set_corpus(), match_songs()
    types.rs                           ← Song, SongSection, SongBar, MatchResult
                                          (#[derive(Tsify, Serialize, Deserialize)])
    matcher.rs                         ← Matcher struct, new(), rank(); thread_local! OnceCell
    algos/
      lcs.rs                           ← lccs<T: Eq>(a: &[T], b: &[T]) → usize
      jaccard.rs                       ← multiset_jaccard using AHashMap
      levenshtein.rs                   ← strsim::generic_levenshtein wrapper, normalized to [0,1]
      idf.rs                           ← IDF pre-computation at Matcher::new(), AHashMap<String,f32>
    roman.rs                           ← optional: chord → Roman numeral via rust-music-theory
  pkg/                                 ← wasm-pack output (gitignored)
    matcher_wasm.js                    ← JS glue; exposes init(), set_corpus(), match_songs()
    matcher_wasm_bg.wasm
    matcher_wasm.d.ts                  ← auto-generated by tsify
    package.json                       ← name: "matcher-wasm", referenced by Next.js workspace

# Next.js app
/app
  /(app)/songs/page.tsx                ← list + harmony search ("use client")
  /(app)/songs/[id]/page.tsx           ← song detail + timeline ("use client")

/workers
  matcher.worker.ts                    ← imports init + set_corpus + match_songs from matcher-wasm
                                          exposes { loadCorpus, match } via Comlink

/components/songs
  SongList.tsx
  SongCard.tsx                         ← shows match score bar + matched section label
  SongFilters.tsx
  HarmonySearchBar.tsx                 ← chord-picker strip for Flow 1
  SongChart/
    SongChart.tsx
    SectionTimeline.tsx                ← horizontal scrolling bar grid
    BarCell.tsx                        ← chord name (large) + Roman numeral (small, faded)
    ChordChip.tsx                      ← tap → ChordDiagram popover
    BarRangeSelector.tsx               ← drag to extract harmony

/lib
  /songs
    ingest.ts                          ← ChordPro → Song JSON + pre-compute romanNumerals (build-time)
    corpus.ts                          ← loads + validates songs.json at runtime
  /workers
    useMatcher.ts                      ← custom hook: creates Worker + Comlink proxy in useEffect,
                                          exposes { loadCorpus, match, isReady }

/data/songs
  songs.json                           ← curated corpus (~200 KB gzipped for 500 songs)
  songs.schema.ts                      ← Zod schema (mirrors Rust types.rs exactly)
  /raw                                 ← source .cho ChordPro files, one per song
```

**Worker file (`workers/matcher.worker.ts`):**

```ts
import * as Comlink from "comlink";
import init, { set_corpus, match_songs } from "matcher-wasm";

let ready: Promise<unknown> | null = null;

const api = {
  async loadCorpus(json: string) {
    if (!ready) ready = init();        // fetch + instantiate the .wasm once
    await ready;
    set_corpus(json);                  // deserialize corpus into Rust Vec<Song>
  },
  async match(query: string[], topK: number) {
    if (!ready) ready = init();
    await ready;
    return match_songs(query, topK);   // returns MatchResult[]
  },
};

export type MatcherAPI = typeof api;
Comlink.expose(api);
```

**`next.config.mjs` addition (required):**

```js
webpack: (config) => {
  config.experiments = { ...config.experiments, asyncWebAssembly: true, layers: true };
  config.output.webassemblyModuleFilename = "static/wasm/[modulehash].wasm";
  return config;
}
```

## Internationalisation (i18n)

Three supported languages: **Español (ES) · English (EN) · Русский (RU)**

The rationale for each:

- **ES** — the vocabulary the guitar tutor uses in lessons; the reference images are in Spanish
- **EN** — internet tutorials, YouTube, library docs, Stack Overflow
- **RU** — native language; useful for grasping theory concepts deeply

### What is translated

|Element                                |Translated|Reason                                  |
|---------------------------------------|----------|----------------------------------------|
|UI labels (tabs, buttons, placeholders)|✅         |Navigation and workflow                 |
|Music theory terms                     |✅         |Most learning value — see glossary below|
|Strumming preset names                 |✅         |Context-sensitive by language           |
|Error / toast messages                 |✅         |Clarity                                 |
|Chord names (Am, Bdim…)                |❌         |Universal notation                      |
|Roman numerals (I, ii, vii°…)          |❌         |Universal notation                      |
|Right-hand finger labels (p i m a)     |❌         |Classical guitar universal notation     |
|Note names (C D E F G A B)             |❌         |Universal in this context               |

### Language switcher

A three-pill toggle in the header: `ES · EN · RU`. Selection persists in `useSettingsStore` (Zustand + localStorage). No URL-based locale routing — locale is a user preference, not a route, so the app stays a single-path PWA without complicating Next.js App Router.

### Music Theory Glossary

The most important translation surface. These terms appear in chord cards, theory explanations, preset names, and Stage 2 educational content.

**Chord qualities:**

|Concept        |Español             |English        |Русский                |
|---------------|--------------------|---------------|-----------------------|
|Major chord    |Acorde mayor        |Major chord    |Мажорный аккорд        |
|Minor chord    |Acorde menor        |Minor chord    |Минорный аккорд        |
|Diminished     |Disminuido          |Diminished     |Уменьшённый            |
|Half-diminished|Semidisminuido      |Half-diminished|Полуменьшённый         |
|Augmented      |Aumentado           |Augmented      |Увеличенный            |
|Suspended      |Suspendido          |Suspended      |Задержанный            |
|Dominant 7th   |Séptima de dominante|Dominant 7th   |Доминантовый септаккорд|

**Scale and harmony:**

|Concept       |Español             |English      |Русский                        |
|--------------|--------------------|-------------|-------------------------------|
|Scale         |Escala              |Scale        |Гамма / Лад                    |
|Major scale   |Escala mayor        |Major scale  |Мажорная гамма                 |
|Natural minor |Escala menor natural|Natural minor|Натуральный минор              |
|Key / Tonality|Tonalidad           |Key          |Тональность                    |
|Tonic         |Tónica              |Tonic        |Тоника                         |
|Subdominant   |Subdominante        |Subdominant  |Субдоминанта                   |
|Dominant      |Dominante           |Dominant     |Доминанта                      |
|Diatonic      |Diatónico           |Diatonic     |Диатонический                  |
|Progression   |Progresión          |Progression  |Прогрессия / Последовательность|
|Cadence       |Cadencia            |Cadence      |Каденция                       |
|Modulation    |Modulación          |Modulation   |Модуляция                      |
|Voice leading |Conducción de voces |Voice leading|Голосоведение                  |
|Inversion     |Inversión           |Inversion    |Обращение                      |

**Rhythm and strumming:**

|Concept          |Español             |English          |Русский          |
|-----------------|--------------------|-----------------|-----------------|
|Whole note       |Redonda             |Whole note       |Целая нота       |
|Half note        |Blanca              |Half note        |Половинная нота  |
|Quarter note     |Negra               |Quarter note     |Четвертная нота  |
|Eighth note      |Corchea             |Eighth note      |Восьмая нота     |
|Sixteenth note   |Semicorchea         |Sixteenth note   |Шестнадцатая нота|
|Rest             |Silencio            |Rest             |Пауза            |
|Bar / Measure    |Compás              |Bar / Measure    |Такт             |
|Time signature   |Indicación de compás|Time signature   |Размер           |
|Beat             |Tiempo              |Beat             |Доля             |
|Downstroke       |Rasgueo abajo       |Downstroke       |Удар вниз        |
|Upstroke         |Rasgueo arriba      |Upstroke         |Удар вверх       |
|Chuck (muted hit)|Chuck / Apagado     |Chuck / Muted hit|Заглушённый удар |
|Arpeggio         |Arpegio             |Arpeggio         |Арпеджио         |
|Tremolo          |Trémolo             |Tremolo          |Тремоло          |
|Strumming pattern|Patrón de rasgueo   |Strumming pattern|Паттерн боя      |

**Right hand (Stage 2):**

|Concept    |Español |English      |Русский           |
|-----------|--------|-------------|------------------|
|Thumb (p)  |Pulgar  |Thumb        |Большой палец     |
|Index (i)  |Índice  |Index finger |Указательный палец|
|Middle (m) |Medio   |Middle finger|Средний палец     |
|Ring (a)   |Anular  |Ring finger  |Безымянный палец  |
|Pluck      |Puntear |Pluck        |Щипок             |
|Rest stroke|Apoyando|Rest stroke  |Апояндо           |
|Free stroke|Tirando |Free stroke  |Тирандо           |
|Nail       |Uña     |Nail         |Ноготь            |

**Fretboard and technique:**

|Concept     |Español                |English     |Русский           |
|------------|-----------------------|------------|------------------|
|Fret        |Traste                 |Fret        |Лад               |
|Nut         |Cejuela                |Nut         |Верхний порожек   |
|Barre chord |Cejilla / Ceja         |Barre chord |Баррэ             |
|Open string |Cuerda al aire         |Open string |Открытая струна   |
|Muted string|Cuerda apagada         |Muted string|Заглушённая струна|
|Position    |Posición               |Position    |Позиция           |
|Neck        |Mástil                 |Neck        |Гриф              |
|Capo        |Cejilla / Cejilla móvil|Capo        |Каподастр         |

### i18n File Structure

```
/messages
  es.json    ← primary (matches tutor vocabulary)
  en.json
  ru.json
```

Each file follows a namespaced flat structure:

```json
{
  "tabs": {
    "table": "Tabla",
    "harmony": "Armonía",
    "saved": "Guardadas"
  },
  "table": {
    "mode_major": "Mayor",
    "mode_minor": "Menor",
    "all_keys": "Todas",
    "common_progressions": "Progresiones comunes"
  },
  "harmony": {
    "name_placeholder": "Nombre de la armonía...",
    "time_signature": "Compás",
    "clear": "Limpiar",
    "save": "Guardar",
    "empty_title": "Sin acordes todavía",
    "empty_hint": "Selecciona acordes en la Tabla"
  },
  "chord_card": {
    "hidden_label": "posición oculta",
    "patterns": "Patrones",
    "hide_patterns": "Ocultar"
  },
  "degrees": {
    "quality_major": "Mayor",
    "quality_minor": "menor",
    "quality_dim": "disminuido"
  },
  "strum_presets": {
    "quarter_notes": "Negras",
    "eighth_notes": "Corcheas",
    "pop_basic": "Pop básico",
    "chuck_down": "Chuck ↓",
    "rasgueado": "Rasgueo",
    "waltz": "Vals",
    "chuck_34": "Chuck 3/4"
  },
  "settings": {
    "show_fingering": "Posiciones",
    "hide_fingering": "Oculto"
  },
  "toast": {
    "chord_added": "+ {{chord}} añadido",
    "progression_loaded": "Cargada: {{name}}",
    "harmony_saved": "✓ Armonía guardada",
    "harmony_loaded": "Cargada: {{name}}",
    "save_error": "⚠ Añade nombre y acordes"
  }
}
```

### Implementation

Library: **`next-intl`** (`npm i next-intl`). Works natively with Next.js 14 App Router. Locale stored in Zustand settings store, not in the URL — the app is a tool, not a content site.

```ts
// stores/useSettingsStore.ts
interface SettingsStore {
  locale: 'es' | 'en' | 'ru';
  showFingering: boolean;
  mode: 'major' | 'minor';
  selectedKey: string | null;
  setLocale: (locale: 'es' | 'en' | 'ru') => void;
}
```

The `useTranslations` hook from `next-intl` is called inside components. Because locale comes from the store rather than the Next.js routing layer, wrap the app with a `NextIntlClientProvider` that receives `locale` and `messages` reactively from the store.

-----

## Technical Architecture

### Stack

|Layer                       |Choice                                      |Reason                                                                               |
|----------------------------|--------------------------------------------|-------------------------------------------------------------------------------------|
|Framework                   |Next.js 14 App Router                       |SSR/SSG, PWA-ready, file routing                                                     |
|Language                    |TypeScript + **Rust**                       |TS for UI/state; Rust for the matching engine                                        |
|Styling                     |Tailwind + shadcn/ui                        |Design tokens + headless components                                                  |
|State                       |Zustand + persist                           |Simple, no boilerplate, localStorage sync                                            |
|i18n                        |`next-intl`                                 |App Router native, locale from store not URL                                         |
|Chord data                  |`@tombatossals/chords-db` (MIT)             |2,141 voicings, 552 chords with MIDI                                                 |
|Chord diagrams              |Custom SVG component                        |Full control over rendering                                                          |
|Music theory (JS)           |`tonal` (MIT)                               |`Key.majorKey()`, `Chord.get()`, Roman numeral display                               |
|**Song matching engine**    |**Rust → WASM via `wasm-pack --target web`**|**LCS + Jaccard + Levenshtein + IDF in Rust, compiled to WASM, runs in a Web Worker**|
|**Worker RPC**              |**`comlink`**                               |**Typed async proxy over `postMessage`; no manual message handling**                 |
|**Serde (Rust/JS boundary)**|**`serde-wasm-bindgen` 0.6 + `serde_json`** |**Corpus sent once as JSON string; results via `serde_wasm_bindgen::to_value`**      |
|Audio (Stage 2+)            |Tone.js + `nbrosowsky/tonejs-instruments`   |Guitar-acoustic samples, CC-BY 3.0                                                   |
|PWA                         |Serwist (`@serwist/next`)                   |Successor to next-pwa, active maintenance                                            |
|Animations                  |Framer Motion                               |Chord card transitions                                                               |

### Codebase Language Rule

**Everything in the codebase is in English**: file names, folder names, routes, component names, function names, variable names, TypeScript types, Rust identifiers, comments, and translation key names. Spanish, English, and Russian are purely runtime values living inside `/messages/*.json`. No Spanish or Russian word ever appears outside those files.

### Project Structure

```
# Root — npm workspaces monorepo
/package.json                         ← workspaces: ["app", "packages/matcher-wasm/pkg"]

# Rust WASM crate
/packages/matcher-wasm/
  Cargo.toml
  src/
    lib.rs                            ← #[wasm_bindgen] exports
    types.rs                          ← Song, SongSection, SongBar, MatchResult (Tsify + Serde)
    matcher.rs                        ← Matcher::new(), rank(); thread_local! OnceCell
    algos/lcs.rs
    algos/jaccard.rs
    algos/levenshtein.rs              ← strsim::generic_levenshtein (NOT triple_accel)
    algos/idf.rs
    roman.rs                          ← optional transposition pass via rust-music-theory
  pkg/                                ← wasm-pack output (gitignored)

# Next.js app
/app
  /(app)/table/page.tsx
  /(app)/harmony/page.tsx
  /(app)/saved/page.tsx
  /(app)/songs/page.tsx               ← song list + harmony search
  /(app)/songs/[id]/page.tsx          ← song detail + timeline
  layout.tsx
  manifest.ts
  next.config.mjs                     ← asyncWebAssembly: true

/workers
  matcher.worker.ts                   ← init() + set_corpus() + match_songs() via Comlink

/messages
  es.json
  en.json
  ru.json

/components
  /chord-diagram/
  /table/
  /harmony/
  /saved/
  /songs/                             ← SongList, SongCard, SongChart/*, HarmonySearchBar
  /settings/LocaleSwitcher.tsx

/lib
  /theory/
  /strum/
  /i18n/
  /songs/
    ingest.ts                         ← ChordPro → Song JSON + pre-compute romanNumerals
    corpus.ts                         ← loads + validates songs.json
  /workers/
    useMatcher.ts                     ← hook: Worker + Comlink proxy in useEffect

/data
  /chords.ts
  /curriculum.ts
  /songs/
    songs.json
    songs.schema.ts                   ← Zod schema mirroring Rust types.rs
    /raw/                             ← source .cho ChordPro files

/stores
  useHarmonyStore.ts
  useSettingsStore.ts                 ← showFingering, mode, selectedKey, locale
```

### Data Models (TypeScript)

```ts
type StrumCell = '' | '↓' | '↑' | '✕';

interface HarmonyChord {
  id: string;
  name: string;       // "Am"
  degree: string;     // "vi"
  key: string;        // "C"
  mode: 'major' | 'minor';
  strumPattern: StrumCell[];
  bars?: number;      // Stage 2
  voicing?: number;   // Stage 2: index into chords-db positions[]
}

interface Harmony {
  id?: string;
  name: string;
  timeSignature: '4/4' | '3/4';
  chords: HarmonyChord[];
  createdAt?: number;
}

interface HarmonyStore {
  current: Harmony;
  saved: Harmony[];
  showFingering: boolean;
  mode: 'major' | 'minor';
  selectedKey: string | null;
  // actions
  addChord: (chord: HarmonyChord) => void;
  removeChord: (id: string) => void;
  moveChord: (id: string, dir: -1 | 1) => void;
  updatePattern: (id: string, pattern: StrumCell[]) => void;
  saveHarmony: () => void;
  loadHarmony: (id: string) => void;
  deleteHarmony: (id: string) => void;
}
```

-----

## Out of Scope (MVP)

- Audio playback — explicitly deferred
- Metronome / tempo
- MIDI input
- User accounts / cloud sync
- Notation export (PDF, MusicXML)
- Microphone-based chord recognition
- Video lessons

-----

## Decisions Log

|Question              |Stage 1                                                          |Stage 2                                                                                                                  |
|----------------------|-----------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------|
|**Keys**              |7 natural keys only (C D E F G A B) matching the reference images|All 12 chromatic keys: add Bb, Eb, Ab, Db, F#/Gb, C#/Db, G#/Ab                                                           |
|**Strumming notation**|Simple ↓ ↑ ✕ direction symbols, one chord = one bar              |Full classical right-hand notation: p i m a finger labels, arpeggio builder, mixed chord durations (½ bar, 1 bar, 2 bars)|
|**Harmony structure** |Flat ordered list of chords                                      |Named sections (Intro, Verso, Estribillo, Puente, Outro) with independent repeat counts per section                      |
|**Chord duration**    |One chord = one bar, fixed                                       |Per-chord duration in bars: ½, 1, 2, 4; two chords can share a bar                                                       |

### What this means concretely

**Stage 1 keeps it minimal so the core loop is fast to build and fast to use:**

- Table shows 7 rows × 7 columns, exactly matching the reference images
- Tap chord → add to flat list → assign ↓↑✕ pattern → save
- No sections, no bar-sharing, no p-i-m-a, no chromatic keys

**Stage 2 adds full compositional power:**

- Table expands to 12 rows; accidentals shown as primary (Bb not A#)
- Each harmony has sections; sections have repeat counts
- ChordCard gets a duration picker (½ · 1 · 2 · 4 bars)
- StrumGrid upgrades to a right-hand finger grid: rows = p/i/m/a, columns = 16th-note subdivisions
- Arpeggio mode: user places one note per finger per subdivision to build classical picking patterns
- Common arpeggio templates: p-i-m-a, p-a-m-i, tremolo (p-a-m-i-a-m-i), alternating bass (p-i-p-m)
- CAGED voicing selector and voice leading engine require all 12 keys to be meaningful