import Image from 'next/image';
import Link from 'next/link';
import { connection } from 'next/server';
import RefreshButton from './components/RefreshButton';
import TypeBadge from './components/TypeBadge';
import { pokeClient } from './lib/pokemon-client';
import { randomIds } from './lib/pokemon-utils';

export default async function Landing() {
  await connection();
  const ids = randomIds(20, 898);
  const pokemon = await Promise.all(
    ids.map((id) => pokeClient.pokemon.getPokemonById(id)),
  );

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
          <RefreshButton />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {/* loop through the random pokemon chars */}
          {pokemon.map((p, i) => (
            <Link
              key={p.id}
              href={`/pokemon/${p.id}`}
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
