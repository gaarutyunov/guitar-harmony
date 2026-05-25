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
  return freqs;
}

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext)();
    console.log('[audio] Created AudioContext, state:', audioCtx.state,
      'sampleRate:', audioCtx.sampleRate,
      'baseLatency:', audioCtx.baseLatency,
      'destination channels:', audioCtx.destination.maxChannelCount,
      'destination numberOfInputs:', audioCtx.destination.numberOfInputs);
  }
  return audioCtx;
}

export async function ensureAudioContext(): Promise<void> {
  const ctx = getCtx();
  console.log('[audio] ensureAudioContext state before:', ctx.state);
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
  console.log('[audio] ensureAudioContext final:', ctx.state, 'currentTime:', ctx.currentTime);
}

export function ensureAudioContextSync(): void {
  const ctx = getCtx();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
}

// ── Test functions: three different approaches to find what works ──

export function testOscillator(): void {
  try {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();
    console.log('[test-osc] ctx.state:', ctx.state, 'currentTime:', ctx.currentTime);

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 440;
    gain.gain.value = 1.0;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    setTimeout(() => { try { osc.stop(); } catch { /* */ } }, 300);
    console.log('[test-osc] started 440Hz square wave for 300ms, gain=1.0');
  } catch (e) {
    console.error('[test-osc] ERROR:', e);
  }
}

export function testBuffer(): void {
  try {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();
    console.log('[test-buf] ctx.state:', ctx.state);

    const sr = ctx.sampleRate;
    const dur = 0.3;
    const len = Math.floor(sr * dur);
    const buffer = ctx.createBuffer(1, len, sr);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) {
      data[i] = Math.sin(2 * Math.PI * 440 * i / sr) * 0.8;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start();
    console.log('[test-buf] started 440Hz buffer sine for 300ms, samples:', len);
  } catch (e) {
    console.error('[test-buf] ERROR:', e);
  }
}

export function testHtmlAudio(): void {
  try {
    console.log('[test-html] generating WAV...');
    const sampleRate = 44100;
    const duration = 0.5;
    const freq = 440;
    const numSamples = Math.floor(sampleRate * duration);
    const bufferLen = 44 + numSamples * 2;
    const buffer = new ArrayBuffer(bufferLen);
    const view = new DataView(buffer);

    const writeStr = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, numSamples * 2, true);

    for (let i = 0; i < numSamples; i++) {
      const sample = Math.sin(2 * Math.PI * freq * i / sampleRate) * 0.9;
      view.setInt16(44 + i * 2, Math.floor(sample * 32767), true);
    }

    const blob = new Blob([buffer], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.volume = 1.0;
    const playPromise = audio.play();
    if (playPromise) {
      playPromise.then(() => {
        console.log('[test-html] Audio.play() resolved OK');
      }).catch((err: unknown) => {
        console.error('[test-html] Audio.play() REJECTED:', err);
      });
    }
    audio.onended = () => {
      URL.revokeObjectURL(url);
      console.log('[test-html] playback ended');
    };
    audio.onerror = (e) => {
      console.error('[test-html] audio element error:', e);
    };
    console.log('[test-html] created Audio element, calling play(), duration:', duration);
  } catch (e) {
    console.error('[test-html] ERROR:', e);
  }
}

// ── Production audio functions ──

function fadeOut(gain: GainNode, duration: number): void {
  const ctx = gain.context;
  const now = ctx.currentTime;
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(gain.gain.value, now);
  gain.gain.linearRampToValueAtTime(0.0001, now + duration);
}

export function playMetronomeClick(accent: boolean): void {
  try {
    const ctx = getCtx();
    if (ctx.state !== 'running') return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = accent ? 1200 : 880;
    gain.gain.value = accent ? 0.7 : 0.4;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    setTimeout(() => {
      fadeOut(gain, 0.03);
      setTimeout(() => { try { osc.stop(); } catch { /* */ } }, 60);
    }, 50);
  } catch (e) {
    console.error('[audio] metronome ERROR:', e);
  }
}

export function playChordStrum(
  frequencies: number[],
  cell: StrumCell
): void {
  if (!cell || (cell as string) === '') return;
  try {
    const ctx = getCtx();
    if (ctx.state !== 'running') return;

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
      gain.gain.value = 0.4;
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start();
      setTimeout(() => fadeOut(gain, 0.03), 40);
      return;
    }

    const ordered =
      cell === '↓' ? [...frequencies] : [...frequencies].reverse();

    const oscs: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    ordered.forEach((freq, i) => {
      setTimeout(() => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        g.gain.value = 0.18;
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start();
        oscs.push(osc);
        gains.push(g);
      }, i * 12);
    });

    setTimeout(() => {
      gains.forEach((g) => fadeOut(g, 0.3));
      setTimeout(() => {
        oscs.forEach((o) => { try { o.stop(); } catch { /* */ } });
      }, 400);
    }, 500);
  } catch (e) {
    console.error('[audio] strum ERROR:', e);
  }
}
