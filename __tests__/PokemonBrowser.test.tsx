import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import PokemonBrowser from '../app/components/PokemonBrowser';

vi.mock('../app/components/PokemonCard', () => ({
  default: ({
    pokemon,
  }: {
    pokemon: { id: number; name: string };
  }) => <div data-testid="pokemon-card">{pokemon.name}</div>,
}));

const pokemon = [
  {
    id: 25,
    name: 'pikachu',
    sprites: { front_default: 'pikachu.png' },
    types: [{ type: { name: 'electric' } }],
  },
  {
    id: 132,
    name: 'ditto',
    sprites: { front_default: 'ditto.png' },
    types: [{ type: { name: 'normal' } }],
  },
  {
    id: 29,
    name: 'nidoran-f',
    sprites: { front_default: 'nidoran-f.png' },
    types: [{ type: { name: 'poison' } }],
  },
  {
    id: 81,
    name: 'magnemite',
    sprites: { front_default: 'magnemite.png' },
    types: [{ type: { name: 'electric' } }],
  },
];

const genderRates = {
  25: 4,
  132: -1,
  29: 8,
  81: -1,
};

describe('PokemonBrowser', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the full provided set by default', () => {
    render(
      <PokemonBrowser idsParam="25,132,29,81" pokemon={pokemon} genderRates={genderRates} />,
    );

    expect(screen.getAllByTestId('pokemon-card')).toHaveLength(4);
    expect(screen.getByText('pikachu')).toBeDefined();
    expect(screen.getByText('ditto')).toBeDefined();
  });

  it('filters the current set by a case-insensitive name query', () => {
    render(
      <PokemonBrowser idsParam="25,132,29,81" pokemon={pokemon} genderRates={genderRates} />,
    );

    fireEvent.change(screen.getByPlaceholderText('Search by name...'), {
      target: { value: 'DIT' },
    });

    expect(screen.getAllByTestId('pokemon-card')).toHaveLength(1);
    expect(screen.getByText('ditto')).toBeDefined();
  });

  it('filters to a single explicit gender bucket', () => {
    render(
      <PokemonBrowser idsParam="25,132,29,81" pokemon={pokemon} genderRates={genderRates} />,
    );

    fireEvent.click(screen.getByLabelText('Female'));

    expect(screen.getAllByTestId('pokemon-card')).toHaveLength(1);
    expect(screen.getByText('nidoran-f')).toBeDefined();
  });

  it('shows the empty-state copy when no pokemon match the query', () => {
    render(
      <PokemonBrowser idsParam="25,132,29,81" pokemon={pokemon} genderRates={genderRates} />,
    );

    fireEvent.change(screen.getByPlaceholderText('Search by name...'), {
      target: { value: 'charizard' },
    });

    expect(
      screen.getByText('No Pokemon in this set match "charizard".'),
    ).toBeDefined();
    expect(screen.queryAllByTestId('pokemon-card')).toHaveLength(0);
  });
});
