import FavoriteButton from '@/app/components/FavoriteButton';
import JsonLd from '@/app/components/JsonLd';
import TypeBadge from '@/app/components/TypeBadge';
import { pokeClient } from '@/app/lib/pokemon-client';
import { MAX_POKEMON_ID, POKEMON_COUNT } from '@/app/lib/pokemon-constants';
import { genderLabel, parseIds } from '@/app/lib/pokemon-utils';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// automatically used by Next.js to generate the page metadata (title, description, etc.)
export async function generateMetadata(
  props: PageProps<'/pokemon/[id]'>,
): Promise<Metadata> {
  const { id } = await props.params;
  try {
    const pokemon = await pokeClient.pokemon.getPokemonById(Number(id));
    const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    return {
      title: `${name} | Pokédex`,
      description: `View ${name}'s stats, abilities, and details.`,
    };
  } catch {
    return { title: 'Pokémon not found | Pokédex' };
  }
}

export default async function PokemonPage(props: PageProps<'/pokemon/[id]'>) {
  const { id } = await props.params;
  const searchParams = await props.searchParams;
  const ids = parseIds(searchParams.ids, POKEMON_COUNT, MAX_POKEMON_ID);
  // fetch both the pokemon and species data in parallel since they're independent (faster)
  const [pokemon, species] = await Promise.all([
    pokeClient.pokemon.getPokemonById(Number(id)),
    pokeClient.pokemon.getPokemonSpeciesById(Number(id)),
  ]).catch(() => notFound());

  // prefer the high-res official artwork; fall back to the small battle sprite
  const image =
    pokemon.sprites.other?.['official-artwork'].front_default ??
    pokemon.sprites.front_default ??
    '';

  // pick the first English version text entry and normalize whitespace
  const description =
    species.flavor_text_entries
      .find((e) => e.language.name === 'en')
      ?.flavor_text.replace(/[\f\n\r]/g, ' ') ?? '';

  // 255 is the highest possible base stat value in the games, used to scale the bars
  const maxStat = 255;
  // NEXT_PUBLIC_SITE_URL should be set to the deployed origin (e.g. https://my-pokedex.vercel.app)
  const url = `${process.env.NEXT_PUBLIC_SITE_URL ?? ''}/pokemon/${pokemon.id}`;
  const name = pokemon.name;

  // SEO-friendly JSON-LD structured data for the details page
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Thing',
    name,
    description,
    image,
    url,
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-6 py-12">
      <JsonLd data={jsonLd} />
      <div className="max-w-2xl mx-auto">
        <Link
          href={ids ? { pathname: '/', query: { ids: searchParams.ids } } : '/'}
          className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-8 transition-colors"
        >
          ← Back to Pokédex
        </Link>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
          {/* header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-8 border-b border-zinc-100 dark:border-zinc-800">
            <div className="relative w-40 h-40 shrink-0">
              <Image
                src={image}
                alt={pokemon.name}
                fill
                className="object-contain"
                sizes="160px"
                priority
                unoptimized
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-sm text-zinc-400 font-mono mb-1">
                #{String(pokemon.id).padStart(3, '0')}
              </p>
              <div className="mb-3 flex items-center justify-center gap-3 sm:justify-start">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 capitalize">
                  {pokemon.name}
                </h1>
                <FavoriteButton
                  pokemonId={pokemon.id}
                  pokemonName={pokemon.name}
                />
              </div>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {pokemon.types.map(({ type }) => (
                  <TypeBadge key={type.name} name={type.name} size="md" />
                ))}
              </div>
            </div>
          </div>

          {description && (
            <p className="px-8 pt-8 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {description}
            </p>
          )}

          <div className="p-8 grid sm:grid-cols-2 gap-8">
            {/* info */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
                Info
              </h2>
              <dl className="space-y-3">
                {[
                  // PokeAPI stores height in decimetres and weight in hectograms
                  { label: 'Height', value: `${pokemon.height / 10} m` },
                  { label: 'Weight', value: `${pokemon.weight / 10} kg` },
                  { label: 'Gender', value: genderLabel(species.gender_rate) },
                  {
                    label: 'Base XP',
                    value: pokemon.base_experience ?? '—',
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <dt className="text-zinc-500">{label}</dt>
                    <dd className="font-medium text-zinc-800 dark:text-zinc-200">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mt-8 mb-4">
                Abilities
              </h2>
              <ul className="space-y-2">
                {pokemon.abilities.map(({ ability, is_hidden }) => (
                  <li
                    key={ability.name}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="capitalize font-medium text-zinc-800 dark:text-zinc-200">
                      {ability.name.replaceAll('-', ' ')}
                    </span>
                    {is_hidden && (
                      <span className="text-xs text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded px-1.5 py-0.5">
                        hidden
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* stats */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">
                Base Stats
              </h2>
              <ul className="space-y-3">
                {pokemon.stats.map(({ stat, base_stat }) => (
                  <li key={stat.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-zinc-500 capitalize">
                        {stat.name.replace('-', ' ')}
                      </span>
                      <span className="font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                        {base_stat}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-zinc-900 dark:bg-zinc-100 transition-all"
                        style={{ width: `${(base_stat / maxStat) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
