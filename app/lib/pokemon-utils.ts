// random number generator with no dupes (set)
export function randomIds(count: number, max: number): number[] {
  const ids = new Set<number>();
  while (ids.size < count) {
    ids.add(Math.floor(Math.random() * max) + 1);
  }
  return Array.from(ids);
}

export function serializeIds(ids: number[]): string {
  return ids.join(',');
}

export function parseIds(
  value: string | string[] | undefined,
  count: number,
  max: number,
): number[] | null {
  if (!value) return null;

  const source = Array.isArray(value) ? value[0] : value;
  if (!source) return null;

  const ids = source
    .split(',')
    .map((part) => Number(part))
    .filter((id) => Number.isInteger(id) && id >= 1 && id <= max);

  if (ids.length !== count) return null;
  if (new Set(ids).size !== count) return null;

  return ids;
}

// pokemon gender map
export function genderLabel(genderRate: number): string {
  if (genderRate === -1) return 'Genderless';
  if (genderRate === 0) return 'Male only';
  if (genderRate === 8) return 'Female only';
  const femalePct = (genderRate / 8) * 100;
  return `${100 - femalePct}% male / ${femalePct}% female`;
}
