import { MAX_POKEMON_ID, POKEMON_COUNT } from './lib/pokemon-constants';
import { getPokemon, getPokemonSpecies } from './lib/pokemon-client';
import { parseIds, randomIds, serializeIds } from './lib/pokemon-utils';

import Link from 'next/link';
import PokemonBrowser from './components/PokemonBrowser';
import RefreshButton from './components/RefreshButton';
import { connection } from 'next/server';
import { redirect } from 'next/navigation';

export default async function Landing(props: PageProps<'/'>) {
  await connection();
  const searchParams = await props.searchParams;
  const ids = parseIds(searchParams.ids, POKEMON_COUNT, MAX_POKEMON_ID);

  if (!ids) {
    redirect(`/?ids=${serializeIds(randomIds(POKEMON_COUNT, MAX_POKEMON_ID))}`);
  }

  const [pokemon, speciesResults] = await Promise.all([
    Promise.all(ids.map((id) => getPokemon(id))),
    Promise.all(ids.map((id) => getPokemonSpecies(id))),
  ]);
  const genderRates = Object.fromEntries(
    ids.map((id, i) => [id, speciesResults[i].gender_rate]),
  );
  const idsParam = serializeIds(ids);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          <Link
            href="/"
            className="text-zinc-900 dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
          >
            Pokédex
          </Link>
        </h1>
        <RefreshButton count={POKEMON_COUNT} max={MAX_POKEMON_ID} />
        <PokemonBrowser
          idsParam={idsParam}
          pokemon={pokemon}
          genderRates={genderRates}
        />
      </div>
    </main>
  );
}
