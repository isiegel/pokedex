import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import TypeBadge from '../app/components/TypeBadge';

describe('TypeBadge', () => {
  afterEach(cleanup);

  it('renders the type name', () => {
    render(<TypeBadge name="fire" />);
    expect(screen.getByText('fire')).toBeDefined();
  });

  it('applies the correct color class for a known type', () => {
    const { container } = render(<TypeBadge name="fire" />);
    expect((container.firstChild as HTMLElement).className).toContain('orange');
  });

  it('falls back to zinc classes for an unknown type', () => {
    const { container } = render(<TypeBadge name="unknown" />);
    expect((container.firstChild as HTMLElement).className).toContain('zinc');
  });

  it('uses small padding by default (size sm)', () => {
    const { container } = render(<TypeBadge name="water" />);
    expect((container.firstChild as HTMLElement).className).toContain('px-2');
  });

  it('uses larger padding for size="md"', () => {
    const { container } = render(<TypeBadge name="water" size="md" />);
    expect((container.firstChild as HTMLElement).className).toContain('px-3');
  });

  it('renders each known type without throwing', () => {
    const types = [
      'fire', 'water', 'grass', 'electric', 'psychic', 'ice',
      'dragon', 'dark', 'fairy', 'normal', 'fighting', 'flying',
      'poison', 'ground', 'rock', 'bug', 'ghost', 'steel',
    ];
    for (const type of types) {
      expect(() => render(<TypeBadge name={type} />)).not.toThrow();
      cleanup();
    }
  });
});
