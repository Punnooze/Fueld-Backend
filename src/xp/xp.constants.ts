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

// Cardio XP scales with Active Zone Minutes (capped).
export function cardioXp(azm: number): number {
  return Math.min(Math.round(azm * 2), 120);
};

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
