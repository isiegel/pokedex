'use client';

import { useEffect, useState } from 'react';
import {
  readFavoritePokemonIds,
  toggleFavoritePokemonId,
  writeFavoritePokemonIds,
} from '../lib/favorite-pokemon';

type FavoriteButtonProps = {
  pokemonId: number;
  pokemonName: string;
  className?: string;
};

export default function FavoriteButton({
  pokemonId,
  pokemonName,
  className = '',
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(
      readFavoritePokemonIds(window.localStorage).includes(pokemonId),
    );
  }, [pokemonId]);

  const handleFavoriteClick = () => {
    const currentIds = readFavoritePokemonIds(window.localStorage);
    const nextIds = toggleFavoritePokemonId(currentIds, pokemonId);
    writeFavoritePokemonIds(window.localStorage, nextIds);
    setIsFavorite(nextIds.includes(pokemonId));
  };

  return (
    <button
      type="button"
      aria-label={
        isFavorite
          ? `Remove ${pokemonName} from favorites`
          : `Add ${pokemonName} to favorites`
      }
      aria-pressed={isFavorite}
      onClick={handleFavoriteClick}
      className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${className} ${
        isFavorite
          ? 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-300'
          : 'border-zinc-200 bg-white text-zinc-400 hover:text-rose-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-500'
      }`}
    >
      <span aria-hidden="true" className="text-base leading-none">
        {isFavorite ? '♥' : '♡'}
      </span>
    </button>
  );
}
