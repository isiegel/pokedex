import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import PokemonBrowser from './components/PokemonBrowser';
import RefreshButton from './components/RefreshButton';
import { pokeClient } from './lib/pokemon-client';
import { MAX_POKEMON_ID, POKEMON_COUNT } from './lib/pokemon-constants';
import { parseIds, randomIds, serializeIds } from './lib/pokemon-utils';

export default async function Landing(props: PageProps<'/'>) {
  await connection();
  const searchParams = await props.searchParams;
  const ids = parseIds(searchParams.ids, POKEMON_COUNT, MAX_POKEMON_ID);

  if (!ids) {
    redirect(`/?ids=${serializeIds(randomIds(POKEMON_COUNT, MAX_POKEMON_ID))}`);
  }

  const results = await Promise.allSettled(
    ids.map((id) => pokeClient.pokemon.getPokemonById(id)),
  );
  const pokemon = results.flatMap((r) => (r.status === 'fulfilled' ? [r.value] : []));
  const idsParam = serializeIds(ids);

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Pokédex
        </h1>
        <div className="flex items-center gap-4 mb-10">
          <p className="text-zinc-500 dark:text-zinc-400">
            20 random Pokémon — refresh for more
          </p>
          <RefreshButton count={POKEMON_COUNT} max={MAX_POKEMON_ID} />
        </div>
        <PokemonBrowser idsParam={idsParam} pokemon={pokemon} />
      </div>
    </main>
  );
}
