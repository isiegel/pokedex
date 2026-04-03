'use client';

import Link from 'next/link';
import Image from 'next/image';
import FavoriteButton from './FavoriteButton';
import TypeBadge from './TypeBadge';

type CardPokemon = {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
};

type PokemonCardProps = {
  idsParam: string;
  pokemon: CardPokemon;
  priority?: boolean;
};

export default function PokemonCard({
  idsParam,
  pokemon,
  priority = false,
}: PokemonCardProps) {
  return (
    <div className="relative">
      <Link
        href={{
          pathname: `/pokemon/${pokemon.id}`,
          query: { ids: idsParam },
        }}
        className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col items-center gap-2 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-md transition-all"
      >
        <span className="text-xs text-zinc-400 self-start">
          #{String(pokemon.id).padStart(3, '0')}
        </span>
        <div className="relative w-24 h-24">
          <Image
            src={pokemon.sprites.front_default ?? ''}
            alt={pokemon.name}
            fill
            className="object-contain group-hover:scale-110 transition-transform"
            sizes="96px"
            priority={priority}
            unoptimized
          />
        </div>
        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 capitalize">
          {pokemon.name}
        </p>
        <div className="flex flex-wrap gap-1 justify-center">
          {pokemon.types.map(({ type }) => (
            <TypeBadge key={type.name} name={type.name} />
          ))}
        </div>
      </Link>

      <FavoriteButton
        pokemonId={pokemon.id}
        pokemonName={pokemon.name}
        className="absolute right-3 top-3"
      />
    </div>
  );
}
