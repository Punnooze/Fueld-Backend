import { levelFromXp, xpThreshold } from './character.constants';

describe('level math', () => {
  it('fresh user is level 1 with empty bar', () => {
    expect(levelFromXp(0)).toBe(1);
    expect(xpThreshold(0)).toBe(0); // floor for level 1
    expect(xpThreshold(1)).toBe(100); // needed to reach level 2
  });

  it('advances at the spec thresholds (100, 300, 600)', () => {
    expect(levelFromXp(99)).toBe(1);
    expect(levelFromXp(100)).toBe(2);
    expect(levelFromXp(299)).toBe(2);
    expect(levelFromXp(300)).toBe(3);
    expect(levelFromXp(600)).toBe(4);
  });

  it('floor never exceeds total (no negative progress)', () => {
    for (const xp of [0, 50, 250, 2840, 9999]) {
      const lvl = levelFromXp(xp);
      expect(xpThreshold(lvl - 1)).toBeLessThanOrEqual(xp);
      expect(xpThreshold(lvl)).toBeGreaterThan(xp);
    }
  });
});
