export const FAVORITE_POKEMON_STORAGE_KEY = 'favoritePokemonIds';

export function readFavoritePokemonIds(storage: Storage): number[] {
  const rawValue = storage.getItem(FAVORITE_POKEMON_STORAGE_KEY);
  if (!rawValue) return [];

  try {
    const parsed = JSON.parse(rawValue);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (value): value is number =>
        Number.isInteger(value) && value >= 1,
    );
  } catch {
    return [];
  }
}

export function writeFavoritePokemonIds(storage: Storage, ids: number[]) {
  storage.setItem(FAVORITE_POKEMON_STORAGE_KEY, JSON.stringify(ids));
}

export function toggleFavoritePokemonId(ids: number[], id: number): number[] {
  if (ids.includes(id)) {
    return ids.filter((value) => value !== id);
  }

  return [...ids, id];
}
