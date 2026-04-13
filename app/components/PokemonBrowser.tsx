'use client';

import { useCallback, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

export default function PokemonBrowser({
  idsParam,
  pokemon,
  genderRates,
}: PokemonBrowserProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const genderParam = searchParams.get('gender') ?? '';
  const genders = genderParam
    ? (genderParam.split(',') as Exclude<GenderEntry, null>[])
    : [];
  const filteredPokemon = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return pokemon.filter((entry) => {
      if (normalizedQuery && !entry.name.toLowerCase().includes(normalizedQuery))
        return false;
      if (genders.length > 0) {
        const rate = genderRates[entry.id];
        if (rate !== undefined) {
          const matches =
            (genders.includes('male') && rate === 0) ||
            (genders.includes('female') && rate === 8) ||
            (genders.includes('genderless') && rate === -1) ||
            (genders.includes('hybrid') && rate !== -1 && rate !== 0 && rate !== 8);
          if (!matches) return false;
        }
      }
      return true;
    });
  }, [pokemon, query, genders, genderRates]);

  const handleGenderChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value, checked } = event.target;
      const params = new URLSearchParams(searchParams.toString());
      const current = params.get('gender')?.split(',').filter(Boolean) ?? [];
      const updated = checked
        ? [...current, value]
        : current.filter((g) => g !== value);
      if (updated.length) {
        params.set('gender', updated.join(','));
      } else {
        params.delete('gender');
      }
      const qs = params.toString();
      router.replace(qs ? `/?${qs}` : '/');
    },
    [router, searchParams],
  );

  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        <p className="text-zinc-500 dark:text-zinc-400">
          20 random Pokemon. Search by name to filter the current set.
        </p>
        <SearchInput query={query} onQueryChange={setQuery} />
      </div>
      <Filter handleGenderChange={handleGenderChange} selectedGenders={genders} />

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
