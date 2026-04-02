import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import RefreshButton from './components/RefreshButton';
import TypeBadge from './components/TypeBadge';
import { pokeClient } from './lib/pokemon-client';
import { parseIds, randomIds, serializeIds } from './lib/pokemon-utils';

const POKEMON_COUNT = 20;
const MAX_POKEMON_ID = 898;

export default async function Landing(props: PageProps<'/'>) {
  await connection();
  const searchParams = await props.searchParams;
  const ids = parseIds(searchParams.ids, POKEMON_COUNT, MAX_POKEMON_ID);

  if (!ids) {
    redirect(`/?ids=${serializeIds(randomIds(POKEMON_COUNT, MAX_POKEMON_ID))}`);
  }

  const pokemon = await Promise.all(
    ids.map((id) => pokeClient.pokemon.getPokemonById(id)),
  );
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* loop through the random pokemon chars */}
          {pokemon.map((p, i) => (
            <Link
              key={p.id}
              href={{
                pathname: `/pokemon/${p.id}`,
                query: { ids: idsParam },
              }}
              className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col items-center gap-2 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-md transition-all"
            >
              <span className="text-xs text-zinc-400 self-start">
                #{String(p.id).padStart(3, '0')}
              </span>
              <div className="relative w-24 h-24">
                <Image
                  src={p.sprites.front_default ?? ''}
                  alt={p.name}
                  fill
                  className="object-contain group-hover:scale-110 transition-transform"
                  sizes="96px"
                  priority={i === 0}
                  unoptimized
                />
              </div>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 capitalize">
                {p.name}
              </p>
              <div className="flex flex-wrap gap-1 justify-center">
                {p.types.map(({ type }) => (
                  <TypeBadge key={type.name} name={type.name} />
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
