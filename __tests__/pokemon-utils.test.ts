import { afterEach, describe, expect, it, vi } from 'vitest';
import { genderLabel, randomIds } from '../app/lib/pokemon-utils';

describe('genderLabel', () => {
  it('returns Genderless for -1', () => {
    expect(genderLabel(-1)).toBe('Genderless');
  });

  it('returns Male only for 0', () => {
    expect(genderLabel(0)).toBe('Male only');
  });

  it('returns Female only for 8', () => {
    expect(genderLabel(8)).toBe('Female only');
  });

  it('returns correct split for gender_rate 1 (mostly male)', () => {
    // 1/8 female → 12.5% female, 87.5% male
    expect(genderLabel(1)).toBe('87.5% male / 12.5% female');
  });

  it('returns 50/50 split for gender_rate 4', () => {
    expect(genderLabel(4)).toBe('50% male / 50% female');
  });

  it('returns correct split for gender_rate 7 (mostly female)', () => {
    // 7/8 female → 87.5% female, 12.5% male
    expect(genderLabel(7)).toBe('12.5% male / 87.5% female');
  });
});

describe('randomIds', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns exactly count ids', () => {
    expect(randomIds(5, 100)).toHaveLength(5);
  });

  it('returns no duplicates', () => {
    const ids = randomIds(20, 898);
    expect(new Set(ids).size).toBe(20);
  });

  it('all ids are within [1, max]', () => {
    const ids = randomIds(15, 50);
    for (const id of ids) {
      expect(id).toBeGreaterThanOrEqual(1);
      expect(id).toBeLessThanOrEqual(50);
    }
  });

  it('works when count equals max (all ids must be covered)', () => {
    const ids = randomIds(5, 5);
    expect(ids.sort()).toEqual([1, 2, 3, 4, 5]);
  });
});
