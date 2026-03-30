// random number generator with no dupes (set)
export function randomIds(count: number, max: number): number[] {
  const ids = new Set<number>();
  while (ids.size < count) {
    ids.add(Math.floor(Math.random() * max) + 1);
  }
  return Array.from(ids);
}

// pokemon gender map
export function genderLabel(genderRate: number): string {
  if (genderRate === -1) return 'Genderless';
  if (genderRate === 0) return 'Male only';
  if (genderRate === 8) return 'Female only';
  const femalePct = (genderRate / 8) * 100;
  return `${100 - femalePct}% male / ${femalePct}% female`;
}
