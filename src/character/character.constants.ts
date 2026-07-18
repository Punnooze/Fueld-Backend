// Cumulative XP to advance PAST n levels = n*(n+1)/2 * 100.
// So reaching level 2 costs threshold(1)=100, level 3 costs threshold(2)=300, etc.
// threshold(0)=0 → a fresh user (0 XP) is level 1 with an empty bar.
export function xpThreshold(n: number): number {
  return (n * (n + 1) * 100) / 2;
}

/** Current level: 1 + number of thresholds cleared. */
export function levelFromXp(totalXp: number): number {
  let k = 0;
  while (xpThreshold(k + 1) <= totalXp) k++;
  return k + 1;
}

// Combat ranks, ascending. index = tier.
export const RANKS = [
  { name: 'RECRUIT', minLevel: 1 },
  { name: 'SOLDIER', minLevel: 5 },
  { name: 'VETERAN', minLevel: 10 },
  { name: 'WARRIOR', minLevel: 15 },
  { name: 'ELITE', minLevel: 25 },
  { name: 'MASTER', minLevel: 40 },
  { name: 'APEX', minLevel: 60 },
] as const;

export function rankTierForLevel(level: number): number {
  let tier = 0;
  for (let i = 0; i < RANKS.length; i++) {
    if (level >= RANKS[i].minLevel) tier = i;
  }
  return tier;
}

// Title by level bracket — brutal flavor for the fighter card.
export function titleForLevel(level: number): string {
  if (level < 5) return 'THE UNTESTED';
  if (level < 10) return 'THE IRON APPRENTICE';
  if (level < 15) return 'THE GRINDER';
  if (level < 25) return 'THE RELENTLESS';
  if (level < 40) return 'THE DANGEROUS';
  if (level < 60) return 'THE UNBROKEN';
  return 'THE APEX PREDATOR';
}

export type FighterClass =
  | 'Powerlifter'
  | 'Hybrid'
  | 'Endurance Fighter'
  | 'All-Rounder';

/** Recalculated monthly from last-30d activity mix. */
export function computeClass(
  gymCount: number,
  nutritionDays: number,
  hasBodyTracking: boolean,
): FighterClass {
  if (gymCount >= 8 && nutritionDays < 10) return 'Powerlifter';
  if (gymCount < 4 && nutritionDays >= 15) return 'Endurance Fighter';
  if (gymCount >= 6 && nutritionDays >= 12 && hasBodyTracking)
    return 'All-Rounder';
  return 'Hybrid';
}
