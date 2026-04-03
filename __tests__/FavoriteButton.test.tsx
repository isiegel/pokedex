import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import FavoriteButton from '../app/components/FavoriteButton';
import { FAVORITE_POKEMON_STORAGE_KEY } from '../app/lib/favorite-pokemon';

describe('FavoriteButton', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('adds a pokemon to favorites when clicked', () => {
    render(<FavoriteButton pokemonId={25} pokemonName="pikachu" />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Add pikachu to favorites' }),
    );

    expect(window.localStorage.getItem(FAVORITE_POKEMON_STORAGE_KEY)).toBe(
      '[25]',
    );
    expect(
      screen.getByRole('button', { name: 'Remove pikachu from favorites' }),
    ).toBeDefined();
  });

  it('loads favorite state from localStorage on mount', () => {
    window.localStorage.setItem(FAVORITE_POKEMON_STORAGE_KEY, '[25]');

    render(<FavoriteButton pokemonId={25} pokemonName="pikachu" />);

    expect(
      screen.getByRole('button', { name: 'Remove pikachu from favorites' }),
    ).toBeDefined();
  });
});
