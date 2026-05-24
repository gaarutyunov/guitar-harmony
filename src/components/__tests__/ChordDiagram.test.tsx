import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChordDiagram } from '@/components/chord-diagram/ChordDiagram';

describe('ChordDiagram', () => {
  it('shows chord name when fingering is hidden', () => {
    render(<ChordDiagram chordName="Am" showFingering={false} />);
    expect(screen.getByText('Am')).toBeInTheDocument();
  });

  it('renders SVG when fingering is shown', () => {
    const { container } = render(<ChordDiagram chordName="Am" showFingering={true} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('shows chord name for unknown chord', () => {
    const { container } = render(<ChordDiagram chordName="Xaug7" showFingering={true} />);
    expect(container.textContent).toContain('Xaug7');
  });

  it('renders small size', () => {
    const { container } = render(<ChordDiagram chordName="C" showFingering={true} size="sm" />);
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('80');
  });
});
