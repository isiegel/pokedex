import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSearchParams } from 'next/navigation';
import PokemonBrowser from '../app/components/PokemonBrowser';

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}));

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

// pikachu: hybrid (rate 4), ditto: genderless (rate -1),
// nidoran-f: female (rate 8), magnemite: genderless (rate -1)
const genderRates = {
  25: 4,
  132: -1,
  29: 8,
  81: -1,
};

const mockReplaceState = vi.spyOn(window.history, 'replaceState');

function renderBrowser(searchParamsString = '') {
  vi.mocked(useSearchParams).mockReturnValue(
    new URLSearchParams(searchParamsString) as ReturnType<typeof useSearchParams>,
  );
  return render(
    <PokemonBrowser idsParam="25,132,29,81" pokemon={pokemon} genderRates={genderRates} />,
  );
}

describe('PokemonBrowser', () => {
  beforeEach(() => {
    mockReplaceState.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders the full provided set by default', () => {
    renderBrowser();

    expect(screen.getAllByTestId('pokemon-card')).toHaveLength(4);
    expect(screen.getByText('pikachu')).toBeDefined();
    expect(screen.getByText('ditto')).toBeDefined();
  });

  it('filters the current set by a case-insensitive name query', () => {
    renderBrowser();

    fireEvent.change(screen.getByPlaceholderText('Search by name...'), {
      target: { value: 'DIT' },
    });

    expect(screen.getAllByTestId('pokemon-card')).toHaveLength(1);
    expect(screen.getByText('ditto')).toBeDefined();
  });

  it('filters to a single gender bucket when gender is set in URL', () => {
    renderBrowser('gender=female');

    expect(screen.getAllByTestId('pokemon-card')).toHaveLength(1);
    expect(screen.getByText('nidoran-f')).toBeDefined();
  });

  it('filters to multiple gender buckets when multiple genders are set in URL', () => {
    renderBrowser('gender=female,genderless');

    // nidoran-f (female), ditto and magnemite (genderless)
    expect(screen.getAllByTestId('pokemon-card')).toHaveLength(3);
    expect(screen.getByText('nidoran-f')).toBeDefined();
    expect(screen.getByText('ditto')).toBeDefined();
    expect(screen.getByText('magnemite')).toBeDefined();
  });

  it('checking a gender checkbox updates the URL gender param', () => {
    renderBrowser();

    fireEvent.click(screen.getByLabelText('Female'));

    expect(mockReplaceState).toHaveBeenCalledWith(null, '', '/?gender=female');
  });

  it('checking a second gender checkbox appends to the existing param in URL', () => {
    renderBrowser('gender=female');

    fireEvent.click(screen.getByLabelText('Genderless'));

    expect(mockReplaceState).toHaveBeenCalledWith(
      null,
      '',
      '/?gender=female%2Cgenderless',
    );
  });

  it('unchecking a gender checkbox removes it from URL param', () => {
    renderBrowser('gender=female,genderless');

    fireEvent.click(screen.getByLabelText('Female'));

    expect(mockReplaceState).toHaveBeenCalledWith(null, '', '/?gender=genderless');
  });

  it('unchecking the only active gender checkbox removes URL param entirely', () => {
    renderBrowser('gender=female');

    fireEvent.click(screen.getByLabelText('Female'));

    expect(mockReplaceState).toHaveBeenCalledWith(null, '', '/');
  });

  it('shows the empty-state copy when no pokemon match the query', () => {
    renderBrowser();

    fireEvent.change(screen.getByPlaceholderText('Search by name...'), {
      target: { value: 'charizard' },
    });

    expect(
      screen.getByText('No Pokemon in this set match "charizard".'),
    ).toBeDefined();
    expect(screen.queryAllByTestId('pokemon-card')).toHaveLength(0);
  });
});
