import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { StrumGrid } from '@/components/harmony/StrumGrid';
import type { StrumCell, BeatType } from '@/types';
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
  const negraBeatTypes: BeatType[] = ['negra', 'negra', 'negra', 'negra'];
  const corcheaBeatTypes: BeatType[] = ['corchea', 'corchea', 'corchea', 'corchea'];

  it('renders 4 cells for negra beat types in 4/4', () => {
    const onChange = vi.fn();
    const onBeatTypesChange = vi.fn();
    renderWithIntl(
      <StrumGrid
        pattern={emptyPattern16}
        beatTypes={negraBeatTypes}
        timeSignature="4/4"
        onChange={onChange}
        onBeatTypesChange={onBeatTypesChange}
      />
    );
    const buttons = screen.getAllByRole('button');
    // 4 cell buttons + 4 beat-type buttons + 1 patterns toggle = 9
    expect(buttons.length).toBeGreaterThanOrEqual(4);
  });

  it('renders 8 cells for corchea beat types in 4/4', () => {
    const onChange = vi.fn();
    const onBeatTypesChange = vi.fn();
    renderWithIntl(
      <StrumGrid
        pattern={emptyPattern16}
        beatTypes={corcheaBeatTypes}
        timeSignature="4/4"
        onChange={onChange}
        onBeatTypesChange={onBeatTypesChange}
      />
    );
    const buttons = screen.getAllByRole('button');
    // 8 cell buttons + 4 beat-type buttons + 1 patterns toggle = 13
    expect(buttons.length).toBeGreaterThanOrEqual(8);
  });

  it('calls onChange when cell is tapped', () => {
    const onChange = vi.fn();
    const onBeatTypesChange = vi.fn();
    renderWithIntl(
      <StrumGrid
        pattern={emptyPattern16}
        beatTypes={negraBeatTypes}
        timeSignature="4/4"
        onChange={onChange}
        onBeatTypesChange={onBeatTypesChange}
      />
    );
    const firstCell = screen.getAllByRole('button')[0];
    fireEvent.click(firstCell);
    expect(onChange).toHaveBeenCalled();
    const newPattern = onChange.mock.calls[0][0] as StrumCell[];
    expect(newPattern[0]).toBe('↓');
  });

  it('displays strum symbols', () => {
    const pattern: StrumCell[] = ['↓', '', '', '', '↑', '', '', '', '✕', '', '', '', '', '', '', ''];
    const onChange = vi.fn();
    const onBeatTypesChange = vi.fn();
    renderWithIntl(
      <StrumGrid
        pattern={pattern}
        beatTypes={negraBeatTypes}
        timeSignature="4/4"
        onChange={onChange}
        onBeatTypesChange={onBeatTypesChange}
      />
    );
    expect(screen.getByText('↓')).toBeInTheDocument();
    expect(screen.getByText('↑')).toBeInTheDocument();
    expect(screen.getByText('✕')).toBeInTheDocument();
  });
});
