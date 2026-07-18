import {
  BadRequestException,
  HttpException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuestsService } from '../quests/quests.service';
import { SettingsService } from '../settings/settings.service';
import { XP } from '../xp/xp.constants';
import { XpService } from '../xp/xp.service';
import {
  WorkoutSession,
  WorkoutSessionDocument,
} from '../workouts/schemas/workout-session.schema';
import { WorkoutsService } from '../workouts/workouts.service';

interface HevySet {
  weight_kg?: number | null;
  reps?: number | null;
}
interface HevyExercise {
  title: string;
  sets: HevySet[];
}
interface HevyWorkout {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  exercises: HevyExercise[];
}

const HEVY_API = 'https://api.hevyapp.com/v1';
const MAX_PAGES = 5;
const WINDOW_DAYS = 30;

@Injectable()
export class HevyService {
  constructor(
    @InjectModel(WorkoutSession.name)
    private workoutModel: Model<WorkoutSessionDocument>,
    private readonly settingsService: SettingsService,
    private readonly workoutsService: WorkoutsService,
    private readonly xpService: XpService,
    private readonly questsService: QuestsService,
  ) {}

  private intensityFor(volume: number): string {
    if (volume > 10000) return 'Destroyed';
    if (volume > 5000) return 'Hard';
    return 'Medium';
  }

  private async fetchWorkouts(
    key: string,
    days = WINDOW_DAYS,
    maxPages = MAX_PAGES,
  ): Promise<HevyWorkout[]> {
    const cutoff = Date.now() - days * 86400000;
    const out: HevyWorkout[] = [];
    for (let page = 1; page <= maxPages; page++) {
      const res = await fetch(
        `${HEVY_API}/workouts?page=${page}&pageSize=10`,
        { headers: { 'api-key': key, accept: 'application/json' } },
      );
      if (res.status === 401) throw new BadRequestException('Invalid Hevy API key');
      if (!res.ok) throw new HttpException('Hevy API error', 502);
      const data = (await res.json()) as {
        page_count: number;
        workouts: HevyWorkout[];
      };
      const workouts = data.workouts ?? [];
      out.push(...workouts);
      const oldest = workouts[workouts.length - 1];
      if (
        !workouts.length ||
        page >= (data.page_count ?? 1) ||
        (oldest && new Date(oldest.start_time).getTime() < cutoff)
      )
        break;
    }
    return out.filter((w) => new Date(w.start_time).getTime() >= cutoff);
  }

  async sync() {
    const settings = await this.settingsService.getSettings();
    const key = settings.hevyApiKey;
    if (!key) throw new BadRequestException('No Hevy API key set in settings');

    const workouts = await this.fetchWorkouts(key);
    // oldest first so PR running-max builds correctly
    workouts.sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
    );

    const existing = new Set(
      (await this.workoutModel
        .find({ hevyWorkoutId: { $in: workouts.map((w) => w.id) } })
        .select('hevyWorkoutId')
        .exec()).map((w) => w.hevyWorkoutId),
    );

    // running max weight per exercise, within this batch (see ceiling note)
    const maxByExercise = new Map<string, number>();
    let synced = 0;
    let xpEarned = 0;
    const newPRs: string[] = [];

    for (const w of workouts) {
      const volume = w.exercises.reduce(
        (sum, ex) =>
          sum +
          ex.sets.reduce(
            (s, set) => s + (set.weight_kg ?? 0) * (set.reps ?? 0),
            0,
          ),
        0,
      );

      // PR detection (within fetched window)
      const prs: string[] = [];
      for (const ex of w.exercises) {
        const best = ex.sets.reduce((m, s) => Math.max(m, s.weight_kg ?? 0), 0);
        const prev = maxByExercise.get(ex.title);
        if (prev != null && best > prev) {
          prs.push(`${ex.title} ${best}kg`);
        }
        if (best > (prev ?? 0)) maxByExercise.set(ex.title, best);
      }

      if (existing.has(w.id)) continue; // dedup

      const intensity = this.intensityFor(volume);
      const date = w.start_time.slice(0, 10);
      const duration = Math.max(
        0,
        Math.round(
          (new Date(w.end_time).getTime() -
            new Date(w.start_time).getTime()) /
            60000,
        ),
      );
      const xp = this.workoutsService.computeXp(intensity, volume, prs);

      await this.workoutModel.create({
        type: w.title || 'Workout',
        duration,
        intensity,
        date,
        loggedAt: new Date(),
        xpEarned: xp,
        hevyWorkoutId: w.id,
        totalVolume: Math.round(volume),
        exercises: w.exercises.map((e) => e.title),
        prs,
      });

      await this.xpService.award('gym_session', xp, `${w.title} (Hevy)`, date);
      for (const pr of prs)
        await this.xpService.award('pr', XP.PR, `New PR: ${pr}`, date);

      synced++;
      xpEarned += xp;
      newPRs.push(...prs);
    }

    const completedQuests = await this.questsService.evaluate();
    return { synced, xpEarned, newPRs, completedQuests };
  }

  /** Read-only analysis pulled straight from Hevy (no DB writes). */
  async stats(days = 90) {
    const settings = await this.settingsService.getSettings();
    const key = settings.hevyApiKey;
    if (!key) throw new BadRequestException('No Hevy API key set in settings');

    const workouts = await this.fetchWorkouts(key, days, 20);
    workouts.sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
    );

    interface Rec {
      sessions: number;
      sets: number;
      history: { date: string; weight: number }[];
      max: number;
    }
    const perEx = new Map<string, Rec>();
    let totalVolume = 0;
    let totalSets = 0;
    const heaviest = { title: '', weight: 0 };

    for (const w of workouts) {
      const seen = new Set<string>();
      for (const ex of w.exercises) {
        const top = ex.sets.reduce((m, s) => Math.max(m, s.weight_kg ?? 0), 0);
        const vol = ex.sets.reduce(
          (s, set) => s + (set.weight_kg ?? 0) * (set.reps ?? 0),
          0,
        );
        totalVolume += vol;
        totalSets += ex.sets.length;

        const rec: Rec = perEx.get(ex.title) ?? {
          sessions: 0,
          sets: 0,
          history: [],
          max: 0,
        };
        rec.sets += ex.sets.length;
        if (!seen.has(ex.title)) {
          rec.sessions++;
          seen.add(ex.title);
        }
        rec.history.push({ date: w.start_time.slice(0, 10), weight: top });
        rec.max = Math.max(rec.max, top);
        perEx.set(ex.title, rec);

        if (top > heaviest.weight) {
          heaviest.title = ex.title;
          heaviest.weight = top;
        }
      }
    }

    const exercises = [...perEx.entries()]
      .map(([title, r]) => ({
        title,
        sessions: r.sessions,
        sets: r.sets,
        currentWeight: r.history[r.history.length - 1]?.weight ?? 0,
        maxWeight: r.max,
        lastDate: r.history[r.history.length - 1]?.date ?? '',
        trend: r.history.slice(-10).map((h) => h.weight),
      }))
      .sort((a, b) => b.sessions - a.sessions);

    return {
      days,
      totalSessions: workouts.length,
      totalVolume: Math.round(totalVolume),
      totalSets,
      heaviest,
      mostFrequent: exercises[0]
        ? { title: exercises[0].title, count: exercises[0].sessions }
        : null,
      exercises,
    };
  }
}
