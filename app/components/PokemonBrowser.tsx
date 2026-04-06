'use client';

import { useMemo, useState } from 'react';
import { pokeClient } from '../lib/pokemon-client';
import type { GenderEntry } from './Filter';
import { Filter } from './Filter';
import PokemonCard from './PokemonCard';
import SearchInput from './SearchInput';

type PokemonBrowserProps = {
  idsParam: string;
  pokemon: Awaited<ReturnType<typeof pokeClient.pokemon.getPokemonById>>[];
  genderRates: Record<number, number>;
};

export default function PokemonBrowser({
  idsParam,
  pokemon,
  genderRates,
}: PokemonBrowserProps) {
  const [query, setQuery] = useState('');
  const [gender, setGender] = useState<GenderEntry>(null);
  const filteredPokemon = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return pokemon.filter((entry) => {
      if (
        normalizedQuery &&
        !entry.name.toLowerCase().includes(normalizedQuery)
      )
        return false;
      if (gender !== null) {
        const rate = genderRates[entry.id];
        if (rate !== undefined) {
          if (gender === 'male' && rate !== 0) return false;
          if (gender === 'female' && rate !== 8) return false;
          if (gender === 'genderless' && rate !== -1) return false;
          if (gender === 'hybrid' && (rate === -1 || rate === 0 || rate === 8))
            return false;
        }
      }
      return true;
    });
  }, [pokemon, query, gender, genderRates]);

  const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setGender(checked ? (value as GenderEntry) : null);
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        <p className="text-zinc-500 dark:text-zinc-400">
          20 random Pokemon. Search by name to filter the current set.
        </p>
        <SearchInput query={query} onQueryChange={setQuery} />
      </div>
      <Filter handleGenderChange={handleGenderChange} />

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
