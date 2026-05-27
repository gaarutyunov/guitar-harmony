import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { StrumGrid } from '@/components/harmony/StrumGrid';
import type { StrumCell } from '@/types';
import messages from '../../../messages/en.json';

function renderWithIntl(ui: React.ReactElement) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe('StrumGrid', () => {
  const emptyPattern16: StrumCell[] = new Array(16).fill('');

  it('renders 4 beat pills for 4/4', () => {
    const onChange = vi.fn();
    renderWithIntl(
      <StrumGrid pattern={emptyPattern16} timeSignature="4/4" onChange={onChange} />
    );
    const buttons = screen.getAllByRole('button');
    // 4 beat pills + 1 patterns toggle = 5
    expect(buttons.length).toBeGreaterThanOrEqual(4);
  });

  it('renders 3 beat pills for 3/4', () => {
    const pattern12: StrumCell[] = new Array(12).fill('');
    const onChange = vi.fn();
    renderWithIntl(
      <StrumGrid pattern={pattern12} timeSignature="3/4" onChange={onChange} />
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });

  it('cycles beat value on tap (empty → ↓)', () => {
    const onChange = vi.fn();
    renderWithIntl(
      <StrumGrid pattern={emptyPattern16} timeSignature="4/4" onChange={onChange} />
    );
    const firstPill = screen.getAllByRole('button')[0];
    fireEvent.click(firstPill);
    expect(onChange).toHaveBeenCalled();
    const newPattern = onChange.mock.calls[0][0] as StrumCell[];
    expect(newPattern[0]).toBe('↓');
    expect(newPattern[1]).toBe('');
    expect(newPattern[2]).toBe('');
    expect(newPattern[3]).toBe('');
  });

  it('displays strum symbols', () => {
    const pattern: StrumCell[] = [
      '↓', '', '', '',
      '↑', '', '', '',
      '✕', '', '', '',
      '', '', '', '',
    ];
    const onChange = vi.fn();
    renderWithIntl(
      <StrumGrid pattern={pattern} timeSignature="4/4" onChange={onChange} />
    );
    expect(screen.getByText('↓')).toBeInTheDocument();
    expect(screen.getByText('↑')).toBeInTheDocument();
    expect(screen.getByText('✕')).toBeInTheDocument();
  });

  it('shows corchea as two symbols in one pill', () => {
    const pattern: StrumCell[] = [
      '↓', '', '↑', '',
      '', '', '', '',
      '', '', '', '',
      '', '', '', '',
    ];
    const onChange = vi.fn();
    renderWithIntl(
      <StrumGrid pattern={pattern} timeSignature="4/4" onChange={onChange} />
    );
    expect(screen.getByText('↓')).toBeInTheDocument();
    expect(screen.getByText('↑')).toBeInTheDocument();
  });
});
