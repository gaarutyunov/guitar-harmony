import { StrumCell } from '@/types';
import { ChordPosition } from '@/types';

const OPEN_STRINGS_MIDI = [40, 45, 50, 55, 59, 64]; // E2 A2 D3 G3 B3 E4

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
  console.log('[audio] getChordFrequencies frets=', position.frets, 'baseFret=', position.baseFret, '→ freqs=', freqs);
  return freqs;
}

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    console.log('[audio] Created AudioContext, state:', audioCtx.state, 'sampleRate:', audioCtx.sampleRate);
  }
  return audioCtx;
}

export async function ensureAudioContext(): Promise<void> {
  const ctx = getCtx();
  console.log('[audio] ensureAudioContext state before resume:', ctx.state);
  if (ctx.state === 'suspended') {
    await ctx.resume();
    console.log('[audio] ensureAudioContext state after resume:', ctx.state);
  }
  console.log('[audio] ensureAudioContext final state:', ctx.state, 'currentTime:', ctx.currentTime);
}

export function playMetronomeClick(accent: boolean): void {
  try {
    const ctx = getCtx();
    console.log('[audio] playMetronomeClick accent=', accent, 'ctx.state=', ctx.state, 'currentTime=', ctx.currentTime);
    if (ctx.state !== 'running') {
      console.warn('[audio] playMetronomeClick SKIPPED — ctx not running:', ctx.state);
      return;
    }
    const now = ctx.currentTime + 0.005;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = accent ? 1200 : 880;
    gain.gain.setValueAtTime(accent ? 0.6 : 0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
    console.log('[audio] playMetronomeClick SCHEDULED at', now);
  } catch (e) {
    console.error('[audio] playMetronomeClick ERROR:', e);
  }
}

export function playChordStrum(
  frequencies: number[],
  cell: StrumCell
): void {
  console.log('[audio] playChordStrum cell=', JSON.stringify(cell), 'freqs count=', frequencies.length);
  if (!cell || (cell as string) === '') {
    console.log('[audio] playChordStrum SKIPPED — empty cell');
    return;
  }
  try {
    const ctx = getCtx();
    if (ctx.state !== 'running') {
      console.warn('[audio] playChordStrum SKIPPED — ctx not running:', ctx.state);
      return;
    }
    const now = ctx.currentTime + 0.005;

    if (cell === '✕') {
      const bufferSize = Math.floor(ctx.sampleRate * 0.05);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 600;
      filter.Q.value = 2;
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start(now);
      console.log('[audio] playChordStrum CHUCK scheduled at', now);
      return;
    }

    const ordered =
      cell === '↓' ? [...frequencies] : [...frequencies].reverse();
    const strumDelay = 0.012;

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
      harmonicGain.gain.setValueAtTime(0.04, t);
      harmonicGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

      osc.connect(gain);
      harmonicOsc.connect(harmonicGain);
      gain.connect(ctx.destination);
      harmonicGain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.8);
      harmonicOsc.start(t);
      harmonicOsc.stop(t + 0.8);
    });
    console.log('[audio] playChordStrum SCHEDULED', ordered.length, 'notes, cell=', cell, 'at', now);
  } catch (e) {
    console.error('[audio] playChordStrum ERROR:', e);
  }
}
