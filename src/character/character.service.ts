import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  currentStreak,
  lastNDates,
  longestStreak,
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
import { XpService } from '../xp/xp.service';
import {
  RANKS,
  computeClass,
  levelFromXp,
  rankTierForLevel,
  titleForLevel,
  xpThreshold,
} from './character.constants';

@Injectable()
export class CharacterService {
  constructor(
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

  async getCharacter() {
    const totalXp = await this.xpService.totalXp();
    const level = levelFromXp(totalXp);
    const floor = xpThreshold(level - 1);
    const next = xpThreshold(level);

    // active dates over the last year → streaks + decay
    const year = lastNDates(365);
    const [logDates, workoutDates] = await Promise.all([
      this.logModel.distinct('date', { date: { $in: year } }).exec(),
      this.workoutModel.distinct('date', { date: { $in: year } }).exec(),
    ]);
    const active = new Set([...logDates, ...workoutDates] as string[]);
    const streak = currentStreak(active);
    const best = longestStreak(active);

    // decay: days since last active day
    const lastActive = [...active].sort().pop();
    const daysSince = lastActive
      ? Math.floor(
          (Date.now() - new Date(lastActive).getTime()) / 86400000,
        )
      : Infinity;
    const decaying = daysSince >= 3;

    // rank (drops one tier if 7+ days inactive)
    let tier = rankTierForLevel(level);
    if (daysSince >= 7 && tier > 0) tier--;
    const rank = RANKS[tier].name;

    // class from last-30d mix
    const month = lastNDates(30);
    const [gymCount, nutritionDays, weightCount, measureCount] =
      await Promise.all([
        this.workoutModel.countDocuments({ date: { $in: month } }).exec(),
        this.logModel.distinct('date', { date: { $in: month } }).exec(),
        this.weightModel.countDocuments({ date: { $in: month } }).exec(),
        this.measurementModel.countDocuments({ date: { $in: month } }).exec(),
      ]);
    const hasBodyTracking = weightCount > 0 || measureCount > 0;
    const fighterClass = computeClass(
      gymCount,
      (nutritionDays as string[]).length,
      hasBodyTracking,
    );

    const settings = await this.settingsModel.findOne().exec();

    return {
      name: settings?.characterName ?? 'FIGHTER',
      level,
      title: titleForLevel(level),
      rank,
      rankTier: tier,
      class: fighterClass,
      streak,
      longestStreak: best,
      decaying,
      daysSinceActive: daysSince === Infinity ? null : daysSince,
      xp: {
        total: totalXp,
        currentLevelFloor: floor,
        nextLevelAt: next,
        intoLevel: totalXp - floor,
        neededForNext: next - floor,
      },
      stats: {
        totalWorkouts: await this.workoutModel.countDocuments().exec(),
        workoutsThisMonth: gymCount,
        nutritionDaysThisMonth: (nutritionDays as string[]).length,
      },
    };
  }
}
