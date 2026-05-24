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
  it('renders correct number of cells for 4/4', () => {
    const pattern: StrumCell[] = ['', '', '', '', '', '', '', ''];
    const onChange = vi.fn();
    renderWithIntl(<StrumGrid pattern={pattern} timeSignature="4/4" onChange={onChange} />);
    const buttons = screen.getAllByRole('button');
    // 8 cells + 1 patterns toggle button
    expect(buttons.length).toBeGreaterThanOrEqual(8);
  });

  it('renders correct number of cells for 3/4', () => {
    const pattern: StrumCell[] = ['', '', '', '', '', ''];
    const onChange = vi.fn();
    renderWithIntl(<StrumGrid pattern={pattern} timeSignature="3/4" onChange={onChange} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(6);
  });

  it('calls onChange when cell is tapped', () => {
    const pattern: StrumCell[] = ['', '', '', '', '', '', '', ''];
    const onChange = vi.fn();
    renderWithIntl(<StrumGrid pattern={pattern} timeSignature="4/4" onChange={onChange} />);
    const firstCell = screen.getAllByRole('button')[0];
    fireEvent.click(firstCell);
    expect(onChange).toHaveBeenCalledWith(['↓', '', '', '', '', '', '', '']);
  });

  it('displays strum symbols', () => {
    const pattern: StrumCell[] = ['↓', '↑', '✕', '', '', '', '', ''];
    const onChange = vi.fn();
    renderWithIntl(<StrumGrid pattern={pattern} timeSignature="4/4" onChange={onChange} />);
    expect(screen.getByText('↓')).toBeInTheDocument();
    expect(screen.getByText('↑')).toBeInTheDocument();
    expect(screen.getByText('✕')).toBeInTheDocument();
  });
});
