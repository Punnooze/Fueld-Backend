import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  restTolerantStreak,
  lastNDates,
  today,
  weekDates,
  weekMonday,
} from '../common/date.util';
import { LogEntry, LogEntryDocument } from '../logs/schemas/log-entry.schema';
import {
  BodyMeasurement,
  BodyMeasurementDocument,
} from '../measurements/schemas/body-measurement.schema';
import {
  UserSettings,
  UserSettingsDocument,
} from '../settings/schemas/user-settings.schema';
import {
  WeightLog,
  WeightLogDocument,
} from '../weight/schemas/weight-log.schema';
import {
  WorkoutSession,
  WorkoutSessionDocument,
} from '../workouts/schemas/workout-session.schema';
import { XP } from '../xp/xp.constants';
import { XpService } from '../xp/xp.service';
import { ALL_QUESTS, QuestDef } from './quest.definitions';
import { Quest, QuestDocument } from './schemas/quest.schema';

interface DailyMacro {
  protein: number;
  calories: number;
}

@Injectable()
export class QuestsService {
  constructor(
    @InjectModel(Quest.name) private questModel: Model<QuestDocument>,
    @InjectModel(LogEntry.name) private logModel: Model<LogEntryDocument>,
    @InjectModel(WorkoutSession.name)
    private workoutModel: Model<WorkoutSessionDocument>,
    @InjectModel(WeightLog.name) private weightModel: Model<WeightLogDocument>,
    @InjectModel(BodyMeasurement.name)
    private measurementModel: Model<BodyMeasurementDocument>,
    @InjectModel(UserSettings.name)
    private settingsModel: Model<UserSettingsDocument>,
    private readonly xpService: XpService,
  ) {}

  private periodKey(def: QuestDef): string {
    if (def.type === 'daily') return today();
    if (def.type === 'weekly') return weekMonday();
    return 'boss';
  }

  /** Sum protein & calories per date (quantity × food macros). */
  private async dailyMacros(dates: string[]): Promise<Map<string, DailyMacro>> {
    const rows = await this.logModel
      .aggregate<{ _id: string; protein: number; calories: number }>([
        { $match: { date: { $in: dates } } },
        {
          $lookup: {
            from: 'fooditems',
            localField: 'foodItemId',
            foreignField: '_id',
            as: 'food',
          },
        },
        { $unwind: '$food' },
        {
          $group: {
            _id: '$date',
            protein: { $sum: { $multiply: ['$food.protein', '$quantity'] } },
            calories: { $sum: { $multiply: ['$food.calories', '$quantity'] } },
          },
        },
      ])
      .exec();
    const map = new Map<string, DailyMacro>();
    for (const r of rows)
      map.set(r._id, { protein: r.protein, calories: r.calories });
    return map;
  }

  private async activeDates(sinceDates: string[]): Promise<Set<string>> {
    const [logDates, workoutDates, cardioDates] = await Promise.all([
      this.logModel.distinct('date', { date: { $in: sinceDates } }).exec(),
      this.workoutModel.distinct('date', { date: { $in: sinceDates } }).exec(),
      this.xpService.datesForType('cardio'),
    ]);
    return new Set([...logDates, ...workoutDates, ...cardioDates] as string[]);
  }

  /** Ensure a quest doc exists for the current period of every definition. */
  private async ensureQuests(): Promise<void> {
    await Promise.all(
      ALL_QUESTS.map((def) => {
        const periodKey = this.periodKey(def);
        return this.questModel
          .updateOne(
            { key: def.key, periodKey },
            {
              $setOnInsert: {
                type: def.type,
                key: def.key,
                title: def.title,
                description: def.description,
                xpReward: def.xpReward,
                targetValue: def.targetValue,
                currentValue: 0,
                completed: false,
                periodKey,
              },
            },
            { upsert: true },
          )
          .exec();
      }),
    );
  }

  /** Compute currentValue for a quest key from real logged data. */
  private async progressFor(key: string): Promise<number> {
    switch (key) {
      case 'fuel_up': {
        const s = await this.getSettings();
        const m = (await this.dailyMacros([today()])).get(today());
        return m && m.protein >= s.targetProtein ? 1 : 0;
      }
      case 'feed_the_beast':
        return this.logModel.countDocuments({ date: today() }).exec();
      case 'on_target': {
        const s = await this.getSettings();
        const m = (await this.dailyMacros([today()])).get(today());
        return m && Math.abs(m.calories - s.targetCalories) <= 100 ? 1 : 0;
      }
      case 'warrior_week':
        return this.workoutModel
          .countDocuments({ date: { $in: weekDates(weekMonday()) } })
          .exec();
      case 'protein_protocol': {
        const s = await this.getSettings();
        const dates = weekDates(weekMonday());
        const macros = await this.dailyMacros(dates);
        return dates.filter(
          (d) => (macros.get(d)?.protein ?? 0) >= s.targetProtein,
        ).length;
      }
      case 'weigh_in':
        return this.weightModel
          .countDocuments({ date: { $in: weekDates(weekMonday()) } })
          .exec();
      case 'the_logged':
        return restTolerantStreak(await this.activeDates(lastNDates(365)));
      case 'shrink_the_core': {
        const rows = await this.measurementModel
          .find({ date: { $in: lastNDates(30) }, waist: { $ne: null } })
          .sort({ date: 1 })
          .exec();
        if (rows.length < 2) return 0;
        const drop = (rows[0].waist ?? 0) - (rows[rows.length - 1].waist ?? 0);
        return Math.max(0, drop);
      }
      case 'macro_monk': {
        const s = await this.getSettings();
        const dates = lastNDates(30);
        const macros = await this.dailyMacros(dates);
        return dates.filter(
          (d) => (macros.get(d)?.protein ?? 0) >= s.targetProtein,
        ).length;
      }
      default:
        return 0;
    }
  }

  private async getSettings(): Promise<UserSettingsDocument> {
    const s = await this.settingsModel.findOne().exec();
    return s ?? (await this.settingsModel.create({}));
  }

  /** Award protein/calorie target XP for a date (deduped once per date). */
  private async awardDailyTargets(date: string): Promise<void> {
    const s = await this.getSettings();
    const m = (await this.dailyMacros([date])).get(date);
    if (!m) return;
    if (m.protein >= s.targetProtein)
      await this.xpService.award(
        'protein_target',
        XP.PROTEIN_TARGET,
        'Hit protein target',
        date,
      );
    if (Math.abs(m.calories - s.targetCalories) <= 100)
      await this.xpService.award(
        'calorie_target',
        XP.CALORIE_TARGET,
        'Hit calorie target',
        date,
      );
  }

  /** Streak milestone bonuses (fire once on the day the milestone is reached). */
  private async awardStreakBonuses(): Promise<void> {
    const active = await this.activeDates(lastNDates(60));
    const streak = restTolerantStreak(active);
    if (streak === 7)
      await this.xpService.award(
        'streak_7',
        XP.STREAK_7,
        '7-day streak',
        today(),
      );
    if (streak === 30)
      await this.xpService.award(
        'streak_30',
        XP.STREAK_30,
        '30-day streak',
        today(),
      );

    // 10 consecutive days hitting protein
    const s = await this.getSettings();
    const dates = lastNDates(10);
    const macros = await this.dailyMacros(dates);
    const allTen = dates.every(
      (d) => (macros.get(d)?.protein ?? 0) >= s.targetProtein,
    );
    if (allTen)
      await this.xpService.award(
        'protein_streak_10',
        XP.PROTEIN_STREAK_10,
        '10-day protein streak',
        today(),
      );

    // disciplined week: ≥4 active days & ≤1 non-Sunday rest (once per week)
    const wk = weekDates(weekMonday());
    const past = wk.filter((d) => d <= today());
    const activeThisWeek = past.filter((d) => active.has(d)).length;
    const rests = past.filter(
      (d) => new Date(d).getUTCDay() !== 0 && !active.has(d),
    ).length;
    if (activeThisWeek >= 4 && rests <= 1)
      await this.xpService.award(
        'weekly_disciplined',
        XP.WEEKLY_DISCIPLINED,
        'Disciplined week — ≤1 rest',
        weekMonday(),
      );
  }

  /**
   * Recompute all active quests, award daily-target & streak XP, complete +
   * award XP for any quest that hit target. Returns newly completed quests
   * (for celebration animations). Single entry point after every mutation.
   */
  async evaluate(): Promise<QuestDocument[]> {
    await this.ensureQuests();
    await this.awardDailyTargets(today());
    await this.awardStreakBonuses();
    const active = await this.questModel.find({ completed: false }).exec();
    const newlyCompleted: QuestDocument[] = [];

    for (const q of active) {
      const value = await this.progressFor(q.key);
      q.currentValue = value;
      if (value >= q.targetValue) {
        q.completed = true;
        q.completedAt = new Date();
        await this.xpService.award(
          `quest:${q.key}`,
          q.xpReward,
          `Quest complete: ${q.title}`,
          today(),
        );
        newlyCompleted.push(q);
      }
      await q.save();
    }
    return newlyCompleted;
  }

  /** All current-period quests with fresh progress. */
  async getActive(): Promise<QuestDocument[]> {
    await this.evaluate();
    const periodKeys = [today(), weekMonday(), 'boss'];
    return this.questModel
      .find({ periodKey: { $in: periodKeys } })
      .sort({ type: 1, xpReward: 1 })
      .exec();
  }
}
