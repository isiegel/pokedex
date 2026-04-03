'use client';

import { useMemo, useState } from 'react';
import { pokeClient } from '../lib/pokemon-client';
import PokemonCard from './PokemonCard';
import SearchInput from './SearchInput';

type PokemonBrowserProps = {
  idsParam: string;
  pokemon: Awaited<ReturnType<typeof pokeClient.pokemon.getPokemonById>>[];
};

export default function PokemonBrowser({
  idsParam,
  pokemon,
}: PokemonBrowserProps) {
  const [query, setQuery] = useState('');

  const filteredPokemon = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return pokemon;

    return pokemon.filter((entry) =>
      entry.name.toLowerCase().includes(normalizedQuery),
    );
  }, [pokemon, query]);

  return (
    <>
      <div className="mb-10 flex items-center gap-4">
        <p className="text-zinc-500 dark:text-zinc-400">
          20 random Pokemon. Search by name to filter the current set.
        </p>
        <SearchInput query={query} onQueryChange={setQuery} />
      </div>

      {filteredPokemon.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredPokemon.map((entry, index) => (
            <PokemonCard
              key={entry.id}
              idsParam={idsParam}
              pokemon={entry}
              priority={index === 0}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-zinc-200 bg-white px-4 py-6 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          No Pokemon in this set match "{query.trim()}".
        </p>
      )}
    </>
  );
}
