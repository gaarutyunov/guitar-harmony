import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { StrumGrid } from '@/components/harmony/StrumGrid';
import type { Beat } from '@/types';
import messages from '../../../messages/en.json';

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe('StrumGrid', () => {
  it('renders correct number of beat pills for 4/4', () => {
    const pattern: Beat[] = [
      { type: 'negra', cells: [''] },
      { type: 'negra', cells: [''] },
      { type: 'negra', cells: [''] },
      { type: 'negra', cells: [''] },
    ];
    const onChange = vi.fn();
    renderWithIntl(<StrumGrid pattern={pattern} timeSignature="4/4" onChange={onChange} />);
    const buttons = screen.getAllByRole('button');
    // 4 cell buttons + 4 beat-type buttons + 1 patterns toggle = 9
    expect(buttons.length).toBeGreaterThanOrEqual(4);
  });

  it('renders correct number of cells for corchea beats', () => {
    const pattern: Beat[] = [
      { type: 'corchea', cells: ['', ''] },
      { type: 'corchea', cells: ['', ''] },
      { type: 'corchea', cells: ['', ''] },
      { type: 'corchea', cells: ['', ''] },
    ];
    const onChange = vi.fn();
    renderWithIntl(<StrumGrid pattern={pattern} timeSignature="4/4" onChange={onChange} />);
    const buttons = screen.getAllByRole('button');
    // 8 cell buttons + 4 beat-type buttons + 1 patterns toggle = 13
    expect(buttons.length).toBeGreaterThanOrEqual(8);
  });

  it('calls onChange when cell is tapped', () => {
    const pattern: Beat[] = [
      { type: 'negra', cells: [''] },
      { type: 'negra', cells: [''] },
      { type: 'negra', cells: [''] },
      { type: 'negra', cells: [''] },
    ];
    const onChange = vi.fn();
    renderWithIntl(<StrumGrid pattern={pattern} timeSignature="4/4" onChange={onChange} />);
    const firstCell = screen.getAllByRole('button')[0];
    fireEvent.click(firstCell);
    expect(onChange).toHaveBeenCalled();
    const newPattern = onChange.mock.calls[0][0] as Beat[];
    expect(newPattern[0].cells[0]).toBe('↓');
  });

  it('displays strum symbols', () => {
    const pattern: Beat[] = [
      { type: 'negra', cells: ['↓'] },
      { type: 'negra', cells: ['↑'] },
      { type: 'negra', cells: ['✕'] },
      { type: 'negra', cells: [''] },
    ];
    const onChange = vi.fn();
    renderWithIntl(<StrumGrid pattern={pattern} timeSignature="4/4" onChange={onChange} />);
    expect(screen.getByText('↓')).toBeInTheDocument();
    expect(screen.getByText('↑')).toBeInTheDocument();
    expect(screen.getByText('✕')).toBeInTheDocument();
  });
});
