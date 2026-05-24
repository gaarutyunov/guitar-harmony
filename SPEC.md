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

|Layer           |Choice                                   |Reason                                          |
|----------------|-----------------------------------------|------------------------------------------------|
|Framework       |Next.js 14 App Router                    |SSR/SSG, PWA-ready, file routing                |
|Language        |TypeScript                               |Type safety for chord/theory data               |
|Styling         |Tailwind + shadcn/ui                     |Design tokens + headless components             |
|State           |Zustand + persist                        |Simple, no boilerplate, localStorage sync       |
|**i18n**        |**`next-intl`**                          |**App Router native, locale from store not URL**|
|Chord data      |`@tombatossals/chords-db` (MIT)          |2,141 voicings, 552 chords with MIDI            |
|Chord diagrams  |Custom SVG component                     |Full control over rendering                     |
|Music theory    |`tonal` (MIT)                            |`Key.majorKey()`, `Chord.get()`, scale math     |
|Audio (Stage 2+)|Tone.js + `nbrosowsky/tonejs-instruments`|Guitar-acoustic samples, CC-BY 3.0              |
|PWA             |Serwist (`@serwist/next`)                |Successor to next-pwa, active maintenance       |
|Animations      |Framer Motion                            |Chord card transitions                          |

### Codebase Language Rule

**Everything in the codebase is in English**: file names, folder names, routes, component names, function names, variable names, TypeScript types, comments, and translation key names. Spanish, English, and Russian are purely runtime values living inside `/messages/*.json`. No Spanish or Russian word ever appears outside those files.

### Project Structure

```
/app
  /(app)/table/page.tsx         ← not /tabla
  /(app)/harmony/page.tsx       ← not /armonia
  /(app)/saved/page.tsx         ← not /guardadas
  layout.tsx
  manifest.ts

/messages
  es.json                       ← Spanish translation values
  en.json                       ← English translation values
  ru.json                       ← Russian translation values

/components
  /chord-diagram/               ← ChordDiagram.tsx, ChordDot.tsx, Barre.tsx
  /table/                       ← ProgressionTable.tsx, KeyFilter.tsx, DegreeHeader.tsx
  /harmony/                     ← HarmonyBuilder.tsx, ChordCard.tsx, StrumGrid.tsx
  /saved/                       ← SavedList.tsx, SavedCard.tsx
  /settings/LocaleSwitcher.tsx  ← ES · EN · RU pill toggle in header

/lib
  /theory/                      ← diatonicChords(), chordQuality(), voiceLeading()
  /strum/                       ← presets, serialization
  /i18n/                        ← provider setup, message loader

/data
  /chords.ts                    ← fingering data, position data
  /curriculum.ts                ← progression templates, suggestions

/stores
  useHarmonyStore.ts            ← current harmony + saved harmonies
  useSettingsStore.ts           ← showFingering, mode, selectedKey, locale
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
