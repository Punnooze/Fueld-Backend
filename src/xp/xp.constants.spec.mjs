// Self-check for qualifyCardio against real device data. Run: node src/xp/xp.constants.spec.mjs
import assert from 'node:assert';
import { qualifyCardio } from '../../dist/xp/xp.constants.js';

const S = (type, durationMin, distanceKm, activeZoneMinutes, paceSecPerM = null) =>
  ({ type, durationMin, distanceKm, activeZoneMinutes, paceSecPerM });

// dedicated ride (2026-07-19) → qualifies
assert.equal(qualifyCardio([S('BIKING', 27, 5.48, 54)]).qualifies, true);
// single commute (2026-07-18) → NO
assert.equal(qualifyCardio([S('BIKING', 6, 1.17, 5)]).qualifies, false);
// morning commute + gym class day (2026-07-20): Sport qualifies, walk/commute don't
assert.equal(
  qualifyCardio([
    S('BIKING', 9, 0.68, 4),
    S('SPORT', 35, 2.23, 29),
    S('WALKING', 99, 1.14, 4, 5.21),
  ]).qualifies,
  true,
);
// two slow strolls (2026-07-17) → NO
assert.equal(
  qualifyCardio([S('WALKING', 28, 0.75, 2, 2.29), S('WALKING', 27, 0.63, 0, 2.59)]).qualifies,
  false,
);
// brisk walk (2026-07-16, pace 0.87) → qualifies
assert.equal(qualifyCardio([S('WALKING', 14, 1.02, 0, 0.87)]).qualifies, true);
// accumulated commutes: two short rides summing past the day threshold → qualifies
assert.equal(
  qualifyCardio([S('BIKING', 14, 2.2, 6), S('BIKING', 14, 2.1, 6)]).qualifies,
  true,
);

console.log('qualifyCardio: all assertions passed');
