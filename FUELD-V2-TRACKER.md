# FUELD v2 — Gym Gamification Tracker

> Turning the calorie tracker into an RPG gym app that makes you compete with yourself.
> Spec: `../fueld-v2.md`. This file is the source of truth for progress. Update as work lands.

## Context / Architecture

- **This repo** = `Fueld-Backend` (NestJS + Mongoose). Frontend is a **separate repo** (`Fueld-Frontend`, React+Vite).
- **Single-user app** — no auth, no `userId`. `UserSettings` is a singleton (`findOne`). All gamification data is global.
- **Design system / nav / animations / fighter card** = frontend work, tracked here for completeness but built in the other repo.

### Backend module dependency rule (avoid circular deps)
- `QuestsService` reads **raw Mongoose models** (LogEntry, WorkoutSession, WeightLog, BodyMeasurement, XPEvent) via `forFeature`, **never sibling services**.
- Mutation services (Logs, Weight, Measurements, Workouts) import `XpModule` + `QuestsModule` and call `xp.award()` / `quests.evaluate()` after writes.
- `XpModule` exports `XpService`; everyone imports it.
- `CharacterModule` reads XPEvent + WorkoutSession + LogEntry + Settings models, computes on the fly (no DB write).

### Core formulas
- **Level**: cumulative XP to *reach* level N = `N*(N+1)/2 * 100` (L1=100, L2=300, L3=600). Current level = max N where threshold(N) ≤ totalXP.
- **Streak**: consecutive active days counting back from today. "Active day" = ≥1 log entry OR ≥1 workout on that date.
- **Decay**: days since last activity. 3 → `decaying` flag; 7 → rank drops one tier.
- **Class** (recalc monthly, from last 30d): mostly gym → Powerlifter; gym+nutrition → Hybrid; nutrition-focus → Endurance Fighter; variety → All-Rounder.
- **Rank** ladder (by level): RECRUIT → SOLDIER → VETERAN → WARRIOR → ELITE → MASTER → APEX.

---

## PHASES

Legend: ☐ todo · ◐ in progress · ☑ done · ⏸ deferred (needs external setup)

### Phase 1 — Schemas & Settings  ☑
- ☑ `XPEvent` schema — `src/xp/schemas/xp-event.schema.ts`
- ☑ `WorkoutSession` schema (+hevyWorkoutId indexed sparse, totalVolume, exercises, prs) — `src/workouts/schemas/`
- ☑ `Quest` schema (+`periodKey`, unique index on key+periodKey) — `src/quests/schemas/`
- ☑ `UserSettings` +characterName, hevyApiKey, googleRefreshToken, pushSubscription, googleHealthConnected; DTO +characterName/hevyApiKey

### Phase 2 — XP engine  ☑
- ☑ `XpService.award()` with daily-once dedup set (`src/xp/xp.constants.ts` → DAILY_ONCE_TYPES)
- ☑ `XpService.totalXp()` (aggregate sum), `recent(limit)`
- ☑ `GET /xp?limit=20`

### Phase 3 — Workouts (manual)  ☑
- ☑ CRUD: `GET /workouts?startDate&endDate`, `GET /workouts/recent`, `POST /workouts`, `DELETE /workouts/:id`
- ☑ `computeXp()`: (80 + 40 Hard/Destroyed) × volumeMultiplier + 200/PR — verified live (Push/Hard = 120)
- ☑ POST returns `{ workout, xpEarned, completedQuests[] }`

### Phase 4 — Quest system  ☑
- ☑ Definitions in `src/quests/quest.definitions.ts` (3 daily / 3 weekly / 3 boss)
- ☑ Lazy generation: `ensureQuests()` upserts current-period docs on evaluate/fetch (daily=today, weekly=Monday, boss=persistent)
- ☑ `evaluate()` → per-key progress vs real data, complete + award XP, returns newly completed
- ☑ `GET /quests`, `POST /quests/evaluate` — verified live (materializes all 9)

### Phase 5 — Character engine  ☑
- ☑ `GET /character` → name, level, title, rank, rankTier, class, streak, longestStreak, decaying, daysSinceActive, xp{...}, stats — verified live
- ☑ Level formula (spec off-by-one fixed: 0 XP = level 1, empty bar), rank ladder, class heuristic, streak+decay
- ☑ Self-check: `character.constants.spec.ts` (3 passing)

### Phase 6 — Wire evaluation into mutations  ☑
- ☑ Food log create → `evaluate()` (protein/calorie target XP folded in) → returns `{ entry, completedQuests }`
- ☑ Weight create → +20 XP + evaluate
- ☑ Measurement create → +50 XP (+200 waist improvement vs prior) + evaluate
- ☑ Streak bonuses (+250 @7, +1000 @30 — fire on exact day) + protein-streak (+150 @10) in `evaluate()`

### Phase 7 — Wiring & build  ☑
- ☑ All modules registered in `AppModule`
- ☑ Quests self-seed on first fetch (skipped explicit SeedService quest seeding — ensureQuests covers it)
- ☑ `nest build` passes; DI graph + all 9 controllers verified booting against live DB

### Phase 8 — Hevy sync  ⏸ (needs HEVY_API_KEY, stored in settings)
- ⏸ `POST /hevy/sync` → GET api.hevyapp.com/v1/workouts, map→WorkoutSession, dedup by hevyWorkoutId, XP+PRs, return {synced,xpEarned,newPRs,completedQuests}

### Phase 9 — Push notifications  ⏸ (needs `web-push` dep + VAPID keys)
- ⏸ `web-push` install, VAPID env, `POST /push/subscribe`, `POST /push/test`, trigger copy

### Phase 10 — Google Health / Fitbit  ⏸ (needs Google Cloud project + OAuth secrets)
- ⏸ OAuth flow `/health/auth` + `/health/callback`, `GET /health/sync`, `GET /health/today`, XP modifiers

### Frontend (separate repo — `Fueld-Frontend`)  ◐
- ☑ Nav restructure HOME/FUEL/GYM/BODY/STATS (`BottomNav.tsx`, `App.tsx` routes). Old Today → `/fuel`; Meals reachable from Fuel header; Foods/Log are sub-routes.
- ☑ API + hooks: `api/{character,quests,xp,workouts}.ts`, `hooks/{useCharacter,useQuests,useWorkouts,useCountUp}.ts`. Gamification invalidation added to log/weight/measurement create hooks.
- ☑ **Fixed breaking contract change**: backend create now returns `{entry, completedQuests}` — `api/{logs,weight,measurements}.ts` create fns unwrap `.entry`.
- ☑ HOME page (`pages/Home.tsx`): FighterCard + attitude copy + QuestList + LevelUpOverlay.
- ☑ Components: `FighterCard` (breathing/decay/momentum states, rank insignia, XP bar, streak flame), `XpBar`, `StreakFlame` (grows 1→30+ tiers), `RankInsignia` (chevron stack by tier), `QuestList` (grouped, progress bars, green particle burst on complete), `LevelUpOverlay` (full-screen slam+shockwave+burn-in, localStorage fires once).
- ☑ GYM page (`pages/Gym.tsx`): manual workout logging (type/intensity/duration/note/date), recent sessions, XP + quest-complete toasts.
- ☑ Animations in `index.css`: breathe, decayPulse, momentumGlow, flameFlicker, xpShine, questBurst, slamIn, shockwave, burnIn (+ reduced-motion guard).
- ☑ `tsc -b` + `vite build` pass.
- ⏸ NOT visually verified in-browser (no browser tool this session) — needs manual eyeball via `npm run dev`.
- ⏸ Hevy/Fitbit connect UI, push permission prompt (blocked on backend phases 8-10)
- ⏸ STATS expansion (XP history graph, rank progression timeline)
- ⏸ Streak-break modal (spec §STREAK: "Streak ended at N days")

---

## ENV VARS (backend)
```
MONGODB_URI=            # existing
HEVY_API_KEY=           # phase 8 (or stored per-user in settings)
GOOGLE_CLIENT_ID=       # phase 10
GOOGLE_CLIENT_SECRET=   # phase 10
GOOGLE_REDIRECT_URI=    # phase 10
VAPID_PUBLIC_KEY=       # phase 9
VAPID_PRIVATE_KEY=      # phase 9
VAPID_EMAIL=            # phase 9
```

## KNOWN SHORTCUTS (ponytail:)
- Dates are UTC (`common/date.util.ts`). Single user → fine; add tz offset if it matters.
- `ensureQuests()` concurrent upserts could rarely E11000 on the same key+period race. Single user, low concurrency — not handled.
- Streak milestone XP fires on the *exact* day streak hits 7/30 (evaluate runs on every mutation, and a milestone day is by definition an active day, so a mutation exists that day).
- Quest XP dedup relies on `quest.completed` flag, not XP-event dedup (quests are unique per period).
- No `userId` anywhere — deliberate, single-user app.

## ⚠️ TEMP CODE — REMOVE BEFORE SHIP
- **Frontend `hooks/useCharacter.ts`** — `PREVIEW_TIER` (forces a rank for preview). Set to `null`.
- **Frontend `components/TodayTraining.tsx`** — `PREVIEW_DATE` (forces a day). Set to `null`.
- **Frontend `App.tsx` + `pages/Variants.tsx`** — `/variants` dev showcase route + page. Remove.
- **Frontend `vite.config.ts`** — `server.allowedHosts: ['.ngrok-free.app']` (dev tunnel only).
- **Frontend `api/client.ts`** — `ngrok-skip-browser-warning` header (inert; drop when done tunneling).
- **Backend `health.controller.ts`** — `GET /health/raw` debug endpoint. Remove.
- **Dormant/unused**: Fitbit module (backend), `SyncBar`, `HealthChips`, `FighterCard`, `BodySVG` (frontend) — delete if not revived.

## LOG
- 2026-07-18: Tracker created. Read spec + codebase.
- 2026-07-18: Phases 1–7 (backend foundation) DONE. New: xp, workouts, quests, character modules; UserSettings extended; XP awarding + quest eval wired into logs/weight/measurements mutations. Build passes, DI + all endpoints verified against live Atlas DB. Level formula off-by-one fixed + unit-tested.
- 2026-07-18: Frontend HOME + GYM + nav restructure DONE (spec build-order items 1,3,5). Fighter card is the emotional core — breathing card, rank insignia, XP bar, streak flame, quest list w/ particle bursts, full-screen level/rank-up takeover. Fixed the create-response contract break. tsc + vite build pass. NOT browser-verified.
  ⚠ DEPLOY COUPLING: frontend now expects the NEW backend (`{entry,completedQuests}` shape + /character,/quests,/xp,/workouts). Render backend is still OLD — deploy backend BEFORE frontend, or frontend breaks.
  Next: manual browser check; then Phase 8 (Hevy) or STATS expansion.
