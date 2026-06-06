import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { ChordExplorer } from '@/components/explorer/ChordExplorer';
import { getMessages } from '@/lib/i18n/messages';

function renderExplorer() {
  return render(
    <NextIntlClientProvider locale="en" messages={getMessages('en')}>
      <ChordExplorer />
    </NextIntlClientProvider>,
  );
}

describe('ChordExplorer', () => {
  it('renders the default chord (Am) with a fretboard', () => {
    const { container } = renderExplorer();
    expect(screen.getAllByText('Am').length).toBeGreaterThan(0);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('switches quality and updates the séptima ruler', () => {
    renderExplorer();
    fireEvent.click(screen.getByText('7th'));
    // Am -> Am7: the m7 rule mentions the flat-7 a whole tone below the octave.
    expect(screen.getByText(/whole tone below the octave/i)).toBeInTheDocument();
  });

  it('exposes the B seventh alternate voicings (Bm7b5 / Bdim7)', () => {
    renderExplorer();
    fireEvent.click(screen.getByRole('button', { name: 'B' }));
    fireEvent.click(screen.getByText('7th'));
    expect(screen.getAllByText('Bm7(♭5)').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Bdim7').length).toBeGreaterThan(0);
  });

  it('toggles note-name visualization when the chord is pressed', () => {
    renderExplorer();
    const board = screen.getByRole('button', { name: 'Show notes' });
    fireEvent.click(board);
    expect(
      screen.getByRole('button', { name: 'Show fingering' }),
    ).toBeInTheDocument();
  });

  it('shows the shape family so chords can slide up the neck', () => {
    renderExplorer();
    // default Am is part of the A-shape minor family Am -> Bm -> Cm
    expect(screen.getByRole('button', { name: 'Bm' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cm' })).toBeInTheDocument();
  });
});
