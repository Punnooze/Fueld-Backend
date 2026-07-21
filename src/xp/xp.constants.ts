// XP rewards for tracked actions (spec §XP SYSTEM). Nothing handed out.
export const XP = {
  GYM_SESSION: 80,
  GYM_INTENSITY_BONUS: 40, // Hard or Destroyed
  PR: 200, // per PR
  PROTEIN_TARGET: 40,
  CALORIE_TARGET: 30, // within 100 kcal
  MEASUREMENTS: 50,
  WEIGHT: 20,
  STREAK_7: 250,
  STREAK_30: 1000,
  PROTEIN_STREAK_10: 150,
  WAIST_IMPROVEMENT: 200,
  STEPS_BONUS: 30, // 10k+ steps
  WEEKLY_DISCIPLINED: 250, // ≤1 rest + 4+ active days in a week
  WEIGHT_MILESTONE: 150, // per kg of progress toward goal weight (banked)
  GOAL_REACHED: 1000, // one-time bonus for hitting goal weight
} as const

// Cardio XP scales with Active Zone Minutes (capped). Floor so a qualifying
// low-AZM session (e.g. accumulated commutes) still pays out.
export function cardioXp(azm: number): number {
  return Math.max(20, Math.min(Math.round(azm * 2), 120));
}

// Steps bonus is tiered — more steps, more XP (once/day).
export function stepsXp(steps: number): number {
  if (steps >= 20000) return 100;
  if (steps >= 15000) return 60;
  if (steps >= 12000) return 45;
  if (steps >= 10000) return 30;
  return 0;
}

// What counts as a "cardio" day for XP — tuned from real device data so
// commute cycling / slow strolls don't count, but dedicated efforts do.
export const CARDIO_RULES = {
  // dedicated non-walk/bike sessions (SPORT, RUNNING, classes…)
  session: { minDurationMin: 20, minAzm: 10 },
  // a single bike ride qualifies only if it's substantial (not a commute)
  bike: { minDurationMin: 20, minDistanceKm: 4, minAzm: 15 },
  // multiple short rides in a day (to office + gym) add up
  bikeDayTotal: { minDistanceKm: 4, minDurationMin: 25 },
  // walks must be brisk (pace = seconds per metre; lower = faster) and a real
  // distance; duration is a light floor so a 2-min burst doesn't count
  walk: { maxPaceSecPerM: 1.1, minDistanceKm: 1, minDurationMin: 10 },
} as const;

export type CardioSessionLite = {
  type: string;
  durationMin?: number | null;
  distanceKm?: number | null;
  activeZoneMinutes?: number | null;
  paceSecPerM?: number | null;
};

// Decide whether a day's exercise sessions add up to a cardio day, and the
// total qualifying Active Zone Minutes (for XP). Pure — unit-testable.
export function qualifyCardio(sessions: CardioSessionLite[]): {
  qualifies: boolean;
  azm: number;
} {
  const R = CARDIO_RULES;
  const isWalk = (t: string) => /WALK|HIK/.test(t);
  const isBike = (t: string) => /BIK|CYCL/.test(t);
  let qualifies = false;
  let bikeDist = 0;
  let bikeDur = 0;
  let totalAzm = 0;
  for (const s of sessions) {
    const a = s.activeZoneMinutes ?? 0;
    const dur = s.durationMin ?? 0;
    const dist = s.distanceKm ?? 0;
    totalAzm += a;
    // any single session can make the day cardio (a dedicated ride, a class/
    // run, or a brisk walk); a walk-only day must clear the walk threshold.
    if (isWalk(s.type)) {
      if (
        s.paceSecPerM != null &&
        s.paceSecPerM <= R.walk.maxPaceSecPerM &&
        dist >= R.walk.minDistanceKm &&
        dur >= R.walk.minDurationMin
      ) {
        qualifies = true;
      }
    } else if (isBike(s.type)) {
      bikeDist += dist;
      bikeDur += dur;
      if (
        dur >= R.bike.minDurationMin ||
        dist >= R.bike.minDistanceKm ||
        a >= R.bike.minAzm
      ) {
        qualifies = true;
      }
    } else if (dur >= R.session.minDurationMin || a >= R.session.minAzm) {
      qualifies = true;
    }
  }
  // accumulated commutes: several short rides sum to a real ride
  if (
    !qualifies &&
    (bikeDist >= R.bikeDayTotal.minDistanceKm ||
      bikeDur >= R.bikeDayTotal.minDurationMin)
  ) {
    qualifies = true;
  }
  // once the day qualifies, all sessions' effort counts toward XP
  return { qualifies, azm: qualifies ? totalAzm : 0 };
}

// Hevy session volume multipliers (kg total lifted)
export function volumeMultiplier(totalVolume: number): number {
  if (totalVolume > 15000) return 2;
  if (totalVolume >= 10000) return 1.5;
  if (totalVolume >= 5000) return 1.25;
  return 1;
}

// Event types that may only fire once per date.
export const DAILY_ONCE_TYPES = new Set([
  'protein_target',
  'calorie_target',
  'weight',
  'measurements',
  'streak_7',
  'streak_30',
  'protein_streak_10',
  'waist_improvement',
  'cardio',
  'steps_bonus',
  'weekly_disciplined',
]);
