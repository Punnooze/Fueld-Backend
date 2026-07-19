// All dates are YYYY-MM-DD strings in UTC.
// ponytail: UTC-based "today" — fine for a single user; add tz offset if it ever matters.

export function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

export function today(): string {
  return toDateStr(new Date());
}

/** N dates ending today (inclusive), oldest first. */
export function lastNDates(n: number, end = new Date()): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setUTCDate(end.getUTCDate() - i);
    out.push(toDateStr(d));
  }
  return out;
}

/** Monday (UTC) of the week containing `d`, as YYYY-MM-DD. */
export function weekMonday(d = new Date()): string {
  const date = new Date(d);
  const day = date.getUTCDay(); // 0=Sun..6=Sat
  const diff = day === 0 ? 6 : day - 1;
  date.setUTCDate(date.getUTCDate() - diff);
  return toDateStr(date);
}

/** The 7 date strings of the week starting at `monday`. */
export function weekDates(monday: string): string[] {
  const start = new Date(monday);
  return lastNDates(7, new Date(start.getTime() + 6 * 86400000));
}

/**
 * Longest run of consecutive active days ending today.
 * `activeDates` = set of YYYY-MM-DD that count as active.
 */
export function currentStreak(activeDates: Set<string>): number {
  let streak = 0;
  const d = new Date();
  // allow the streak to be "alive" if today isn't logged yet but yesterday was
  if (!activeDates.has(toDateStr(d))) d.setUTCDate(d.getUTCDate() - 1);
  while (activeDates.has(toDateStr(d))) {
    streak++;
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return streak;
}

/**
 * Rest-tolerant streak. A day is "maintained" if active, OR it's a Sunday
 * (gym closed = free), OR it's the single allowed non-Sunday rest in a trailing
 * 7-day window. A 2nd non-Sunday rest inside 7 days breaks it. Today counts as
 * pending (its inactivity won't break the streak until the day passes).
 */
export function restTolerantStreak(activeDates: Set<string>): number {
  const d = new Date();
  if (!activeDates.has(toDateStr(d))) d.setUTCDate(d.getUTCDate() - 1); // today pending
  let streak = 0;
  const window: boolean[] = []; // recent-first: was this a non-Sunday rest?
  for (let i = 0; i < 400; i++) {
    const ds = toDateStr(d);
    const isSunday = d.getUTCDay() === 0;
    const active = activeDates.has(ds);
    if (active) {
      window.unshift(false);
    } else if (isSunday) {
      window.unshift(false); // free day, maintains
    } else {
      const restsInWeek = window.slice(0, 6).filter(Boolean).length + 1;
      if (restsInWeek > 1) break; // 2nd non-Sunday rest within 7 days → broken
      window.unshift(true);
    }
    streak++;
    if (window.length > 7) window.pop();
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return streak;
}

/** Longest streak anywhere in the set (for personal best). */
export function longestStreak(activeDates: Set<string>): number {
  const sorted = [...activeDates].sort();
  let best = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const s of sorted) {
    const cur = new Date(s);
    if (prev && cur.getTime() - prev.getTime() === 86400000) {
      run++;
    } else {
      run = 1;
    }
    if (run > best) best = run;
    prev = cur;
  }
  return best;
}
