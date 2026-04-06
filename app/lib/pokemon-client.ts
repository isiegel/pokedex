import { cache } from 'react';
import { MainClient } from "pokenode-ts";

// shared pokenode-ts client — instantiated once (singleton) so the built-in
// axios-cache-interceptor cache is reused across all server requests
export const pokeClient = new MainClient();

export const getPokemon = cache((id: number) =>
  pokeClient.pokemon.getPokemonById(id),
);

export const getPokemonSpecies = cache((id: number) =>
  pokeClient.pokemon.getPokemonSpeciesById(id),
);
