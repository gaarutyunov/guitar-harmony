import { StrumCell } from '@/types';
import { ChordPosition } from '@/types';

const OPEN_STRINGS_MIDI = [40, 45, 50, 55, 59, 64]; // E2 A2 D3 G3 B3 E4
const SAMPLE_RATE = 44100;

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function getChordFrequencies(position: ChordPosition): number[] {
  const freqs: number[] = [];
  for (let i = 0; i < 6; i++) {
    const fret = position.frets[i];
    if (fret < 0) continue;
    const actualFret = fret === 0 ? 0 : position.baseFret - 1 + fret;
    freqs.push(midiToFreq(OPEN_STRINGS_MIDI[i] + actualFret));
  }
  return freqs;
}

// ── WAV generation ──

const writeStr = (view: DataView, offset: number, str: string) => {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
};

function samplesToWavBlob(samples: Float32Array): Blob {
  const numSamples = samples.length;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  writeStr(view, 0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeStr(view, 8, 'WAVE');
  writeStr(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(view, 36, 'data');
  view.setUint32(40, numSamples * 2, true);

  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, Math.floor(s * 32767), true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

// ── Sound generation ──

function generateClick(accent: boolean): Float32Array {
  const duration = 0.08;
  const freq = accent ? 1200 : 880;
  const len = Math.floor(SAMPLE_RATE * duration);
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 50);
    out[i] = Math.sin(2 * Math.PI * freq * t) * env * (accent ? 0.8 : 0.5);
  }
  return out;
}

function generateChuck(): Float32Array {
  const duration = 0.06;
  const len = Math.floor(SAMPLE_RATE * duration);
  const out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    out[i] = (Math.random() * 2 - 1) * Math.exp(-t * 80) * 0.5;
  }
  return out;
}

function generateStrum(
  frequencies: number[],
  direction: '↓' | '↑'
): Float32Array {
  const duration = 0.9;
  const len = Math.floor(SAMPLE_RATE * duration);
  const out = new Float32Array(len);
  const strumDelay = 0.015;
  const ordered = direction === '↑' ? [...frequencies].reverse() : frequencies;

  ordered.forEach((freq, si) => {
    const offset = Math.floor(si * strumDelay * SAMPLE_RATE);
    for (let i = offset; i < len; i++) {
      const t = (i - offset) / SAMPLE_RATE;
      const env = Math.exp(-t * 3.5);
      const wave =
        Math.sin(2 * Math.PI * freq * t) +
        Math.sin(2 * Math.PI * freq * 2 * t) * 0.25 +
        Math.sin(2 * Math.PI * freq * 3 * t) * 0.08;
      out[i] += wave * env * 0.12;
    }
  });

  let peak = 0;
  for (let i = 0; i < len; i++) peak = Math.max(peak, Math.abs(out[i]));
  if (peak > 0.95) {
    const scale = 0.9 / peak;
    for (let i = 0; i < len; i++) out[i] *= scale;
  }

  return out;
}

// ── Cache ──

let clickAccentUrl: string | null = null;
let clickNormalUrl: string | null = null;
let chuckUrl: string | null = null;
const strumCache = new Map<string, string>();

function getClickUrl(accent: boolean): string {
  if (accent) {
    if (!clickAccentUrl) {
      clickAccentUrl = URL.createObjectURL(samplesToWavBlob(generateClick(true)));
    }
    return clickAccentUrl;
  }
  if (!clickNormalUrl) {
    clickNormalUrl = URL.createObjectURL(samplesToWavBlob(generateClick(false)));
  }
  return clickNormalUrl;
}

function getChuckUrl(): string {
  if (!chuckUrl) {
    chuckUrl = URL.createObjectURL(samplesToWavBlob(generateChuck()));
  }
  return chuckUrl;
}

function getStrumUrl(frequencies: number[], direction: '↓' | '↑', chordName: string): string {
  const key = `${chordName}_${direction}`;
  let url = strumCache.get(key);
  if (!url) {
    url = URL.createObjectURL(samplesToWavBlob(generateStrum(frequencies, direction)));
    strumCache.set(key, url);
  }
  return url;
}

// ── Playback via HTML Audio ──

function playUrl(url: string): void {
  const audio = new Audio(url);
  audio.volume = 1.0;
  audio.play().catch((e) => console.error('[audio] play error:', e));
}

// ── Public API ──

export function ensureAudioReady(): void {
  getClickUrl(true);
  getClickUrl(false);
  getChuckUrl();
}

export function playMetronomeClick(accent: boolean): void {
  playUrl(getClickUrl(accent));
}

export function playChordStrum(
  frequencies: number[],
  cell: StrumCell,
  chordName: string
): void {
  if (!cell || (cell as string) === '') return;
  if (cell === '✕') {
    playUrl(getChuckUrl());
    return;
  }
  playUrl(getStrumUrl(frequencies, cell as '↓' | '↑', chordName));
}
