'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { pokeClient } from '../lib/pokemon-client';
import type { GenderEntry } from './Filter';
import { Filter } from './Filter';
import PokemonCard from './PokemonCard';
import { SearchInput } from './SearchInput';

type PokemonBrowserProps = {
  idsParam: string;
  pokemon: Awaited<ReturnType<typeof pokeClient.pokemon.getPokemonById>>[];
  genderRates: Record<number, number>;
};

const parseSelectedGenders = (searchParams: URLSearchParams) => {
  const genderParam = searchParams.get('gender') ?? '';
  return genderParam
    ? (genderParam.split(',').filter(Boolean) as Exclude<GenderEntry, null>[])
    : [];
};

export default function PokemonBrowser({
  idsParam,
  pokemon,
  genderRates,
}: PokemonBrowserProps) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [selectedGenders, setSelectedGenders] = useState<
    Exclude<GenderEntry, null>[]
  >(() => parseSelectedGenders(searchParams));

  useEffect(() => {
    setSelectedGenders(parseSelectedGenders(searchParams));
  }, [searchParams]);

  const genderParam = selectedGenders.join(',');
  const filteredPokemon = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return pokemon.filter((entry) => {
      if (normalizedQuery && !entry.name.toLowerCase().includes(normalizedQuery))
        return false;
      if (selectedGenders.length > 0) {
        const rate = genderRates[entry.id];
        if (rate !== undefined) {
          const matches =
            (selectedGenders.includes('male') && rate === 0) ||
            (selectedGenders.includes('female') && rate === 8) ||
            (selectedGenders.includes('genderless') && rate === -1) ||
            (selectedGenders.includes('hybrid') &&
              rate !== -1 &&
              rate !== 0 &&
              rate !== 8);
          if (!matches) return false;
        }
      }
      return true;
    });
  }, [pokemon, query, selectedGenders, genderRates]);

  const handleGenderChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value, checked } = event.target;
      setSelectedGenders((current) => {
        if (checked) {
          if (current.includes(value as Exclude<GenderEntry, null>)) return current;
          return [...current, value as Exclude<GenderEntry, null>];
        }
        return current.filter((g) => g !== value);
      });
    },
    [],
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedGenders.length > 0) {
      params.set('gender', selectedGenders.join(','));
    } else {
      params.delete('gender');
    }
    const qs = params.toString();
    const nextUrl = qs ? `/?${qs}` : '/';
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (nextUrl !== currentUrl) {
      window.history.replaceState(null, '', nextUrl);
    }
  }, [searchParams, selectedGenders]);

  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        <p className="text-zinc-500 dark:text-zinc-400">
          20 random Pokemon. Search by name to filter the current set.
        </p>
        <SearchInput query={query} onQueryChange={setQuery} />
      </div>
      <Filter
        handleGenderChange={handleGenderChange}
        selectedGenders={selectedGenders}
      />

      {filteredPokemon.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredPokemon.map((entry, index) => (
            <PokemonCard
              key={entry.id}
              idsParam={idsParam}
              genderParam={genderParam}
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
