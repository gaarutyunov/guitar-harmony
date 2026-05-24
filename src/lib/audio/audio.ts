import { StrumCell } from '@/types';
import { ChordPosition } from '@/types';

const OPEN_STRINGS_MIDI = [40, 45, 50, 55, 59, 64]; // E2 A2 D3 G3 B3 E4

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

export function getChordFrequencies(
  position: ChordPosition
): number[] {
  const freqs: number[] = [];
  for (let i = 0; i < 6; i++) {
    const fret = position.frets[i];
    if (fret < 0) continue;
    const actualFret = fret === 0 ? 0 : position.baseFret - 1 + fret;
    freqs.push(midiToFreq(OPEN_STRINGS_MIDI[i] + actualFret));
  }
  return freqs;
}

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function ensureAudioContext(): void {
  getCtx();
}

export function playMetronomeClick(accent: boolean): void {
  const ctx = getCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = accent ? 1200 : 880;
  gain.gain.setValueAtTime(accent ? 0.35 : 0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.06);
}

export function playChordStrum(
  frequencies: number[],
  cell: StrumCell
): void {
  if (!cell || (cell as string) === '') return;
  const ctx = getCtx();
  const now = ctx.currentTime;

  if (cell === '✕') {
    const bufferSize = Math.floor(ctx.sampleRate * 0.04);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 600;
    filter.Q.value = 2;
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start(now);
    return;
  }

  const ordered =
    cell === '↓' ? [...frequencies] : [...frequencies].reverse();
  const strumDelay = 0.008;

  ordered.forEach((freq, i) => {
    const t = now + i * strumDelay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;

    const harmonicOsc = ctx.createOscillator();
    const harmonicGain = ctx.createGain();
    harmonicOsc.type = 'sine';
    harmonicOsc.frequency.value = freq * 2;
    harmonicGain.gain.setValueAtTime(0.02, t);
    harmonicGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    gain.gain.setValueAtTime(0.07, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

    osc.connect(gain);
    harmonicOsc.connect(harmonicGain);
    gain.connect(ctx.destination);
    harmonicGain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.6);
    harmonicOsc.start(t);
    harmonicOsc.stop(t + 0.6);
  });
}
